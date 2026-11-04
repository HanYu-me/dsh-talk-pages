/**
 * Routing rules, tested without a browser.
 *
 *   node test/edge-route.test.mjs
 *
 * The failure this guards against: a line between two cards cutting straight
 * through a third card that happens to sit between them.
 */
import assert from 'node:assert/strict'
import { routeEdge, corridors, roundedPath, simplify } from '../src/client/edge-route.ts'

const CARD_W = 224
const CARD_H = 120
const card = (x, y) => ({ x, y, w: CARD_W, h: CARD_H })

const isAxisAligned = points => points.every((point, index) => {
  if (index === 0) return true
  const prev = points[index - 1]
  return Math.abs(prev.x - point.x) < 0.6 || Math.abs(prev.y - point.y) < 0.6
})

/** No segment may cross any card body. */
const crossesAny = (points, rects) => {
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1]
    const b = points[index]
    for (const rect of rects) {
      if (Math.abs(a.y - b.y) < 0.6) {
        const lo = Math.min(a.x, b.x)
        const hi = Math.max(a.x, b.x)
        if (a.y > rect.y + 1 && a.y < rect.y + rect.h - 1 && hi > rect.x + 1 && lo < rect.x + rect.w - 1) return rect
      } else if (Math.abs(a.x - b.x) < 0.6) {
        const lo = Math.min(a.y, b.y)
        const hi = Math.max(a.y, b.y)
        if (a.x > rect.x + 1 && a.x < rect.x + rect.w - 1 && hi > rect.y + 1 && lo < rect.y + rect.h - 1) return rect
      }
    }
  }
  return null
}

// --- 1. clear line: straight, and it is the shortest sensible shape ----------
{
  const a = card(0, 0)
  const b = card(600, 0)
  const points = routeEdge(a, b, 'r', 'l', [a, b])
  assert.ok(points.length >= 2, 'produces a polyline')
  assert.ok(isAxisAligned(points), 'polyline is orthogonal: ' + JSON.stringify(points))
  assert.equal(crossesAny(points, [a, b]), null, 'nothing is crossed')
  assert.ok(points[0].x === CARD_W && Math.abs(points[0].y - CARD_H / 2) < 0.6, 'starts at the right face')
  assert.ok(Math.abs(points.at(-1).x - 600) < 0.6, 'ends at the left face')
  assert.ok(points.length === 2, 'a clear straight run needs no bends: ' + JSON.stringify(points))
}

// --- 2. a card in the way: the line must go around it -----------------------
{
  const a = card(0, 0)
  const b = card(600, 0)
  const wall = card(300, 0)         // sits exactly on the direct run at y = 60
  const obstacles = [a, b, wall]
  const points = routeEdge(a, b, 'r', 'l', obstacles)
  assert.ok(isAxisAligned(points), 'orthogonal: ' + JSON.stringify(points))
  assert.equal(crossesAny(points, obstacles), null,
    'never crosses the blocking card: ' + JSON.stringify(points))
  // it has to bend at least twice
  assert.ok(points.length >= 4, 'detours: ' + JSON.stringify(points))
}

// --- 3. channel centres are the middle of the gap --------------------------
{
  const rects = [card(0, 0), card(300, 0)]
  const xs = corridors(rects, 'x', 20)
  assert.equal(xs.length, 1, 'one channel between two columns')
  assert.equal(xs[0], (224 + 300) / 2, 'channel sits in the middle of the gap')
  const ys = corridors(rects, 'y', 20)
  assert.equal(ys.length, 0, 'no horizontal channel when rows overlap')
}

// --- 4. narrow gaps are not used ------------------------------------------
{
  const tight = [card(0, 0), card(240, 0)]   // 16px gap
  assert.deepEqual(corridors(tight, 'x', 28), [], 'a 16px gap is too tight to route through')
}

// --- 5. stacked cards: vertical channel, not a crossing --------------------
{
  const a = card(0, 0)
  const b = card(0, 500)
  const wall = card(0, 240)
  const obstacles = [a, b, wall]
  const points = routeEdge(a, b, 'b', 't', obstacles)
  assert.equal(crossesAny(points, obstacles), null, 'stays clear: ' + JSON.stringify(points))
}

// --- 6. simplify drops redundant points -----------------------------------
{
  const points = simplify([
    { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 30 },
  ])
  assert.deepEqual(points, [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 30 }])
}

// --- 7. rounded path is valid SVG and keeps the endpoints -----------------
{
  const path = roundedPath([{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 80 }], 10)
  assert.match(path, /^M 0 0 /, 'starts with a move')
  assert.match(path, /Q /, 'corners are rounded')
  assert.match(path, /L 100 80$/, 'ends on the target point')
}

console.log('edge-route: 15 checks passed')
