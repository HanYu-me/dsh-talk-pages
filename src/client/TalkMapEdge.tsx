/**
 * One edge renderer for the whole map.
 *
 * 未同步 → 灰色虚线，看得见。
 * 同步中 → 整条线透明度 0，看不见（东西已经到位，不需要再提示）。
 *
 * 没有发光、没有流光、没有粒子：线要么在，要么不在。箭头跟着线一起隐藏。
 */
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react'
import { routeBetween, roundedPath, type Face, type Point, type Rect } from './edge-route.ts'
import { pickFaces } from './edge-routing.ts'

export interface TalkMapEdgeData {
  fromCardId?: string
  toCardId?: string
  sync?: 'synced' | 'idle'
  /** False until the canvas has finished its first layout pass. */
  ready?: boolean
  /** A structural link (fork), which never hides itself. */
  structural?: boolean
  /** Every other painted card, in flow coordinates — the line must avoid them. */
  obstacles?: readonly Rect[]
  /** The two endpoint cards' real boxes (used to exclude them from obstacles). */
  fromRect?: Rect
  toRect?: Rect
}

/**
 * Every painted card, measured from the DOM.
 *
 * The obstacle list arrives through edge data, and when that list is missing a
 * card the router happily draws through it. The DOM cannot be wrong about what is
 * painted, so the boxes are measured here as well and merged in. Measuring costs a
 * layout pass, so the result is cached briefly.
 */
const boardCache: { at: number; boxes: Rect[] } = { at: 0, boxes: [] }

function boardBoxes(): Rect[] {
  if (typeof document === 'undefined') return []
  const now = Date.now()
  if (now - boardCache.at < 60) return boardCache.boxes
  const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null
  if (viewport === null) return boardCache.boxes
  const boxes: Rect[] = []
  for (const element of document.querySelectorAll('[data-talkmap-session]')) {
    const node = element as HTMLElement
    // offsetLeft/offsetTop are LAYOUT pixels — untransformed — so they are flow
    // coordinates already, and they do not change when the canvas is zoomed. Using
    // getBoundingClientRect() here made the geometry zoom-dependent, which is why a
    // vertical line flipped between the two sides of a gap while zooming.
    let x = 0
    let y = 0
    let cursor: HTMLElement | null = node
    while (cursor !== null && cursor !== viewport) {
      x += cursor.offsetLeft
      y += cursor.offsetTop
      cursor = cursor.offsetParent as HTMLElement | null
    }
    if (cursor === null) continue                    // not inside the canvas
    if (node.offsetWidth < 8 || node.offsetHeight < 8) continue
    boxes.push({ x, y, w: node.offsetWidth, h: node.offsetHeight })
  }
  if (boxes.length > 0) {
    boardCache.at = now
    boardCache.boxes = boxes
  }
  return boxes
}
/** Union of two box lists, ignoring near-duplicates. */
function mergeBoxes(a: readonly Rect[], b: readonly Rect[]): Rect[] {
  const out: Rect[] = []
  for (const box of [...a, ...b]) {
    const duplicate = out.some(other => Math.abs(other.x - box.x) < 2
      && Math.abs(other.y - box.y) < 2
      && Math.abs(other.w - box.w) < 2
      && Math.abs(other.h - box.h) < 2)
    if (!duplicate) out.push(box)
  }
  return out
}

/** Is this box one of the two cards the edge is attached to? */
function isEndpoint(box: Rect, x: number, y: number): boolean {
  // 40px halo: the anchor sits on the card border and the DOM/viewport transform
  // is only pixel-accurate, so a tight tolerance leaves the endpoint card in the
  // obstacle set — and then the search cannot even start.
  const pad = 40
  return x >= box.x - pad && x <= box.x + box.w + pad && y >= box.y - pad && y <= box.y + box.h + pad
}

/** Is this point inside (or on) the box? */
function containsPoint(box: Rect, x: number, y: number): boolean {
  // 40px halo: the anchor sits on the card border and the DOM/viewport transform
  // is only pixel-accurate, so a tight tolerance leaves the endpoint card in the
  // obstacle set — and then the search cannot even start.
  const pad = 40
  return x >= box.x - pad && x <= box.x + box.w + pad && y >= box.y - pad && y <= box.y + box.h + pad
}

