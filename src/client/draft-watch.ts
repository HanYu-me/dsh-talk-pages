/**
 * "This conversation has text typed but not sent."
 *
 * The composer keeps its draft in the shell's own per-session conversation
 * store, which persists to `localStorage` under `dsh.conversation.<sessionId>`
 * as `{ draft: string | { text, references }, view }`. There is no client
 * service or projection exposing it, so the map reads the same storage the
 * composer writes and polls it while the panel is open (same-document writes do
 * not fire `storage` events, so there is nothing to listen to).
 */
const STORE_PREFIX = 'dsh.conversation.'

/** Extract the plain text out of either persisted draft shape. */
function draftTextOf(value: unknown): string {
  if (typeof value === 'string') return value
  if (value !== null && typeof value === 'object') {
    const text = (value as { text?: unknown }).text
    if (typeof text === 'string') return text
  }
  return ''
}

let snapshot: ReadonlySet<string> = new Set()
const listeners = new Set<() => void>()

function publish(next: ReadonlySet<string>): void {
  snapshot = next
  for (const listener of listeners) listener()
}

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false
  for (const value of a) if (!b.has(value)) return false
  return true
}

/** Which sessions currently hold unsent text, straight from the shell's store. */
export function readDraftSessions(): Set<string> {
  const out = new Set<string>()
  if (typeof localStorage === 'undefined') return out
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (key === null || !key.startsWith(STORE_PREFIX)) continue
    const sessionId = key.slice(STORE_PREFIX.length)
    if (sessionId === '') continue
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) continue
      const stored: unknown = JSON.parse(raw)
      const draft = stored !== null && typeof stored === 'object'
        ? (stored as { draft?: unknown }).draft
        : undefined
      if (draftTextOf(draft).trim() !== '') out.add(sessionId)
    } catch {
      // A half-written entry is not a reason to fail the map.
    }
  }
  return out
}

export const draftWatch = {
  getSnapshot(): ReadonlySet<string> {
    return snapshot
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  /** Re-read the store; publishes only when the set actually changed. */
  refresh(): void {
    const next = readDraftSessions()
    if (!sameSet(next, snapshot)) publish(next)
  },
}
