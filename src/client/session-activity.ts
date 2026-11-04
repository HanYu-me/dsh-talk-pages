/**
 * "It finished while the map was up" tracking, plus the "this run was
 * interrupted" note that only exists across a restart.
 *
 * The shell marks a session *unread* only when it finishes while that session is
 * not the main view. Opening the map from a conversation keeps that conversation
 * as the selected session, so a turn that completes behind the map never gets
 * that mark — the card stays plain and the user misses it.
 *
 * So the map keeps its own projection: while the panel is mounted we watch each
 * session's running flag, and a running → idle transition marks it finished.
 * The mark clears when the session runs again, when it starts waiting for the
 * user, or when the user opens it from the map.
 *
 * Both sets are persisted (see state-persist.ts) so a restart does not wipe the
 * green "待查看" lamps — or the "已中断" notes of runs that were cut off.
 */
import type { SessionStatusFact } from './dsh.ts'
import { loadLampState, recordRunningAtShutdown, saveLampState } from './state-persist.ts'

interface SummaryLike {
  readonly running?: boolean
  readonly pendingInteraction?: unknown
  readonly retainedBy?: { readonly mainView?: number }
}

const lastRunning = new Map<string, boolean>()
const finished = new Set<string>()
const interrupted = new Set<string>()
/** Ids restored from storage: the first observation may clear them (see observe). */
const hydrated = new Set<string>()
/** Set when the panel mounts; the first observation then re-establishes the baseline. */
let needsBaseline = true
/** Bumped every time the map panel mounts: marks carry the epoch they were made in. */
let panelEpoch = 0
const markedEpoch = new Map<string, number>()
/** Last completionUnread we saw per session, to detect a real transition. */
const lastUnread = new Map<string, boolean | undefined>()
let snapshot: ReadonlySet<string> = new Set()
let interruptedSnapshot: ReadonlySet<string> = new Set()
const listenerSet = new Set<() => void>()

function publish(): void {
  snapshot = new Set(finished)
  interruptedSnapshot = new Set(interrupted)
  for (const listener of listenerSet) listener()
}

function persist(): void {
  const now = Date.now()
  const finishedRecord: Record<string, number> = {}
  for (const sessionId of finished) finishedRecord[sessionId] = now
  const interruptedRecord: Record<string, number> = {}
  for (const sessionId of interrupted) interruptedRecord[sessionId] = now
  saveLampState({ finished: finishedRecord, interrupted: interruptedRecord })
}

function hydrate(): void {
  const stored = loadLampState()
  for (const sessionId of Object.keys(stored.finished)) {
    finished.add(sessionId)
    hydrated.add(sessionId)
  }
  for (const sessionId of Object.keys(stored.interrupted)) {
    interrupted.add(sessionId)
    hydrated.add(sessionId)
  }
  // The snapshots — not the sets — are what the components read, so publish them
  // or the restored marks stay invisible until something else changes.
  publish()
}

hydrate()

