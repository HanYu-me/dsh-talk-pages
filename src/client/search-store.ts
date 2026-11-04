/**
 * Search state that outlives the panel.
 *
 * Jumping into a conversation unmounts the map, and coming back to an empty
 * search box is jarring: remember the query and its results per surface
 * (the header's global search, and each folder's drawer search).
 */
const TTL_MS = 12 * 60 * 60 * 1000

/** Every extra hit fetched for a session (shape owned by the caller). */
export type StoredMore = Record<string, unknown>

export interface StoredSearch<T> {
  query: string
  hits: T[]
  /** Extra per-session hits already loaded — do not fetch them again. */
  more?: StoredMore
  at: number
}

function keyFor(scope: string): string {
  return `dsh.talk-pages.search.${scope}.v1`
}

export function saveSearch<T>(scope: string, value: { query: string; hits: T[]; more?: StoredMore }): void {
  try {
    if (typeof localStorage === 'undefined') return
    const payload: StoredSearch<T> = { ...value, at: Date.now() }
    localStorage.setItem(keyFor(scope), JSON.stringify(payload))
  } catch { /* private mode / quota: the search just will not be restored */ }
}

export function loadSearch<T>(scope: string): StoredSearch<T> | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(keyFor(scope))
    if (raw === null) return null
    const parsed = JSON.parse(raw) as StoredSearch<T>
    if (typeof parsed?.query !== 'string' || !Array.isArray(parsed?.hits)) return null
    if (Date.now() - Number(parsed.at ?? 0) > TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

export function clearSearch(scope: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(keyFor(scope))
  } catch { /* nothing to do */ }
}
