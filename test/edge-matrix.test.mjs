/**
 * The routing matrix — every combination the map can produce.
 *
 * Sweeps:
 *   • all 16 face pairs (r/l/t/b × r/l/t/b)
 *   • 3 card sizes   (224×120 layout constant, 250×129 painted box, 224×160 tall)
 *   • 3 grid widths  (2 / 4 / 6 columns — real folders have 1–6)
 *   • 2 gap sets     (48×56 standard, 24×32 tight)
 *   • 7 arrangements (neighbour right/below, diagonal, one card between horizontally
 *                     and vertically, two between, far diagonal)
 *
 * For every case it routes with the real router, clips the way the renderer does,
 * and asserts:
 *   1. no point inside another card          (the user's complaint)
 *   2. no point inside its own endpoint card (renderer clips, so this must be 0)
 *   3. every leg is axis-aligned
 *   4. no absurd detour
 *
 *   node test/edge-matrix.test.mjs
 */
import assert from 'node:assert/strict'
import { routeBetween, clipToRects } from '../src/client/edge-route.ts'

const MIN_CLEARANCE = 8
const FACES = ['r', 'l', 't', 'b']

const SIZES = [
  { name: '224×120 const', w: 224, h: 120 },
  { name: '250×129 painted', w: 250, h: 129 },
  { name: '224×160 tall', w: 224, h: 160 },
]
const GRID_COLS = [2, 4, 6]
const GAPS = [
  { name: '48×56', gapX: 48, gapY: 56 },
  { name: '24×32', gapX: 24, gapY: 32 },
]

function anchorOf(box, face) {
  if (face === 'r') return { x: box.x + box.w, y: box.y + box.h / 2 }
  if (face === 'l') return { x: box.x, y: box.y + box.h / 2 }
  if (face === 't') return { x: box.x + box.w / 2, y: box.y }
  return { x: box.x + box.w / 2, y: box.y + box.h }
}

const inside = (point, box) => point.x > box.x + 0.5 && point.x < box.x + box.w - 0.5
  && point.y > box.y + 0.5 && point.y < box.y + box.h - 0.5

function clearance(point, box) {
  const dx = Math.max(box.x - point.x, 0, point.x - (box.x + box.w))
  const dy = Math.max(box.y - point.y, 0, point.y - (box.y + box.h))
  return Math.hypot(dx, dy)
}

function sampleSegments(subpaths, visit) {
  for (const subpath of subpaths) {
    for (let index = 1; index < subpath.length; index += 1) {
      const a = subpath[index - 1]
      const b = subpath[index]
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2))
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps
        visit({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      }
    }
  }
}

function board({ cols, rows, w, h, gapX, gapY }) {
  const cards = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      cards.push({ id: `c${row}_${col}`, x: col * (w + gapX), y: row * (h + gapY), w, h })
    }
  }
  return cards
}

/** Arrangements, clamped to the grid that is actually there. */
function pairsFor(cols) {
  const last = cols - 1
  return [
    { name: 'right neighbour', from: 'c1_0', to: 'c1_1', needs: 2 },
    { name: 'below neighbour', from: 'c1_0', to: 'c2_0', needs: 1 },
    { name: 'diagonal', from: 'c1_0', to: 'c2_1', needs: 2 },
    { name: 'one card right', from: 'c1_0', to: `c1_${Math.min(2, last)}`, needs: 3 },
    { name: 'one card below', from: 'c1_0', to: 'c3_0', needs: 1 },
    { name: 'two cards below', from: 'c0_0', to: 'c3_0', needs: 1 },
    { name: 'far diagonal', from: 'c0_0', to: `c3_${last}`, needs: 2 },
  ]
}

let cases = 0
let skipped = 0
const failures = []
let worstClearance = Infinity

