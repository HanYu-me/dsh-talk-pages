/**
 * The stack drawer's wiring: a dense grid of painted-size cards (250×129) with the same
 * router and the same face rule the drawer uses. Every ordered pair is routed and
 * checked against every other card.
 *
 *   node test/drawer-grid.test.mjs
 */
import assert from 'node:assert/strict'
import { routeEdge } from '../src/client/edge-route.ts'
import { pickFaces } from '../src/client/edge-routing.ts'

const CARD_W = 250
const CARD_H = 129
const GAP_X = 48
const GAP_Y = 56
const COLS = 3
const ROWS = 4

const cards = []
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    cards.push({ id: `c${row}_${col}`, x: col * (CARD_W + GAP_X), y: row * (CARD_H + GAP_Y), w: CARD_W, h: CARD_H })
  }
}

const distance = (point, box) => Math.hypot(
  Math.max(box.x - point.x, 0, point.x - (box.x + box.w)),
  Math.max(box.y - point.y, 0, point.y - (box.y + box.h)),
)

let cases = 0
const failures = []
let closest = Infinity

for (const from of cards) {
  for (const to of cards) {
    if (from === to) continue
    const others = cards.filter(card => card !== from && card !== to)
    const faces = pickFaces(
      { id: from.id, x: from.x, y: from.y },
      { id: to.id, x: to.x, y: to.y },
      cards,
      { cardWidth: CARD_W, cardHeight: CARD_H },
    )
    const points = routeEdge(from, to, faces.fromHandle, faces.toHandle, [from, to, ...others])
    cases += 1

    let hits = 0
    for (let index = 1; index < points.length; index += 1) {
      const a = points[index - 1]
      const b = points[index]
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2))
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps
        const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
        for (const card of others) {
          const away = distance(point, card)
          if (away < closest) closest = away
          if (away === 0) hits += 1
        }
      }
    }
    if (hits > 0) failures.push({ from: from.id, to: to.id, faces, hits, points: points.map(p => [Math.round(p.x), Math.round(p.y)]) })
  }
}

assert.equal(failures.length, 0, `${failures.length}/${cases} drawer links cross a card:\n` + JSON.stringify(failures.slice(0, 3)))
assert.ok(closest >= 8, `closest approach ${closest.toFixed(1)}px < 8px`)
console.log(`drawer-grid: ${cases} links clean (closest ${closest.toFixed(1)}px)`)
