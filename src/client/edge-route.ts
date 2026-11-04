/**
 * Orthogonal edge routing that goes around cards.
 *
 * Straight/L-shaped connectors happily cut through whatever card happens to sit
 * between two endpoints. This module routes on a coarse orthogonal grid built
 * from **the centres of the gaps between cards**, so a line that cannot go direct
 * leaves through the nearest channel and comes back — never over a card body.
 *
 * Pure on purpose: routing is the part worth testing, the canvas is not.
 */

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type Face = 't' | 'r' | 'b' | 'l'

export interface Point {
  x: number
  y: number
}

/** 诊断用：最近一次路由的内部计数（仅调试脚本读取）。 */
export const __routeDebug: Record<string, unknown> = {}

export interface RouteOptions {
  /** Clearance kept between a line and any card. */
  margin?: number
  /** Straight run out of the handle before the line may turn. */
  stub?: number
  /** Gaps narrower than this are treated as impassable. */
  minCorridor?: number
}

const DEFAULTS = { margin: 4, stub: 22, minCorridor: 10 }

/** Cost of putting the line through a card. Large enough to never be preferred. */
const CROSS_PENALTY = 5_000_000

/** Middle of the face an edge leaves from. */
export function anchorOf(rect: Rect, face: Face): Point {
  switch (face) {
    case 'r': return { x: rect.x + rect.w, y: rect.y + rect.h / 2 }
    case 'l': return { x: rect.x, y: rect.y + rect.h / 2 }
    case 't': return { x: rect.x + rect.w / 2, y: rect.y }
    default: return { x: rect.x + rect.w / 2, y: rect.y + rect.h }
  }
}

/** Outward unit direction of a face. */
export function normalOf(face: Face): Point {
  switch (face) {
    case 'r': return { x: 1, y: 0 }
    case 'l': return { x: -1, y: 0 }
    case 't': return { x: 0, y: -1 }
    default: return { x: 0, y: 1 }
  }
}

function expand(rect: Rect, by: number): Rect {
  return { x: rect.x - by, y: rect.y - by, w: rect.w + by * 2, h: rect.h + by * 2 }
}

function insideStrict(rect: Rect, point: Point): boolean {
  return point.x > rect.x && point.x < rect.x + rect.w
    && point.y > rect.y && point.y < rect.y + rect.h
}

/** Does a horizontal run at `y` between `x1` and `x2` hit any rect? */
/**
 * How many cards a run crosses.
 *
 * Counting (instead of a hard yes/no) lets the search treat a crossing as a legal
 * but ruinously expensive move: with no clean route left the edge still comes out
 * as the least-bad polyline, never the old straight line through everything.
 */
export function __hitsH(rects: Rect[], y: number, x1: number, x2: number): number { return hitsHorizontal(rects, y, x1, x2) }

function hitsHorizontal(rects: Rect[], y: number, x1: number, x2: number): number {
  const lo = Math.min(x1, x2)
  const hi = Math.max(x1, x2)
  let count = 0
  for (const rect of rects) {
    if (y <= rect.y || y >= rect.y + rect.h) continue
    if (hi <= rect.x || lo >= rect.x + rect.w) continue
    count += 1
  }
  return count
}

/** Cards crossed by a vertical run at `x` between `y1` and `y2`. */
export function __hitsV(rects: Rect[], x: number, y1: number, y2: number): number { return hitsVertical(rects, x, y1, y2) }

function hitsVertical(rects: Rect[], x: number, y1: number, y2: number): number {
  const lo = Math.min(y1, y2)
  const hi = Math.max(y1, y2)
  let count = 0
  for (const rect of rects) {
    if (x <= rect.x || x >= rect.x + rect.w) continue
    if (hi <= rect.y || lo >= rect.y + rect.h) continue
    count += 1
  }
  return count
}

/**
 * Centres of the empty channels between cards, per axis.
 *
 * Cards are clustered into bands along the axis; every gap wide enough to route
 * through contributes its midpoint — that is what makes lines pass through the
 * *middle* of a gap rather than hugging one card.
 */
/** Merged [start, end] spans of the cards along one axis. */
export function bands(rects: Rect[], axis: 'x' | 'y'): { start: number; end: number }[] {
  const spans = rects
    .map(rect => (axis === 'x'
      ? { start: rect.x, end: rect.x + rect.w }
      : { start: rect.y, end: rect.y + rect.h }))
    .sort((a, b) => a.start - b.start)

  const out: { start: number; end: number }[] = []
  for (const span of spans) {
    const last = out[out.length - 1]
    if (last !== undefined && span.start <= last.end) {
      last.end = Math.max(last.end, span.end)
    } else {
      out.push({ ...span })
    }
  }
  return out
}