for (const size of SIZES) {
  for (const gaps of GAPS) {
    for (const cols of GRID_COLS) {
      const cards = board({ cols, rows: 5, w: size.w, h: size.h, gapX: gaps.gapX, gapY: gaps.gapY })
      for (const pair of pairsFor(cols)) {
        if (cols < pair.needs) { skipped += 1; continue }
        const from = cards.find(card => card.id === pair.from)
        const to = cards.find(card => card.id === pair.to)
        if (from === undefined || to === undefined) { skipped += 1; continue }
        const others = cards.filter(card => card !== from && card !== to)
        for (const fromFace of FACES) {
          for (const toFace of FACES) {
            cases += 1
            const start = anchorOf(from, fromFace)
            const end = anchorOf(to, toFace)
            const points = routeBetween(
              { start, startFace: fromFace, end, endFace: toFace },
              from,
              to,
              others.map(card => ({ x: card.x, y: card.y, w: card.w, h: card.h })),
            )
            const where = `${size.name} · ${gaps.name} · ${cols}col · ${pair.name} · ${fromFace}→${toFace}`

            // 1) another card
            let hits = 0
            sampleSegments([points], point => {
              for (const card of others) {
                const away = clearance(point, card)
                if (away < worstClearance) worstClearance = away
                if (inside(point, card)) hits += 1
              }
            })
            if (hits > 0) failures.push({ where, reason: 'crosses another card', hits })

            // 2) its own endpoint card, measured on the clipped path the renderer draws
            const drawn = clipToRects(points, [from, to])
            let own = 0
            sampleSegments(drawn, point => {
              const nearStart = Math.hypot(point.x - start.x, point.y - start.y) <= 26
              const nearEnd = Math.hypot(point.x - end.x, point.y - end.y) <= 26
              if (nearStart || nearEnd) return
              if (inside(point, from) || inside(point, to)) own += 1
            })
            if (own > 0) failures.push({ where, reason: 'crosses its own card', hits: own })

            // 3) orthogonal legs
            let skew = 0
            for (let index = 1; index < points.length; index += 1) {
              const a = points[index - 1]
              const b = points[index]
              if (Math.abs(a.x - b.x) > 0.5 && Math.abs(a.y - b.y) > 0.5) skew += 1
            }
            if (skew > 0) failures.push({ where, reason: 'diagonal leg', hits: skew })

            // 4) detour sanity
            let length = 0
            for (let index = 1; index < points.length; index += 1) {
              length += Math.abs(points[index].x - points[index - 1].x) + Math.abs(points[index].y - points[index - 1].y)
            }
            const direct = Math.abs(end.x - start.x) + Math.abs(end.y - start.y)
            if (length > direct * 6 + 400) failures.push({ where, reason: 'absurd detour', hits: Math.round(length - direct) })
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Real-board scenarios: shapes taken from screenshots of the actual map.
// A column of three cards where the middle one is wider/offset (a real card is
// 250×129 while the layout box is 224×120) — the reported crossing.
// ---------------------------------------------------------------------------
const SCENARIOS = [
  {
    name: 'stacked column, wider middle card',
    cards: [
      { id: 'top', x: 0, y: 0, w: 224, h: 120 },
      { id: 'mid', x: 4, y: 176, w: 250, h: 129 },
      { id: 'bottom', x: 0, y: 352, w: 224, h: 120 },
    ],
    pairs: [['top', 'bottom']],
  },
  {
    name: 'stacked column, middle card offset right',
    cards: [
      { id: 'top', x: 0, y: 0, w: 224, h: 120 },
      { id: 'mid', x: 20, y: 176, w: 224, h: 129 },
      { id: 'bottom', x: 0, y: 352, w: 224, h: 120 },
    ],
    pairs: [['top', 'bottom']],
  },
]

for (const scenario of SCENARIOS) {
  for (const [fromId, toId] of scenario.pairs) {
    const from = scenario.cards.find(card => card.id === fromId)
    const to = scenario.cards.find(card => card.id === toId)
    const others = scenario.cards.filter(card => card !== from && card !== to)
    for (const fromFace of FACES) {
      for (const toFace of FACES) {
        cases += 1
        const start = anchorOf(from, fromFace)
        const end = anchorOf(to, toFace)
        const points = routeBetween(
          { start, startFace: fromFace, end, endFace: toFace },
          from,
          to,
          others.map(card => ({ x: card.x, y: card.y, w: card.w, h: card.h })),
        )
        let hits = 0
        sampleSegments([points], point => {
          for (const card of others) {
            const away = clearance(point, card)
            if (away < worstClearance) worstClearance = away
            if (inside(point, card)) hits += 1
          }
        })
        if (hits > 0) failures.push({ where: `${scenario.name} · ${fromFace}→${toFace}`, reason: 'crosses another card', hits })
      }
    }
  }
}

const byReason = failures.reduce((acc, failure) => {
  acc[failure.reason] = (acc[failure.reason] ?? 0) + 1
  return acc
}, {})

console.log(JSON.stringify({
  cases,
  skipped,
  failed: failures.length,
  worstClearance: Math.round(worstClearance * 10) / 10,
  byReason,
  sample: failures.slice(0, 5),
}, null, 1))

assert.equal(failures.length, 0, `${failures.length}/${cases} combinations failed`)
assert.ok(worstClearance >= MIN_CLEARANCE, `worst clearance ${worstClearance.toFixed(1)}px < ${MIN_CLEARANCE}px`)
console.log(`edge-matrix: ${cases} combinations clean (worst clearance ${worstClearance.toFixed(1)}px)`)
