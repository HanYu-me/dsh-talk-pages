/**
 * Canvas data store: the client-side working copy of the talk-pages domain.
 * Reads land here from GET /talk-pages/state plus the SSE change feed; writes
 * are optimistic (local first) with debounced persistence. Card positions
 * are sacred user data — nothing here ever moves a card except an explicit
 * user drag or the one-time auto-placement of a session that has no card yet.
 */
import { talkMapApi } from './api.ts'
import { setLocalePref } from './i18n.ts'
import type { Box, Card, Digest, FrameGeometry, MapEdgeData, MapGlobal, Camera } from '../shared/model.ts'
import { INBOX_BOARD_ID } from '../shared/model.ts'

export interface CanvasState {
  readonly phase: 'idle' | 'loading' | 'ready' | 'error'
  readonly error?: string
  readonly cards: Readonly<Record<string, Card>>
  readonly edges: Readonly<Record<string, MapEdgeData>>
  readonly digests: Readonly<Record<string, Digest>>
  readonly global: MapGlobal | null
}

type Listener = () => void

const FLUSH_DELAY_MS = 500
const CAMERA_DELAY_MS = 800

let state: CanvasState = { phase: 'idle', cards: {}, edges: {}, digests: {}, global: null }
const listeners = new Set<Listener>()

function setState(next: Partial<CanvasState>): void {
  state = { ...state, ...next }
  // The interface language lives in the canvas global, so every path that
  // can change it (load, SSE, local patch, undo) funnels through here.
  setLocalePref(state.global?.locale ?? 'auto')
  for (const listener of listeners) listener()
}

const dirtyCards = new Set<string>()
let flushTimer: ReturnType<typeof setTimeout> | undefined
let cameraTimer: ReturnType<typeof setTimeout> | undefined
let frameTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Monotonic counter of local board edits. refresh() reads the server copy
 * wholesale, so a fetch that started before a local add (auto-sync, import,
 * drop) would silently undo it — the guard drops that stale answer instead.
 */
let editSeq = 0

function bumpEdits(): void {
  editSeq += 1
}

/**
 * Card writes whose POST has not answered yet. refresh() reads the server copy
 * wholesale, so applying an answer while one of these is in flight can undo a
 * card that already exists locally (auto-sync, import, drop).
 */
let cardWritesInFlight = 0

function trackCardWrite(promise: Promise<unknown>): void {
  cardWritesInFlight += 1
  void promise.finally(() => { cardWritesInFlight -= 1 })
}

/** Undo/redo: whole-board snapshots (camera excluded on restore). Rapid
 * operation streams (a drag emits dozens of moves) collapse into one entry. */
interface BoardSnapshot {
  cards: Readonly<Record<string, Card>>
  edges: Readonly<Record<string, MapEdgeData>>
  global: MapGlobal | null
}
const undoStack: BoardSnapshot[] = []
const redoStack: BoardSnapshot[] = []
let lastUndoPush = 0

function takeSnapshot(): BoardSnapshot {
  return { cards: state.cards, edges: state.edges, global: state.global }
}

function pushUndo(): void {
  // Every mutator funnels through here, so this is where a local edit is
  // recorded as "the board moved on" (see refresh()'s stale-answer guard).
  bumpEdits()
  const now = Date.now()
  if (now - lastUndoPush < 400 && undoStack.length > 0) return
  lastUndoPush = now
  undoStack.push(takeSnapshot())
  if (undoStack.length > 50) undoStack.shift()
  redoStack.length = 0
}

