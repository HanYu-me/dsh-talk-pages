/**
 * dsh-talk-pages host entry. Three independently-injected layers over one
 * shared store promise, so a composition missing llm or agents still serves
 * the board (spawn/digest routes answer 503 instead):
 *
 *   1. storageDomain + webServer  → talk_pages domain + /talk-pages/* routes
 *   2. sessionQuery + llm + agentDefaultModel + sessions → digest pipeline
 *   3. agents + sessionQuery      → injection-spawn
 *
 * Failure policy: a broken external plugin must not take the host down —
 * open/mount failures are logged and the affected layer stays inert.
 */
import type {
  DigestHostServices,
  SessionEventLite,
  SessionQueryService,
  SessionRecordLite,
  SpawnHostServices,
  TalkMapHostServices,
} from './host/dsh-host.ts'
import { textOfBlocks } from './host/digest/extract.ts'
import { DigestPipeline, DIGEST_DEFAULTS } from './host/digest/pipeline.ts'
import { startAgentApi } from './host/agent-api.ts'
import { mountTalkMapRoutes, type TalkMapRuntime } from './host/routes.ts'
import { Spawner } from './host/spawn.ts'
import { openTalkMapStore, DOMAIN_NAME, type Digest, type TalkMapStore } from './host/store.ts'

export const name = 'dsh-talk-pages'

/** Structural cordis surface at the outer (uninjected) layer. */
interface OuterContext {
  logger?: { info?(message: string): void; warn(message: string): void }
  inject(deps: readonly string[], callback: (ctx: unknown) => void): void
}

