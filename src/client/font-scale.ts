/**
 * Whole-map text size, in "steps": one step = +1px on every element's own base
 * size (each style keeps its own size; they all move together). Persisted in
 * localStorage and applied as `--tm-font-step` on the panel root, so nothing
 * outside the map is affected.
 */
const STORAGE_KEY = 'dsh.talk-pages.font-step'
const MIN = -3
const MAX = 9

function read(): number {
  if (typeof localStorage === 'undefined') return 0
  const raw = localStorage.getItem(STORAGE_KEY)
  const value = raw === null ? 0 : Number(raw)
  return Number.isFinite(value) ? Math.min(MAX, Math.max(MIN, Math.round(value))) : 0
}

let step = read()
let snapshot = step
const listeners = new Set<() => void>()

function publish(): void {
  snapshot = step
  if (typeof localStorage !== 'undefined') {
    try { localStorage.setItem(STORAGE_KEY, String(step)) } catch { /* quota */ }
  }
  for (const listener of listeners) listener()
}

export const fontScale = {
  getSnapshot(): number {
    return snapshot
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  /** CSS value for the panel root. */
  css(): string {
    return `${snapshot}px`
  },
  canDecrease(): boolean {
    return snapshot > MIN
  },
  canIncrease(): boolean {
    return snapshot < MAX
  },
  increase(): void {
    if (step >= MAX) return
    step += 1
    publish()
  },
  decrease(): void {
    if (step <= MIN) return
    step -= 1
    publish()
  },
  reset(): void {
    if (step === 0) return
    step = 0
    publish()
  },
}
