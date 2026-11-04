/**
 * The one place that speaks to the Host.
 *
 * Everything the map does remotely goes through `connection.rpc.call('/api',
 * endpoint, { args: { request } })` — the generated endpoint for a
 * `@Remote(...)` Host method, whose single parameter is called `request`:
 *
 *   sessionController.rename      → 'session/rename'
 *   sessionController.create      → 'session/create'
 *   sessionController.prompt      → 'session/prompt'
 *   workspaceController.rename    → 'workspace/rename'
 *   workspaceController.create    → 'workspace/create'
 *
 * Result envelope: `{ ok: true, value } | { ok: false, error }`.
 * (An earlier version of this plugin invented a `connection.api.sessions.*`
 * shape that never existed; the optional chain swallowed it and features simply
 * did nothing.)
 */
import { talkMapApi } from './api.ts'
import { connectionService } from './map-state.ts'
import { t } from './i18n.ts'

/** Repeating the same query inside a minute should not hit the corpus again. */
const searchCache = new Map<string, { at: number; hits: ContentHit[] }>()
const SEARCH_CACHE_MS = 60_000
export interface RpcFailure {
  code?: string
  message?: string
}

/**
 * Call one Host endpoint. Throws with the Host's own message on failure, so the
 * UI can show the real reason instead of a generic "not ready".
 */
export async function callRpc<T>(endpoint: string, request: Record<string, unknown> = {}): Promise<T> {
  const rpc = connectionService()?.rpc
  if (rpc === undefined) throw new Error(t('spawn.apiUnavailable'))
  // Endpoints that declare cancellation: { parameter: 'signal' } (session/search
  // is one) expect the signal as the RPC call's own argument, not inside rgs.
  // Omitting it is what made the full-text search fail while rename/create were
  // fine — same helper, different arity.
  const controller = new AbortController()
  const result = await rpc.call('/api', endpoint, { args: { request } }, controller.signal)
  if (result.ok !== true) {
    const failure = (result as { error?: RpcFailure }).error
    throw new Error(`${endpoint}: ${failure?.message ?? failure?.code ?? 'failed'}`)
  }
  return (result as { value: T }).value
}

/** Report a client-side failure to the Host log, so it is diagnosable later. */
export function reportToHost(payload: Record<string, unknown>): void {
  try {
    void fetch('/talk-pages/client-boot', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ at: new Date().toISOString(), ...payload }),
    }).catch(() => {})
  } catch { /* nothing to do */ }
}

export interface ContentHit {
  sessionId: string
  /** One entry per match; each holds the matched line (index 1 of its block). */
  blocks: string[][]
  /** Event seq per match, so the passage can be pulled on demand. */
  seqs: (number | null)[]
  /** Per-match author: your message or the agent's answer. */
  roles: (string | null)[]
  /** Whose session this is: the conversation you had, or one an agent spawned. */
  agent: 'main' | 'subagent'
  /** How deep in the delegation chain a sub-agent session sits. */
  depth: number
}

/**
 * Full-text search across every conversation.
 *
 * Two paths, in order: the Host's generated endpoint over the shared connection
 * (session/search), then our own Host route (/talk-pages/search). The second
 * exists because the drawer's search must not degrade to title-only matching if
 * the RPC surface is missing — and the failure of the first one is logged so it
 * can be diagnosed instead of guessed at.
 */
export async function searchSessions(query: string, cwd?: string): Promise<ContentHit[]> {
  const key = (cwd ?? '') + '|' + query.trim().toLowerCase()
  const remembered = searchCache.get(key)
  if (remembered !== undefined && Date.now() - remembered.at < SEARCH_CACHE_MS) return remembered.hits
  const hits = await searchSessionsUncached(query, cwd)
  searchCache.set(key, { at: Date.now(), hits })
  return hits
}

