/**
 * How fresh is one injection edge?
 *
 * Three states, decided only from what the client actually owns:
 *   • synced — the source conversation has not changed since the last push, so
 *     the target really is holding the latest context. The line gets a light
 *     packet running along it (the "still flowing" look).
 *   • stale  — the source moved on and nobody pushed again. No flow; the line
 *     glows amber as a standing reminder.
 *   • far    — stale AND the push is old: the target is many turns behind. Red.
 *
 * Link edges (two existing conversations, never pushed) are `idle`: they carry
 * no context, so they must not pretend to flow or to be behind.
 */
export type EdgeSyncState = 'synced' | 'stale' | 'far' | 'idle'

/** Filesystem/mtime slack: a push at T and a message at T are the same moment. */
const SAME_MOMENT_MS = 5_000

/** After this long without a push, a stale edge counts as "way behind". */
export const FAR_BEHIND_MS = 12 * 60 * 60 * 1000

export interface EdgeSyncInput {
  /** Injection kind: 'digest' | 'full' | 'selection' | 'none' | 'link'. */
  kind: string
  /** When this edge last delivered something, if ever. */
  lastPushAt?: number
  /** The source session's own `updatedAt` (null when it is gone). */
  sourceUpdatedAt?: number
  /** Injectable clock, for tests. */
  now?: number
}

export function edgeSyncState(input: EdgeSyncInput): EdgeSyncState {
  // An association line carries no context: nothing to be behind on.
  if (input.kind === 'link') return 'idle'
  // 'full' forks copy the history once; they are never "in sync" or behind.
  if (input.kind === 'full') return 'idle'
  if (input.lastPushAt === undefined) return 'idle'
  if (input.sourceUpdatedAt === undefined) return 'idle'

  const lastPushAt = Number(input.lastPushAt)
  const sourceUpdatedAt = Number(input.sourceUpdatedAt)
  if (!Number.isFinite(lastPushAt) || !Number.isFinite(sourceUpdatedAt)) return 'idle'

  // Nothing happened in the source after the push → the target is current.
  if (sourceUpdatedAt <= lastPushAt + SAME_MOMENT_MS) return 'synced'

  const now = Number(input.now ?? Date.now())
  return now - lastPushAt >= FAR_BEHIND_MS ? 'far' : 'stale'
}

/**
 * Freshness of a lineage line (parent session → forked/subagent child).
 * Nothing is pushed along it; this only says whether the child has kept up.
 */
export function lineageSyncState(input: {
  parentUpdatedAt?: number
  childUpdatedAt?: number
  now?: number
}): EdgeSyncState {
  const parent = Number(input.parentUpdatedAt)
  const child = Number(input.childUpdatedAt)
  if (!Number.isFinite(parent) || !Number.isFinite(child)) return 'idle'
  // The child was written to at or after the parent: it has the latest state.
  if (child + SAME_MOMENT_MS >= parent) return 'synced'
  const now = Number(input.now ?? Date.now())
  return now - child >= FAR_BEHIND_MS ? 'far' : 'stale'
}
