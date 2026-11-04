/**
 * Thin fetch/EventSource layer over the host half's /talk-pages/* routes.
 * Same-origin by construction (relative URLs against the serving shell).
 */
import type { Card, Digest, MapEdgeData, MapGlobal, MapStatePayload } from '../shared/model.ts'

/** Error shape thrown on non-2xx: `code` carries the host's structured
 * error code (e.g. 'session-not-live') when the body provides one. */
export interface ApiError extends Error {
  code?: string
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (!response.ok) {
    let detail = ''
    let code: string | undefined
    try {
      // Stringify before reading .code: a legal JSON body of `null` must
      // still land in the error message.
      const body = await response.json() as unknown
      detail = JSON.stringify(body)
      if (typeof body === 'object' && body !== null) {
        const bodyCode = (body as { code?: unknown }).code
        if (typeof bodyCode === 'string') code = bodyCode
      }
    } catch { /* body not json */ }
    const error: ApiError = new Error(`${path} → ${response.status} ${detail}`)
    if (code !== undefined) error.code = code
    throw error
  }
  return await response.json() as T
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export const talkMapApi = {
  getState(): Promise<MapStatePayload> {
    return requestJson<MapStatePayload>('/talk-pages/state')
  },
  upsertCards(cards: Record<string, Card>): Promise<void> {
    return postJson('/talk-pages/cards/upsert', { cards })
  },
  deleteCards(ids: readonly string[]): Promise<void> {
    return postJson('/talk-pages/cards/delete', { ids })
  },
  upsertEdges(edges: Record<string, MapEdgeData>): Promise<void> {
    return postJson('/talk-pages/edges/upsert', { edges })
  },
  deleteEdges(ids: readonly string[]): Promise<void> {
    return postJson('/talk-pages/edges/delete', { ids })
  },
  setGlobal(global: MapGlobal): Promise<void> {
    return postJson('/talk-pages/global', { global })
  },
  spawn(request: {
    parents: { cardId: string; sessionId: string; text: string }[]
    boardId: string
    x: number
    y: number
    wsOverride?: string
    /** Box the forked card joins; absent = a free card on its page. */
    boxId?: string
  }): Promise<{ sessionId: string; cardId: string; card: Card; edges: Record<string, MapEdgeData> }> {
    return postJson('/talk-pages/spawn', request)
  },
  injectContext(sessionId: string, parents: { sessionId: string; text: string }[]): Promise<{ ok: true }> {
    return postJson('/talk-pages/inject', { sessionId, parents })
  },
  refreshDigest(sessionId: string): Promise<{ sessionId: string; digest: Digest }> {
    return postJson('/talk-pages/digest/refresh', { sessionId })
  },
  /**
   * Regenerate ONLY if the conversation moved on: the Host hashes the
   * transcript and hands back the stored digest when it is still current.
   */
  ensureDigest(sessionId: string): Promise<{ sessionId: string; digest: Digest }> {
    return postJson('/talk-pages/digest/ensure', { sessionId })
  },
  /**
   * The last message the USER sent, per session — what the card body shows now
   * that the LLM summary is gone. Read straight off the Host's session surface.
   */
  lastUserMessages(sessionIds: readonly string[]): Promise<{ texts: Record<string, string> }> {
    return postJson('/talk-pages/last-user', { sessionIds })
  },
  /**
   * Full-text search across every conversation, done Host-side. This is the
   * fallback when the shared connection's RPC surface is unavailable, so the
   * drawer's search never silently degrades to title-only matching.
   */
  searchSessions(query: string, cwd?: string): Promise<{
    items: { sessionId: string; blocks?: string[][]; seqs?: (number | null)[]; agent?: string; depth?: number; lines?: string[]; snippet?: string }[]
    hasMore?: boolean
  }> {
    return postJson('/talk-pages/search', cwd === undefined ? { query } : { query, cwd })
  },
  /** Every extra hit inside ONE conversation (asked for explicitly). */
  searchSessionHits(sessionId: string, query: string): Promise<{
    blocks: string[][]
    seqs: (number | null)[]
  }> {
    return postJson('/talk-pages/search-session', { sessionId, query })
  },
  /** The passage around one hit — fetched only when the pointer rests on it. */
  searchContext(sessionId: string, seq: number, query: string): Promise<{ lines: string[] }> {
    return postJson('/talk-pages/search-context', { sessionId, seq, query })
  },
  ensureDir(path: string): Promise<{ ok: true; path: string }> {
    return postJson('/talk-pages/fs/ensure-dir', { path })
  },
  getDefaults(): Promise<{
    model: { provider: string; model: string; reasoningEffort?: string } | null
    preset: string | null
  }> {
    return requestJson('/talk-pages/defaults')
  },
  /**
   * Subscribe to host-side domain changes (multi-tab sync, digest arrivals).
   * @returns disposer closing the EventSource.
   */
  subscribeChanges(onChange: (change: {
    table: string
    key: string
    operation: 'put' | 'deleted'
    value?: unknown
  }) => void, onReload?: () => void): () => void {
    const source = new EventSource('/talk-pages/events')
    // The host (agent API) changed things behind our back: re-sync everything.
    source.addEventListener('reload', () => { onReload?.() })
    source.addEventListener('change', (event) => {
      try {
        onChange(JSON.parse((event as MessageEvent).data as string))
      } catch { /* malformed frame — skip */ }
    })
    return () => { source.close() }
  },
}