async function searchSessionsUncached(query: string, cwd?: string): Promise<ContentHit[]> {
  const clean = (lines: readonly unknown[]): string[] =>
    lines.filter((line): line is string => typeof line === 'string' && line.trim() !== '')
  const normalize = (
    items: readonly {
      sessionId?: string
      blocks?: string[][]
      seqs?: (number | null)[]
      agent?: string
      depth?: number
      lines?: string[]
      snippet?: string
    }[] | undefined,
  ): ContentHit[] =>
    (items ?? [])
      .filter((item): item is { sessionId: string; blocks?: string[][]; lines?: string[]; snippet?: string } =>
        typeof item.sessionId === 'string')
      .map((item) => {
        // New shape: blocks of context lines. Older shapes are wrapped so the
        // drawer renders the same way whatever the Host answers.
        const seqs = Array.isArray(item.seqs) ? item.seqs : []
        const roles = Array.isArray(item.roles) ? item.roles : []
        const agent: 'main' | 'subagent' = item.agent === 'subagent' ? 'subagent' : 'main'
        const depth = typeof item.depth === 'number' ? item.depth : 0
        const withSeqs = (blocks: string[][]): ContentHit => ({
          sessionId: item.sessionId,
          blocks,
          seqs: blocks.map((_, index) => (typeof seqs[index] === 'number' ? seqs[index] : null)),
          roles: blocks.map((_, index) => (typeof roles[index] === 'string' ? roles[index] : null)),
          agent,
          depth,
        })
        if (Array.isArray(item.blocks)) {
          const blocks = item.blocks.map(clean).filter(block => block.length > 0)
          if (blocks.length > 0) return withSeqs(blocks)
        }
        if (Array.isArray(item.lines)) {
          const lines = clean(item.lines)
          if (lines.length > 0) return withSeqs(lines.map(line => [line]))
        }
        if (typeof item.snippet === 'string' && item.snippet.trim() !== '') {
          return withSeqs([[item.snippet.trim()]])
        }
        return { sessionId: item.sessionId, blocks: [], seqs: [], roles: [], agent, depth }
      })
      .filter(hit => hit.blocks.length > 0)

  // Our own Host route first: it runs on the corpus query service, which is the
  // entry point that actually works from inside the Host. The API-domain
  // endpoint (session/search) needs an owning Agent and answers
  // SessionQueryError when the plugin asks, so it is only the fallback.
  let routeError: Error | undefined
  try {
    const page = await talkMapApi.searchSessions(query, cwd)
    return normalize(page.items)
  } catch (error) {
    routeError = error as Error
    reportToHost({ phase: 'search-host-failed', query, message: String(routeError?.message ?? error) })
  }
  try {
    const page = await callRpc<{ items?: { sessionId: string; blocks?: string[][]; lines?: string[]; snippet?: string }[] }>('session/search', { query })
    return normalize(page.items)
  } catch (error) {
    reportToHost({ phase: 'search-rpc-failed', query, message: String((error as Error)?.message ?? error) })
    // Keep BOTH reasons: the Host route is the one that knows whether the
    // deployment disabled the index, so its message must not be lost.
    const combined = [routeError?.message, (error as Error)?.message].filter(Boolean).join('；')
    throw new Error(combined === '' ? 'search failed' : combined)
  }
}
/** The passage around one hit, loaded when the pointer rests on it. */
export async function fetchSearchContext(sessionId: string, seq: number, query: string): Promise<string[]> {
  try {
    const page = await talkMapApi.searchContext(sessionId, seq, query)
    return Array.isArray(page.lines) ? page.lines.filter(line => typeof line === 'string' && line !== '') : []
  } catch (error) {
    reportToHost({ phase: 'search-context-failed', sessionId, seq, message: String((error as Error)?.message ?? error) })
    return []
  }
}


/** Extra hits inside one conversation, loaded when the user asks for them. */
export async function fetchSessionHits(
  sessionId: string,
  query: string,
): Promise<{ blocks: string[][]; seqs: (number | null)[] }> {
  try {
    const page = await talkMapApi.searchSessionHits(sessionId, query)
    const blocks = (page.blocks ?? []).filter(block => Array.isArray(block) && block.length > 0)
    return { blocks, seqs: blocks.map((_, index) => (typeof page.seqs?.[index] === 'number' ? page.seqs[index] : null)) }
  } catch (error) {
    reportToHost({ phase: 'search-session-failed', sessionId, message: String((error as Error)?.message ?? error) })
    return { blocks: [], seqs: [] }
  }
}
