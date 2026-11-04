import { cleanPreviewText } from './preview-text.ts'

/**
 * Cached card bodies.
 *
 * The body (the user's last message) comes from the Host, and one surface read
 * costs ~250ms per session — so fetching on every open means the cards sit empty
 * for a moment. These texts almost never change, so they are cached in
 * localStorage next to their `updatedAt` stamp: the map paints from the cache
 * immediately and only asks the Host for sessions whose stamp moved.
 */
const STORAGE_KEY = 'dsh.talk-pages.previews.v1'
/** Raw text is capped before storing; the display cap is applied after cleaning. */
const MAX_RAW = 600
/** Enough for a few hundred conversations; each entry is one line of text. */
const MAX_ENTRIES = 300

export interface PreviewEntry {
  text: string
  stamp: number
}

type Store = Record<string, PreviewEntry>

let cache: Store | null = null
let timer: ReturnType<typeof setTimeout> | undefined

export function loadPreviewCache(): Store {
  if (cache !== null) return cache
  if (typeof localStorage === 'undefined') {
    cache = {}
    return cache
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw === null ? null : JSON.parse(raw) as unknown
    cache = parsed !== null && typeof parsed === 'object' ? parsed as Store : {}
  } catch {
    cache = {}
  }
  return cache
}

/**
 * Plain sessionId → text, for the first paint.
 *
 * The cache stores the RAW message and cleans it on the way out: a rule fix then
 * applies to entries written before it, instead of leaving old noise cached
 * forever (the stamp only changes when the conversation does).
 */
export function readPreviewTexts(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [sessionId, entry] of Object.entries(loadPreviewCache())) {
    if (typeof entry?.text !== 'string' || entry.text === '') continue
    const cleaned = cleanPreviewText(entry.text).slice(0, 240)
    if (cleaned !== '') out[sessionId] = cleaned
  }
  return out
}

function persist(): void {
  if (typeof localStorage === 'undefined' || cache === null) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // Quota exceeded: drop the cache rather than break the map.
    cache = {}
  }
}

function scheduleSave(): void {
  if (timer !== undefined) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = undefined
    persist()
  }, 400)
}

/** Store one freshly fetched body — RAW, cleaned at read time (see above). */
export function putPreview(sessionId: string, text: string, stamp: number): void {
  const store = loadPreviewCache()
  store[sessionId] = { text: text.slice(0, MAX_RAW), stamp }
  const keys = Object.keys(store)
  if (keys.length > MAX_ENTRIES) {
    // Oldest-first eviction: a Map would be nicer, but the record is what lands in JSON.
    const ordered = keys
      .map(key => ({ key, stamp: store[key]?.stamp ?? 0 }))
      .sort((a, b) => a.stamp - b.stamp)
    for (const entry of ordered.slice(0, keys.length - MAX_ENTRIES)) delete store[entry.key]
  }
  scheduleSave()
}
