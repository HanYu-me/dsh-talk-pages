/**
 * The board, one page at a time. A page is a workspace (see pages.ts); the tab
 * bar above the canvas switches pages, and ONLY the active page's cards, boxes
 * and edges are rendered or routed.
 *
 * A card is either FREE — it renders at its stored x/y and nothing ever moves
 * it — or inside a BOX (`Card.boxId`), a user-drawn container that lays its
 * members out on a slot grid (grid-layout.ts) and carries them when moved.
 * Dragging a free card into a box joins it; dragging a member out makes it free
 * again at the drop point. A box never deletes a session: deleting it only
 * ungroups, and its cards stay exactly where they were.
 *
 * Interaction: right/middle-drag pans, plain right-click opens the context
 * menu, left-drag box-selects on the pane and drags nodes.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {
  Background, BackgroundVariant, ConnectionMode, ControlButton, Controls, MarkerType, ReactFlow, ReactFlowProvider,
  SelectionMode, useReactFlow, type Connection, type Edge, type EdgeChange, type FinalConnectionState,
  type NodeChange, type Viewport,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { RootSlotStandardProps, SessionListState, SessionStatusFact, WorkspaceListState } from './dsh.ts'
import type { Box, Card, Digest, FrameGeometry } from '../shared/model.ts'
import { UNSORTED_PAGE_ID } from '../shared/model.ts'
import { canvas, INBOX_BOARD_ID, newCardId, type CanvasState } from './canvas-store.ts'
import { canvasActions } from './canvas-actions.ts'
import { COLOR_TAGS } from './colors.ts'
import { buildPushText, digestIsEmpty } from './digest-text.ts'
import { edgeSyncState, lineageSyncState } from './edge-sync.ts'
import { pickFaces, type Obstacle } from './edge-routing.ts'
import { lastPushFor, stampPush } from './push-log.ts'
import { DigestDialog } from './DigestDialog.tsx'
import { closeMapPanel, currentSessionId, getServices, mapUi, openSessionInUi, uiWorkspaceService } from './map-state.ts'
import { archiveSessions, trashSessions } from './session-actions.ts'
import { allSessionTitles, setCardTable, setTitleResolver, setTitleTable } from './map-state.ts'
import { drawerState } from './drawer-state.ts'
import { callRpc, fetchSearchContext, fetchSessionHits, searchSessions, type ContentHit } from './rpc.ts'
import { sessionAlerts } from './session-alerts.ts'
import { sessionActivity } from './session-activity.ts'
import { draftWatch } from './draft-watch.ts'
import { cleanPreviewText } from './preview-text.ts'
import { loadPreviewCache, putPreview, readPreviewTexts } from './preview-cache.ts'
import { ContextMenu, type MenuItem, type MenuState } from './ContextMenu.tsx'
import { edgeTypes } from './TalkMapEdge.tsx'

/** Registered in dgeTypes: the map's only edge renderer. */
const TALK_MAP_EDGE_TYPE = 'talkMap'
import { RenameDialog, type RenameTarget } from './RenameDialog.tsx'
import { SessionCardNode, type CardGlow, type SessionCardData, type SessionCardNodeType } from './SessionCard.tsx'
import { SpawnPreview, type PendingSpawn } from './SpawnPreview.tsx'
import { WsFrameNode, type ResizeAxis, type WsFrameNodeType } from './WsFrame.tsx'
import { activeLocale, subscribeLocale, t } from './i18n.ts'
import { talkMapApi, type ApiError } from './api.ts'
import {
  CARD_H, CARD_W, FRAME_PAD, GAP_X, GAP_Y, MIN_FRAME_HEIGHT, MIN_FRAME_WIDTH,
  capacityFor, colsForWidth, frameRect, layoutFor, readingOrder, slotIndexAt, slotPoint, visibleCount, type PlacedCard,
} from './grid-layout.ts'
import {
  buildPages, LAYOUT_VERSION, migrateToBoxes, pageCameraKey, pageOfBox, pageOfCard, resolveActivePage,
  sessionPageIndex,
} from './pages.ts'
import { StackDrawer, type StackEntry } from './StackDrawer.tsx'
import { StackNode, type StackNodeType } from './StackNode.tsx'
import { PriorityRail, type PriorityRailEntry } from './PriorityRail.tsx'
import { useDsDarkTheme } from './use-dark.ts'
import styles from './talk-pages.module.css'

const nodeTypes = {
  sessionCard: SessionCardNode,
  wsFrame: WsFrameNode,
  stackCell: StackNode,
}

const GRID = 16
const COLS = 3
/** Auto-sync budget: a page is filled in batches, never in one giant write. */
const AUTO_SYNC_PER_PAGE = 60
const AUTO_SYNC_TOTAL = 200

type TalkMapNode = SessionCardNodeType | WsFrameNodeType | StackNodeType

/** Stable empty projection for a runtime without the ui-session status hook. */
const EMPTY_SESSION_STATUS: ReadonlyMap<string, SessionStatusFact> = new Map()

/**
 * Last activity stamp the board has seen, per session. Module scope on purpose:
 * closing the map unmounts the panel, and "you sent a message while the map was
 * closed" is the case the promotion exists for — a component ref would forget it.
 */

function snap(value: number): number {
  return Math.round(value / GRID) * GRID
}

/** Sessions eligible for a card: top-level, non-empty logs. */
function placeableSessionIds(sessions: SessionListState): string[] {
  return sessions.ids.filter((id) => {
    const summary = sessions.byId[id]
    return summary !== undefined && !summary.blank && summary.origin !== 'subagent'
  })
}

function gridPosition(origin: { x: number; y: number }, index: number): { x: number; y: number } {
  const column = index % COLS
  const row = Math.floor(index / COLS)
  return {
    x: snap(origin.x + column * (CARD_W + GAP_X)),
    y: snap(origin.y + row * (CARD_H + GAP_Y)),
  }
}

/**
 * True when the two rects share actual area. Folders are never allowed to sit
 * on each other, so a drop that overlaps bounces back instead of being stored.
 */
function rectsOverlap(rect: FrameGeometry, other: FrameGeometry): boolean {
  const overlapX = Math.min(rect.x + rect.width, other.x + other.width) - Math.max(rect.x, other.x)
  const overlapY = Math.min(rect.y + rect.height, other.y + other.height) - Math.max(rect.y, other.y)
  return overlapX > 1 && overlapY > 1
}

interface MenuContext {
  left: number
  top: number
  flowX: number
  flowY: number
  kind: 'pane' | 'card' | 'frame' | 'edge'
  targetId?: string
  /** Edge menus: endpoint card ids (set for stored AND lineage edges). */
  edgeFrom?: string
  edgeTo?: string
  view: 'root' | 'import-ws' | 'import-session' | 'new-ws' | 'box-color'
}

