/**
 * "It broke" alerts for the map's lamps.
 *
 * The Host forwards `api-session/error` (sessionId, errorChain) for any agent
 * that fails a run. Nothing in the Session list carries that fact, so the map
 * keeps its own small projection: last error per session, cleared when the
 * session runs again or is opened as the main view (same acknowledgement rule
 * ui-session uses for its completion reminder).
 */
import type { AlertSource, SessionListState } from './dsh.ts'
import { loadLampState, saveLampState } from './state-persist.ts'

const alerts = new Map<string, string>()
let snapshot: ReadonlyMap<string, string> = new Map()
const listeners = new Set<() => void>()

// A restart keeps the red lamps: "this run failed" is a per-browser UI fact and
// the Host exposes no last-error flag the map could rebuild it from.
for (const [sessionId, detail] of Object.entries(loadLampState().errors)) {
  alerts.set(sessionId, detail)
}

function persist(): void {
  saveLampState({ errors: Object.fromEntries(alerts) })
}

function publish(): void {
  snapshot = new Map(alerts)
  persist()
  for (const listener of listeners) listener()
}

// Publish what survived the restart: the snapshot, not just the map, is what the
// cards read.
snapshot = new Map(alerts)

export const sessionAlerts = {
  getSnapshot(): ReadonlyMap<string, string> {
    return snapshot
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
}

/** Sessions list surface this module reads (structural subset). */
interface SessionListSurface {
  getSnapshot(): SessionListState
  subscribe(listener: () => void): () => void
}

/**
 * Wire the alert projection to the Host event stream and the session list.
 *
 * @param remote - ctx.remote (absent on a build without the remote service).
 * @param list - ctx.sessions.list.
 * @returns disposer that detaches every subscription.
 */
export function attachAlertSource(remote: AlertSource | undefined, list: SessionListSurface): () => void {
  const disposers: (() => void)[] = []

  const onError = (...args: unknown[]): void => {
    const sessionId = args[0]
    if (typeof sessionId !== 'string') return
    const detail = typeof args[1] === 'string' ? args[1] : 'error'
    alerts.set(sessionId, detail)
    publish()
  }
  const onStatus = (...args: unknown[]): void => {
    const sessionId = args[0]
    // A new run supersedes the previous failure.
    if (typeof sessionId === 'string' && args[1] === true && alerts.delete(sessionId)) publish()
  }

  if (remote !== undefined) {
    try {
      disposers.push(remote.$on('api-session/error', onError))
      disposers.push(remote.$on('api-session/status', onStatus))
    } catch (error) {
      console.error('[dsh-talk-pages] session alert source unavailable:', error)
    }
  }

  // Opening the session as the main view acknowledges the failure.
  const reconcile = (): void => {
    if (alerts.size === 0) return
    const state = list.getSnapshot()
    let changed = false
    for (const id of [...alerts.keys()]) {
      const row = state.byId[id]
      if (row === undefined) continue
      if ((row.retainedBy?.mainView ?? 0) > 0) {
        alerts.delete(id)
        changed = true
      }
    }
    if (changed) publish()
  }
  try {
    disposers.push(list.subscribe(reconcile))
    reconcile()
  } catch (error) {
    console.error('[dsh-talk-pages] session alert list subscription failed:', error)
  }

  return () => {
    for (const dispose of disposers) {
      try {
        dispose()
      } catch {
        // A torn-down remote must not keep the plugin from unloading.
      }
    }
  }
}
