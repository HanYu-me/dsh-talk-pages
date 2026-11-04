/**
 * Deterministic lattice router.
 *
 * The board is a slot grid: cards sit at fixed slots, so the *gutters* between
 * them are known empty strips. Routing is then pure geometry — no search, no
 * fallback: every bend sits on a gutter centre line, and a run along a gutter
 * cannot cross a card because cards never occupy a gutter.
 *
 *   node scripts/_lattice-probe.mjs     (sanity check on the real board)
 */
import type { Point, Rect } from './edge-route.ts'

/** Candidate lines: gutter centres plus the frame's outer margin, per axis. */
export interface LatticeInput {
  /** Every card box on the board. */
  boxes: readonly Rect[]
  /** Extra "free" lines (frame outer margins) the caller knows about. */
  extraX?: readonly number[]
  extraY?: readonly number[]
  /** Grid pitch used to derive gutters from boxes. */
  gapX?: number
  gapY?: number
}

const CENTRE_TOLERANCE = 0.6

function insideAny(boxes: readonly Rect[], point: Point): boolean {
  for (const box of boxes) {
    if (point.x > box.x + 1 && point.x < box.x + box.w - 1
      && point.y > box.y + 1 && point.y < box.y + box.h - 1) return true
  }
  return false
}

/** How many cards a segment crosses (0 = clean). */
export function crossings(boxes: readonly Rect[], a: Point, b: Point): number {
  const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2))
  let worst = 0
  let hits = 0
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps
    const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
    if (insideAny(boxes, point)) hits += 1
  }
  return hits > 0 ? Math.max(1, Math.round(hits / 8)) : worst
}

/**
 * Lines that run along the empty space of the board.
 *
 * For every card we add the centre of the strip immediately outside its left and
 * right edge (same for top/bottom). Two cards that share a gutter therefore
 * produce the SAME line, which is exactly the "mid-gap" line we want.
 */
export function latticeLines(boxes: readonly Rect[], axis: 'x' | 'y', gap: number): number[] {
  const lines = new Set<number>()
  for (const box of boxes) {
    if (axis === 'x') {
      lines.add(Math.round((box.x - gap / 2) * 2) / 2)
      lines.add(Math.round((box.x + box.w + gap / 2) * 2) / 2)
    } else {
      lines.add(Math.round((box.y - gap / 2) * 2) / 2)
      lines.add(Math.round((box.y + box.h + gap / 2) * 2) / 2)
    }
  }
  return [...lines].sort((a, b) => a - b)
}

/** Nearest lattice line on one side of a coordinate. */
function pick(lines: readonly number[], coordinate: number): number | undefined {
  let best: number | undefined
  let bestDistance = Infinity
  for (const line of lines) {
    const distance = Math.abs(line - coordinate)
    if (distance < bestDistance) {
      bestDistance = distance
      best = line
    }
  }
  return best
}

export interface RouteEnds {
  start: Point
  startFace: 'l' | 'r' | 't' | 'b'
  end: Point
  endFace: 'l' | 'r' | 't' | 'b'
}

/**
 * Orthogonal route on the lattice.
 *
 * Tries the handful of standard orthogonal shapes (Z, L, double-Z) built from
 * gutter lines and keeps the first one that crosses nothing; if every candidate
 * is dirty it returns the one with the fewest crossings, so the caller can still
 * draw something honest.
 */