export const sessionActivity = {
  /** Sessions the map believes "finished, unread" (drives the green lamp). */
  getSnapshot(): ReadonlySet<string> {
    return snapshot
  },
  /** Sessions whose run was cut off by a restart ("已中断"). */
  getInterrupted(): ReadonlySet<string> {
    return interruptedSnapshot
  },
  subscribe(listener: () => void): () => void {
    listenerSet.add(listener)
    return () => { listenerSet.delete(listener) }
  },
  isFinished(sessionId: string): boolean {
    return finished.has(sessionId)
  },
  isInterrupted(sessionId: string): boolean {
    return interrupted.has(sessionId)
  },
  /**
   * Feed one observation of the live status map. Only a transition observed
   * while the map is mounted counts, so a session that finished while the map
   * was closed keeps whatever the shell decided for it.
   */
  /**
   * The map panel (re)mounts: the next observation is a BASELINE, not a
   * transition. Without this, a run that finished while the panel was closed
   * looked like "was running, now idle" and produced a false 待查看 lamp — the
   * mark must only exist for completions that happen while the map is up.
   */
  beginPanelSession(): void {
    needsBaseline = true
    panelEpoch += 1
  },
  observe(
    status: ReadonlyMap<string, SessionStatusFact>,
    summaries: Readonly<Record<string, SummaryLike>>,
  ): void {
    let changed = false
    const ids = new Set<string>([...status.keys(), ...Object.keys(summaries)])
    if (needsBaseline) {
      needsBaseline = false
      for (const sessionId of ids) {
        const fact = status.get(sessionId)
        const row = summaries[sessionId]
        lastRunning.set(sessionId, fact?.running === true || row?.running === true)
      }
      return
    }
    for (const sessionId of ids) {
      const fact = status.get(sessionId)
      const row = summaries[sessionId]
      const running = fact?.running === true || row?.running === true
      const blocked = (fact !== undefined && fact.pendingInteraction !== undefined)
        || row?.pendingInteraction !== undefined
      const wasRunning = lastRunning.get(sessionId)
      lastRunning.set(sessionId, running)
      if (running || blocked) {
        // A new run (or a question) supersedes both marks.
        if (finished.delete(sessionId)) changed = true
        if (interrupted.delete(sessionId)) changed = true
        hydrated.delete(sessionId)
        continue
      }
      if (wasRunning === true && !finished.has(sessionId)) {
        finished.add(sessionId)
        markedEpoch.set(sessionId, panelEpoch)
        changed = true
      }
      // A mark restored from storage is dropped as soon as the session is on
      // screen now — the shell had already acknowledged it, someone looked at it
      // while the app was closed, or (most often) it is the session the new start
      // restored. Runtime-made marks are never in `hydrated`, so they survive.
      if (hydrated.has(sessionId) && (row?.retainedBy?.mainView ?? 0) > 0) {
        hydrated.delete(sessionId)
        if (finished.delete(sessionId)) changed = true
        if (interrupted.delete(sessionId)) changed = true
      }
      // Two ways a mark can be released, and only two:
      //  1. the shell flips completionUnread from true to false — somebody read
      //     it (notification, sidebar, anywhere not this map);
      //  2. you left the map and came back, and the session is now the one on
      //     screen (markedEpoch < panelEpoch) — you were looking at it. Main-view
      //     retention alone is NOT enough: while the map is open the session you
      //     came from stays "main view" even though the map is covering it.
      const unread = fact?.completionUnread
      const previousUnread = lastUnread.get(sessionId)
      if (typeof unread === 'boolean') lastUnread.set(sessionId, unread)
      if (finished.has(sessionId)) {
        const readElsewhere = previousUnread === true && unread === false
        const cameBackToIt = (row?.retainedBy?.mainView ?? 0) > 0
          && (markedEpoch.get(sessionId) ?? panelEpoch) < panelEpoch
        if (readElsewhere || cameBackToIt) {
          finished.delete(sessionId)
          markedEpoch.delete(sessionId)
          changed = true
        }
      }
    }
    if (changed) {
      persist()
      publish()
    }
  },
  /**
   * "Mark as unread" from the context menu: the exact state the map computes when
   * a run finishes unwatched, and cleared the same way (open the conversation).
   */
  markFinished(sessionId: string): void {
    hydrated.delete(sessionId)
    if (finished.has(sessionId)) return
    finished.add(sessionId)
    persist()
    publish()
  },
  /** The user is looking at it now: stop advertising it as unread/interrupted. */
  acknowledge(sessionId: string): void {
    hydrated.delete(sessionId)
    const removedFinished = finished.delete(sessionId)
    const removedInterrupted = interrupted.delete(sessionId)
    if (removedFinished || removedInterrupted) {
      persist()
      publish()
    }
  },
  /** The session is gone (deleted / archived): drop both records. */
  forget(sessionId: string): void {
    lastRunning.delete(sessionId)
    hydrated.delete(sessionId)
    const removed = finished.delete(sessionId) || interrupted.delete(sessionId)
    if (removed) {
      persist()
      publish()
    }
  },
  /**
   * Called from `beforeunload`: everything still running is a run that will be
   * cut off, so the next start can say so.
   */
  recordShutdown(status: ReadonlyMap<string, SessionStatusFact>, summaries: Readonly<Record<string, SummaryLike>>): void {
    const running: string[] = []
    for (const [sessionId, fact] of status) if (fact.running === true) running.push(sessionId)
    for (const [sessionId, row] of Object.entries(summaries)) if (row.running === true) running.push(sessionId)
    if (running.length === 0) return
    for (const sessionId of running) interrupted.add(sessionId)
    recordRunningAtShutdown(running)
    publish()
  },
}
