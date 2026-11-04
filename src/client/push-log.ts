/**
 * When did a card pair last deliver context to each other?
 *
 * A lineage line (fork/subagent provenance) can be pushed along too — it just has
 * no stored edge to hang `lastPushAt` on, so the record lives here, keyed by the
 * card pair. Stored edges read it as a fallback, which also keeps the state alive
 * if an edge is ever recreated.
 */
const KEY = 'dsh.talk-pages.push-log.v1'

type PushLog = Record<string, number>

function pairKey(fromCardId: string, toCardId: string): string {
  return `${fromCardId}>${toCardId}`
}

function read(): PushLog {
  try {
    if (typeof localStorage === 'undefined') return {}
    const raw = localStorage.getItem(KEY)
    if (raw === null) return {}
    const parsed = JSON.parse(raw) as PushLog
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/** Record that `from` just delivered context to `to`. */
export function stampPush(fromCardId: string, toCardId: string): number {
  const at = Date.now()
  try {
    const log = read()
    log[pairKey(fromCardId, toCardId)] = at
    if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(log))
  } catch { /* private mode: the state just stays unknown */ }
  return at
}

/** Last delivery for this pair, if it was ever pushed. */
export function lastPushFor(fromCardId: string, toCardId: string): number | undefined {
  const value = read()[pairKey(fromCardId, toCardId)]
  return typeof value === 'number' ? value : undefined
}