function CanvasInner(props: RootSlotStandardProps): React.JSX.Element {
  const dark = useDsDarkTheme()
  const canvasState = useSyncExternalStore(canvas.subscribe, canvas.get)
  const sessions = props.useSessions(state => state)
  const workspaces = props.useWorkspaces(state => state)
  // ui-session's own projection. The session list rows expose no completion
  // flag, so "ran to the end while you were looking elsewhere" lives here.
  const statusById = typeof props.useSessionStatus === 'function'
    ? props.useSessionStatus(status => status)
    : EMPTY_SESSION_STATUS
  const alertById = useSyncExternalStore(sessionAlerts.subscribe, sessionAlerts.getSnapshot)
  // "Ran to completion while the map was up" — the map's own projection, because
  // the shell keeps the session you came from as the main view (see the module).
  const finishedById = useSyncExternalStore(sessionActivity.subscribe, sessionActivity.getSnapshot)
  // Runs cut off by closing the app ("已中断"): persisted, so a restart still
  // tells you which conversations did not finish cleanly.
  const interruptedById = useSyncExternalStore(sessionActivity.subscribe, sessionActivity.getInterrupted)
  useEffect(() => {
    const onUnload = (): void => { sessionActivity.recordShutdown(statusById, sessions.byId) }
    window.addEventListener('beforeunload', onUnload)
    return () => { window.removeEventListener('beforeunload', onUnload) }
  }, [statusById, sessions])
  // The first observation after the panel mounts is a baseline: a run that
  // finished while the map was closed must NOT produce a "待查看" lamp (you were
  // watching that conversation). Declared before the observe effect so it wins.
  useEffect(() => {
    sessionActivity.beginPanelSession()
  }, [])
  // Every status snapshot feeds the projection; a running → idle step seen while
  // the map is up is what it turns into a "done, unread" lamp.
  useEffect(() => {
    sessionActivity.observe(statusById, sessions.byId)
  }, [statusById, sessions])
  // Sessions whose composer holds unsent text — read from the shell's own
  // conversation store in localStorage (there is no service for it).
  const draftSessions = useSyncExternalStore(draftWatch.subscribe, draftWatch.getSnapshot)
  useEffect(() => {
    draftWatch.refresh()
    // Same-document storage writes fire no event, so while the panel is up we
    // just re-read the store; refresh() publishes only on a real change.
    const timer = setInterval(() => { draftWatch.refresh() }, 1500)
    return () => { clearInterval(timer) }
  }, [])

  // Card bodies: the user's last message, fetched from the Host's session
  // surface (the LLM digest is no longer shown). One batched request per change
  // of "which sessions advanced", debounced so a burst of updates costs one.
  // First paint comes from the cache; the network only tops it up.
  const [previews, setPreviews] = useState<Record<string, string>>(readPreviewTexts)
  const previewStamp = useRef<Map<string, number>>(
    // Only entries that still make a usable body count as cached: a rule fix that
    // empties an old entry must trigger a refetch, not leave a blank card.
    new Map(Object.entries(loadPreviewCache())
      .filter(([, entry]) => typeof entry?.text === 'string' && cleanPreviewText(entry.text) !== '')
      .map(([sessionId, entry]) => [sessionId, entry.stamp])),
  )
  const { screenToFlowPosition, zoomTo, setNodes, setCenter, getZoom, setViewport, fitView } = useReactFlow()
  // 2026-10-24 补丁：默认左键拖拽平移，左下角控件面板可切回框选
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set())
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<ReadonlySet<string>>(new Set())
  // Connection drag in flight → every card shows its (otherwise hidden)
  // connection points, so drop targets are visible.
  const [connecting, setConnecting] = useState(false)
  // Esc pressed mid-drag: swallow the following release so the spawn panel
  // does not pop on a gesture the user just cancelled.
  const connectCancelledRef = useRef(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [pendingSpawn, setPendingSpawn] = useState<PendingSpawn | null>(null)
  const [menu, setMenu] = useState<MenuContext | null>(null)
  /** Folder whose stack cell was clicked: the drawer lists all of its cards. */
  // The open drawer survives leaving the map: the folder id lives in
  // localStorage, so reading a conversation and coming back keeps it open.
  const [drawer, setDrawer] = useState<{ groupId: string } | null>(() => {
    const remembered = drawerState.readGroup()
    return remembered === null ? null : { groupId: remembered }
  })
  /** Explicit close: forget the position, the drawer is done. */
  const closeDrawer = (): void => {
    setDrawer(null)
    drawerState.clear()
  }
  /** Card whose digest is being inspected (read-only). */
  const [digestTarget, setDigestTarget] = useState<{ title: string; digest: Digest | undefined } | null>(null)
  /** Bumped after a push: edges recompute their sync state (lineage has no edge row). */
  const [pushEpoch, setPushEpoch] = useState(0)
  /** Lineage lines (fork/subagent provenance) can be switched off entirely. */
  const LINEAGE_KEY = 'dsh.talk-pages.lineage-hidden.v1'
  /** Fork lines the user deleted one by one; keyed `parent->child`. */
  const LINEAGE_CUT_KEY = 'dsh.talk-pages.lineage-cut.v1'
  const [lineageCut, setLineageCut] = useState<readonly string[]>(() => {
    try {
      const raw = window.localStorage.getItem(LINEAGE_CUT_KEY)
      const parsed = raw === null ? [] : JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : []
    } catch {
      return []
    }
  })
  /** Deleting a derived fork line: it is not stored anywhere, so remember the pair. */
  const cutLineage = (from: string, to: string): void => {
    const key = from + '->' + to
    setLineageCut(current => {
      if (current.includes(key)) return current
      const next = [...current, key]
      try { window.localStorage.setItem(LINEAGE_CUT_KEY, JSON.stringify(next)) } catch { /* private mode */ }
      return next
    })
  }

  const [lineageHidden, setLineageHiddenState] = useState(() => {
    try {
      return localStorage.getItem('dsh.talk-pages.lineage-hidden.v1') === '1'
    } catch {
      return false
    }
  })
  const setLineageHidden = (next: boolean): void => {
    setLineageHiddenState(next)
    try {
      localStorage.setItem('dsh.talk-pages.lineage-hidden.v1', next ? '1' : '0')
    } catch { /* private mode: the choice lasts this session */ }
  }
  const [renameTarget, setRenameTarget] = useState<RenameTarget | null>(null)
  /** Last pointer-down on a box label: recognises a double-click on the drag
   * handle, which React Flow otherwise swallows into a frame drag. */
  const lastLabelPress = useRef<{ boxId: string; at: number } | null>(null)
  // Renamed titles we already know: the card updates at once instead of waiting
  // for the session list to round-trip.
  const [renamedTitles, setRenamedTitles] = useState<Record<string, string>>({})
  /** Batch mode: the canvas selection IS the batch; the bar acts on it. */
  const [batchMode, setBatchMode] = useState(false)
  /** The cards picked in batch mode. */
  const [batchPicks, setBatchPicks] = useState<ReadonlySet<string>>(new Set())
  const [batchBusy, setBatchBusy] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  // Slot layout bookkeeping: the card under the pointer renders at its raw
  // drag position (everything else is snapped), and a frame being moved or
  // resized contributes a live rect that the members reflow into before the
  // gesture commits.
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)
  const [liveFrame, setLiveFrame] = useState<{ groupId: string; rect: FrameGeometry } | null>(null)
  // Folder currently overlapping another one while being dragged (drop will bounce).
  const [blockedFrame, setBlockedFrame] = useState<string | null>(null)
  // Centre of the card being dragged, in flow coordinates: the folder uses it to
  // decide which slot the card would be inserted into.
  const [dragCenter, setDragCenter] = useState<{ x: number; y: number } | null>(null)
  // While a rubber-band drag is running, the node/edge arrays are frozen:
  // a mid-drag data refresh (digest SSE, running-state flip) re-renders the
  // flow and corrupts React Flow's in-flight hit testing — the intermittent
  // "one small box selects everything / selects nothing" reports.
  const [isSelecting, setIsSelecting] = useState(false)
  const frozenRef = useRef<{ nodes: TalkMapNode[]; edges: Edge[] } | null>(null)

  // Copy inside React Flow nodes is memoised by the flow itself, so a
  // language switch has to invalidate the memos that build them — hence
  // `locale` in their dependency lists below.
  const locale = useSyncExternalStore(subscribeLocale, activeLocale, activeLocale)

  const sessionWs = useMemo(() => sessionPageIndex(workspaces.items), [workspaces.items])
  const wsTitles = useMemo(
    () => new Map(workspaces.items.map(item => [item.workspaceId, item.title])),
    [workspaces],
  )
  const workspacesReady = workspaces.baselinesReady !== false
  /** The sidebar's own pin set — the map mirrors it, it does not own it. */
  /** Sessions that already own a card (import/auto-sync skip these). */
  const boardSessionIds = useMemo(
    () => new Set(Object.values(canvasState.cards).map(card => card.sessionId)),
    [canvasState.cards],
  )

  const wsFrames = canvasState.global?.wsFrames ?? {}
  const boxes = canvasState.global?.boxes ?? {}
  const layoutVersion = canvasState.global?.layoutVersion ?? 1
  /** 吸附/Snap: a dropped free card lands on the 16px grid (default on). */
  const snapEnabled = canvasState.global?.snap !== false

  /** The tab bar's pages, in sidebar order (same rules as PageTabs). */
  const pages = useMemo(() => buildPages({
    workspaces: workspaces.items,
    cards: canvasState.cards,
    boxes,
    sessionPage: sessionWs,
    isHidden: card => sessions.byId[card.sessionId]?.blank === true,
    unsortedTitle: t('page.unsorted'),
    ...(canvasState.global?.activePage !== undefined ? { activePage: canvasState.global.activePage } : {}),
  }), [workspaces.items, canvasState.cards, boxes, sessionWs, sessions, canvasState.global?.activePage])
  /** The page actually rendered: the stored one while it still exists. */
  const activePage = resolveActivePage(canvasState.global, pages)

  // Each page keeps its own camera (`cameraByBoard["page:<id>"]`). The FIRST
  // render is left to React Flow's own defaultViewport/fitView; every later
  // page switch restores that page's camera, or fits its content when it has
  // never been visited.
  const pageCameraReady = useRef(false)
  useEffect(() => {
    const camera = canvas.savedCamera(pageCameraKey(activePage))
    if (!pageCameraReady.current) {
      pageCameraReady.current = true
      // React Flow's own first fitView runs before the cards are measured, so a
      // page with content far from the box could open on an empty corner. Fit
      // once more after the first paint — unless the user has a saved camera.
      if (camera !== undefined || Object.keys(canvasState.cards).length === 0) return
      const timer = window.setTimeout(() => { void fitView({ duration: 0, padding: 0.2 }) }, 80)
      return () => window.clearTimeout(timer)
    }
    if (camera !== undefined) void setViewport(camera, { duration: 0 })
    else void fitView({ duration: 0, padding: 0.2 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage])

  // Migration to the page/box world (v5): every old folder becomes a box with
  // the SAME id (so geometry and colour carry over) and every grouped card gets
  // `boxId`. Cards that were never in a folder stay free where they are — a
  // migration must not move anything the user placed.
  useEffect(() => {
    if (canvasState.phase !== 'ready' || layoutVersion >= LAYOUT_VERSION || !workspacesReady) return
    const migrated = migrateToBoxes({
      cards: canvasState.cards,
      wsFrames,
      boxes: canvasState.global?.boxes,
      sessionPage: sessionWs,
      titles: wsTitles,
    })
    if (!migrated.changed) {
      // Nothing to move, but the version still has to be stamped or this effect
      // would run again on every render.
      canvas.patchGlobalNow({ layoutVersion: LAYOUT_VERSION })
      return
    }
    canvas.migrateToBoxes(migrated.boxes, migrated.cards, LAYOUT_VERSION)
  }, [canvasState.phase, layoutVersion, workspacesReady, canvasState.cards, canvasState.global, wsFrames, boxes, sessionWs, wsTitles])

  // What the canvas paints: the active page's cards, minus cards whose session
  // has no usable log. Everything rendered — nodes, edges, routing obstacles,
  // the status rail, the drawer — reads THIS, so a page can never leak onto
  // another one.
  const visibleCards = useMemo(() => {
    const out: Record<string, Card> = {}
    for (const [cardId, card] of Object.entries(canvasState.cards)) {
      if (sessions.byId[card.sessionId]?.blank === true) continue
      if (pageOfCard(card, boxes, sessionWs) !== activePage) continue
      out[cardId] = card
    }
    return out
  }, [canvasState.cards, sessions, boxes, sessionWs, activePage])

  // Card bodies: the user's last message, read off the Host's session surface
  // (the LLM digest is no longer displayed).
  //
  // Deliberately a POLL, not a debounced reaction to `sessions`: in the real app
  // the session list repaints constantly (a running turn ticks every second), and
  // a timer restarted by every change never fires — the preview simply never
  // arrived. The poll owns its own clock, so churn cannot starve it.
  const previewInputs = useRef({ cards: visibleCards, sessions })
  previewInputs.current = { cards: visibleCards, sessions }
  const previewTick = useRef<() => void>(() => {})
  useEffect(() => {
    const tick = (): void => {
      const { cards, sessions: latest } = previewInputs.current
      const pending: string[] = []
      const stamps: [string, number][] = []
      for (const card of Object.values(cards)) {
        const stamp = latest.byId[card.sessionId]?.updatedAt ?? 0
        if (previewStamp.current.get(card.sessionId) === stamp) continue
        pending.push(card.sessionId)
        stamps.push([card.sessionId, stamp])
      }
      if (pending.length === 0) return
      for (const [sessionId, stamp] of stamps) previewStamp.current.set(sessionId, stamp)
      void talkMapApi.lastUserMessages(pending)
        .then(({ texts }) => {
          const cleaned: Record<string, string> = {}
          for (const [sessionId, text] of Object.entries(texts)) {
            const value = cleanPreviewText(text).slice(0, 240)
            const stamp = stamps.find(([id]) => id === sessionId)?.[1] ?? 0
            // The cache keeps the RAW text so a rule fix also cleans old entries.
            putPreview(sessionId, text, stamp)
            if (value === '') continue
            cleaned[sessionId] = value
          }
          setPreviews(previous => ({ ...previous, ...cleaned }))
        })
        .catch(() => undefined)
    }
    previewTick.current = tick
    tick()
    const timer = setInterval(tick, 1500)
    return () => { clearInterval(timer) }
  }, [])

  // Cards only exist after the canvas finishes loading: kick the request the
  // moment the set changes instead of waiting for the next poll tick.
  useEffect(() => { previewTick.current() }, [visibleCards])

  // Membership is stored ON the card (`boxId`), not derived from the workspace
  // any more: a box is the user's own container and may hold sessions from any
  // workspace. A free card is in no map at all and keeps its own position.
  const membersByGroup = useMemo(() => {
    const index = new Map<string, string[]>()
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (card.boxId === undefined) continue
      if (boxes[card.boxId] === undefined) continue
      index.set(card.boxId, [...index.get(card.boxId) ?? [], cardId])
    }
    return index
  }, [visibleCards, boxes])

  // Folder geometry as rendered: the stored rect (the user's wish, clamped to
  // one column / one row) with a live gesture rect on top while a frame is
  // being moved or resized. The folder does NOT grow to fit its cards any more:
  // what does not fit collapses into the stack cell at the end of the grid.
  const frameRects = useMemo(() => {
    const out: Record<string, FrameGeometry> = {}
    for (const [boxId, stored] of Object.entries(wsFrames)) {
      // Only the active page's boxes render (and only they are routing
      // targets). A frame whose box row is still missing stands in for itself:
      // that is the state between the first paint and the v5 migration.
      if (pageOfBox(boxId, boxes) !== activePage) continue
      const base = liveFrame !== null && liveFrame.groupId === boxId ? liveFrame.rect : stored
      out[boxId] = frameRect(base)
    }
    return out
  }, [wsFrames, boxes, activePage, liveFrame])

  /** Per folder: the slot order, how many slots it can show, and the split. */
  const folderLayouts = useMemo(() => {
    const out: Record<string, {
      rect: FrameGeometry
      /** Member ids in reading order (drag = reorder, activity = promote). */
      ordered: string[]
      /** Cards rendered on the grid. */
      shown: string[]
      /** Cards folded into the stack cell (empty = no stack). */
      folded: string[]
      /** Free box: members keep their own positions. */
      free: boolean
    }> = {}
    for (const [groupId, rect] of Object.entries(frameRects)) {
      const members = (membersByGroup.get(groupId) ?? [])
        .map((cardId): PlacedCard | undefined => {
          const card = visibleCards[cardId]
          return card === undefined ? undefined : { cardId, x: card.x, y: card.y }
        })
        .filter((entry): entry is PlacedCard => entry !== undefined)
      const reading = readingOrder(members)
      // The sidebar's pins do NOT order the map: a conversation pinned there is
      // not pinned here. The reading order is the user's own arrangement.
      const ordered = reading
      if (boxes[groupId]?.free === true) {
        out[groupId] = { rect, ordered, shown: ordered, folded: [], free: true }
        continue
      }
      const capacity = capacityFor(rect)
      let preview = ordered
      if (draggingCardId !== null && ordered.includes(draggingCardId)) {
        // While a card is in the air the folder previews the INSERTION: the card
        // leaves the order and goes back in at the slot under its centre, so the
        // neighbour it reaches yields immediately instead of at drop time. It
        // also keeps the dragged card out of the overflow cell — otherwise it
        // could sort itself into the stack and vanish mid-drag.
        const others = ordered.filter(cardId => cardId !== draggingCardId)
        const slots = Math.max(1, visibleCount(capacity, others.length + 1))
        const wanted = dragCenter === null ? others.length : slotIndexAt(rect, dragCenter)
        const insertAt = Math.min(Math.max(0, wanted), Math.max(0, Math.min(slots, others.length) - 1))
        preview = [...others.slice(0, insertAt), draggingCardId, ...others.slice(insertAt)]
      }
      const visibleSlots = visibleCount(capacity, preview.length)
      out[groupId] = {
        rect,
        ordered: preview,
        shown: preview.slice(0, visibleSlots),
        folded: preview.length > capacity ? preview.slice(visibleSlots) : [],
        free: false,
      }
    }
    return out
  }, [frameRects, membersByGroup, visibleCards, draggingCardId, dragCenter, boxes])

  // Slot positions for every card that lives in a folder. Positions are derived
  // from the order, never stored-and-trusted: that is what makes a resize
  // reflow, a promotion rewrite the arrangement and a removal close the gap.
  const cardLayout = useMemo(() => {
    const out: Record<string, { x: number; y: number }> = {}
    for (const layout of Object.values(folderLayouts)) {
      if (layout.free) continue
      Object.assign(out, layoutFor(layout.rect, layout.ordered))
    }
    return out
  }, [folderLayouts])

  /**
   * While a FREE box is being moved its members travel with it: the live rect
   * differs from the stored one by a pure translation (same size), and every
   * member is drawn shifted by that delta. Resizing (the size changes) never
   * shifts members.
   */
  const memberShift = useMemo(() => {
    const out: Record<string, { dx: number; dy: number }> = {}
    if (liveFrame === null) return out
    const stored = wsFrames[liveFrame.groupId]
    if (stored === undefined || boxes[liveFrame.groupId]?.free !== true) return out
    if (liveFrame.rect.width !== stored.width || liveFrame.rect.height !== stored.height) return out
    const dx = liveFrame.rect.x - stored.x
    const dy = liveFrame.rect.y - stored.y
    if (dx === 0 && dy === 0) return out
    for (const cardId of membersByGroup.get(liveFrame.groupId) ?? []) out[cardId] = { dx, dy }
    return out
  }, [liveFrame, wsFrames, boxes, membersByGroup])

  /** card ids folded into a stack cell, and which folder each cell belongs to. */
  const foldedCards = useMemo(() => {
    const out: Record<string, string[]> = {}
    for (const [groupId, layout] of Object.entries(folderLayouts)) {
      if (layout.folded.length > 0) out[groupId] = layout.folded
    }
    return out
  }, [folderLayouts])

  // Persist the derived arrangement whenever it drifts from the store: a card
  // was added, removed, dropped somewhere else, or a folder changed shape. The
  // write is skipped mid-gesture (the dragged card's position IS the gesture)
  // and is a no-op once everything matches, so it cannot loop.
  useEffect(() => {
    if (canvasState.phase !== 'ready') return
    if (draggingCardId !== null || liveFrame !== null) return
    // Debounced, with a tolerance: resizing a frame re-slots many cards at once, and one
    // write per layout pass piled up on the host and stalled the board mid-drag.
    const timer = window.setTimeout(() => {
      const stale: Record<string, { x: number; y: number }> = {}
      for (const [cardId, point] of Object.entries(cardLayout)) {
        const card = canvasState.cards[cardId]
        if (card === undefined) continue
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue
        if (Math.abs(card.x - point.x) > 0.5 || Math.abs(card.y - point.y) > 0.5) stale[cardId] = point
      }
      if (Object.keys(stale).length > 0) canvas.moveCards(stale)
    }, 140)
    return () => window.clearTimeout(timer)
  }, [cardLayout, canvasState.cards, canvasState.phase, draggingCardId, liveFrame])

  /** Cards folded into a stack cell — kept in the model, hidden from the grid. */
  const foldedSet = useMemo(() => new Set(Object.values(foldedCards).flat()), [foldedCards])

  // (The old "active conversation jumps to the first slot" reordering is gone: the
  // map never rearranges what the user arranged.)

  // Auto-sync: every page pulls in the sessions of its workspace that have no
  // card yet, once per open. The map stopped asking the user to press "同步" —
  // a workspace you can see a tab for should just stay complete.
  //
  // Newcomers are FREE cards (a box is the user's own container; auto-sync never
  // invents one), laid out in a tidy row below whatever the page already holds.
  // A session the user placed before comes back to its remembered spot.
  const autoSyncedRef = useRef(false)
  useEffect(() => {
    if (canvasState.phase !== 'ready' || !workspacesReady || autoSyncedRef.current) return
    // What stays on the map is the user's choice (the 选择对话 picker); automatic
    // import is opt-in.
    if (canvasState.global?.autoAdd !== true) return
    // Wait for the v5 migration: before it, grouped cards still look free.
    if (layoutVersion < LAYOUT_VERSION) return
    autoSyncedRef.current = true
    const remembered = canvasState.global?.layoutMemory ?? {}
    const placeable = placeableSessionIds(sessions)
    const byPage = new Map<string, Card[]>()
    for (const card of Object.values(canvasState.cards)) {
      const pageId = pageOfCard(card, boxes, sessionWs)
      byPage.set(pageId, [...(byPage.get(pageId) ?? []), card])
    }
    const added: Record<string, Card> = {}
    let budget = AUTO_SYNC_TOTAL
    for (const page of pages) {
      if (budget <= 0) break
      const existing = byPage.get(page.id) ?? []
      const missing = placeable
        .filter(sessionId => (sessionWs.get(sessionId) ?? UNSORTED_PAGE_ID) === page.id)
        .filter(sessionId => !boardSessionIds.has(sessionId))
        .sort((a, b) => (sessions.byId[b]?.updatedAt ?? 0) - (sessions.byId[a]?.updatedAt ?? 0))
        .slice(0, Math.min(AUTO_SYNC_PER_PAGE, budget))
      if (missing.length === 0) continue
      // One tidy row under the page's existing content (newest first, left to
      // right); an empty page starts at the origin.
      const origin = existing.length === 0
        ? { x: 0, y: 0 }
        : {
            x: snap(Math.min(...existing.map(card => card.x))),
            y: snap(Math.max(...existing.map(card => card.y + CARD_H)) + GAP_Y),
          }
      missing.forEach((sessionId, index) => {
        const entry = remembered[sessionId]
        const position = entry !== undefined ? { x: entry.x, y: entry.y } : gridPosition(origin, index)
        added[newCardId()] = {
          boardId: INBOX_BOARD_ID,
          sessionId,
          x: position.x,
          y: position.y,
          createdAt: Date.now(),
        }
      })
      budget -= missing.length
    }
    if (Object.keys(added).length > 0) canvas.addCards(added)
  }, [canvasState.phase, canvasState.cards, canvasState.global, workspacesReady, layoutVersion, pages, boxes, sessions, sessionWs, boardSessionIds])

  // While a connection drag is live, Esc belongs to it. React Flow (this
  // @xyflow version) has NO Escape handling of its own and exposes no
  // cancelConnection API — the ghost line follows the pointer until
  // release regardless. So Esc only arms the cancel flag; the drag state
  // (handles revealed, Esc claimed) deliberately survives until pointerup,
  // matching the still-visible ghost line and keeping a second Esc from
  // falling through to the overlay and closing the map. onConnect and
  // onConnectEnd both honor the flag, so a cancelled gesture creates
  // nothing no matter where it is released.
  useEffect(() => {
    if (!connecting) return
    const release = mapUi.claimEscape('connecting')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') connectCancelledRef.current = true
    }
    // pointercancel/blur too: a gesture the browser aborts (system touch
    // gesture, tab switch) never produces a pointerup, and a connecting
    // state that cannot exit would hold the Esc claim forever.
    const onGestureEnd = (): void => { setConnecting(false) }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    window.addEventListener('pointerup', onGestureEnd, { capture: true })
    window.addEventListener('pointercancel', onGestureEnd, { capture: true })
    window.addEventListener('blur', onGestureEnd)
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      window.removeEventListener('pointerup', onGestureEnd, { capture: true })
      window.removeEventListener('pointercancel', onGestureEnd, { capture: true })
      window.removeEventListener('blur', onGestureEnd)
      release()
    }
  }, [connecting])

  // Cmd/Ctrl+Z undoes board operations (Shift redoes); text fields keep
  // their native undo.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.code !== 'KeyZ') return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, [contenteditable="true"]') !== null && target !== null) return
      event.preventDefault()
      event.stopPropagation()
      if (event.shiftKey) canvas.redo()
      else canvas.undo()
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => { window.removeEventListener('keydown', onKeyDown, { capture: true }) }
  }, [])

  // With a selection active, Esc clears it instead of closing the map, and
  // Backspace/Delete removes selected FRAMES (React Flow no longer owns
  // frame selection, so its deleteKeyCode cannot reach them; cards stay on
  // the React Flow path).
  // Selection ids can go stale without a select:false ever firing — the
  // context menu and SSE delete straight from the store, and React Flow
  // emits no change for an element that simply vanished from a controlled
  // array. These existence-filtered sets are the ONLY selection surface
  // consumers may read (Backspace, the color toolbar, node/edge selected
  // flags): a dead id must neither pin hasSelection (swallowing Escape)
  // nor let an action fire against a deleted frame or card. Cards are
  // judged against visibleCards — a session turning blank drops its card
  // from the canvas while it lingers in the store.
  const liveSelectedIds = useMemo(() => {
    const next = new Set<string>()
    for (const id of selectedIds) {
      if (id.startsWith('frame-')) {
        // Only boxes on the ACTIVE page render; a selection left on another
        // page must not keep Escape/Backspace hostage.
        if (frameRects[id.slice('frame-'.length)] !== undefined) next.add(id)
      } else if (visibleCards[id] !== undefined) {
        next.add(id)
      }
    }
    return next
  }, [selectedIds, visibleCards, frameRects])
  const liveSelectedEdgeIds = useMemo(() => {
    const next = new Set<string>()
    for (const id of selectedEdgeIds) {
      if (canvasState.edges[id] !== undefined) next.add(id)
    }
    return next
  }, [selectedEdgeIds, canvasState.edges])
  const hasSelection = liveSelectedIds.size > 0 || liveSelectedEdgeIds.size > 0
  useEffect(() => {
    if (!hasSelection) return
    const release = mapUi.claimEscape('selection')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setSelectedIds(new Set())
        setSelectedEdgeIds(new Set())
        return
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const target = event.target as HTMLElement | null
        if (target !== null && target.closest('input, textarea, [contenteditable="true"]') !== null) return
        const frameIds = [...liveSelectedIds].filter(id => id.startsWith('frame-'))
        if (frameIds.length === 0) return
        // Deleting a box UNGROUPS: the cards stay, the container goes away.
        for (const frameId of frameIds) deleteBox(frameId.slice('frame-'.length))
        setSelectedIds((previous) => {
          const next = new Set(previous)
          for (const frameId of frameIds) next.delete(frameId)
          return next
        })
      }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      release()
    }
  })

  /** Batch mode is its own layer: Esc leaves it before it can close the map. */
  useEffect(() => {
    if (!batchMode) return
    const release = mapUi.claimEscape('batch-mode')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setBatchMode(false)
      setBatchPicks(new Set())
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      release()
    }
  }, [batchMode])

  /**
   * Resize a folder. Screen-space pointer deltas become flow-space growth, the
   * members reflow live into the new width (that is the whole point of a
   * container), and only the release persists the rect.
   */
  const beginResize = (groupId: string, axis: ResizeAxis, event: React.PointerEvent<HTMLDivElement>): void => {
    const start = frameRects[groupId] ?? wsFrames[groupId]
    if (start === undefined) return
    const origin = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    const count = (membersByGroup.get(groupId) ?? []).length
    // Which sides this handle moves. West/north grow leftward/upward, so the
    // origin moves with the size and the opposite edge stays put.
    const movesWest = axis === 'w' || axis === 'nw' || axis === 'sw'
    const movesNorth = axis === 'n' || axis === 'ne' || axis === 'nw'
    const movesEast = axis === 'e' || axis === 'ne' || axis === 'se'
    const movesSouth = axis === 's' || axis === 'se' || axis === 'sw'
    // How far each moving side may travel before it touches another folder.
    let maxRight = Number.POSITIVE_INFINITY
    let minLeft = Number.NEGATIVE_INFINITY
    let maxBottom = Number.POSITIVE_INFINITY
    let minTop = Number.NEGATIVE_INFINITY
    for (const [otherId, other] of Object.entries(frameRects)) {
      if (otherId === groupId) continue
      const spansRows = other.y < start.y + start.height && other.y + other.height > start.y
      const spansCols = other.x < start.x + start.width && other.x + other.width > start.x
      if (spansRows) {
        if (other.x >= start.x + start.width) maxRight = Math.min(maxRight, other.x)
        if (other.x + other.width <= start.x) minLeft = Math.max(minLeft, other.x + other.width)
      }
      if (spansCols) {
        if (other.y >= start.y + start.height) maxBottom = Math.min(maxBottom, other.y)
        if (other.y + other.height <= start.y) minTop = Math.max(minTop, other.y + other.height)
      }
    }
    let next: FrameGeometry = { ...start }
    const onMove = (moveEvent: PointerEvent): void => {
      const now = screenToFlowPosition({ x: moveEvent.clientX, y: moveEvent.clientY })
      const dx = now.x - origin.x
      const dy = now.y - origin.y
      next = {
        x: movesWest ? start.x + dx : start.x,
        y: movesNorth ? start.y + dy : start.y,
        width: movesWest ? start.width - dx : movesEast ? start.width + dx : start.width,
        height: movesNorth ? start.height - dy : movesSouth ? start.height + dy : start.height,
      }
      // Stop the moving side(s) at the nearest neighbouring folder: a folder
      // cannot be grown into another one.
      if (movesEast && next.x + next.width > maxRight) next.width = maxRight - next.x
      if (movesWest && next.x < minLeft) {
        next.width = start.x + start.width - minLeft
        next.x = minLeft
      }
      if (movesSouth && next.y + next.height > maxBottom) next.height = maxBottom - next.y
      if (movesNorth && next.y < minTop) {
        next.height = start.y + start.height - minTop
        next.y = minTop
      }
      setLiveFrame({ groupId, rect: next })
    }
    const onUp = (): void => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      setLiveFrame(null)
      // Clamp to the one-column / one-row floor without teleporting the frame:
      // anchored on the edge the user is NOT dragging.
      const clamped: FrameGeometry = { ...next }
      if (clamped.width < MIN_FRAME_WIDTH) {
        if (movesWest) clamped.x = start.x + start.width - MIN_FRAME_WIDTH
        clamped.width = MIN_FRAME_WIDTH
      }
      if (clamped.height < MIN_FRAME_HEIGHT) {
        if (movesNorth) clamped.y = start.y + start.height - MIN_FRAME_HEIGHT
        clamped.height = MIN_FRAME_HEIGHT
      }
      canvas.setWsFrameRect(groupId, frameRect(clamped))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  /**
   * One lamp per card, most urgent first: a failure must not be hidden behind a
   * "finished" glow, and being blocked on the user outranks merely still
   * running. Shared by the grid cards and the folder drawer.
   */
  const glowOf = (sessionId: string): CardGlow | undefined => {
    const status = statusById.get(sessionId)
    const summary = sessions.byId[sessionId]
    if (alertById.has(sessionId)) return 'error'
    if (status !== undefined && status.pendingInteraction !== undefined) return 'waiting'
    if (status?.running === true || summary?.running === true) return 'running'
    // Either the shell noticed it (the session was not on screen) or the map did
    // (the session you came from stays "main view", so the shell stays quiet).
    if (status?.completionUnread === true || finishedById.has(sessionId)) return 'done'
    return undefined
  }

  /** The priority rail lists the cards the user marked, highest priority first. */
  const priorityEntries = useMemo<PriorityRailEntry[]>(() => {
    const rows: PriorityRailEntry[] = []
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (card.boardId !== INBOX_BOARD_ID || card.priority === undefined) continue
      if (pageOfCard(card, boxes, sessionWs) !== activePage) continue
      const summary = sessions.byId[card.sessionId]
      rows.push({
        cardId,
        sessionId: card.sessionId,
        title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
        priority: card.priority,
        ...(summary?.updatedAt !== undefined ? { updatedAt: summary.updatedAt } : {}),
        ...(previews[card.sessionId] !== undefined ? { preview: previews[card.sessionId] } : {}),
      })
    }
    return rows
  }, [visibleCards, boxes, sessionWs, activePage, sessions, renamedTitles, previews])

  /** Bring one card into view and select it (a click on a rail row). */
  const focusCard = useCallback((cardId: string) => {
    const slot = cardLayout[cardId]
    const card = visibleCards[cardId]
    const point = slot ?? (card === undefined ? undefined : { x: card.x, y: card.y })
    setSelectedIds([cardId])
    if (point === undefined) return
    setCenter(point.x + CARD_W / 2, point.y + CARD_H / 2, { zoom: getZoom(), duration: 320 })
  }, [cardLayout, visibleCards, setCenter, getZoom, setSelectedIds])

  const liveNodes = useMemo<TalkMapNode[]>(() => {
    const wsColors = canvasState.global?.wsColors ?? {}
    const frameNodes: TalkMapNode[] = Object.entries(frameRects).map(([groupId, rect]) => {
      const members = membersByGroup.get(groupId) ?? []
      const boxTitle = boxes[groupId]?.title ?? wsTitles.get(groupId) ?? t('frame.unknown')
      return {
        id: `frame-${groupId}`,
        type: 'wsFrame' as const,
        position: { x: rect.x, y: rect.y },
        data: {
          workspaceId: groupId,
          title: boxTitle,
          count: members.length,
          width: rect.width,
          height: rect.height,
          // Box colour (global.wsColors[boxId]) drives the border and the chip.
          ...(wsColors[groupId] !== undefined ? { colorTag: wsColors[groupId] } : {}),
          // Red outline while this box overlaps another one mid-drag.
          blocked: blockedFrame === groupId,
          onResizeStart: (axis: ResizeAxis, event: React.PointerEvent<HTMLDivElement>) => {
            beginResize(groupId, axis, event)
          },
          // Double-click on the label renames the box (the body keeps "new chat").
          onRename: () => {
            setRenameTarget({ kind: 'box', id: groupId, title: boxTitle })
          },
          onLabelPointerDown: () => {
            lastLabelPress.current = { boxId: groupId, at: Date.now() }
          },
        },
        draggable: true,
        // NOT selectable by React Flow: rubber-band selection grows in
        // batches and would sweep the huge frames in. Frame selection is
        // click-only, managed by this component (onNodeClick).
        selectable: false,
        focusable: false,
        selected: liveSelectedIds.has(`frame-${groupId}`),
        zIndex: -1,
        // Folders no longer eat pointer events: the body has to stay
        // transparent so a double-click inside it reaches the pane (that is
        // "new chat in this workspace"). The label and border strips are the
        // frame's own physical surfaces and keep their own pointer events.
        style: { pointerEvents: 'none' as const },
      }
    })
    const cardNodes: TalkMapNode[] = Object.entries(visibleCards)
      .filter(([, card]) => card.boardId === INBOX_BOARD_ID)
      .map(([cardId, card]) => {
        const summary = sessions.byId[card.sessionId]
        const digest = canvasState.digests[card.sessionId]
        const status = statusById.get(card.sessionId)
        const slot = cardLayout[cardId]
        const dragging = draggingCardId === cardId
        const data: SessionCardData = {
          cardId,
          sessionId: card.sessionId,
          title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
          running: status?.running ?? summary?.running ?? false,
          ghost: summary === undefined,
          updatedAt: summary?.updatedAt,
          ...(previews[card.sessionId] !== undefined ? { preview: previews[card.sessionId] } : {}),
          waiting: status !== undefined ? status.pendingInteraction !== undefined : summary?.pendingInteraction !== undefined,
          done: status?.completionUnread === true,
          glow: glowOf(card.sessionId),
          ...(draftSessions.has(card.sessionId) ? { pendingDraft: true } : {}),
          ...(interruptedById.has(card.sessionId) ? { interrupted: true } : {}),
          ...(currentSessionId() === card.sessionId ? { current: true } : {}),
          ...(card.priority !== undefined ? { priority: card.priority } : {}),
          }
        return {
          id: cardId,
          type: 'sessionCard' as const,
          // The dragged card follows the pointer; every other card sits on its
          // slot (and glides there — the CSS transition owns the animation).
          position: dragging || slot === undefined
            ? { x: card.x + (memberShift[cardId]?.dx ?? 0), y: card.y + (memberShift[cardId]?.dy ?? 0) }
            : { x: slot.x, y: slot.y },
          // Batch mode shows the pick as the card's ring; otherwise it is the
          // canvas selection.
          selected: batchMode ? batchPicks.has(cardId) : liveSelectedIds.has(cardId),
          ...(batchMode ? { data: { ...data, onPick: () => { toggleBatchPick(cardId) } } } : { data }),
          // Cards folded into the stack cell stay in the model (their edges and
          // selection survive) but must not paint over the grid.
          hidden: foldedSet.has(cardId),
          className: dragging ? 'tmDragging' : '',
        }
      })
    // Overflow cells: one per folder that cannot show all of its cards, sitting
    // in the last visible slot with a count of what it swallowed.
    const stackNodes: TalkMapNode[] = Object.entries(foldedCards).map(([groupId, folded]) => {
      const layout = folderLayouts[groupId]
      const rect = layout?.rect ?? frameRects[groupId]
      const index = layout?.shown.length ?? 0
      const point = rect === undefined ? { x: 0, y: 0 } : slotPoint(rect, index)
      const newest = [...folded]
        .map(cardId => sessions.byId[visibleCards[cardId]?.sessionId ?? '']?.updatedAt ?? 0)
        .reduce((best, stamp, position) => (stamp > best.stamp ? { stamp, position } : best), { stamp: -1, position: 0 })
      const topCardId = folded[newest.position]
      const topSessionId = topCardId === undefined ? undefined : visibleCards[topCardId]?.sessionId
      // The cell is a card too: it dims like one unless something inside it is
      // actually reporting (running / waiting / unread / unsent / interrupted).
      const busy = folded.some((cardId) => {
        const sessionId = visibleCards[cardId]?.sessionId
        if (sessionId === undefined) return false
        return glowOf(sessionId) !== undefined
          || draftSessions.has(sessionId)
          || interruptedById.has(sessionId)
      })
      return {
        id: `stack-${groupId}`,
        type: 'stackCell' as const,
        position: point,
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: 5,
        data: {
          workspaceId: groupId,
          count: folded.length,
          ...(busy ? { busy: true } : {}),
          ...(topSessionId !== undefined && sessions.byId[topSessionId] !== undefined
            ? { topTitle: sessions.byId[topSessionId].displayTitle }
            : {}),
          onOpen: () => {
            setDrawer({ groupId })
            drawerState.writeGroup(groupId)
          },
        },
      }
    })
    return [...frameNodes, ...cardNodes, ...stackNodes]
  }, [frameRects, folderLayouts, foldedCards, foldedSet, cardLayout, draggingCardId, memberShift, membersByGroup, wsTitles, boxes, visibleCards, canvasState.digests, canvasState.global, sessions, statusById, alertById, finishedById, interruptedById, draftSessions, previews, renamedTitles, liveSelectedIds, batchMode, batchPicks, locale])

  const sessionIdToCardId = useMemo(() => {
    const index = new Map<string, string>()
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (!index.has(card.sessionId)) index.set(card.sessionId, cardId)
    }
    return index
  }, [visibleCards])

  /** Last delivery for a card pair: the edge's own stamp, else the push log. */
  const lastPushOf = (fromCardId: string, toCardId: string): number | undefined => {
    for (const edge of Object.values(canvasState.edges)) {
      const same = (edge.fromCardId === fromCardId && edge.toCardId === toCardId)
        || (edge.fromCardId === toCardId && edge.toCardId === fromCardId)
      if (same && typeof edge.lastPushAt === 'number') return edge.lastPushAt
    }
    return lastPushFor(fromCardId, toCardId)
  }

  /** `updatedAt` of the session behind a card (undefined when it is gone). */
  const sourceCardUpdatedAt = (cardId: string): number | undefined => {
    const card = canvasState.cards[cardId]
    if (card === undefined) return undefined
    return sessions.byId[card.sessionId]?.updatedAt
  }



  /**
   * Cards the line must not cross, in flow coordinates.
   *
   * A card grows with its content (the stylesheet only sets a min-height), so the
   * box reserves a little extra height — otherwise a line shaves the bottom of a
   * taller neighbour. The renderer anchors the line on the real handles and does
   * the routing itself.
   */
  /**
   * Canvas boxes exactly as the nodes are rendered.
   *
   * `liveNodes` is the single source of truth for node positions (it is what React
   * Flow draws and what the edge anchors are computed from). Routing against any
   * other coordinate — the stored x/y, or a layout slot that may not exist for this
   * folder — puts the obstacles in a different space than the anchors, and the line
   * then dodges empty space while cutting through the card that is really there.
   */
  const renderedBoxes = (): Record<string, { x: number; y: number; w: number; h: number }> => {
    const out: Record<string, { x: number; y: number; w: number; h: number }> = {}
    for (const node of liveNodes) {
      if (node.type !== 'sessionCard' || node.hidden === true) continue
      // No DOM lookups here: this runs for every card, for every edge, on every render —
      // during a frame resize that is thousands of querySelector calls per frame, which
      // stalls the board (and a stalled drag is how the map ended up blanking).
      // The painted card is 224×120 plus padding and border, so those constants are used.
      out[node.id] = {
        x: node.position.x,
        y: node.position.y,
        w: CARD_PAINTED_W,
        h: CARD_PAINTED_H,
      }
    }
    return out
  }

  // One extra pass after the first paint: edges render before the cards are
  // measured, and a route built before that has no obstacle to avoid.
  /** The painted size of a card: 224×120 plus padding and border. */
  const CARD_PAINTED_W = 250
  const CARD_PAINTED_H = 129

  const [boardTick, setBoardTick] = useState(0)
  useEffect(() => {
    const timer = window.setTimeout(() => setBoardTick(value => value + 1), 150)
    return () => window.clearTimeout(timer)
  }, [])

  const obstaclesFor = (fromCardId: string, toCardId: string): { x: number; y: number; w: number; h: number }[] => {
    // Union of "what the canvas paints" and "what the store says exists": either
    // source alone can miss a card, and one missing box is exactly what lets a line
    // run through that card (reproduced in scripts/_draw-connect.mjs).
    const rendered = renderedBoxes()
    const painted: Record<string, { x: number; y: number; w: number; h: number }> = { ...rendered }
    // Active page only: a line must not dodge a card that is not on this page.
    for (const [id, card] of Object.entries(visibleCards)) {
      if (painted[id] !== undefined) continue
      painted[id] = { x: card.x, y: card.y, w: CARD_W, h: CARD_H }
    }
    return Object.entries(painted)
      .map(([, box]) => box)
  }
  /** One card's box, exactly as rendered. */
  const boxOf = (cardId: string): { x: number; y: number; w: number; h: number } | undefined =>
    renderedBoxes()[cardId]

  /** Faces for a stored edge, from where its two cards are right now. */
  const routingObstacles = (): Obstacle[] => Object.entries(visibleCards).map(([id, card]) => ({
    id,
    x: card.x,
    y: card.y,
  }))

  /** Faces for a pair — see edge-routing.ts for the rules. */
  const sideHandles = (fromCardId: string, toCardId: string): { fromHandle: string; toHandle: string } => {
    const from = canvasState.cards[fromCardId]
    const to = canvasState.cards[toCardId]
    if (from === undefined || to === undefined) return { fromHandle: 'r', toHandle: 'l' }
    const picked = pickFaces(
      { id: fromCardId, x: from.x, y: from.y },
      { id: toCardId, x: to.x, y: to.y },
      routingObstacles(),
      { cardWidth: CARD_W, cardHeight: CARD_H },
    )
    return { fromHandle: picked.fromHandle, toHandle: picked.toHandle }
  }

  const computedHandles = (fromCardId: string, toCardId: string): {
    sourceHandle: string
    targetHandle: string
  } => {
    const from = canvasState.cards[fromCardId]
    const to = canvasState.cards[toCardId]
    if (from === undefined || to === undefined) return { sourceHandle: 'r', targetHandle: 'l' }
    const picked = sideHandles(fromCardId, toCardId)
    return { sourceHandle: picked.fromHandle, targetHandle: picked.toHandle }
  }

  const liveEdges = useMemo<Edge[]>(() => {
    const out: Edge[] = []
    // A folded card is not painted, so its edges must not be either (an edge to
    // a hidden node would otherwise dangle on the board).
    const present = new Set(Object.keys(visibleCards).filter(cardId => !foldedSet.has(cardId)))
    // Card pairs with an explicit user-drawn edge, registered in BOTH
    // directions: the derived lineage dashes yield to a stored edge no
    // matter which way it was drawn — otherwise the two lines overlap on
    // the same handles and a deleted edge looks like it survived.
    const explicitPairs = new Set<string>()
    for (const [edgeId, edge] of Object.entries(canvasState.edges)) {
      explicitPairs.add(`${edge.fromCardId}->${edge.toCardId}`)
      explicitPairs.add(`${edge.toCardId}->${edge.fromCardId}`)
      if (!present.has(edge.fromCardId) || !present.has(edge.toCardId)) continue
      const kind = edge.injection.kind
      // Does this line still carry the source's latest context?
      const sync = edgeSyncState({
        kind,
        ...(lastPushOf(edge.fromCardId, edge.toCardId) !== undefined
          ? { lastPushAt: lastPushOf(edge.fromCardId, edge.toCardId) }
          : {}),
        ...(sourceCardUpdatedAt(edge.fromCardId) !== undefined
          ? { sourceUpdatedAt: sourceCardUpdatedAt(edge.fromCardId) }
          : {}),
      })
      out.push({
        id: edgeId,
        source: edge.fromCardId,
        target: edge.toCardId,
        // Faces are recomputed from the live positions — a stored handle would
        // keep a 12px stub forever after the cards were laid out side by side.
        // Honour the handles the user picked. Recomputing them unconditionally meant a
        // connection drawn from the left face of two stacked cards came out of their
        // *bottom* faces instead, and then had to loop back — the loop is what cut
        // through the cards. Only fall back to geometry when nothing was stored.
        ...(edge.fromHandle !== undefined && edge.toHandle !== undefined
          ? { sourceHandle: edge.fromHandle, targetHandle: edge.toHandle }
          : computedHandles(edge.fromCardId, edge.toCardId)),
        type: TALK_MAP_EDGE_TYPE,
        selected: liveSelectedEdgeIds.has(edgeId),
        // Endpoints ride along for the edge context menu (id parsing would
        // be ambiguous — card ids contain dashes); `sync` drives the look.
        data: {
          fromCardId: edge.fromCardId,
          toCardId: edge.toCardId,
          sync,
          // Hidden until the first layout pass: the stored positions come first and the
          // measured ones a frame later, and drawing the early route made the line
          // visibly jump across the board when the map opened.
          ready: boardTick > 0,
          obstacles: obstaclesFor(edge.fromCardId, edge.toCardId),
          ...(boxOf(edge.fromCardId) !== undefined ? { fromRect: boxOf(edge.fromCardId) } : {}),
          ...(boxOf(edge.toCardId) !== undefined ? { toRect: boxOf(edge.toCardId) } : {}),
        },
        // Every line carries its direction now: 「推送摘要」 always travels
        // source → target, so a link edge gets a lighter arrow instead of none.
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: kind === 'link' ? 13 : 16,
          height: kind === 'link' ? 13 : 16,
          color: sync === 'synced'
            ? 'rgba(255, 214, 106, 0.9)'
            : 'rgba(255, 255, 255, 0.45)',
        },
        // Pure association lines: no label, lighter than injection edges.
        ...(kind === 'link'
          ? { style: { opacity: 0.45 } }
          : {
              label: kind === 'none'
                ? t('edge.none')
                : kind === 'full'
                  ? t('edge.full')
                  : t('edge.injected'),
              ...(kind === 'none' ? { style: { opacity: 0.45 } } : {}),
            }),
      })
    }
    // Derived fork ("lineage") links are off: the map draws only the connections
    // the user made, all of them with the one edge style. These derived lines were
    // also the ones that kept running through cards, and they are not something the
    // user ever asked to see.
    if (DRAW_LINEAGE_LINKS && !lineageHidden) {
      // ...minus the pairs the user deleted one by one.
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (foldedSet.has(cardId)) continue
      const parentSessionId = sessions.byId[card.sessionId]?.parentId
      if (parentSessionId === undefined) continue
      const parentCardId = sessionIdToCardId.get(parentSessionId)
      if (parentCardId === undefined) continue
          // Skip when a stored edge already joins this pair — in either direction, otherwise
          // the lineage line runs parallel to it and the two read as one doubled line.
          if (explicitPairs.has(parentCardId + '->' + cardId)) continue
          if (explicitPairs.has(cardId + '->' + parentCardId)) continue
          // ...and the pairs the user deleted one by one.
      const parentSession = sessions.byId[visibleCards[parentCardId]?.sessionId ?? '']
      const childSession = sessions.byId[card.sessionId]
      // A lineage line can be pushed along too (the menu offers 推送摘要 on it),
      // so the pair log decides: pushed after the parent changed → synced.
      const lineagePush = lastPushOf(parentCardId, cardId)
      const lineageSync = lineagePush !== undefined
        ? edgeSyncState({
            kind: 'digest',
            lastPushAt: lineagePush,
            ...(parentSession?.updatedAt !== undefined ? { sourceUpdatedAt: parentSession.updatedAt } : {}),
          })
        : lineageSyncState({
            ...(parentSession?.updatedAt !== undefined ? { parentUpdatedAt: parentSession.updatedAt } : {}),
            ...(childSession?.updatedAt !== undefined ? { childUpdatedAt: childSession.updatedAt } : {}),
          })
      out.push({
        id: `lineage-${parentCardId}-${cardId}`,
        source: parentCardId,
        target: cardId,
        // Derived lines route like any other: faces are recomputed from the
        // cards' current positions, so a 12px neighbour gap becomes a real loop.
        ...computedHandles(parentCardId, cardId),
        type: TALK_MAP_EDGE_TYPE,
        // Selectable on purpose: right-clicking it must answer "what is this",
        // and offer to hide it. It used to be un-clickable mystery wiring.
        // 血缘线就按“一条还没同步的普通连线”渲染：同样的虚线、同样的箭头、
        // 同样的避障规则，没有单独样式，也不参与同步状态。
        data: {
          fromCardId: parentCardId,
          toCardId: cardId,
          sync: 'idle',
          ready: boardTick > 0,
          obstacles: obstaclesFor(parentCardId, cardId),
          ...(boxOf(parentCardId) !== undefined ? { fromRect: boxOf(parentCardId) } : {}),
          ...(boxOf(cardId) !== undefined ? { toRect: boxOf(cardId) } : {}),
        },
        // No inline stroke: inline style beats everything the renderer draws.
        style: { opacity: 0.85 },
      })
    }
    }
    return out
    // liveNodes is in the deps on purpose: routes are built from the rendered
    // positions, so a drag has to rebuild them.
  }, [visibleCards, canvasState.edges, sessions, sessionIdToCardId, liveSelectedEdgeIds, foldedSet, locale, pushEpoch, lineageHidden, liveNodes, boardTick])

  /**
   * Links for the open drawer.
   *
   * Deliberately derived from `liveEdges`: that is exactly what the canvas is
   * drawing, already filtered to the cards it actually paints and already
   * carrying the sync state. Recomputing from canvasState.edges instead made
   * the drawer disagree with the board in both directions (it drew lines the
   * board hid, and missed the derived fork lines entirely).
   */
  const drawerWireLinks = useMemo(() => {
    if (drawer === null) return []
    const layout = folderLayouts[drawer.groupId]
    const inFolder = new Set(layout === undefined ? [] : [...layout.shown, ...layout.folded])
    const painted = new Set(Object.keys(visibleCards).filter(cardId => !foldedSet.has(cardId)))
    return liveEdges
      .filter(edge => painted.has(edge.source) && painted.has(edge.target)
        && inFolder.has(edge.source) && inFolder.has(edge.target))
      .map(edge => {
        const data = (edge.data ?? {}) as { sync?: string; structural?: boolean }
        // Same rule as TalkMapEdge: transfers vanish once in sync, fork lines
        // never do.
        const visible = !(data.sync === 'synced' && data.structural !== true)
        return { from: edge.source, to: edge.target, visible }
      })
  }, [drawer, folderLayouts, liveEdges, visibleCards, foldedSet])

  /** The open drawer is only meaningful while its box is on screen. */
  const activeDrawer = drawer !== null && frameRects[drawer.groupId] !== undefined ? drawer : null

  const nodes = isSelecting && frozenRef.current !== null ? frozenRef.current.nodes : liveNodes
  const edges = isSelecting && frozenRef.current !== null ? frozenRef.current.edges : liveEdges

  const onSelectionStart = (): void => {
    frozenRef.current = { nodes: liveNodes, edges: liveEdges }
    setIsSelecting(true)
  }
  const onSelectionEnd = (): void => {
    frozenRef.current = null
    setIsSelecting(false)
  }

  /** Put a dragged folder back where it started (an illegal drop). */
  const rejectFrameDrop = (nodeId: string, base: FrameGeometry): void => {
    setNodes(current => current.map(node => (
      node.id === nodeId ? { ...node, position: { x: base.x, y: base.y } } : node
    )))
  }

  const onNodesChange = (changes: NodeChange<TalkMapNode>[]): void => {
    for (const change of changes) {
      if (change.type === 'position' && change.position !== undefined) {
        if (change.id.startsWith('frame-')) {
          // Moving a folder: the members are not translated card by card any
          // more — their slots are derived from the folder's rect, so a live
          // rect moves (and animates) the whole group in one pass.
          const groupId = change.id.slice('frame-'.length)
          const base = frameRects[groupId] ?? wsFrames[groupId]
          if (base === undefined) continue
          const rect: FrameGeometry = {
            x: change.position.x,
            y: change.position.y,
            width: base.width,
            height: base.height,
          }
          if (change.dragging === false) {
            setLiveFrame(null)
            setBlockedFrame(null)
            // The drop has to be legal: folders never sit on each other. An
            // overlapping drop is refused and the folder returns to where it
            // started — the neighbour it brushed past does not move.
            const collides = Object.entries(frameRects)
              .some(([otherId, otherRect]) => otherId !== groupId && rectsOverlap(rect, otherRect))
            if (collides) {
              rejectFrameDrop(change.id, base)
            } else {
              canvas.setWsFrameRect(groupId, rect)
              // A free box carries its members: they were drawn shifted during
              // the drag, now the shift becomes their stored position.
              const stored = wsFrames[groupId] ?? base
              const dx = rect.x - stored.x
              const dy = rect.y - stored.y
              if (boxes[groupId]?.free === true && (dx !== 0 || dy !== 0)) {
                const moved: Record<string, { x: number; y: number }> = {}
                for (const cardId of membersByGroup.get(groupId) ?? []) {
                  const member = visibleCards[cardId]
                  if (member !== undefined) moved[cardId] = { x: member.x + dx, y: member.y + dy }
                }
                canvas.moveCards(moved)
              }
            }
          } else if (change.dragging === true) {
            setLiveFrame({ groupId, rect })
            // Nothing is pushed while dragging: the folder may travel over a
            // neighbour, it just cannot be dropped there.
            const blocked = Object.entries(frameRects)
              .some(([otherId, otherRect]) => otherId !== groupId && rectsOverlap(rect, otherRect))
            setBlockedFrame(blocked ? groupId : null)
          }
        } else if (change.dragging === false) {
          // Dropped. Where the card CENTRE lands decides its fate:
          //   - inside a box on this page → it joins that box and the slot
          //     layout takes over;
          //   - anywhere else → it is (or becomes) a FREE card and keeps the
          //     drop position, snapped to the grid when 吸附 is on.
          setDraggingCardId(null)
          setDragCenter(null)
          const centre = { x: change.position.x + CARD_W / 2, y: change.position.y + CARD_H / 2 }
          const target = groupAtPoint(centre.x, centre.y)
          if (target !== undefined) {
            canvas.setCardBox(change.id, target)
            // Persist the order the box was PREVIEWING — every card, not just
            // the dragged one. Writing only the dragged card left two cards
            // sharing one slot's coordinates, so the re-derived reading order
            // fell back to the old arrangement and the box snapped back.
            const droppedLayout = folderLayouts[target]
            const droppedRect = frameRects[target]
            if (droppedLayout?.free === true) {
              const x = snapEnabled ? snap(change.position.x) : change.position.x
              const y = snapEnabled ? snap(change.position.y) : change.position.y
              canvas.moveCard(change.id, x, y)
            } else if (droppedLayout !== undefined && droppedRect !== undefined) {
              const cols = colsForWidth(droppedRect.width)
              const order = droppedLayout.ordered.includes(change.id)
                ? droppedLayout.ordered
                : (() => {
                    // A newcomer is inserted where it was dropped, not appended.
                    const at = Math.min(Math.max(0, slotIndexAt(droppedRect, centre)), droppedLayout.ordered.length)
                    return [...droppedLayout.ordered.slice(0, at), change.id, ...droppedLayout.ordered.slice(at)]
                  })()
              order.forEach((cardId, index) => {
                const point = slotPoint(droppedRect, index, cols)
                canvas.moveCard(cardId, point.x, point.y)
              })
            }
          } else {
            // Dragged out of a box: it joins nothing and stays where it landed.
            if (visibleCards[change.id]?.boxId !== undefined) canvas.setCardBox(change.id, undefined)
            const x = snapEnabled ? snap(change.position.x) : change.position.x
            const y = snapEnabled ? snap(change.position.y) : change.position.y
            canvas.moveCard(change.id, x, y)
          }
        } else if (change.dragging === true) {
          // Live drag — this card is the only one that ignores its slot.
          setDraggingCardId(change.id)
          setDragCenter({ x: change.position.x + CARD_W / 2, y: change.position.y + CARD_H / 2 })
          canvas.moveCard(change.id, change.position.x, change.position.y)
        }
      } else if (change.type === 'select') {
        setSelectedIds((previous) => {
          const next = new Set(previous)
          if (change.selected) next.add(change.id)
          else next.delete(change.id)
          return next
        })
      } else if (change.type === 'remove') {
        // Backspace/Delete on a selection (React Flow ignores focused inputs).
        // Cards leave the map (the session itself is untouched); deleting a BOX
        // only ungroups its cards — it never removes a conversation.
        if (change.id.startsWith('frame-')) {
          deleteBox(change.id.slice('frame-'.length))
        } else if (!change.id.startsWith('stack-')) {
          canvas.removeCard(change.id)
        }
        setSelectedIds((previous) => {
          const next = new Set(previous)
          next.delete(change.id)
          return next
        })
      }
    }
    // A box outlives its cards: it is the user's own container, so removing the
    // last card must not silently delete it (the old auto-folder rule). Delete
    // the box itself from its own menu when it is no longer wanted.
  }

  const onEdgesChange = (changes: EdgeChange[]): void => {
    // Removals batch into ONE store call: a hub card's Backspace emits one
    // remove per connected edge, and per-edge calls would mean one undo
    // frame, one state copy, and one POST each.
    const removedIds: string[] = []
    for (const change of changes) {
      if (change.type === 'select') {
        setSelectedEdgeIds((previous) => {
          const next = new Set(previous)
          if (change.selected) next.add(change.id)
          else next.delete(change.id)
          return next
        })
      } else if (change.type === 'remove') {
        // Lineage edges are derived — nothing to delete.
        if (!change.id.startsWith('lineage-')) removedIds.push(change.id)
        setSelectedEdgeIds((previous) => {
          const next = new Set(previous)
          next.delete(change.id)
          return next
        })
      }
    }
    if (removedIds.length > 0) canvas.removeEdges(removedIds)
  }

  // Mount guard + timer cleanup: a push settling after the map closed must
  // not set state on the unmounted component or park a timer holding the
  // render closure alive.
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (toastTimer.current !== undefined) clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = (message: string): void => {
    if (!mountedRef.current) return
    setToast(message)
    if (toastTimer.current !== undefined) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => { setToast(null) }, 4000)
  }
  // Chrome outside the canvas (the conversation picker) reports through the same toast.
  const showToastRef = useRef(showToast)
  showToastRef.current = showToast
  useEffect(() => {
    const onToast = (event: Event): void => {
      const detail = (event as CustomEvent<unknown>).detail
      if (typeof detail === 'string') showToastRef.current(detail)
    }
    window.addEventListener('talk-pages:toast', onToast)
    return () => { window.removeEventListener('talk-pages:toast', onToast) }
  }, [])

  /**
   * Create an EMPTY box with its top-left corner at a flow point. Two columns
   * wide and one row tall, on the active page; creating a box never moves or
   * creates a card — cards join it only when they are dropped inside it.
   */
  const createBoxAt = (flowX: number, flowY: number): void => {
    const width = CARD_W * 2 + GAP_X + FRAME_PAD * 2
    const created = canvas.createBox(activePage, {
      x: snap(flowX),
      y: snap(flowY),
      width,
      height: MIN_FRAME_HEIGHT,
    }, t('box.defaultTitle'))
    if (created !== undefined) showToast(t('toast.boxCreated'))
  }

  /** The tab bar's ＋ 新建框: a box centred on the current viewport. */
  const createBoxHere = (): void => {
    const wrapper = wrapperRef.current
    if (wrapper === null) return
    const bounds = wrapper.getBoundingClientRect()
    const centre = screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    })
    const width = CARD_W * 2 + GAP_X + FRAME_PAD * 2
    createBoxAt(centre.x - width / 2, centre.y - MIN_FRAME_HEIGHT / 2)
  }

  // The tab bar lives outside the React Flow provider, so it reaches the
  // viewport through this one registered action.
  useEffect(() => {
    canvasActions.setCreateBox(createBoxHere)
    return () => { canvasActions.setCreateBox(undefined) }
  })

  /** Pick edge anchor sides from the cards' relative placement. */
  /** Every card on this board, as routing obstacles. */

  /** A plain association between two existing cards. One edge per pair —
   * a second draw over an already-connected pair is silently a no-op. */
  const createLinkEdge = (
    fromCardId: string,
    toCardId: string,
    handles?: { fromHandle?: string | null; toHandle?: string | null },
  ): void => {
    if (fromCardId === toCardId) return
    const exists = Object.values(canvasState.edges).some(edge =>
      (edge.fromCardId === fromCardId && edge.toCardId === toCardId)
      || (edge.fromCardId === toCardId && edge.toCardId === fromCardId))
    if (exists) return
    const fromCard = canvasState.cards[fromCardId]
    const toCard = canvasState.cards[toCardId]
    if (fromCard === undefined || toCard === undefined) return
    const geometry = sideHandles(fromCardId, toCardId)
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle
    canvas.addEdges({
      [`edge-${crypto.randomUUID()}`]: {
        boardId: INBOX_BOARD_ID,
        fromCardId,
        toCardId,
        injection: { kind: 'link' },
        fromHandle: handles?.fromHandle ?? geometry.fromHandle,
        toHandle: handles?.toHandle ?? geometry.toHandle,
        ...(fromTitle !== undefined ? { fromTitle } : {}),
        createdAt: Date.now(),
      },
    })
  }

  /** Handle-to-handle drop on another card (ConnectionMode.Loose). */
  const onConnect = (connection: Connection): void => {
    // An Esc-cancelled gesture must not create an edge even when released
    // on a handle (React Flow calls onConnect BEFORE onConnectEnd; the
    // flag is reset there).
    if (connectCancelledRef.current) return
    createLinkEdge(connection.source, connection.target, {
      fromHandle: connection.sourceHandle,
      toHandle: connection.targetHandle,
    })
  }

  /** The pipe: push the source's latest digest into the target's inbox. */
  /**
   * Give a derived pair a real edge so it can carry per-edge settings
   * (auto push, handles). The lineage line yields automatically: the canvas
   * already skips a derived line when a stored edge covers that pair.
   */
  const materialiseEdge = (fromCardId: string, toCardId: string): string | undefined => {
    const fromCard = canvasState.cards[fromCardId]
    const toCard = canvasState.cards[toCardId]
    if (fromCard === undefined || toCard === undefined) return undefined
    const geometry = sideHandles(fromCard, toCard)
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle
    const edgeId = `edge-${crypto.randomUUID()}`
    canvas.addEdges({
      [edgeId]: {
        boardId: INBOX_BOARD_ID,
        fromCardId,
        toCardId,
        injection: { kind: 'digest' },
        fromHandle: geometry.fromHandle,
        toHandle: geometry.toHandle,
        ...(fromTitle !== undefined ? { fromTitle } : {}),
        createdAt: Date.now(),
      },
    })
    return edgeId
  }

  const pushAlongEdge = async (fromCardId: string, toCardId: string): Promise<void> => {
    const fromCard = canvasState.cards[fromCardId]
    const toCard = canvasState.cards[toCardId]
    if (fromCard === undefined || toCard === undefined) return
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle ?? fromCard.sessionId
    const toTitle = sessions.byId[toCard.sessionId]?.displayTitle ?? toCard.sessionId
    try {
      // The digest is not kept warm any more: refresh it here, but only when
      // this conversation actually changed (the Host skips the LLM call).
      const fresh = await talkMapApi.ensureDigest(fromCard.sessionId)
      const digest = fresh.digest ?? canvasState.digests[fromCard.sessionId]
      if (digest === undefined || digestIsEmpty(digest)) {
        showToast(t('digest.empty'))
        return
      }
      await talkMapApi.injectContext(toCard.sessionId, [
        { sessionId: fromCard.sessionId, text: buildPushText(fromTitle, digest) },
      ])
      // Remember when this line last delivered: "synced" is decided from it.
      // The record is keyed by the card PAIR, so a lineage line (which has no
      // stored edge to write to) keeps its state too.
      const pushedAt = stampPush(fromCardId, toCardId)
      setPushEpoch(previous => previous + 1)
      for (const [id, edge] of Object.entries(canvasState.edges)) {
        const same = (edge.fromCardId === fromCardId && edge.toCardId === toCardId)
          || (edge.fromCardId === toCardId && edge.toCardId === fromCardId)
        if (!same) continue
        canvas.addEdges({ [id]: { ...edge, lastPushAt: pushedAt } })
      }
      showToast(t('toast.pushed', { to: toTitle }))
    } catch (error) {
      const code = (error as ApiError).code
      showToast(code === 'session-not-live'
        ? t('toast.notLive')
        : `${t('toast.pushFailed')}${String(error)}`)
    }
  }

  const onConnectEnd = (
    event: MouseEvent | TouchEvent,
    connectionState: FinalConnectionState,
  ): void => {
    setConnecting(false)
    if (connectCancelledRef.current) {
      connectCancelledRef.current = false
      return
    }
    if (connectionState.isValid === true) return // landed on a handle → onConnect
    const fromNodeId = connectionState.fromNode?.id
    if (fromNodeId === undefined) return
    const card = canvasState.cards[fromNodeId]
    if (card === undefined) return
    const client = 'clientX' in event
      ? { x: event.clientX, y: event.clientY }
      : event.changedTouches[0] !== undefined
        ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }
        : undefined
    if (client === undefined) return
    const position = screenToFlowPosition(client)
    // Dropped on an existing card's BODY (between handles)? That's a link,
    // not a fork — only a drop on empty canvas opens the spawn panel.
    // DOM hit-testing, not card-rect math: cards are min-height and grow
    // with their digest, so a fixed-height rectangle misjudges both the
    // lower band of tall cards and the space under short ones — and the
    // DOM answers with proper stacking order for overlapping cards.
    // elementsFromPoint (plural): overlay UI (the Controls panel, the
    // color toolbar) floats above the canvas and would shadow a card
    // beneath it — walk the whole stack for the topmost card node.
    const hitNode = document.elementsFromPoint(client.x, client.y)
      .map(el => el.closest('.react-flow__node[data-id^="card-"]'))
      .find(el => el !== null)
    const hitId = hitNode?.getAttribute('data-id') ?? undefined
    if (hitId !== undefined && visibleCards[hitId] !== undefined) {
      if (hitId !== fromNodeId) createLinkEdge(fromNodeId, hitId)
      return
    }
    const summary = sessions.byId[card.sessionId]
    if (summary === undefined) return
    const parentWorkspaceId = sessionWs.get(card.sessionId)
    setPendingSpawn({
      parent: { cardId: fromNodeId, sessionId: card.sessionId, title: summary.displayTitle },
      ...(parentWorkspaceId !== undefined ? { parentWorkspaceId } : {}),
      ...(card.boxId !== undefined ? { parentBoxId: card.boxId } : {}),
      x: snap(position.x - CARD_W / 2),
      y: snap(position.y - CARD_H / 2),
    })
  }

  const openSession = (sessionId: string): void => {
    // Looking at it counts as reading it: drop the map's own "finished, unread".
    sessionActivity.acknowledge(sessionId)
    // Open first: if the runtime has no session opener, the map stays up (and
    // the reason lands in the console) instead of closing onto the old chat.
    if (openSessionInUi(sessionId)) closeMapPanel()
  }

  /**
   * Open a conversation found by a search.
   *
   * No attempt to scroll to the matched record: the transcript exposes no
   * per-message anchor (no data-seq / id) and only the messages near the
   * viewport are mounted, so a plugin cannot place the view precisely. The
   * reference plugin in the market (dsh-find-all) does the same — it opens the
   * session and leaves the scroll position to the shell.
   */
  const openSearchHit = (sessionId: string): void => {
    openSession(sessionId)
  }

  /**
   * The drawer search is intentionally LOCAL: it filters the rows this folder is
   * rendering (title + body) instead of asking the corpus. Nothing leaves the
   * board, so it is instant and it can never surface a conversation the folder
   * does not contain.
   */
  const searchInWorkspace = async (groupId: string, query: string): Promise<DrawerSearchHit[]> => {
    const needle = query.trim().toLowerCase()
    if (needle === '') return []
    return drawerItems(groupId)
      .filter(item => item.title.toLowerCase().includes(needle)
        || (item.preview ?? '').toLowerCase().includes(needle))
      .map(item => {
        const titleHit = item.title.toLowerCase().includes(needle)
        return {
          sessionId: item.sessionId,
          title: item.title,
          // A title hit already shows its title: no second, identical line.
          blocks: titleHit || (item.preview ?? '') === '' ? [] : [[item.preview ?? '']],
          seqs: [null],
          roles: [null],
          byTitle: titleHit,
        }
      })
  }

  const toHitView = (hit: ContentHit): DrawerSearchHit => ({
    sessionId: hit.sessionId,
    title: renamedTitles[hit.sessionId] ?? sessions.byId[hit.sessionId]?.displayTitle ?? hit.sessionId,
    blocks: hit.blocks,
    seqs: hit.seqs,
    roles: hit.roles,
    agent: hit.agent,
    depth: hit.depth,
  })
  // Publish the board's title lookup for the header's global search panel.
  useEffect(() => {
    setTitleResolver((sessionId) => renamedTitles[sessionId] ?? sessions.byId[sessionId]?.displayTitle)
    setCardTable(Object.entries(canvasState.cards).map(([cardId, card]) => ({
      cardId,
      sessionId: card.sessionId,
      title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId,
      preview: previews[card.sessionId] ?? '',
      workspaceTitle: wsTitles.get(sessionWs.get(card.sessionId) ?? '') ?? '',
    })))
    setTitleTable(Object.entries(sessions.byId).map(([sessionId, row]) => ({
      sessionId,
      title: renamedTitles[sessionId] ?? row.displayTitle ?? '',
    })).filter(entry => entry.title !== ''))
    return () => { setTitleResolver(undefined) }
  }, [renamedTitles, sessions])
  /** Edges that start or end at `cardId` and stay inside the same folder. */
  const folderLinks = (groupId: string, cardId: string): NonNullable<StackEntry['links']> => {
    const out: NonNullable<StackEntry['links']> = []
    for (const edge of Object.values(canvasState.edges)) {
      const other = edge.fromCardId === cardId
        ? edge.toCardId
        : edge.toCardId === cardId ? edge.fromCardId : undefined
      if (other === undefined) continue
      const otherSessionId = visibleCards[other]?.sessionId
      if (otherSessionId === undefined) continue
      if (visibleCards[other]?.boxId !== groupId) continue
      out.push({
        toCardId: other,
        title: renamedTitles[otherSessionId] ?? sessions.byId[otherSessionId]?.displayTitle ?? otherSessionId,
        kind: edge.injection?.kind ?? 'link',
        outgoing: edge.fromCardId === cardId,
      })
    }
    return out
  }

  const drawerItems = (groupId: string): StackEntry[] => {
    const layout = folderLayouts[groupId]
    const ids = layout === undefined ? [] : [...layout.shown, ...layout.folded]
    const items: StackEntry[] = []
    for (const cardId of ids) {
      const card = visibleCards[cardId]
      if (card === undefined) continue
      const summary = sessions.byId[card.sessionId]
      const digest = canvasState.digests[card.sessionId]
      const glow = glowOf(card.sessionId)
      items.push({
        cardId,
        sessionId: card.sessionId,
        title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
        ...(previews[card.sessionId] !== undefined ? { preview: previews[card.sessionId] } : {}),
        ...(summary?.updatedAt !== undefined ? { updatedAt: summary.updatedAt } : {}),
        running: statusById.get(card.sessionId)?.running ?? summary?.running ?? false,
        ...(glow !== undefined ? { glow } : {}),
        ...(draftSessions.has(card.sessionId) ? { pendingDraft: true } : {}),
        ...(interruptedById.has(card.sessionId) ? { interrupted: true } : {}),
        // The drawer mirrors the canvas selection (single pick or batch tick),
        // and marks the conversation the map was opened from.
        selected: batchMode ? batchPicks.has(cardId) : liveSelectedIds.has(cardId),
        current: currentSessionId() === card.sessionId,
        // The grid draws these as lines; inside the drawer they have to be
        // spelled out, otherwise a pushed digest looks like it came from nowhere.
        links: folderLinks(groupId, cardId),
      })
    }
    return items
  }

  /**
   * Archive or delete a set of cards, then take them off the map. Delete goes
   * through dsh-recycle-bin's Host route, so it lands in the bin and stays
   * restorable.
   */
  const runActions = async (kind: 'archive' | 'delete', cardIds: readonly string[]): Promise<void> => {
    if (cardIds.length === 0) return
    const sessionIds = cardIds
      .map(cardId => visibleCards[cardId]?.sessionId)
      .filter((sessionId): sessionId is string => sessionId !== undefined)
    if (sessionIds.length === 0) return
    setBatchBusy(true)
    try {
      if (kind === 'archive') await archiveSessions(sessionIds)
      else await trashSessions(sessionIds, () => { showToast(t('toast.stopping')) })
      for (const cardId of cardIds) canvas.removeCard(cardId)
      showToast(t(kind === 'archive' ? 'toast.archived' : 'toast.deleted', { n: String(sessionIds.length) }))
    } catch (error) {
      showToast(`${t(kind === 'archive' ? 'toast.archiveFailed' : 'toast.deleteFailed')}${String(error)}`)
    } finally {
      setBatchBusy(false)
    }
  }

  /**
   * A drag inside the stack drawer landed. The drawer shows the folder's
   * reading order, which is derived from canvas positions — so the new
   * arrangement is written back as slot coordinates, exactly like a canvas
   * drop. Nothing is stored twice, so grid and drawer cannot disagree.
   */
  const reorderInDrawer = (groupId: string, cardId: string, index: number): void => {
    const layout = folderLayouts[groupId]
    const rect = frameRects[groupId] ?? wsFrames[groupId]
    if (layout === undefined || rect === undefined) return
    const ids = [...layout.ordered]
    const from = ids.indexOf(cardId)
    if (from < 0) return
    ids.splice(from, 1)
    const at = Math.min(Math.max(0, index), ids.length)
    ids.splice(at, 0, cardId)
    const cols = colsForWidth(rect.width)
    ids.forEach((id, position) => {
      const point = slotPoint(rect, position, cols)
      canvas.moveCard(id, point.x, point.y)
    })
  }

  /** Cards picked in batch mode (a plain click on a card toggles it). */
  const selectedCardIds = useMemo(
    () => [...batchPicks].filter(id => visibleCards[id] !== undefined),
    [batchPicks, visibleCards],
  )

  /** Toggle one card's batch membership. */
  const toggleBatchPick = (cardId: string): void => {
    setBatchPicks((previous) => {
      const next = new Set(previous)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
  }

  /** Batch bar action: run, then leave batch mode. */
  const runBatch = async (kind: 'archive' | 'delete'): Promise<void> => {
    if (batchBusy || !batchMode) return
    const cardIds = selectedCardIds
    if (cardIds.length === 0) return
    setBatchMode(false)
    setBatchPicks(new Set())
    await runActions(kind, cardIds)
  }


  /**
   * Which folder is under a flow-space point (rendered rects, not the stored
   * ones). Two folders can overlap on a free board, so the SMALLEST one wins:
   * the more specific target is the one the pointer is really on.
   */
  const groupAtPoint = (x: number, y: number): string | undefined => {
    let best: { groupId: string; area: number } | undefined
    for (const [groupId, rect] of Object.entries(frameRects)) {
      if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) continue
      const area = rect.width * rect.height
      if (best === undefined || area < best.area) best = { groupId, area }
    }
    return best?.groupId
  }

  /**
   * Start a conversation: hand the workspace to the SHELL's own new-conversation
   * screen and leave the map. No in-place composer any more — the shipped screen
   * already owns the workspace picker, the whole agent-preset list (标准/创造/…)
   * and the send path, so the map cannot drift out of sync with it.
   */
  const startSessionIn = (workspaceId?: string): void => {
    const ui = uiWorkspaceService()
    if (ui === undefined || typeof ui.startSession !== 'function') {
      showToast(t('toast.needUiWorkspace'))
      return
    }
    closeMapPanel()
    ui.startSession(workspaceId)
  }

  /**
   * Which WORKSPACE a flow point resolves to (for "new chat here"): the page of
   * the box under the pointer, else the active page. A user box on the unsorted
   * page resolves to nothing — there is no workspace to start a chat in.
   */
  const workspaceAt = (flowX: number, flowY: number): string | undefined => {
    const boxId = groupAtPoint(flowX, flowY)
    const pageId = boxId === undefined ? activePage : (boxes[boxId]?.pageId ?? activePage)
    return wsTitles.has(pageId) ? pageId : undefined
  }

  // ---- import actions -------------------------------------------------

  /**
   * Bring one conversation onto the map as a FREE card at the click point. The
   * card lives on its session's workspace page, so importing from another page
   * also switches to that page — otherwise the click would look like a no-op.
   */
  const importSession = (sessionId: string, atX: number, atY: number): void => {
    canvas.addCards({
      [newCardId()]: {
        boardId: INBOX_BOARD_ID,
        sessionId,
        x: snapEnabled ? snap(atX) : atX,
        y: snapEnabled ? snap(atY) : atY,
        createdAt: Date.now(),
      },
    })
    const pageId = sessionWs.get(sessionId) ?? UNSORTED_PAGE_ID
    if (pageId !== activePage) {
      canvas.setActivePage(pageId)
      showToast(t('toast.importedOnPage', { page: wsTitles.get(pageId) ?? t('page.unsorted') }))
    }
  }

  /**
   * Delete a BOX. Its cards are ungrouped, not deleted: they stay exactly where
   * the slot layout put them, as free cards. Sessions and edges are untouched —
   * a container is not a conversation.
   */
  const deleteBox = (boxId: string): void => {
    const title = boxes[boxId]?.title ?? wsTitles.get(boxId) ?? t('frame.unknown')
    canvas.deleteBox(boxId)
    showToast(t('toast.boxDeleted', { title }))
  }

  // ---- context menu ----------------------------------------------------

  const openMenu = (
    event: React.MouseEvent | MouseEvent,
    kind: MenuContext['kind'],
    targetId?: string,
    edgeEnds?: { from: string; to: string },
  ): void => {
    event.preventDefault()
    const wrapper = wrapperRef.current
    if (wrapper === null) return
    const bounds = wrapper.getBoundingClientRect()
    const flow = screenToFlowPosition({ x: event.clientX, y: event.clientY })
    setMenu({
      left: event.clientX - bounds.left,
      top: event.clientY - bounds.top,
      flowX: flow.x,
      flowY: flow.y,
      kind,
      ...(targetId !== undefined ? { targetId } : {}),
      ...(edgeEnds !== undefined ? { edgeFrom: edgeEnds.from, edgeTo: edgeEnds.to } : {}),
      view: 'root',
    })
  }

  const menuState: MenuState | null = useMemo(() => {
    if (menu === null) return null
    const close = (): void => { setMenu(null) }
    const items: MenuItem[] = []
    let title: string | undefined

    if (menu.view === 'box-color' && menu.targetId !== undefined) {
      const boxId = menu.targetId
      const current = (canvasState.global?.wsColors ?? {})[boxId]
      title = t('menu.color')
      items.push({
        key: '__none__',
        label: t('color.clear'),
        ...(current === undefined ? { hint: t('menu.colorCurrent') } : {}),
        onPick: () => {
          close()
          canvas.setWorkspaceColor(boxId, undefined)
        },
      })
      for (const tag of COLOR_TAGS) {
        items.push({
          key: tag.id,
          label: t(`color.${tag.id}`),
          ...(current === tag.id ? { hint: t('menu.colorCurrent') } : {}),
          onPick: () => {
            close()
            canvas.setWorkspaceColor(boxId, tag.id)
          },
        })
      }
      return { left: menu.left, top: menu.top, ...(title !== undefined ? { title } : {}), items }
    }

    if (menu.view === 'new-ws') {
      const parentDir = ((): string => {
        const sample = workspaces.items[0]?.path
        if (sample === undefined) return ''
        const cut = sample.lastIndexOf('/')
        return cut > 0 ? sample.slice(0, cut) : sample
      })()
      return {
        left: menu.left,
        top: menu.top,
        title: t('menu.newWs'),
        prompt: {
          placeholder: t('draft.wsNamePlaceholder'),
          submitLabel: t('menu.createAndImport'),
          preview: (value: string) => `${parentDir}/${value}`,
          onSubmit: async (value: string) => {
            const services = getServices()
            if (services === undefined || parentDir === '') throw new Error('no workspace root available')
            const path = `${parentDir}/${value}`
            await talkMapApi.ensureDir(path)
            const created = await callRpc<{ workspace: { workspaceId: string } }>('workspace/create', { path })
            // A workspace IS a page: show it, its sessions arrive as free cards.
            canvas.setActivePage(created.workspace.workspaceId)
            close()
          },
        },
        items: [],
      }
    }

    if (menu.view === 'import-ws') {
      // Every workspace is a page already, so this list is a page picker.
      title = t('menu.pages')
      items.push({
        key: '__new__',
        label: t('menu.newWs'),
        onPick: () => { setMenu({ ...menu, view: 'new-ws' }) },
      })
      for (const page of pages) {
        items.push({
          key: page.id,
          label: page.title,
          ...(page.id === activePage ? { hint: t('menu.currentPage') } : {}),
          onPick: () => {
            canvas.setActivePage(page.id)
            close()
          },
        })
      }
    } else if (menu.view === 'import-session') {
      title = t('menu.importSession')
      const candidates = placeableSessionIds(sessions)
        .filter(id => !boardSessionIds.has(id))
        .slice(0, 200)
      for (const sessionId of candidates) {
        items.push({
          key: sessionId,
          label: sessions.byId[sessionId]?.displayTitle ?? sessionId,
          onPick: () => {
            importSession(sessionId, menu.flowX, menu.flowY)
            close()
          },
        })
      }
    } else if (menu.kind === 'pane') {
      const under = workspaceAt(menu.flowX, menu.flowY)
      const underTitle = under === undefined ? undefined : wsTitles.get(under)
      items.push({
        key: 'draft',
        // Say which workspace it will land in: the menu is opened at a point,
        // and that point is what decides the workspace.
        label: underTitle === undefined ? t('menu.newChat') : t('menu.newChatIn', { ws: underTitle }),
        onPick: () => {
          startSessionIn(under)
          close()
        },
      })
      // Empty canvas: drop a box right here (the toolbar button centres one).
      items.push({
        key: 'new-box',
        icon: 'group',
        label: t('menu.newBox'),
        onPick: () => {
          createBoxAt(menu.flowX, menu.flowY)
          close()
        },
      })

      items.push({
        key: 'import-ws',
        label: `${t('menu.pages')}…`,
        onPick: () => { setMenu({ ...menu, view: 'import-ws' }) },
      })
      items.push({
        key: 'import-session',
        label: `${t('menu.importSession')}…`,
        onPick: () => { setMenu({ ...menu, view: 'import-session' }) },
      })
    } else if (menu.kind === 'card' && menu.targetId !== undefined) {
      const cardId = menu.targetId
      const card = canvasState.cards[cardId]
      // "打开对话" lives on the card itself (single click) and "从地图移除" is
      // covered by 删除/归档 — neither needs a menu entry.
      // Importance marks are the map's own (the sidebar's pin is not mirrored here).
      const current = card?.priority
      for (const level of [1, 2, 3] as const) {
        items.push({
          key: `priority-${level}`,
          icon: 'pin',
          label: t(`menu.priority${level}`),
          ...(current === level ? { hint: '✓' } : {}),
          onPick: () => {
            close()
            canvas.setCardPriority(cardId, current === level ? undefined : level)
          },
        })
      }
      if (current !== undefined) {
        items.push({
          key: 'priority-clear',
          icon: 'unpin',
          label: t('menu.priorityClear'),
          onPick: () => {
            close()
            canvas.setCardPriority(cardId, undefined)
          },
        })
      }
      // Mark it unread by hand: exactly the "finished, nobody looked" state the
      // map computes on its own, cleared the same way (open the conversation).
      items.push({
        key: 'unread',
        icon: 'unread',
        label: t('menu.markUnread'),
        onPick: () => {
          close()
          if (card !== undefined) sessionActivity.markFinished(card.sessionId)
        },
      })
      items.push({
        key: 'rename',
        icon: 'rename',
        label: t('menu.rename'),
        onPick: () => {
          close()
          if (card !== undefined) {
            setRenameTarget({
              kind: 'session',
              id: card.sessionId,
              title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId,
            })
          }
        },
      })
      // Read-only: exactly the text this card would push to another session.
      items.push({
        key: 'view-digest',
        icon: 'digest',
        label: t('menu.viewDigest'),
        ...(card === undefined || digestIsEmpty(canvasState.digests[card.sessionId])
          ? { hint: t('digest.empty'), disabled: true }
          : {}),
        onPick: () => {
          close()
          if (card === undefined) return
          setDigestTarget({
            title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId,
            digest: canvasState.digests[card.sessionId],
          })
        },
      })

      items.push({
        key: 'archive',
        icon: 'archive',
        label: t('menu.archive'),
        onPick: () => {
          close()
          void runActions('archive', [cardId])
        },
      })
      items.push({
        key: 'delete-session',
        icon: 'delete',
        danger: true,
        label: t('menu.deleteSession'),
        onPick: () => {
          close()
          void runActions('delete', [cardId])
        },
      })
      items.push({
        key: 'batch',
        icon: 'batch',
        label: t('menu.batch'),
        onPick: () => {
          close()
          // Batch mode: the picked card is the first member of the batch.
          setBatchMode(true)
          setBatchPicks(new Set([cardId]))
        },
      })
    } else if (menu.kind === 'edge' && menu.targetId !== undefined
      && menu.edgeFrom !== undefined && menu.edgeTo !== undefined) {
      const edgeId = menu.targetId
      const edgeFrom = menu.edgeFrom
      const edgeTo = menu.edgeTo
      const stored = canvasState.edges[edgeId]
      const fromCard = canvasState.cards[edgeFrom]
      const toCard = canvasState.cards[edgeTo]
      const fromTitle = fromCard !== undefined
        ? sessions.byId[fromCard.sessionId]?.displayTitle ?? fromCard.sessionId
        : '?'
      const toTitle = toCard !== undefined
        ? sessions.byId[toCard.sessionId]?.displayTitle ?? toCard.sessionId
        : '?'
      title = `${fromTitle} → ${toTitle}`
      const digest = fromCard !== undefined ? canvasState.digests[fromCard.sessionId] : undefined
      const noDigest = digest === undefined || digestIsEmpty(digest)
      const lineage = stored === undefined
      items.push({
        key: 'push',
        label: t('edge.push'),
        ...(noDigest ? { hint: t('edge.pushNoDigest'), disabled: true } : {}),
        onPick: () => {
          close()
          void pushAlongEdge(edgeFrom, edgeTo)
        },
      })
      // Same switch on both kinds: a lineage line materialises a real edge first
      // (its derived line then yields), so the control is never missing.
      const auto = stored?.injection.autoPush === true
      items.push({
        key: 'auto-push',
        label: auto ? t('edge.autoPushOff') : t('edge.autoPushOn'),
        ...(auto ? {} : { hint: t('edge.autoPushHint') }),
        onPick: () => {
          close()
          if (stored !== undefined) {
            canvas.addEdges({
              [edgeId]: {
                ...stored,
                injection: { ...stored.injection, autoPush: !auto },
              },
            })
            return
          }
          materialiseEdge(edgeFrom, edgeTo)
        },
      })

      // One control for both kinds. A stored edge is removed; a derived fork
      // line has nothing to delete, so the pair is remembered instead.
      items.push({
        key: 'delete-edge',
        label: t('edge.delete'),
        onPick: () => {
          close()
          if (stored !== undefined) {
            canvas.removeEdges([edgeId])
            return
          }
          cutLineage(edgeFrom, edgeTo)
        },
      })
    } else if (menu.kind === 'frame' && menu.targetId !== undefined) {
      const boxId = menu.targetId
      const box = boxes[boxId]
      const boxTitle = box?.title ?? wsTitles.get(boxId) ?? t('frame.unknown')
      title = boxTitle
      // A new chat started from a box belongs to the box's PAGE workspace.
      const pageId = box?.pageId ?? activePage
      const pageWorkspace = wsTitles.has(pageId) ? pageId : undefined
      items.push({
        key: 'new-chat',
        icon: 'open',
        label: t('menu.newChat'),
        onPick: () => {
          startSessionIn(pageWorkspace)
          close()
        },
      })
      items.push({
        key: 'rename-box',
        icon: 'rename',
        label: t('menu.renameBox'),
        onPick: () => {
          close()
          setRenameTarget({ kind: 'box', id: boxId, title: boxTitle })
        },
      })
      items.push({
        key: 'box-layout',
        label: box?.free === true ? t('menu.boxGrid') : t('menu.boxFree'),
        onPick: () => {
          close()
          canvas.setBoxFree(boxId, box?.free !== true)
        },
      })
      items.push({
        key: 'box-color',
        label: `${t('menu.color')}…`,
        onPick: () => { setMenu({ ...menu, view: 'box-color' }) },
      })
      // Deleting a box UNGROUPS its cards — it never deletes a conversation.
      items.push({
        key: 'delete-box',
        icon: 'delete',
        label: t('menu.deleteBox'),
        danger: true,
        onPick: () => {
          close()
          deleteBox(boxId)
        },
      })
    }
    const searchable = menu.view === 'import-ws' || menu.view === 'import-session'
    return {
      left: menu.left,
      top: menu.top,
      ...(title !== undefined ? { title } : {}),
      ...(searchable ? { searchable } : {}),
      items,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, workspaces.items, sessions, boardSessionIds, boxes, pages, activePage, wsTitles, canvasState.cards, canvasState.edges, canvasState.digests, locale])

  const savedCamera = canvas.savedCamera(pageCameraKey(activePage))
  const hasContent = Object.keys(visibleCards).length > 0 || Object.keys(frameRects).length > 0

  return (
    <div
      ref={wrapperRef}
      className={`${styles['canvas']}${connecting ? ` ${styles['canvasConnecting']}` : ''}`}
      onDoubleClick={(event) => {
        const target = event.target as HTMLElement
        // A double-click on a box LABEL renames the box. The label is also the
        // frame's drag handle, so React Flow turns the second press into a drag
        // and the browser reports the PANE as the dblclick target — the label's
        // own pointer-down is what tells us the gesture really started there.
        const labelPress = lastLabelPress.current
        if (labelPress !== null && Date.now() - labelPress.at < 600 && boxes[labelPress.boxId] !== undefined) {
          lastLabelPress.current = null
          setRenameTarget({ kind: 'box', id: labelPress.boxId, title: boxes[labelPress.boxId].title })
          return
        }
        // React Flow renders nodes INSIDE the pane, so the pane check below is
        // true for a card as well. A card owns its own double-click (open the
        // conversation).
        const nodeElement = target.closest('.react-flow__node')
        if (nodeElement !== null) {
          const nodeId = nodeElement.getAttribute('data-id') ?? ''
          // A double-click on a BOX body (its border or the transparent middle
          // that lets the event through to the pane) starts a conversation in
          // the box's page workspace. The label chip renames the box instead.
          if (nodeId.startsWith('frame-')) {
            const boxId = nodeId.slice('frame-'.length)
            const pageId = boxes[boxId]?.pageId ?? activePage
            startSessionIn(wsTitles.has(pageId) ? pageId : undefined)
          }
          return
        }
        if (target.closest('.react-flow__pane') === null) return
        // Empty canvas: the box under the pointer decides the workspace (if any).
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })
        startSessionIn(workspaceAt(position.x, position.y))
      }}
      onContextMenu={(event) => { event.preventDefault() }}
      onClick={() => { if (menu !== null) setMenu(null) }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={() => {
          // A fresh drag always starts clean — a cancel flag left over from
          // a path that never reached onConnectEnd must not eat this one.
          connectCancelledRef.current = false
          setConnecting(true)
        }}
        onConnectEnd={onConnectEnd}
        connectionMode={ConnectionMode.Loose}
        onSelectionStart={onSelectionStart}
        onSelectionEnd={onSelectionEnd}
        onNodeClick={(event, node) => {
          // Batch mode: the card's own onPick already handled the click.
          if (batchMode) return
          // A single left click on a card jumps straight into that conversation.
          if (node.type === 'sessionCard') {
            const data = (node as SessionCardNodeType).data
            if (!data.ghost) openSession(data.sessionId)
            return
          }
          if (node.type !== 'wsFrame') return
          // Click-only frame selection (React Flow never selects frames). A
          // selected frame owns the colour toolbar.
          const frameId = node.id
          setSelectedIds((previous) => {
            if (event.shiftKey) {
              const next = new Set(previous)
              if (next.has(frameId)) next.delete(frameId)
              else next.add(frameId)
              return next
            }
            return new Set([frameId])
          })
        }}
        onPaneContextMenu={(event) => { openMenu(event as MouseEvent, 'pane') }}
        onNodeContextMenu={(event, node) => {
          if (node.type === 'sessionCard') openMenu(event, 'card', node.id)
          else if (node.type === 'wsFrame') openMenu(event, 'frame', node.id.slice('frame-'.length))
          else event.preventDefault()
        }}
        onEdgeContextMenu={(event, edge) => {
          const data = edge.data as { fromCardId?: string; toCardId?: string } | undefined
          if (data?.fromCardId !== undefined && data.toCardId !== undefined) {
            openMenu(event, 'edge', edge.id, { from: data.fromCardId, to: data.toCardId })
          } else {
            event.preventDefault()
          }
        }}
        onMoveEnd={(_event, viewport: Viewport) => {
          canvas.setCamera(pageCameraKey(activePage), viewport)
        }}
        colorMode={dark ? 'dark' : 'light'}
        // 吸附/Snap only governs what the pointer does while dragging; a FREE
        // card additionally snaps its final position on drop (onNodesChange).
        snapToGrid={snapEnabled}
        snapGrid={[GRID, GRID]}
        zoomOnDoubleClick={false}
        // Batch mode turns the pane into a selection surface: drag a box to
        // pick many cards, Shift-click to add one.
        // The canvas is a map: the mouse always pans. No rubber-band mode
        panOnDrag
        selectionOnDrag={false}
        selectionMode={SelectionMode.Partial}
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.1}
        proOptions={{ hideAttribution: true }}
        {...(savedCamera !== undefined ? { defaultViewport: savedCamera } : { fitView: hasContent })}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID} size={1} />
        <Controls showInteractive={false}>
          <ControlButton title={t('map.zoom100')} onClick={() => { void zoomTo(1, { duration: 200 }) }}>
            <span className={styles['zoomResetLabel']}>1:1</span>
          </ControlButton>
        </Controls>
      </ReactFlow>
      <PriorityRail entries={priorityEntries} cardWidth={CARD_W} onFocus={focusCard} />
      {batchMode
        ? (
            <BatchBar
              count={selectedCardIds.length}
              busy={batchBusy}
              onArchive={() => { void runBatch('archive') }}
              onDelete={() => { void runBatch('delete') }}
              onCancel={() => { setBatchMode(false); setBatchPicks(new Set()) }}
            />
          )
        : null}
      {hasContent ? null : <div className={styles['emptyHint']}>{t('map.empty')}</div>}
      {menuState !== null
        ? <ContextMenu key={menu?.view ?? 'root'} menu={menuState} onClose={() => { setMenu(null) }} />
        : null}
      {pendingSpawn !== null
        ? <SpawnPreview pending={pendingSpawn} onClose={() => { setPendingSpawn(null) }} />
        : null}
      {digestTarget !== null
        ? (
            <DigestDialog
              title={digestTarget.title}
              digest={digestTarget.digest}
              onClose={() => { setDigestTarget(null) }}
            />
          )
        : null}
      {renameTarget !== null

        ? (
            <RenameDialog
              target={renameTarget}
              onDone={(title) => {
                const target = renameTarget
                setRenameTarget(null)
                if (title === null) return
                if (target.kind === 'box') {
                  // Canvas-private: persisted in global.boxes, no RPC involved.
                  canvas.renameBox(target.id, title)
                } else {
                  setRenamedTitles(previous => ({ ...previous, [target.id]: title }))
                }
                showToast(t('toast.renamed'))
              }}
            />
          )
        : null}
      {activeDrawer !== null
        ? (
            <StackDrawer
              workspaceTitle={boxes[activeDrawer.groupId]?.title ?? wsTitles.get(activeDrawer.groupId) ?? t('frame.unknown')}
              items={drawerItems(activeDrawer.groupId)}
              links={drawerWireLinks}
              onOpenCard={(cardId) => {
                const card = visibleCards[cardId]
                // Deliberately NOT clearing the drawer: jumping into a
                // conversation and coming back should land on the same folder
                // at the same scroll position.
                if (card !== undefined) openSession(card.sessionId)
              }}
              // Right-click inside the drawer opens the SAME card menu as the
              // grid: 置顶 / 重命名 / 标为未读 / 归档 / 删除 / 批量.
              onCardMenu={(cardId, event) => { openMenu(event, 'card', cardId) }}
              // Full-text search runs on the Host (session/search), so it also
              // finds conversations that are not on this map at all.
              // Scope: this folder's workspace only. The header search is the
              // global one (see GlobalSearch).
              onSearchContent={async (query) => searchInWorkspace(activeDrawer.groupId, query)}
              onOpenSession={(sessionId) => { openSearchHit(sessionId) }}
              onReorder={(cardId, index) => { reorderInDrawer(activeDrawer.groupId, cardId, index) }}
              // Hover asks for that one hit's passage (an on-demand log read).
              onFetchContext={(sessionId, seq, query) => fetchSearchContext(sessionId, seq, query)}
              onFetchSessionHits={(sessionId, query) => fetchSessionHits(sessionId, query)}
              onClose={closeDrawer}
            />
          )
        : null}
      {toast !== null ? <div className={styles['toast']}>{toast}</div> : null}
    </div>
  )
}