function restoreSnapshot(snapshot: BoardSnapshot): void {
  const previousCards = state.cards
  const previousEdges = state.edges
  const currentCamera = state.global?.cameraByBoard
  const global = snapshot.global === null
    ? state.global
    : { ...snapshot.global, cameraByBoard: currentCamera ?? snapshot.global.cameraByBoard }
  setState({ cards: snapshot.cards, edges: snapshot.edges, ...(global !== null ? { global } : {}) })
  // Server sync, fire-and-forget: full upserts + deletions of the leftovers.
  const goneCards = Object.keys(previousCards).filter(id => snapshot.cards[id] === undefined)
  const goneEdges = Object.keys(previousEdges).filter(id => snapshot.edges[id] === undefined)
  void (async () => {
    if (Object.keys(snapshot.cards).length > 0) await talkMapApi.upsertCards({ ...snapshot.cards })
    if (goneCards.length > 0) await talkMapApi.deleteCards(goneCards)
    if (Object.keys(snapshot.edges).length > 0) await talkMapApi.upsertEdges({ ...snapshot.edges })
    if (goneEdges.length > 0) await talkMapApi.deleteEdges(goneEdges)
    if (global !== null) await persistGlobal(global, 'undo')
  })().catch((error) => {
    console.error('[dsh-talk-pages] undo sync failed:', error)
  })
}

/**
 * Count of global writes whose POST has not answered yet. refresh() reads
 * the server's copy wholesale, so without this a patch that is still in
 * flight (a language switch, a hotkey rebind) is silently rolled back by
 * the next refresh — the same protection dirtyCards gives card positions.
 */
let globalWritesInFlight = 0

function persistGlobal(value: MapGlobal, label: string): Promise<void> {
  globalWritesInFlight += 1
  return talkMapApi.setGlobal(value).catch((error) => {
    console.error(`[dsh-talk-pages] ${label} save failed:`, error)
  }).finally(() => {
    globalWritesInFlight -= 1
  })
}

let globalPersistTimer: ReturnType<typeof setTimeout> | undefined

/** Debounced full-global persist (layout-memory writes batch under deletes). */
function scheduleGlobalPersist(): void {
  if (globalPersistTimer !== undefined) clearTimeout(globalPersistTimer)
  globalPersistTimer = setTimeout(() => {
    globalPersistTimer = undefined
    const current = state.global
    if (current === null) return
    void persistGlobal(current, 'layout-memory')
  }, 600)
}

function scheduleCardFlush(): void {
  if (flushTimer !== undefined) return
  flushTimer = setTimeout(() => {
    flushTimer = undefined
    void flushCards()
  }, FLUSH_DELAY_MS)
}

async function flushCards(): Promise<void> {
  if (dirtyCards.size === 0) return
  const payload: Record<string, Card> = {}
  for (const id of dirtyCards) {
    const card = state.cards[id]
    if (card !== undefined) payload[id] = card
  }
  dirtyCards.clear()
  if (Object.keys(payload).length === 0) return
  cardWritesInFlight += 1
  try {
    await talkMapApi.upsertCards(payload)
  } catch (error) {
    console.error('[dsh-talk-pages] card flush failed:', error)
    for (const id of Object.keys(payload)) dirtyCards.add(id)
  } finally {
    cardWritesInFlight -= 1
  }
}