export function corridors(rects: Rect[], axis: 'x' | 'y', minCorridor: number): number[] {
  const merged = bands(rects, axis)
  const out: number[] = []
  for (let index = 1; index < merged.length; index += 1) {
    const gap = merged[index]!.start - merged[index - 1]!.end
    if (gap >= minCorridor) out.push((merged[index - 1]!.end + merged[index]!.start) / 2)
  }
  return out
}

/**
 * Lines that run just outside the whole cluster of cards.
 *
 * Without these the grid only had channels *between* cards, so a card sitting on
 * the direct run left the search nothing to go through and it fell back to a
 * crossing line.
 */
export function outerLines(rects: Rect[], axis: 'x' | 'y', clearance: number): number[] {
  const merged = bands(rects, axis)
  const out: number[] = []
  for (const band of merged) {
    out.push(band.start - clearance, band.end + clearance)
  }
  return out
}

class Heap {
  private items: { key: number; cost: number; node: string }[] = []

  push(cost: number, key: number, node: string): void {
    this.items.push({ cost, key, node })
    let index = this.items.length - 1
    while (index > 0) {
      const parent = (index - 1) >> 1
      if (this.items[parent]!.cost <= this.items[index]!.cost) break
      const tmp = this.items[parent]!
      this.items[parent] = this.items[index]!
      this.items[index] = tmp
      index = parent
    }
  }

  pop(): { key: number; node: string } | undefined {
    if (this.items.length === 0) return undefined
    const top = this.items[0]!
    const last = this.items.pop()!
    if (this.items.length > 0) {
      this.items[0] = last
      let index = 0
      for (;;) {
        const left = index * 2 + 1
        const right = left + 1
        let smallest = index
        if (left < this.items.length && this.items[left]!.cost < this.items[smallest]!.cost) smallest = left
        if (right < this.items.length && this.items[right]!.cost < this.items[smallest]!.cost) smallest = right
        if (smallest === index) break
        const tmp = this.items[smallest]!
        this.items[smallest] = this.items[index]!
        this.items[index] = tmp
        index = smallest
      }
    }
    return { key: top.key, node: top.node }
  }

  get size(): number {
    return this.items.length
  }
}

function dedupe(values: number[], epsilon = 0.5): number[] {
  const sorted = [...values].sort((a, b) => a - b)
  const out: number[] = []
  for (const value of sorted) {
    if (out.length === 0 || Math.abs(value - out[out.length - 1]!) > epsilon) out.push(value)
  }
  return out
}

/** Collapse repeated and collinear points. */
export function simplify(points: Point[]): Point[] {
  const out: Point[] = []
  for (const point of points) {
    const last = out[out.length - 1]
    if (last !== undefined && Math.abs(last.x - point.x) < 0.5 && Math.abs(last.y - point.y) < 0.5) continue
    out.push(point)
  }
  for (let index = 1; index < out.length - 1;) {
    const a = out[index - 1]!
    const b = out[index]!
    const c = out[index + 1]!
    const collinear = (Math.abs(a.x - b.x) < 0.5 && Math.abs(b.x - c.x) < 0.5)
      || (Math.abs(a.y - b.y) < 0.5 && Math.abs(b.y - c.y) < 0.5)
    if (collinear) out.splice(index, 1)
    else index += 1
  }
  return out
}

/**
 * Route from one face of `from` to one face of `to`, staying out of every card.
 *
 * Falls back to a plain L when the grid cannot find a way (dense boards): a
 * crossing line is still better than no line at all.
 */
export function routeEdge(
  from: Rect,
  to: Rect,
  fromFace: Face,
  toFace: Face,
  obstacles: readonly Rect[],
  options: RouteOptions = {},
): Point[] {
  return routeBetween(
    { start: anchorOf(from, fromFace), startFace: fromFace, end: anchorOf(to, toFace), endFace: toFace },
    from,
    to,
    obstacles,
    options,
  )
}

export interface RouteEnds {
  start: Point
  startFace: Face
  end: Point
  endFace: Face
}

/**
 * Same search, but with the anchor points handed in.
 *
 * The canvas knows the real handle position (React Flow reports it) while the
 * cards' rendered height is content-driven — deriving anchors from the layout
 * constants put the lines a dozen pixels above the actual card edge.
 */
/**
 * Nudge every interior run onto the middle of the gap it travels through.
 *
 * The A* result is already orthogonal and clear of cards, but its first turn can
 * land wherever the stub ends — a run at 50% off the gap centre still looks like
 * "the line is hugging a card". Moving whole segments keeps the path orthogonal.
 */