export function apply(ctx: OuterContext): void {
  const runtime: TalkMapRuntime = {}
  let resolveStore: (store: TalkMapStore) => void
  let rejectStore: (error: unknown) => void
  const storeReady = new Promise<TalkMapStore>((resolve, reject) => {
    resolveStore = resolve
    rejectStore = reject
  })
  storeReady.catch(() => { /* observed per-consumer; avoid unhandled rejection */ })

  // Layer 1: storage domain + HTTP routes.
  ctx.inject(['storageDomain', 'webServer'], (injected: unknown) => {
    const services = injected as TalkMapHostServices
    services.effect(() => {
      let disposed = false
      let store: TalkMapStore | undefined
      openTalkMapStore(services.storageDomain).then((opened) => {
        if (disposed) {
          void opened.domain.close()
          return
        }
        store = opened
        resolveStore(opened)
        services.logger?.info?.('[dsh-talk-pages] storage domain open, routes live at /talk-pages/')
      }).catch((error) => {
        services.logger?.warn(`[dsh-talk-pages] storage domain failed to open: ${String(error)}`)
        rejectStore(error)
      })
      const unmountRoutes = mountTalkMapRoutes(services, storeReady, runtime)
      // Files-as-API: a snapshot to read and an inbox to write (docs/AGENT.md).
      const stopAgentApi = startAgentApi(
        storeReady,
        message => services.logger?.info?.(message),
        listener => services.on('domain/changed', (...args: unknown[]) => {
          if ((args[0] as { domain?: string } | undefined)?.domain === DOMAIN_NAME) listener()
        }),
      )
      return () => {
        disposed = true
        stopAgentApi()
        unmountRoutes()
        void store?.domain.close()
      }
    }, 'dsh-talk-pages: domain + routes')
  })

  // Layer 2: digest pipeline (needs the llm route and session surfaces).
  ctx.inject(['sessions', 'sessionQuery', 'sessionController', 'llm', 'agentDefaultModel'], (injected: unknown) => {
    const services = injected as DigestHostServices
    services.effect(() => {
      /**
       * Host-side mirror of the client push text (digest-text.ts).
       * Keep the wording in sync: the same paragraph is what people read.
       */
      const buildPushTextHost = (title: string, digest: Digest | undefined): string => {
        const now = new Date()
        const stamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        const body: string[] = []
        if (digest !== undefined && digest.summary !== '') body.push(`摘要：${digest.summary}`)
        if (Array.isArray(digest?.keyFindings) && digest.keyFindings.length > 0) {
          body.push('关键结论：')
          for (const finding of digest.keyFindings) body.push(`- ${finding}`)
        }
        const next = digest !== undefined && digest.nextStep !== ''
          ? digest.nextStep
          : digest?.todoNext ?? ''
        if (next !== '') body.push(`下一步：${next}`)
        body.push(`【提醒】以上是摘要提纲，不是完整对话。需要细节（具体命令、参数、结论出处）时，请随时回到原会话「${title}」查看完整对话记录。`)
        return [`【来自「${title}」的更新 · ${stamp}】`, ...body].join('\n')
      }
      /**
       * Sessions pulled from by at least one auto-push edge. Only these are
       * digested on turn/end while per-turn generation is off — every other
       * digest is generated on demand (ensure/refresh/card upsert).
       */
      const refreshAutoSources = async (): Promise<Set<string>> => {
        const store = await storeReady
        const set = new Set<string>()
        for (const [, edge] of store.edges.entries()) {
          if (edge?.injection?.autoPush !== true) continue
          const card = store.cards.get(edge.fromCardId)
          if (card !== undefined) set.add(card.sessionId)
        }
        runtime.autoPushSessions = set
        return set
      }
      runtime.autoPushSessions = new Set<string>()
      void refreshAutoSources().catch(() => undefined)
      // Edges can be switched on while the host runs: keep the trigger set
      // honest instead of freezing the mount-time snapshot.
      const offEdgeChanges = services.on('domain/changed', (...args: unknown[]) => {
        const change = args[0] as { domain?: string; table?: string } | undefined
        if (change?.domain !== DOMAIN_NAME || change.table !== 'edges') return
        void refreshAutoSources().catch(() => undefined)
      })
      const pipeline = new DigestPipeline(
        services,
        storeReady,
        {
          ...DIGEST_DEFAULTS,
          shouldAuto: sessionId => runtime.autoPushSessions?.has(sessionId) === true,
        },
        /** Runs only when a digest really changed (hash differs). */
        async (sessionId, digest) => {
          const store = await storeReady
          const targets: { sessionId: string; edgeId: string }[] = []
          for (const [edgeId, edge] of store.edges.entries()) {
            if (edge?.injection?.autoPush !== true) continue
            const from = store.cards.get(edge.fromCardId)
            const to = store.cards.get(edge.toCardId)
            if (from?.sessionId !== sessionId || to === undefined) continue
            targets.push({ sessionId: to.sessionId, edgeId })
          }
          if (targets.length === 0) return
          const records = await services.sessionQuery.listSessions()
            .catch((): SessionRecordLite[] => [])
          const title = records.find(record => record.header.id === sessionId)?.header.title ?? sessionId
          const text = buildPushTextHost(title, digest)
          const pushedAt = Date.now()
          for (const target of targets) {
            try {
              if (runtime.spawner === undefined) throw new Error('spawn layer unavailable')
              await runtime.spawner.injectInto(target.sessionId, [{ sessionId, text }])
              // Stamp the edge so the map can draw "synced" instead of "behind".
              const edge = await store.edges.get(target.edgeId)
              if (edge !== undefined) await store.edges.put(target.edgeId, { ...edge, lastPushAt: pushedAt })
              services.logger?.info?.(`[dsh-talk-pages] auto-pushed digest → ${target.sessionId}`)
            } catch (error) {
              services.logger?.warn(`[dsh-talk-pages] auto push failed: ${String(error)}`)
            }
          }
        },
      )
      const stop = pipeline.start()
      runtime.digest = pipeline
      // Full-text search over every conversation. `sessionController.search`
      // is the API-domain wrapper (it needs an owning Agent and answers
      // SessionQueryError when the Host itself asks), so this goes through the
      // corpus query service instead.
      /** ±80/120 chars around the match, elided like a transcript snippet. */
      const excerptAround = (text: string, at: number, length: number): string => {
        const start = Math.max(0, at - 80)
        const end = Math.min(text.length, at + length + 120)
        return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
      }
      /**
       * Only the text the transcript actually shows: your own messages and the
       * assistant's answers. Tool arguments and tool output are dropped, so a
       * conversation that matched only inside a command's stdout disappears.
       */
      const visibleMatch = async (
        searchCorpus: SessionQueryService,
        sessionId: string,
        query: string,
      ): Promise<{ line: string; seq: number | null } | null> => {
        const docs = await searchCorpus.filterEvents(sessionId, [
          { kind: 'type', values: ['user/message', 'assistant/message'] },
          { kind: 'text', text: query },
        ])
        const needle = query.toLowerCase()
        for (const doc of docs ?? []) {
          const text = typeof doc?.text === 'string' ? doc.text : ''
          const at = text.toLowerCase().indexOf(needle)
          if (at < 0) continue
          return {
            line: excerptAround(text, at, query.length),
            seq: typeof doc.seq === 'number' ? doc.seq : null,
          }
        }
        return null
      }
      /**
       * One corpus query, nothing else. Measured on the real corpus: a search
       * that also ran searchEvents per session took 12-15 s; this form just
       * returns the best match the index already computed. Extra hits inside
       * one conversation are fetched by /talk-pages/search-session when asked.
       */
      runtime.search = async (query, cwd) => {
        const corpus = runtime.sessionQuery
        if (corpus === undefined) throw new Error('sessionQuery unavailable')
        const signal = new AbortController().signal
        const scoped = typeof cwd === 'string' && cwd !== ''
        const page = await corpus.searchSessions(
          scoped ? { query, limit: 10, filters: [{ kind: 'cwd', values: [cwd] }] } : { query, limit: 10 },
          { signal },
        )
        // Only what the transcript actually shows: your messages and the
        // assistant's answers. Tool arguments, tool output, system/developer
        // envelopes are noise — and skipping them also makes the query cheaper.
        const searchable = new Set(['user/message', 'assistant/message'])
        const candidates = (page?.items ?? []).map((hit) => {
          const best = hit.bestMatch
          const snippet = (best?.snippet ?? '').trim()
          const line = snippet.split(/\r?\n/).map(part => part.trim()).find(part => part !== '') ?? ''
          return {
            sessionId: hit.header?.id ?? hit.sessionId ?? '',
            type: typeof best?.type === 'string' ? best.type : '',
            line,
            seq: typeof best?.seq === 'number' ? best.seq : null,
          }
        }).filter(entry => entry.sessionId !== '')
        // Verify the strongest hits against the visible transcript (in
        // parallel, capped) and take the snippet from there.
        interface SearchItem {
          sessionId: string
          blocks: string[][]
          seqs: (number | null)[]
        }
        const verified = await Promise.all(candidates.slice(0, 6).map(async (entry): Promise<SearchItem | null> => {
          if (entry.type !== '' && !searchable.has(entry.type)) return null
          try {
            const match = await visibleMatch(corpus, entry.sessionId, query)
            if (match === null) return null
            return { sessionId: entry.sessionId, blocks: [[match.line]], seqs: [match.seq] }
          } catch {
            return entry.line === ''
              ? null
              : { sessionId: entry.sessionId, blocks: [[entry.line]], seqs: [entry.seq] }
          }
        }))
        const items = verified.filter((item): item is SearchItem => item !== null)
        return { items, hasMore: page?.nextCursor !== undefined }
      }
      /** Every extra hit inside ONE conversation (asked for explicitly). */
      runtime.searchSession = async (sessionId, query) => {
        const corpus = runtime.sessionQuery
        if (corpus === undefined) throw new Error('sessionQuery unavailable')
        const signal = new AbortController().signal
        const events = await corpus.searchEvents(
          {
            sessionId, query, limit: 6,
            filters: [{ kind: 'type', values: ['user/message', 'assistant/message'] }],
          },
          { signal },
        )
        const blocks: string[][] = []
        const seqs: (number | null)[] = []
        for (const hit of events?.items ?? []) {
          const snippet = typeof hit?.snippet === 'string' ? hit.snippet.trim() : ''
          if (snippet === '') continue
          blocks.push([snippet.split(/\r?\n/).map(part => part.trim()).find(part => part !== '') ?? ''])
          seqs.push(typeof hit?.seq === 'number' ? hit.seq : null)
        }
        return { blocks, seqs }
      }
      /**
       * The passage a hit came from. The event is found BY CONTENT — the seq
       * handed over by the search may point at a neighbouring event once a
       * message has been replayed — and if the query is not in the text we
       * return nothing rather than an unrelated paragraph.
       */
      runtime.searchContext = async (sessionId, seq, query) => {
        const corpus = runtime.sessionQuery
        if (corpus === undefined) throw new Error('sessionQuery unavailable')
        const signal = new AbortController().signal
        const eventWindow = await corpus.readEvent({ sessionId, seq, before: 6, after: 6 }, signal)
        const wanted = String(query ?? '').toLowerCase()
        // user/message keeps its content on `data`, assistant/message on
        // `data.message` — handling only one shape returned the wrong event.
        const textOfEvent = (event: SessionEventLite | undefined): string => {
          const data = (event?.data ?? {}) as { content?: unknown; message?: { content?: unknown } }
          const content = Array.isArray(data.content)
            ? data.content
            : Array.isArray(data.message?.content) ? data.message.content : []
          return textOfBlocks(content)
        }
        // Only the conversation itself: a tool result or a document record is
        // not what the reader is looking for, and its JSON scaffolding is noise.
        const conversationEvents = new Set(['user/message', 'assistant/message'])
        const events = [eventWindow?.target, ...(eventWindow?.events ?? [])]
          .filter((event): event is SessionEventLite =>
            event !== undefined && conversationEvents.has(String(event.type ?? '')))
        const pick = events
          .map(event => ({ event, text: String(textOfEvent(event) ?? '').trim() }))
          .filter(entry => entry.text !== '' && entry.text.toLowerCase().includes(wanted))
          .sort((a, b) => (b.event.seq ?? 0) - (a.event.seq ?? 0))[0]
        if (pick === undefined) return { lines: [] }
        const all = pick.text.split(/\r?\n/).map(line => line.trim()).filter(line => line !== '')
        const at = all.findIndex(line => line.toLowerCase().includes(wanted))
        if (all.length <= 1) {
          // One long paragraph: hand back a wide character window instead.
          const flat = pick.text.replace(/\s+/g, ' ')
          const index = Math.max(0, flat.toLowerCase().indexOf(wanted))
          const start = Math.max(0, index - 420)
          const end = Math.min(flat.length, index + 520)
          return { lines: [(start > 0 ? '…' : '') + flat.slice(start, end) + (end < flat.length ? '…' : '')] }
        }
        const index = at < 0 ? 0 : at
        const from = Math.max(0, index - 6)
        const to = Math.min(all.length - 1, index + 6)
        const lines = all.slice(from, to + 1).map((line) => {
          if (line.length <= 400) return line
          const hitAt = Math.max(0, line.toLowerCase().indexOf(wanted))
          return (hitAt > 140 ? '…' : '') + line.slice(Math.max(0, hitAt - 140), hitAt + 260) + '…'
        })
        return { lines }
      }
      // Backfill: cards already on the board whose session has no digest yet
      // (historic conversations never hit the turn/end trigger).
      void storeReady.then((store) => {
        if (runtime.digest !== pipeline) return
        const missing = [...new Set([...store.cards.entries()].map(([, card]) => card.sessionId))]
          .filter((sessionId) => {
            const digest = store.digests.get(sessionId)
            return digest === undefined || digest.summary === ''
          })
        pipeline.backfill(missing)
      }).catch(() => undefined)
      return () => {
        offEdgeChanges()
        stop()
        if (runtime.digest === pipeline) delete runtime.digest
      }
    }, 'dsh-talk-pages: digest pipeline')
  })

  // Defaults for the draft composer (each optional — missing service just
  // leaves the corresponding default unlabeled).
  ctx.inject(['agentDefaultModel'], (injected: unknown) => {
    const services = injected as { agentDefaultModel: { currentSelection(): { provider: string; model: string; reasoningEffort?: string } }; effect(cb: () => () => void, label?: string): void }
    services.effect(() => {
      runtime.modelDefault = () => services.agentDefaultModel.currentSelection()
      return () => { delete runtime.modelDefault }
    }, 'dsh-talk-pages: model default')
  })
  // Card bodies read the user's last message straight off the session surface —
  // no LLM involved, so it is a separate injection from the digest pipeline.
  ctx.inject(['sessionQuery'], (injected: unknown) => {
    const services = injected as { sessionQuery: SessionQueryService; effect(cb: () => () => void, label?: string): void }
    services.effect(() => {
      runtime.sessionQuery = services.sessionQuery
      return () => {
        if (runtime.sessionQuery === services.sessionQuery) delete runtime.sessionQuery
      }
    }, 'dsh-talk-pages: session query')
  })
  ctx.inject(['agentPresets'], (injected: unknown) => {
    const services = injected as { agentPresets: { defaultId: string }; effect(cb: () => () => void, label?: string): void }
    services.effect(() => {
      runtime.presetDefault = () => services.agentPresets.defaultId
      return () => { delete runtime.presetDefault }
    }, 'dsh-talk-pages: preset default')
  })

  // Layer 3: injection-spawn (needs the agent registry).
  ctx.inject(['agents', 'sessionQuery', 'workspaceRegistry'], (injected: unknown) => {
    const services = injected as SpawnHostServices
    services.effect(() => {
      const spawner = new Spawner(services, storeReady)
      runtime.spawner = spawner
      return () => {
        if (runtime.spawner === spawner) delete runtime.spawner
      }
    }, 'dsh-talk-pages: spawner')
  })
}