export const canvas = {
  get(): CanvasState {
    return state
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },

  ensureLoaded(): void {
    if (state.phase === 'loading' || state.phase === 'ready') return
    setState({ phase: 'loading', error: undefined })
    // A hung host request would otherwise leave the map on "正在加载地图……"
    // forever, with no way out but a reload of the whole app.
    const timer = setTimeout(() => {
      if (state.phase !== 'loading') return
      setState({ phase: 'error', error: 'timeout' })
    }, 12000)
    talkMapApi.getState().then((payload) => {
      clearTimeout(timer)
      setState({
        phase: 'ready',
        cards: payload.cards,
        edges: payload.edges,
        digests: payload.digests,
        global: payload.global,
      })
    }).catch((error) => {
      clearTimeout(timer)
      setState({ phase: 'error', error: String(error) })
    })
  },

  /** Retry a failed or timed-out load (the error banner's button). */
  reload(): void {
    if (state.phase === 'loading') return
    setState({ phase: 'pending', error: undefined })
    this.ensureLoaded()
  },

  /** SSE mirror: applies host-confirmed changes (idempotent over our own writes). */
  connect(): () => void {
    return talkMapApi.subscribeChanges((change) => {
      if (change.table === 'cards') {
        // Never clobber a position the user is actively dragging.
        if (dirtyCards.has(change.key)) return
        const cards = { ...state.cards }
        if (change.operation === 'deleted') delete cards[change.key]
        else cards[change.key] = change.value as Card
        setState({ cards })
        return
      }
      if (change.table === 'edges') {
        const edges = { ...state.edges }
        if (change.operation === 'deleted') delete edges[change.key]
        else edges[change.key] = change.value as MapEdgeData
        setState({ edges })
        return
      }
      if (change.table === 'digests') {
        const digests = { ...state.digests }
        if (change.operation === 'deleted') delete digests[change.key]
        else digests[change.key] = change.value as Digest
        setState({ digests })
      }
    })
  },

  moveCard(id: string, x: number, y: number): void {
    // Existence FIRST, undo frame after — a no-op must not push an
    // identical snapshot (pushUndo clears the redo stack). Same order in
    // every mutator below.
    const card = state.cards[id]
    if (card === undefined) return
    pushUndo()
    setState({ cards: { ...state.cards, [id]: { ...card, x, y } } })
    dirtyCards.add(id)
    scheduleCardFlush()
  },

  /**
   * Batch position write — one undo frame, one state copy, one flush. The slot
   * layout moves a whole folder of cards at once (drop, resize, compaction),
   * and per-card calls would push an undo frame per card and post N times.
   */
  moveCards(points: Record<string, { x: number; y: number }>): void {
    const cards = { ...state.cards }
    let changed = false
    for (const [id, point] of Object.entries(points)) {
      const card = cards[id]
      if (card === undefined) continue
      if (card.x === point.x && card.y === point.y) continue
      cards[id] = { ...card, x: point.x, y: point.y }
      dirtyCards.add(id)
      changed = true
    }
    if (!changed) return
    pushUndo()
    setState({ cards })
    scheduleCardFlush()
  },

  /** Immediate-persist upsert (new cards from double-click / auto-placement). */
  addCards(entries: Record<string, Card>): void {
    pushUndo()
    setState({ cards: { ...state.cards, ...entries } })
    trackCardWrite(talkMapApi.upsertCards(entries).catch((error) => {
      console.error('[dsh-talk-pages] card upsert failed:', error)
    }))
  },

  /** Add edges: local state first, then persisted (no SSE round-trip needed). */
  addEdges(entries: Record<string, MapEdgeData>): void {
    pushUndo()
    setState({ edges: { ...state.edges, ...entries } })
    void talkMapApi.upsertEdges(entries).catch((error) => {
      console.error('[dsh-talk-pages] edge upsert failed:', error)
    })
  },

  removeEdges(ids: readonly string[]): void {
    const present = ids.filter(id => state.edges[id] !== undefined)
    // No-op deletes (already gone via SSE, double Backspace) must not
    // push an identical undo frame — pushUndo clears the redo stack.
    if (present.length === 0) return
    pushUndo()
    const edges = { ...state.edges }
    for (const id of present) delete edges[id]
    setState({ edges })
    void talkMapApi.deleteEdges(present).catch((error) => {
      console.error('[dsh-talk-pages] edge delete failed:', error)
    })
  },

  /** Background re-sync with the server (missed SSE while the map was
   * closed or the server restarted). Skipped while local writes — card
   * positions or a global patch — are still in flight. */
  refresh(): void {
    if (state.phase !== 'ready' || dirtyCards.size > 0 || globalWritesInFlight > 0 || cardWritesInFlight > 0) return
    const seqAtStart = editSeq
    talkMapApi.getState().then((payload) => {
      if (state.phase !== 'ready' || dirtyCards.size > 0 || globalWritesInFlight > 0) return
      // A local edit landed while this fetch was in flight: the answer is stale.
      if (seqAtStart !== editSeq) return
      setState({
        cards: payload.cards,
        edges: payload.edges,
        digests: payload.digests,
        global: payload.global,
      })
    }).catch(() => undefined)
  },

  /** Local mirror of a host-side spawn result (host already persisted it). */
  applySpawn(result: { cardId: string; card: Card; edges: Record<string, MapEdgeData> }): void {
    pushUndo()
    setState({
      cards: { ...state.cards, [result.cardId]: result.card },
      edges: { ...state.edges, ...result.edges },
    })
  },

  removeCard(id: string): void {
    const card = state.cards[id]
    if (card === undefined) return
    pushUndo()
    const cards = { ...state.cards }
    delete cards[id]
    // Remember the placement so a re-import restores the arrangement.
    if (state.global !== null) {
      const layoutMemory = {
        ...state.global.layoutMemory,
        [card.sessionId]: {
          x: card.x,
          y: card.y,
          ...(card.colorTag !== undefined ? { colorTag: card.colorTag } : {}),
        },
      }
      const global: MapGlobal = { ...state.global, layoutMemory }
      setState({ cards, global })
      scheduleGlobalPersist()
    } else {
      setState({ cards })
    }
    trackCardWrite(talkMapApi.deleteCards([id]).catch((error) => {
      console.error('[dsh-talk-pages] card delete failed:', error)
    }))
  },

  /** Adopt a card into a user box (undefined = back to a free card). */
  setCardBox(id: string, boxId: string | undefined): void {
    const card = state.cards[id]
    if (card === undefined) return
    if (card.boxId === boxId) return
    pushUndo()
    const next = { ...card }
    if (boxId === undefined) delete next.boxId
    else next.boxId = boxId
    setState({ cards: { ...state.cards, [id]: next } })
    void talkMapApi.upsertCards({ [id]: next }).catch((error) => {
      console.error('[dsh-talk-pages] card box save failed:', error)
    })
  },

  /** Switch the rendered page (each page keeps its own camera). */
  setActivePage(pageId: string): void {
    if (state.global === null || state.global.activePage === pageId) return
    canvas.patchGlobalNow({ activePage: pageId })
  },

  /** Header 吸附/Snap switch: free cards snap to the grid on drop. */
  setSnap(enabled: boolean): void {
    if (state.global === null || state.global.snap === enabled) return
    canvas.patchGlobalNow({ snap: enabled })
  },

  /**
   * Create a user box on a page and return its id. Geometry starts at `rect`
   * (the canvas passes the viewport centre); the box is empty until cards are
   * dropped into it — creating a box never moves or creates a card.
   */
  createBox(pageId: string, rect: FrameGeometry, title: string): string | undefined {
    if (state.global === null) return undefined
    const boxId = `box-${crypto.randomUUID()}`
    pushUndo()
    const global: MapGlobal = {
      ...state.global,
      boxes: { ...state.global.boxes, [boxId]: { pageId, title } },
      wsFrames: { ...state.global.wsFrames, [boxId]: rect },
    }
    setState({ global })
    void persistGlobal(global, 'box')
    return boxId
  },

  /** Rename a box (the label chip and the tab bar read this title). */
  renameBox(boxId: string, title: string): void {
    if (state.global === null) return
    const box = state.global.boxes?.[boxId]
    if (box === undefined || box.title === title) return
    pushUndo()
    const global: MapGlobal = {
      ...state.global,
      boxes: { ...state.global.boxes, [boxId]: { ...box, title } },
    }
    setState({ global })
    void persistGlobal(global, 'box')
  },

  /**
   * Delete a box and UNGROUP its cards: every member becomes a free card at the
   * position it already had. Sessions, cards and edges are untouched — only the
   * container goes away.
   */
  deleteBox(boxId: string): void {
    if (state.global === null) return
    const box = state.global.boxes?.[boxId]
    if (box === undefined) return
    pushUndo()
    const cards = { ...state.cards }
    const patches: Record<string, Card> = {}
    for (const [cardId, card] of Object.entries(cards)) {
      if (card.boxId !== boxId) continue
      const next = { ...card }
      delete next.boxId
      cards[cardId] = next
      patches[cardId] = next
    }
    const boxes = { ...state.global.boxes }
    delete boxes[boxId]
    const wsFrames = { ...state.global.wsFrames }
    delete wsFrames[boxId]
    // wsColors is deliberately kept: a re-created box may reuse the id.
    const global: MapGlobal = { ...state.global, boxes, wsFrames }
    setState({ cards, global })
    if (Object.keys(patches).length > 0) {
      trackCardWrite(talkMapApi.upsertCards(patches).catch((error) => {
        console.error('[dsh-talk-pages] ungroup save failed:', error)
      }))
    }
    void persistGlobal(global, 'box')
  },

  /**
   * One-time layout migration (LAYOUT_VERSION 5): write the migrated boxes and
   * card memberships in one pass. No undo frame — a migration is not an edit the
   * user made, and Cmd+Z must not be able to resurrect the old layout half-way.
   */
  migrateToBoxes(boxes: Record<string, Box>, cards: Record<string, Card>, layoutVersion: number): void {
    if (state.global === null) return
    const global: MapGlobal = { ...state.global, layoutVersion, boxes }
    setState({ cards: { ...state.cards, ...cards }, global })
    if (Object.keys(cards).length > 0) {
      trackCardWrite(talkMapApi.upsertCards(cards).catch((error) => {
        console.error('[dsh-talk-pages] migration card save failed:', error)
      }))
    }
    void persistGlobal(global, 'migration')
  },

  /** Manual frame geometry (drag/resize); local now, persisted debounced. */
  setWsFrameRect(workspaceId: string, rect: FrameGeometry): void {
    if (state.global === null) return
    pushUndo()
    const global: MapGlobal = {
      ...state.global,
      wsFrames: { ...state.global.wsFrames, [workspaceId]: rect },
    }
    setState({ global })
    if (frameTimer !== undefined) clearTimeout(frameTimer)
    frameTimer = setTimeout(() => {
      frameTimer = undefined
      const current = state.global
      if (current === null) return
      void persistGlobal(current, 'frame')
    }, 600)
  },

  /** Recolor a workspace frame (undefined clears); persists immediately. */
  setWorkspaceColor(workspaceId: string, colorTag: string | undefined): void {
    if (state.global === null) return
    pushUndo()
    const wsColors = { ...state.global.wsColors }
    if (colorTag === undefined) delete wsColors[workspaceId]
    else wsColors[workspaceId] = colorTag
    canvas.patchGlobalNow({ wsColors })
  },

  /** Immediate global patch (layout-version stamp etc.) — no debounce. */
  patchGlobalNow(patch: Partial<MapGlobal>): void {
    if (state.global === null) return
    const global: MapGlobal = { ...state.global, ...patch }
    setState({ global })
    void persistGlobal(global, 'global')
  },

  setCamera(boardId: string, camera: Camera): void {
    if (state.global === null) return
    const global: MapGlobal = {
      ...state.global,
      cameraByBoard: { ...state.global.cameraByBoard, [boardId]: camera },
    }
    setState({ global })
    if (cameraTimer !== undefined) clearTimeout(cameraTimer)
    cameraTimer = setTimeout(() => {
      cameraTimer = undefined
      const current = state.global
      if (current === null) return
      void persistGlobal(current, 'camera')
    }, CAMERA_DELAY_MS)
  },

  /** Cmd/Ctrl+Z — board operations only (conversations are not undoable). */
  undo(): void {
    const snapshot = undoStack.pop()
    if (snapshot === undefined) return
    redoStack.push(takeSnapshot())
    restoreSnapshot(snapshot)
  },

  redo(): void {
    const snapshot = redoStack.pop()
    if (snapshot === undefined) return
    undoStack.push(takeSnapshot())
    restoreSnapshot(snapshot)
  },

  savedCamera(boardId: string): Camera | undefined {
    return state.global?.cameraByBoard[boardId]
  },

  /** First card found for a session (M1: one board, at most one card each). */
  cardIdForSession(sessionId: string): string | undefined {
    for (const [id, card] of Object.entries(state.cards)) {
      if (card.sessionId === sessionId) return id
    }
    return undefined
  },
}

export function newCardId(): string {
  return `card-${crypto.randomUUID()}`
}

export { INBOX_BOARD_ID }