/**
 * Centre every interior run in the gap it actually passes through.
 *
 * The global band model is useless on a busy board: cards from different folders
 * sit at different heights, their row spans merge into one continuous band, and
 * then there is no channel anywhere to align to — lines end up running along the
 * 14px stub, i.e. hugging a card border.
 *
 * So this works per run: look at the nearest card above and below (for a
 * horizontal run) whose span overlaps the run itself, and move the run to the
 * midpoint between them. A run that no longer fits is left alone.
 */
export function snapToChannels(
  points: Point[],
  obstacles: readonly Rect[],
  margin: number,
): Point[] {
  if (points.length < 3) return points
  const rects = obstacles as Rect[]

  const centreFor = (
    horizontal: boolean,
    fixed: number,
    lo: number,
    hi: number,
  ): number | undefined => {
    let low = -Infinity      // card edge on the "before" side
    let high = Infinity      // card edge on the "after" side
    for (const rect of rects) {
      // does the card overlap the run's own span?
      if (horizontal) {
        if (rect.x + rect.w <= lo || rect.x >= hi) continue
        if (rect.y + rect.h <= fixed + 0.5) low = Math.max(low, rect.y + rect.h)
        else if (rect.y >= fixed - 0.5) high = Math.min(high, rect.y)
      } else {
        if (rect.y + rect.h <= lo || rect.y >= hi) continue
        if (rect.x + rect.w <= fixed + 0.5) low = Math.max(low, rect.x + rect.w)
        else if (rect.x >= fixed - 0.5) high = Math.min(high, rect.x)
      }
    }
    if (!Number.isFinite(low) || !Number.isFinite(high)) return undefined
    const gap = high - low
    if (gap < margin * 2 + 6) return undefined
    return (low + high) / 2
  }

  const out = points.map(point => ({ ...point }))
  const last = out.length - 1
  const horizontalSegment = (index: number): boolean =>
    Math.abs(out[index - 1]!.y - out[index]!.y) < 0.6
  const fromStubHorizontal = horizontalSegment(1)
  const toStubHorizontal = horizontalSegment(last)

  for (let index = 1; index < last; index += 1) {
    const a = out[index - 1]!
    const b = out[index]!
    const horizontalRun = Math.abs(a.y - b.y) < 0.6
    if (index === 1 && horizontalRun === fromStubHorizontal) continue
    if (index === last - 1 && horizontalRun === toStubHorizontal) continue

    const lo = horizontalRun ? Math.min(a.x, b.x) : Math.min(a.y, b.y)
    const hi = horizontalRun ? Math.max(a.x, b.x) : Math.max(a.y, b.y)
    const centre = centreFor(horizontalRun, horizontalRun ? a.y : a.x, lo, hi)
    if (centre === undefined) continue
    if (horizontalRun) {
      if (Math.abs(centre - a.y) < 0.6) continue
      a.y = centre
      b.y = centre
    } else {
      if (Math.abs(centre - a.x) < 0.6) continue
      a.x = centre
      b.x = centre
    }
  }

  const candidate = simplify(out)

  // Safety net: a centred run must still not touch a card. If moving broke that,
  // keep the original path.
  const sameRectSet = (point: Point): boolean => rects.some(rect =>
    point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h)
  for (let index = 1; index < candidate.length; index += 1) {
    const a = candidate[index - 1]!
    const b = candidate[index]!
    const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 4))
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      if (sameRectSet({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) return points
    }
  }
  return candidate
}
function routeRaw(
  ends: RouteEnds,
  from: Rect,
  to: Rect,
  obstacles: readonly Rect[],
  options: RouteOptions = {},
): Point[] {
  const margin = options.margin ?? DEFAULTS.margin
  const stub = options.stub ?? DEFAULTS.stub
  const minCorridor = options.minCorridor ?? DEFAULTS.minCorridor

  const start = ends.start
  const end = ends.end
  const startNormal = normalOf(ends.startFace)
  const endNormal = normalOf(ends.endFace)

  /**
   * How much room there is straight out of a handle before the next card.
   *
   * The stub used to be a fixed 22px; on a tight layout that put the first turn
   * *inside* the neighbouring card's clearance box, the search had no legal move,
   * and the whole edge fell back to a straight line through cards.
   */
  const spaceAhead = (point: Point, normal: Point): number => {
    let best = 240
    // expanded boxes — the clearance the router will actually enforce
    for (const raw of obstacles as Rect[]) {
      const rect = expand(raw, margin)
      if (normal.x !== 0) {
        if (point.y <= rect.y || point.y >= rect.y + rect.h) continue
        if (normal.x > 0 && rect.x >= point.x) best = Math.min(best, rect.x - point.x)
        if (normal.x < 0 && rect.x + rect.w <= point.x) best = Math.min(best, point.x - (rect.x + rect.w))
      } else {
        if (point.x <= rect.x || point.x >= rect.x + rect.w) continue
        if (normal.y > 0 && rect.y >= point.y) best = Math.min(best, rect.y - point.y)
        if (normal.y < 0 && rect.y + rect.h <= point.y) best = Math.min(best, point.y - (rect.y + rect.h))
      }
    }
    return best
  }
  const stubFor = (space: number): number => {
    // half the free lane minus a margin at each side: the turn lands mid-gap
    const half = Math.max(0, (space - margin * 2) / 2)
    return Math.max(4, Math.min(stub, half))
  }
  // At least margin+3 long, so the stub point sits outside the endpoint card's
  // expanded box — otherwise the first grid point is unreachable and the search
  // collapses to the fallback.
  const minStub = margin + 3
  const startStubLength = Math.max(stubFor(spaceAhead(start, startNormal)), minStub)
  // expanded box — otherwise the first grid point is unreachable and the whole
  // flipped normal measured the empty side instead, so the stub never shortened and
  // on a 24px gap it punched straight into the neighbouring card.
  const endStubLength = Math.max(stubFor(spaceAhead(end, endNormal)), minStub)
  const startStub = {
    x: start.x + startNormal.x * startStubLength,
    y: start.y + startNormal.y * startStubLength,
  }
  const endStub = {
    x: end.x + endNormal.x * endStubLength,
    y: end.y + endNormal.y * endStubLength,
  }

  // Blocked bodies: everything except the two endpoints themselves.
  //
  // Compared by geometry, not identity: callers routinely pass a fresh object for
  // the same card (one for the anchor maths, one inside the obstacle list), and an
  // identity check then treats the endpoints as obstacles — the search finds no
  // legal first move and every line falls back to a straight L through the board.
  const sameRect = (a: Rect, b: Rect): boolean => Math.abs(a.x - b.x) < 0.5
    && Math.abs(a.y - b.y) < 0.5
    && Math.abs(a.w - b.w) < 0.5
    && Math.abs(a.h - b.h) < 0.5
  // A card that physically overlaps one of the endpoints cannot be avoided by any
  // route — the two bodies are in the same place. Treat it as part of the endpoint
  // rather than letting the whole search fail (which used to fall back to a straight
  // line through everything).
  const overlaps = (a: Rect, b: Rect): boolean =>
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  // The endpoints are obstacles too: the only place a line may be inside them is
  // the stub (drawn separately, never routed). Excluding them let a route reach a
  // left face by running through the card body from the right.
  const blocked = [...obstacles, ...(sameRect(from, to) ? [] : [from, to])]
    .map(rect => expand(rect, margin))
  __routeDebug.blockedCount = blocked.length
  __routeDebug.blockedFirst = blocked.slice(0, 2)

  /**
   * Obstacle-aware last resort.
   *
   * If the grid search finds nothing, do not draw a straight line through the
   * board: try the four "go around the outside of everything" shapes and keep the
   * first one that crosses nothing, else the one with the fewest crossings.
   */
  const makeFallback = (): Point[] => {
    if (blocked.length === 0) return simplify([start, startStub, { x: endStub.x, y: startStub.y }, endStub, end])
    const gap = margin + 8
    const left = Math.min(...blocked.map(rect => rect.x)) - gap
    const right = Math.max(...blocked.map(rect => rect.x + rect.w)) + gap
    const top = Math.min(...blocked.map(rect => rect.y)) - gap
    const bottom = Math.max(...blocked.map(rect => rect.y + rect.h)) + gap
    // Z shapes through every candidate lane (the gutters between cards), then the
    // four "around the outside" shapes. The gutters are what makes this work on a
    // tight board: the outside lanes are usually blocked by the endpoints' own row.
    const lanesX = [...new Set([left, right, ...xsTrimmed])].sort((a, b) => Math.abs(a - startStub.x) - Math.abs(b - startStub.x))
    const lanesY = [...new Set([top, bottom, ...ysTrimmed])].sort((a, b) => Math.abs(a - startStub.y) - Math.abs(b - startStub.y))
    const candidates: Point[][] = []
    for (const lane of lanesY.slice(0, 8)) {
      candidates.push([start, startStub, { x: startStub.x, y: lane }, { x: endStub.x, y: lane }, endStub, end])
    }
    for (const lane of lanesX.slice(0, 8)) {
      candidates.push([start, startStub, { x: lane, y: startStub.y }, { x: lane, y: endStub.y }, endStub, end])
    }
    candidates.push([start, startStub, { x: left, y: startStub.y }, { x: left, y: endStub.y }, endStub, end])
    candidates.push([start, startStub, { x: right, y: startStub.y }, { x: right, y: endStub.y }, endStub, end])
    // Around the pair's own bounding box: two faces pointing the same way
    // (left→left, right→right, top→top, bottom→bottom) force the line to wrap
    // around the other card, which no lane above is guaranteed to do.
    const pairTop = Math.min(from.y, to.y) - margin - 8
    const pairBottom = Math.max(from.y + from.h, to.y + to.h) + margin + 8
    const pairLeft = Math.min(from.x, to.x) - margin - 8
    const pairRight = Math.max(from.x + from.w, to.x + to.w) + margin + 8
    candidates.push([start, startStub, { x: startStub.x, y: pairTop }, { x: endStub.x, y: pairTop }, endStub, end])
    candidates.push([start, startStub, { x: startStub.x, y: pairBottom }, { x: endStub.x, y: pairBottom }, endStub, end])
    candidates.push([start, startStub, { x: pairLeft, y: startStub.y }, { x: pairLeft, y: endStub.y }, endStub, end])
    candidates.push([start, startStub, { x: pairRight, y: startStub.y }, { x: pairRight, y: endStub.y }, endStub, end])
    let best: Point[] | undefined
    let bestHits = Infinity
    for (const candidate of candidates) {
      const points = simplify(candidate)
      let hits = 0
      // Skip the first and last segment: those are the stubs, which are *meant* to touch
      // the endpoint cards (counting them made every candidate look dirty, so the
      // fallback always returned the straight line through the cards).
      for (let index = 2; index < points.length - 1; index += 1) {
        const a = points[index - 1]!
        const b = points[index]!
        hits += a.x === b.x
          ? hitsVertical(blocked, a.x, a.y, b.y)
          : hitsHorizontal(blocked, a.y, a.x, b.x)
      }
      if (hits < bestHits) {
        bestHits = hits
        best = points
        if (hits === 0) break
      }
    }
    return best ?? simplify([start, startStub, { x: endStub.x, y: startStub.y }, endStub, end])
  }
  __routeDebug.last = { usedFallback: true }

  // Channels between cards, plus lines just outside the whole cluster so a card
  // sitting on the direct run can still be walked around.
  // Only lines inside the window the route can plausibly use. On a real board (60+
  // cards across several folders) the full candidate set is huge, and bailing out
  // to the fallback was exactly what let lines cut through cards.
  const pad = 260
  const window = {
    x1: Math.min(start.x, end.x) - pad,
    x2: Math.max(start.x, end.x) + pad,
    y1: Math.min(start.y, end.y) - pad,
    y2: Math.max(start.y, end.y) + pad,
  }
  const near = (obstacles as Rect[]).filter(rect =>
    rect.x + rect.w >= window.x1 && rect.x <= window.x2
    && rect.y + rect.h >= window.y1 && rect.y <= window.y2)
  const withinX = (value: number): boolean => value >= window.x1 && value <= window.x2
  const withinY = (value: number): boolean => value >= window.y1 && value <= window.y2

  // Lanes come from *every* card, not just the ones inside the search window: a
  // long edge that must dodge two screens away had no lane to dodge to, so the
  // search was forced through the card instead.
  const lanes = obstacles as Rect[]
  const xs = corridors(lanes, 'x', minCorridor).filter(withinX)
  const ys = corridors(lanes, 'y', minCorridor).filter(withinY)
  const xOuter = outerLines(lanes, 'x', margin + 6).filter(withinX)
  const yOuter = outerLines(lanes, 'y', margin + 6).filter(withinY)
  // Lanes hugging each nearby card, so a block that spans a whole channel still
  // leaves somewhere to slip past. Without these, a dense board gives A* nothing
  // and the edge degrades into a straight line through everything.
  const hug = margin + 8
  const xHug = (lanes as Rect[]).flatMap(rect => [rect.x - hug, rect.x + rect.w + hug])
  const yHug = (lanes as Rect[]).flatMap(rect => [rect.y - hug, rect.y + rect.h + hug])
  const xCands = dedupe([start.x, end.x, startStub.x, endStub.x, ...xs, ...xOuter, ...xHug])
  const yCands = dedupe([start.y, end.y, startStub.y, endStub.y, ...ys, ...yOuter, ...yHug])
  // Long lines (a fork whose two cards live in different folders) make the window
  // huge, and a hard cap used to bail out to a straight L — which then cut
  // Keep the four anchor coordinates, then sample the rest evenly across the whole
  // span. Keeping only the "closest" lines dropped everything near the far end, so
  // the goal node became unreachable and the edge fell back to a straight line.
  const trim = (values: number[], mustKeep: readonly number[], limit: number): number[] => {
    if (values.length <= limit) return values
    const keep = new Set<number>(mustKeep)
    const rest = values.filter(value => !keep.has(value))
    const slots = Math.max(1, limit - keep.size)
    const stride = Math.max(1, Math.floor(rest.length / slots))
    for (let index = 0; index < rest.length && keep.size < limit; index += stride) {
      keep.add(rest[index]!)
    }
    return values.filter(value => keep.has(value))
  }
  const MAX_LINES = 72
  const xsTrimmed = xCands.length > MAX_LINES
    ? trim(xCands, [start.x, end.x, startStub.x, endStub.x], MAX_LINES)
    : xCands
  const ysTrimmed = yCands.length > MAX_LINES
    ? trim(yCands, [start.y, end.y, startStub.y, endStub.y], MAX_LINES)
    : yCands

  __routeDebug.candidates = { x: xsTrimmed.length, y: ysTrimmed.length, near: near.length }
  const corridorX = new Set(xs.map(value => Math.round(value)))
  const corridorY = new Set(ys.map(value => Math.round(value)))
  const nodeId = (ix: number, iy: number): string => `${ix},${iy}`
  const pointAt = (id: string): Point => {
    const [ix, iy] = id.split(',').map(Number)
    return { x: xsTrimmed[ix]!, y: ysTrimmed[iy]! }
  }

  const startIndex = { x: xsTrimmed.findIndex(value => Math.abs(value - startStub.x) < 0.5), y: ysTrimmed.findIndex(value => Math.abs(value - startStub.y) < 0.5) }
  const endIndex = { x: xsTrimmed.findIndex(value => Math.abs(value - endStub.x) < 0.5), y: ysTrimmed.findIndex(value => Math.abs(value - endStub.y) < 0.5) }
  if (startIndex.x < 0 || startIndex.y < 0 || endIndex.x < 0 || endIndex.y < 0) { __routeDebug.reason = 'no-index'; __routeDebug.index = { startIndex, endIndex, xs: xsTrimmed.length, ys: ysTrimmed.length }; return makeFallback() }

  const goal = { x: endStub.x, y: endStub.y }
  const startNode = nodeId(startIndex.x, startIndex.y)
  const goalNode = nodeId(endIndex.x, endIndex.y)

  const best = new Map<string, number>()
  const cameFrom = new Map<string, string>()
  const heap = new Heap()

  // State key includes the travel direction so a turn can be priced.
  const withDir = (node: string, dir: string): string => `${node}|${dir}`
  best.set(withDir(startNode, 'x'), 0)
  heap.push(0, 0, withDir(startNode, 'x'))

  const estimate = (point: Point): number => Math.abs(point.x - goal.x) + Math.abs(point.y - goal.y)

  let visited = 0
  while (heap.size > 0) {
    visited += 1
    const popped = heap.pop()!
    const state = popped.node
    const [node, dir] = state.split('|')
    const cost = best.get(state)
    if (cost === undefined) continue
    if (node === goalNode) {
      const path: Point[] = []
      let cursor: string | undefined = state
      while (cursor !== undefined) {
        const [cell] = cursor.split('|')
        path.push(pointAt(cell))
        cursor = cameFrom.get(cursor)
      }
      path.reverse()
      __routeDebug.last = { usedFallback: false, steps: path.length }
      __routeDebug.rawPath = path.map(point => [Math.round(point.x), Math.round(point.y)])
      return snapToChannels(
        simplify([start, startStub, ...path.slice(1), endStub, end]),
        obstacles as Rect[],
        margin,
      )
    }
    const [ix, iy] = node.split(',').map(Number)
    const here = pointAt(node)

    const steps: { dx: number; dy: number; axis: 'x' | 'y' }[] = [
      { dx: 1, dy: 0, axis: 'x' },
      { dx: -1, dy: 0, axis: 'x' },
      { dx: 0, dy: 1, axis: 'y' },
      { dx: 0, dy: -1, axis: 'y' },
    ]
    for (const step of steps) {
      const nx = ix + step.dx
      const ny = iy + step.dy
      if (nx < 0 || ny < 0 || nx >= xsTrimmed.length || ny >= ysTrimmed.length) continue
      const next = { x: xsTrimmed[nx]!, y: ysTrimmed[ny]! }
      const nextNode = nodeId(nx, ny)
      // Hard obstacles: a move into a card, or a run that crosses one, is simply not
      // available. Soft costs were tried and lost — on a tight board every candidate
      // was "expensive", so the cheapest path was the straight line through the card.
      if (nextNode !== goalNode && blocked.some(rect => insideStrict(rect, next))) continue
      const crossing = step.axis === 'x'
        ? hitsHorizontal(blocked, here.y, here.x, next.x)
        : hitsVertical(blocked, here.x, here.y, next.y)
      if (crossing > 0) continue

      const distance = Math.abs(next.x - here.x) + Math.abs(next.y - here.y)
      const onCorridor = step.axis === 'x'
        ? corridorY.has(Math.round(here.y))
        : corridorX.has(Math.round(here.x))
      const turn = dir === step.axis ? 0 : 18
      // Travelling along a channel is the whole point: a line that merely takes the
      // short way ends up hugging a card's border (2–3px away), which reads as
      // "the line overlaps the card". Price that heavily.
      const prefer = onCorridor ? 0 : 40
      const nextCost = cost + distance + turn + prefer
      const nextState = withDir(nextNode, step.axis)
      const known = best.get(nextState)
      if (known !== undefined && known <= nextCost) continue
      if (nextNode === goalNode) __routeDebug.goalPushed = nextState
      best.set(nextState, nextCost)
      cameFrom.set(nextState, state)
      heap.push(nextCost + estimate(next), nextCost, nextState)
    }
  }

  return makeFallback()
}