/**
 * Workspace colour picker. Cards are not colourable any more; a workspace frame
 * is, and this appears as soon as one is selected (click its label or border).
 */
function BatchBar(props: {
  count: number
  busy: boolean
  onArchive: () => void
  onDelete: () => void
  onCancel: () => void
}): React.JSX.Element {
  return (
    <div className={styles['batchBar']} role="toolbar" aria-label={t('batch.title')}>
      <span className={styles['batchCount']}>{t('batch.count', { n: String(props.count) })}</span>
      <span className={styles['batchSpace']} />
      <button
        type="button"
        className={styles['batchAction']}
        disabled={props.busy || props.count === 0}
        onClick={props.onArchive}
      >
        {t('batch.archive')}
      </button>
      <button
        type="button"
        className={`${styles['batchAction']} ${styles['batchDanger']}`}
        disabled={props.busy || props.count === 0}
        onClick={props.onDelete}
      >
        {t('batch.delete')}
      </button>
      <button
        type="button"
        className={styles['batchAction']}
        disabled={props.busy}
        onClick={props.onCancel}
      >
        {t('batch.cancel')}
      </button>
    </div>
  )
}

/** Derived fork links are not drawn: one kind of line, the ones the user made. */
const DRAW_LINEAGE_LINKS = true

export function MapCanvas(props: RootSlotStandardProps): React.JSX.Element {
  const canvasState = useSyncExternalStore(canvas.subscribe, canvas.get)

  useEffect(() => {
    canvas.ensureLoaded()
    canvas.refresh()
    return canvas.connect()
  }, [])

  if (canvasState.phase === 'error') {
    return (
      <div className={styles['canvas']}>
        <div className={styles['emptyHint']}>
          {t('map.loadError')} {canvasState.error}
          <button
            type="button"
            className={styles['cardRemove']}
            style={{ marginLeft: 8 }}
            onClick={() => { canvas.reload() }}
          >
            {t('map.retry')}
          </button>
        </div>
      </div>
    )
  }
  if (canvasState.phase !== 'ready') {
    return (
      <div className={styles['canvas']}>
        <div className={styles['emptyHint']}>{t('map.loading')}</div>
      </div>
    )
  }
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}

export type { CanvasState }
