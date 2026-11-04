/**
 * Canvas-domain data model shared by both halves. The host side's zod
 * schemas (src/host/store.ts) are the durable source of truth; these plain
 * interfaces mirror them for the browser bundle (which must not pull zod).
 */

export interface Card {
  boardId: string
  sessionId: string
  x: number
  y: number
  colorTag?: string
  /** Legacy (pre-v5) group override; the layout migration folds it into boxId. */
  wsOverride?: string
  /**
   * User box this card belongs to. Absent = free card: it renders at its own
   * x/y and nothing ever moves it. A boxed card is laid out by the slot grid.
   */
  boxId?: string
  /** Importance mark: 1 high, 2 medium, 3 low; absent = unmarked. */
  priority?: 1 | 2 | 3
  createdAt: number
}

/**
 * A user-drawn container on one page. Geometry lives in `global.wsFrames[id]`
 * and colour in `global.wsColors[id]` (both kept under their old names so the
 * v4 folder data carries over unchanged).
 */
export interface Box {
  /** Page (workspace id, or UNSORTED_PAGE_ID) this box belongs to. */
  pageId: string
  title: string
  /** Members keep their own positions (no slot grid, no overflow stack). */
  free?: boolean
}

export interface Board {
  name: string
  color: string
  order: number
  createdAt: number
  archivedAt?: number
  shelvedAt?: number
}

export interface EdgeInjection {
  /** 'link' = plain association between existing cards; 'none' = fork edge
   * whose child inherited nothing. */
  kind: 'digest' | 'full' | 'selection' | 'none' | 'link'
  injectedText?: string
  /**
   * Push this card's digest to the edge's target whenever it changes.
   * Off by default: digests are generated on demand only.
   */
  autoPush?: boolean
}

export interface MapEdgeData {
  boardId: string
  fromCardId: string
  toCardId: string
  injection: EdgeInjection
  /** Handle sides ('t'|'r'|'b'|'l'); absent = legacy r→l. */
  fromHandle?: string
  toHandle?: string
  /** Pipe mode: source digest changes auto-push along this edge. */
  autoSync?: boolean
  /** When this edge last delivered context (manual push or auto push). */
  lastPushAt?: number
  /** Source-session title snapshot for host-side auto-sync headers. */
  fromTitle?: string
  createdAt: number
}

export interface Digest {
  atSeq: number
  summary: string
  keyFindings: string[]
  nextStep: string
  todoNext?: string
  generatedAt: number
  model?: string
  error?: string
}

export interface Camera {
  x: number
  y: number
  zoom: number
}

export interface MapGlobal {
  version: number
  activeBoard: string
  cameraByBoard: Record<string, Camera>
  /** Auto-placement generation; absent = v1 (pre-workspace-grouping). */
  layoutVersion?: number
  /** Per-box color tags (boxes replaced the auto workspace folders). */
  wsColors?: Record<string, string>
  /** Box geometry, keyed by box id (a migrated folder keeps its workspace id). */
  wsFrames?: Record<string, FrameGeometry>
  /** User boxes: the only grouping layer on the board. */
  boxes?: Record<string, Box>
  /** Page (workspace) currently shown; absent = the first page of the tab bar. */
  activePage?: string
  /** Free cards snap to the 16px grid on drop; absent = true. */
  snap?: boolean
  /** New conversations of a workspace appear on its page by themselves; absent = false. */
  autoAdd?: boolean
  /** Map-toggle hotkey, e.g. "alt+KeyF" (modifiers + KeyboardEvent.code). */
  hotkey?: string
  /** Interface language; absent = 'auto' (follow dsh's <html lang>). */
  locale?: LocalePref
  /** Last known placement per session — re-imports restore the arrangement. */
  layoutMemory?: Record<string, LayoutMemoryEntry>
}

/** Language the map's own copy renders in; 'auto' defers to dsh. */
export type LocalePref = 'auto' | 'zh' | 'en'

export interface LayoutMemoryEntry {
  x: number
  y: number
  colorTag?: string
}

export interface FrameGeometry {
  x: number
  y: number
  width: number
  height: number
}

export interface MapStatePayload {
  boards: Record<string, Board>
  cards: Record<string, Card>
  edges: Record<string, MapEdgeData>
  digests: Record<string, Digest>
  global: MapGlobal
}

export const INBOX_BOARD_ID = 'inbox'
/** Page that collects cards whose session belongs to no workspace. */
export const UNSORTED_PAGE_ID = '__none__'