/** Orthogonal polyline → SVG path with rounded corners. */
export function roundedPath(points: Point[], radius = 10): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${round(points[0]!.x)} ${round(points[0]!.y)}`

  const parts = [`M ${round(points[0]!.x)} ${round(points[0]!.y)}`]
  for (let index = 1; index < points.length - 1; index += 1) {
    const prev = points[index - 1]!
    const here = points[index]!
    const next = points[index + 1]!
    const inLength = Math.hypot(here.x - prev.x, here.y - prev.y)
    const outLength = Math.hypot(next.x - here.x, next.y - here.y)
    const corner = Math.min(radius, inLength / 2, outLength / 2)
    if (corner < 0.5) {
      parts.push(`L ${round(here.x)} ${round(here.y)}`)
      continue
    }
    const enter = {
      x: here.x + ((prev.x - here.x) / (inLength || 1)) * corner,
      y: here.y + ((prev.y - here.y) / (inLength || 1)) * corner,
    }
    const leave = {
      x: here.x + ((next.x - here.x) / (outLength || 1)) * corner,
      y: here.y + ((next.y - here.y) / (outLength || 1)) * corner,
    }
    parts.push(`L ${round(enter.x)} ${round(enter.y)}`)
    parts.push(`Q ${round(here.x)} ${round(here.y)} ${round(leave.x)} ${round(leave.y)}`)
  }
  const last = points[points.length - 1]!
  parts.push(`L ${round(last.x)} ${round(last.y)}`)
  return parts.join(' ')
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/** 把折线裁剪到给定矩形之外：返回若干子路径（每段至少两个点）。 */
export function clipToRects(points: Point[], rects: readonly Rect[]): Point[][] {
  if (points.length < 2) return [points]
  const insideAny = (point: Point): boolean => rects.some(rect =>
    point.x > rect.x + 0.5 && point.x < rect.x + rect.w - 0.5
    && point.y > rect.y + 0.5 && point.y < rect.y + rect.h - 0.5)
  const subpaths: Point[][] = []
  let current: Point[] = []
  const flush = (): void => {
    if (current.length >= 2) subpaths.push(current)
    current = []
  }
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1]!
    const b = points[index]!
    const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2))
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps
      const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
      if (insideAny(point)) {
        flush()
      } else {
        const last = current[current.length - 1]
        if (last === undefined || Math.abs(last.x - point.x) > 0.4 || Math.abs(last.y - point.y) > 0.4) {
          current.push(point)
        }
      }
    }
  }
  flush()
  if (subpaths.length === 0) return [points]
  // Round and drop collinear samples: a fine-grained polyline would otherwise make the
  // SVG path jitter between renders (and look like a zig-zag).
  return subpaths.map(subpath => {
    const rounded = subpath.map(point => ({ x: Math.round(point.x * 2) / 2, y: Math.round(point.y * 2) / 2 }))
    const out: Point[] = []
    for (const point of rounded) {
      const last = out[out.length - 1]
      if (last !== undefined && last.x === point.x && last.y === point.y) continue
      const before = out[out.length - 2]
      if (before !== undefined && last !== undefined
        && ((before.x === last.x && last.x === point.x) || (before.y === last.y && last.y === point.y))) {
        out[out.length - 1] = point
        continue
      }
      out.push(point)
    }
    return out
  }).filter(subpath => subpath.length >= 2)
}

/**
 * Every route the canvas draws goes through here.
 *
 * `routeRaw` is the grid search. On a real board some face pairs simply cannot be joined
 * by it: two faces pointing the same way (right→right), or away from each other (left→right),
 * force the line through one of the two cards — and the search happily does that because the
 * endpoints are excluded from the obstacle set.
 *
 * So the result is verified: if it runs through either endpoint card, four "around the pair's
 * bounding box" shapes are tried instead. Those always start and end on the requested anchors
 * (the stub is unchanged), they just take the long way round.
 */
export function routeBetween(
  ends: RouteEnds,
  from: Rect,
  to: Rect,
  obstacles: readonly Rect[],
  options: RouteOptions = {},
): Point[] {
  const raw = routeRaw(ends, from, to, obstacles, options)
  const margin = options.margin ?? DEFAULTS.margin

  const near = (point: Point, anchor: Point): boolean =>
    Math.abs(point.x - anchor.x) <= 26 && Math.abs(point.y - anchor.y) <= 26
  const hits = (points: readonly Point[], boxes: readonly Rect[]): number => {
    let count = 0
    for (let index = 1; index < points.length; index += 1) {
      const a = points[index - 1]!
      const b = points[index]!
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 3))
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps
        const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
        if (near(point, ends.start) || near(point, ends.end)) continue
        for (const box of boxes) {
          const inside = point.x > box.x + 1 && point.x < box.x + box.w - 1
            && point.y > box.y + 1 && point.y < box.y + box.h - 1
          if (inside) { count += 1; continue }
          // "Close" counts too: a wrap that squeezes 2px past a card looks as broken as
          // one that crosses it.
          const dx = Math.max(box.x - point.x, 0, point.x - (box.x + box.w))
          const dy = Math.max(box.y - point.y, 0, point.y - (box.y + box.h))
          if (Math.hypot(dx, dy) < 8) count += 1
        }
      }
    }
    return count
  }

  // Verify against *every* card, not just the two endpoints: the grid search usually
  // dodges them, but when it falls back (a dense board, a long line) the result can run
  // through a third card, and that is exactly what the drawer showed.
  if (hits(raw, [from, to, ...obstacles]) === 0) return raw

  const spread = margin + 24
  const boxTop = Math.min(from.y, to.y) - spread
  const boxBottom = Math.max(from.y + from.h, to.y + to.h) + spread
  const boxLeft = Math.min(from.x, to.x) - spread
  const boxRight = Math.max(from.x + from.w, to.x + to.w) + spread

  const startNormal = normalOf(ends.startFace)
  const endNormal = normalOf(ends.endFace)
  const stubLength = Math.max(options.stub ?? DEFAULTS.stub, margin + 3)
  const startStub = {
    x: ends.start.x + startNormal.x * stubLength,
    y: ends.start.y + startNormal.y * stubLength,
  }
  const endStub = {
    x: ends.end.x + endNormal.x * stubLength,
    y: ends.end.y + endNormal.y * stubLength,
  }

  const wraps: Point[][] = [
    [ends.start, startStub, { x: startStub.x, y: boxTop }, { x: endStub.x, y: boxTop }, endStub, ends.end],
    [ends.start, startStub, { x: startStub.x, y: boxBottom }, { x: endStub.x, y: boxBottom }, endStub, ends.end],
    [ends.start, startStub, { x: boxLeft, y: startStub.y }, { x: boxLeft, y: endStub.y }, endStub, ends.end],
    [ends.start, startStub, { x: boxRight, y: startStub.y }, { x: boxRight, y: endStub.y }, endStub, ends.end],
  ]

  let best: Point[] | undefined
  let bestHits = Infinity
  let bestLength = Infinity
  for (const wrap of wraps) {
    const points = simplify(wrap)
    const wrapped = hits(points, [from, to, ...obstacles])
    let length = 0
    for (let index = 1; index < points.length; index += 1) {
      length += Math.abs(points[index]!.x - points[index - 1]!.x) + Math.abs(points[index]!.y - points[index - 1]!.y)
    }
    if (wrapped < bestHits || (wrapped === bestHits && length < bestLength)) {
      best = points
      bestHits = wrapped
      bestLength = length
    }
    if (wrapped === 0) break
  }
  // Take the wrap whenever it beats the raw route: it is verified against the cards, so
  // at worst it runs close to one — never through it.
  return bestHits === 0 && best !== undefined ? best : raw
}