/**
 * Persistence for the map's own transient lamp state.
 *
 * The canvas domain (cards, frames, camera) lives in the Host store, but the
 * *lamp* facts are derived from live client subscriptions — and those reset on
 * restart, so a green "待查看" or a red "异常终止" vanished with the app. These
 * are per-browser UI facts anyway, so they live in localStorage next to the
 * shell's own draft store, and survive a restart without touching the Host
 * schema (MapGlobal is zod-validated and would drop unknown fields).
 */
const STORAGE_KEY = 'dsh.talk-pages.lamp-state.v1'
/** Marks older than this are noise from long-dead sessions. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

export interface PersistedLampState {
  version: 1
  /** sessionId → when the map noticed it finish (green "待查看"). */
  finished: Record<string, number>
  /** sessionId → the failure detail (red "异常终止"). */
  errors: Record<string, string>
  /** sessionId → when it was last seen running (amber "已中断" after restart). */
  interrupted: Record<string, number>
}

const EMPTY: PersistedLampState = { version: 1, finished: {}, errors: {}, interrupted: {} }

function prune(record: Record<string, number>, now: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [sessionId, at] of Object.entries(record)) {
    if (typeof at === 'number' && now - at < MAX_AGE_MS) out[sessionId] = at
  }
  return out
}

let cache: PersistedLampState | null = null
let timer: ReturnType<typeof setTimeout> | undefined

export function loadLampState(): PersistedLampState {
  if (cache !== null) return cache
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      cache = EMPTY
      return cache
    }
    const parsed = JSON.parse(raw) as Partial<PersistedLampState>
    const now = Date.now()
    cache = {
      version: 1,
      finished: prune(parsed.finished ?? {}, now),
      errors: parsed.errors ?? {},
      interrupted: prune(parsed.interrupted ?? {}, now),
    }
  } catch {
    cache = EMPTY
  }
  return cache
}

/** Debounced write-through; `flush` forces it (used on unload). */
export function saveLampState(patch: Partial<Omit<PersistedLampState, 'version'>>): void {
  const base = loadLampState()
  cache = {
    version: 1,
    finished: patch.finished ?? base.finished,
    errors: patch.errors ?? base.errors,
    interrupted: patch.interrupted ?? base.interrupted,
  }
  if (typeof localStorage === 'undefined') return
  if (timer !== undefined) clearTimeout(timer)
  timer = setTimeout(() => { flushLampState() }, 250)
}

export function flushLampState(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
  if (cache === null || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // A full quota must not break the map.
  }
}

/**
 * Before unload: remember which sessions were running, so the next start can say
 * "this run was interrupted" instead of showing the conversation as idle.
 */
export function recordRunningAtShutdown(sessionIds: readonly string[]): void {
  const base = loadLampState()
  const interrupted = { ...base.interrupted }
  const now = Date.now()
  for (const sessionId of sessionIds) interrupted[sessionId] = now
  saveLampState({ interrupted })
  flushLampState()
}