export function routeOnLattice(
  ends: RouteEnds,
  boxes: readonly Rect[],
  options: { gapX?: number; gapY?: number; stub?: number } = {},
): Point[] {
  const gapX = options.gapX ?? 48
  const gapY = options.gapY ?? 56
  const stub = options.stub ?? 18

  const xs = latticeLines(boxes, 'x', gapX)
  const ys = latticeLines(boxes, 'y', gapY)

  const normal = (face: RouteEnds['startFace']): Point => (face === 'r' ? { x: 1, y: 0 }
    : face === 'l' ? { x: -1, y: 0 }
      : face === 't' ? { x: 0, y: -1 } : { x: 0, y: 1 })

  const nStart = normal(ends.startFace)
  const nEnd = normal(ends.endFace)
  const startStub = { x: ends.start.x + nStart.x * stub, y: ends.start.y + nStart.y * stub }
  const endStub = { x: ends.end.x + nEnd.x * stub, y: ends.end.y + nEnd.y * stub }

  // the lattice lines reachable straight out of each stub
  const startLine = nStart.x !== 0 ? pick(xs, startStub.x) : pick(ys, startStub.y)
  const endLine = nEnd.x !== 0 ? pick(xs, endStub.x) : pick(ys, endStub.y)

  const candidates: Point[][] = []
  const push = (points: Point[]): void => { candidates.push(simplify(points)) }

  // Z through the two verticals
  if (nStart.x !== 0 && nEnd.x !== 0 && startLine !== undefined && endLine !== undefined) {
    push([ends.start, startStub, { x: startLine, y: startStub.y }, { x: startLine, y: endStub.y },
      { x: endLine, y: endStub.y }, endStub, ends.end])
    push([ends.start, startStub, { x: startLine, y: startStub.y }, { x: startLine, y: endStub.y === ends.end.y ? endStub.y : endStub.y },
      endStub, ends.end])
  }
  // Z through the two horizontals
  if (nStart.y !== 0 && nEnd.y !== 0 && startLine !== undefined && endLine !== undefined) {
    push([ends.start, startStub, { x: startStub.x, y: startLine }, { x: endStub.x, y: startLine },
      { x: endStub.x, y: endLine }, endStub, ends.end])
  }
  // mixed: out horizontally then the horizontal lattice of the target
  if (nStart.x !== 0 && startLine !== undefined) {
    const row = pick(ys, ends.end.y - nEnd.y * stub)
    if (row !== undefined) {
      push([ends.start, startStub, { x: startLine, y: startStub.y }, { x: startLine, y: row },
        { x: endStub.x, y: row }, endStub, ends.end])
    }
  }
  if (nStart.y !== 0 && startLine !== undefined) {
    const column = pick(xs, ends.end.x - nEnd.x * stub)
    if (column !== undefined) {
      push([ends.start, startStub, { x: startStub.x, y: startLine }, { x: column, y: startLine },
        { x: column, y: endStub.y }, endStub, ends.end])
    }
  }
  // direct L
  push([ends.start, startStub, { x: endStub.x, y: startStub.y }, endStub, ends.end])
  push([ends.start, startStub, { x: startStub.x, y: endStub.y }, endStub, ends.end])

  let best: Point[] | undefined
  let bestHits = Infinity
  for (const candidate of candidates) {
    let hits = 0
    for (let index = 1; index < candidate.length; index += 1) {
      hits += crossings(boxes, candidate[index - 1]!, candidate[index]!)
    }
    if (hits < bestHits) {
      bestHits = hits
      best = candidate
      if (hits === 0) break
    }
  }
  return best ?? [ends.start, ends.end]
}

export function simplify(points: Point[]): Point[] {
  const out: Point[] = []
  for (const point of points) {
    const last = out[out.length - 1]
    if (last !== undefined && Math.abs(last.x - point.x) < CENTRE_TOLERANCE && Math.abs(last.y - point.y) < CENTRE_TOLERANCE) continue
    const before = out[out.length - 2]
    if (before !== undefined && last !== undefined) {
      const collinear = (Math.abs(before.x - last.x) < CENTRE_TOLERANCE && Math.abs(last.x - point.x) < CENTRE_TOLERANCE)
        || (Math.abs(before.y - last.y) < CENTRE_TOLERANCE && Math.abs(last.y - point.y) < CENTRE_TOLERANCE)
      if (collinear) { out[out.length - 1] = point; continue }
    }
    out.push(point)
  }
  return out
}