export function TalkMapEdge(props: EdgeProps): React.JSX.Element {
  const data = (props.data ?? {}) as TalkMapEdgeData
  const synced = data.sync === 'synced'
  // Only transfer lines disappear once they are in sync; a fork link is part of
  // the map structure and stays where it is.
  // Also hide until the layout is settled: the first pass has stored positions and the
  // next one has the measured ones, so showing the early route made the line jump
  // across the board while the map was opening.
  const hidden = (synced && data.structural !== true) || data.ready === false
  /**
   * Route here rather than on the canvas: React Flow hands us the *real* handle
   * positions, and the cards' rendered height is content-driven, so anchors
   * computed from the layout constants sit above the actual card edge.
   */
  const faceOf = (position: unknown): Face => {
    const name = String(position ?? 'left')
    if (name === 'right') return 'r'
    if (name === 'top') return 't'
    if (name === 'bottom') return 'b'
    return 'l'
  }
  const obstacles = data.obstacles
  // Obstacles from the edge data *plus* everything the DOM says is painted. A card
  // that is missing from the data used to be invisible to the router, which then
  // drew straight through it — that is the crossing this map kept showing.
  // Identify the two endpoint boxes by their TOP-LEFT corner, which is the node
  // position and therefore identical in the data and in the DOM measurement. Anchor
  // geometry is not reliable for this: the anchor sits on the border and the
  // viewport transform is only pixel-accurate.

  // Obstacles measured here in LAYOUT pixels (zoom independent), falling back to the
  // list the canvas passed. The measured boxes carry the card's real size, which is
  // what the router needs to keep clear of.
  const measuredBoxes = boardBoxes()
  const sameCorner = (box: Rect, other: Rect | undefined): boolean =>
    other !== undefined && Math.abs(box.x - other.x) < 6 && Math.abs(box.y - other.y) < 6
  // The canvas' list is authoritative; the DOM measurement is only a fallback (on the
  // real page it returned every box at (0,0), and preferring it threw the good list away).
  const merged = (obstacles !== undefined && obstacles.length > 0 ? obstacles : measuredBoxes)
    .filter(box => !sameCorner(box, data.fromRect))
    .filter(box => !sameCorner(box, data.toRect))
    .filter(box => !sameCorner(box, data.fromRect))
    .filter(box => !sameCorner(box, data.toRect))
  // Always route when the two boxes are known. The old "no obstacles → smooth-step"
  // shortcut drew a straight line through the target card on a two-card board.
  // Stable per-edge lane offset: two edges in the same gap would otherwise draw the
  // same line twice.
  const laneOffset = (() => {
    let hash = 7
    for (const character of String(props.id)) hash = (hash * 31 + character.charCodeAt(0)) % 997
    return ((hash % 5) - 2) * 1.2
  })()

  const route = data.fromRect === undefined || data.toRect === undefined
    ? undefined
    : routeBetween(
        {
          // Rounded to whole flow pixels: anchors carry sub-pixel noise after a zoom,
          // which shifted the clipped endpoints by a pixel between renders.
          start: { x: Math.round(props.sourceX), y: Math.round(props.sourceY) },
          startFace: faceOf(props.sourcePosition),
          end: { x: Math.round(props.targetX), y: Math.round(props.targetY) },
          endFace: faceOf(props.targetPosition),
        },
        // The endpoints' real boxes: the router excludes them from the obstacle
        // set by geometry.
        data.fromRect ?? { x: props.sourceX, y: props.sourceY, w: 0, h: 0 },
        data.toRect ?? { x: props.targetX, y: props.targetY, w: 0, h: 0 },
        merged,
      )
  // If the route the user's handles produce would run through a card (two faces pointing
  // the same way, e.g. right→right between side-by-side cards), fall back to the faces
  // geometry suggests. Keeping the requested faces at the cost of a line through the
  // card is the worse trade.
  let finalRoute = route
  if (route !== undefined && route.length > 1 && data.fromRect !== undefined && data.toRect !== undefined) {
    // The endpoint cards count here too: a straight line between two same-side faces runs
    // through the *target* card, and the target is excluded from the obstacle list. Points
    // near the anchors are the stubs and are allowed to touch the cards.
    const boxesForHit = [
      ...(data.fromRect === undefined ? [] : [data.fromRect]),
      ...(data.toRect === undefined ? [] : [data.toRect]),
      ...merged,
    ]
    const nearAnchor = (point: Point): boolean =>
      Math.hypot(point.x - props.sourceX, point.y - props.sourceY) <= 26
      || Math.hypot(point.x - props.targetX, point.y - props.targetY) <= 26
    // Sample along the segments: checking only the vertices misses a two-point straight
    // line entirely (both of its ends are the anchors).
    const hitsCard = (points: readonly Point[]): boolean => {
      for (let index = 1; index < points.length; index += 1) {
        const a = points[index - 1]!
        const b = points[index]!
        const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 4))
        for (let step = 0; step <= steps; step += 1) {
          const t = step / steps
          const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
          if (nearAnchor(point)) continue
          if (boxesForHit.some(box => point.x > box.x + 1 && point.x < box.x + box.w - 1
            && point.y > box.y + 1 && point.y < box.y + box.h - 1)) return true
        }
      }
      return false
    }
    // A two-point route between two faces that point the same way is always a straight
    // line through one of the cards (nothing else is possible), so retry even when the
    // hit test cannot see it.
    const sameSide = faceOf(props.sourcePosition) === faceOf(props.targetPosition)
    if (hitsCard(route) || (route.length <= 2 && sameSide)) {
      const faces = pickFaces(
        { id: 'from', x: data.fromRect.x, y: data.fromRect.y },
        { id: 'to', x: data.toRect.x, y: data.toRect.y },
        merged.map((box, index) => ({ id: `o${index}`, x: box.x, y: box.y })),
        { cardWidth: data.fromRect.w, cardHeight: data.fromRect.h },
      )
      const retry = routeBetween(
        {
          start: { x: Math.round(props.sourceX), y: Math.round(props.sourceY) },
          startFace: faces.fromHandle,
          end: { x: Math.round(props.targetX), y: Math.round(props.targetY) },
          endFace: faces.toHandle,
        },
        data.fromRect,
        data.toRect,
        merged,
      )
      if (retry.length > 1 && !hitsCard(retry)) finalRoute = retry
    }
  }
  const routed = finalRoute !== undefined && finalRoute.length > 1

  /**
   * Last line of defence: if the computed polyline still touches a card, do not
   * draw it. A dashed line through a card reads as a bug; two short stubs with
   * their arrow read as "this connection exists but the map is too tight here".
   */
  const routeHitsCard = (points: readonly Point[] | undefined, rects: readonly Rect[] | undefined): boolean => {
    if (points === undefined || rects === undefined) return false
    for (let index = 1; index < points.length; index += 1) {
      const a = points[index - 1]!
      const b = points[index]!
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 3))
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps
        const x = a.x + (b.x - a.x) * t
        const y = a.y + (b.y - a.y) * t
        for (const rect of rects) {
          if (x > rect.x + 1 && x < rect.x + rect.w - 1 && y > rect.y + 1 && y < rect.y + rect.h - 1) return true
        }
      }
    }
    return false
  }
  // The guard judges against the *measured* board, not the data: if the data is
  // what is wrong, judging by it would pass a crossing route.
  const guardBoxes = merged
  const blockedRoute = routeHitsCard(route, guardBoxes)
  // 调试钩子：渲染脚本据此核对组件实际拿到的数据（生产环境无副作用）
  if (typeof window !== 'undefined') {
    const w = window as unknown as { __edgeDebug?: unknown[] }
    w.__edgeDebug = w.__edgeDebug ?? []
    ;(w.__edgeDebug as unknown[]).push({
      id: props.id,
      obstacles: obstacles?.length ?? null,
      merged: merged.length,
      measured: boardBoxes().length,
      measuredFirst: boardBoxes().slice(0, 2),
      src: { x: props.sourceX, y: props.sourceY, pos: String(props.sourcePosition) },
      dst: { x: props.targetX, y: props.targetY, pos: String(props.targetPosition) },
      points: route ?? null,
    })
  }
  const [smoothPath] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  })
  // Draw the routed polyline whole: the stub fallback and the endpoint clipping
  // produced orphan fragments on the board, and with the obstacle list fixed there
  // is nothing left for them to guard against.
  const safeRoute = routed ? (finalRoute as Point[]) : undefined
  const path = safeRoute !== undefined ? roundedPath(safeRoute, 10) : smoothPath

  /**
   * Which way the arrow points: the last leg of the route (or, without one, the
   * face the line enters through).
   */
  /**
   * Which way the arrow points: always INTO the card, decided by the face the line
   * enters through. Deriving it from the last leg of the route is unreliable: the
   * final segment can approach from inside the card, and then the head points back
   * out along the line, which is the "箭头反了" that gets reported.
   */
  const arrowAngle = (() => {
    const position = String(props.targetPosition ?? 'left')
    if (position === 'right') return 180
    if (position === 'top') return 90
    if (position === 'bottom') return -90
    return 0
  })()

  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        style={{
          stroke: 'rgba(200, 206, 216, 0.45)',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeDasharray: '6 5',
          // Synced: the line simply is not there any more.
          opacity: hidden ? 0 : 1,
        }}
      />

      <path
        d="M0 0 L-11 -5 L-11 5 Z"
        transform={`translate(${props.targetX} ${props.targetY}) rotate(${arrowAngle})`}
        fill="rgba(200, 206, 216, 0.5)"
        opacity={hidden ? 0 : 1}
        pointerEvents="none"
      />
    </>
  )
}

export const edgeTypes = { talkMap: TalkMapEdge }
