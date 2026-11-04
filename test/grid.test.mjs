/**
 * Pure-function checks for the slot layout (no browser, no build):
 *   node test/grid.test.mjs
 *
 * Invariants the UI relies on: fixed non-overlapping slots, width/height decide
 * the grid, overflow collapses into ONE stack cell, order is whatever the
 * canvas hands over.
 */
import assert from 'node:assert/strict'
import {
  CARD_H, CARD_W, GAP_X, GAP_Y, MIN_FRAME_HEIGHT, MIN_FRAME_WIDTH,
  capacityFor, colsForWidth, contentHeight, frameRect, layoutFor, readingOrder, rowsForHeight,
  slotIndexAt, slotPoint, visibleCount,
} from '../src/client/grid-layout.ts'

const rect = (width, height) => frameRect({ x: 0, y: 0, width, height })
const card = (cardId, x, y) => ({ cardId, x, y })

let checks = 0
function ok(name, fn) {
  fn()
  checks += 1
  console.log(`  ok ${name}`)
}

ok('columns follow width', () => {
  assert.equal(colsForWidth(MIN_FRAME_WIDTH), 1)
  assert.equal(colsForWidth(MIN_FRAME_WIDTH + CARD_W + GAP_X), 2)
  assert.equal(colsForWidth(832), 3)
  assert.equal(colsForWidth(1248), 4)
  assert.equal(colsForWidth(10), 1, 'a tiny folder still fits one column')
})

ok('rows follow height', () => {
  assert.equal(rowsForHeight(MIN_FRAME_HEIGHT), 1)
  assert.equal(rowsForHeight(MIN_FRAME_HEIGHT + CARD_H + GAP_Y), 2)
  assert.equal(rowsForHeight(10), 1, 'a tiny folder still fits one row')
})

ok('capacity = columns x rows', () => {
  assert.equal(capacityFor(rect(832, contentHeight(2, 3))), 3)
  assert.equal(capacityFor(rect(832, contentHeight(5, 3))), 6)
  assert.equal(capacityFor(rect(MIN_FRAME_WIDTH, MIN_FRAME_HEIGHT)), 1)
})

ok('slots never overlap, and stay inside the box', () => {
  for (const width of [MIN_FRAME_WIDTH, 560, 832, 1248]) {
    for (const rows of [1, 2, 3]) {
      const geometry = rect(width, contentHeight(rows * colsForWidth(width), colsForWidth(width)))
      const cols = colsForWidth(geometry.width)
      const points = Array.from({ length: rows * cols }, (_, i) => slotPoint(geometry, i, cols))
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j]
          const overlap = a.x < b.x + CARD_W && b.x < a.x + CARD_W && a.y < b.y + CARD_H && b.y < a.y + CARD_H
          assert.equal(overlap, false, `overlap at ${width}px row ${rows}: ${i}-${j}`)
        }
      }
      const last = points.at(-1)
      assert.ok(last.x + CARD_W <= geometry.x + geometry.width, 'slot overflows folder width')
      assert.ok(last.y + CARD_H <= geometry.y + geometry.height + 1, 'slot overflows folder height')
    }
  }
})

ok('layout follows the order it is given', () => {
  const geometry = rect(832, contentHeight(3, 3))
  const layout = layoutFor(geometry, ['b', 'a', 'c'])
  assert.deepEqual(layout['b'], slotPoint(geometry, 0))
  assert.deepEqual(layout['a'], slotPoint(geometry, 1))
  assert.deepEqual(layout['c'], slotPoint(geometry, 2))
})

ok('cards past the capacity still get coordinates (for a later grow)', () => {
  const geometry = rect(832, contentHeight(1, 3))
  const layout = layoutFor(geometry, ['a', 'b', 'c', 'd', 'e'])
  assert.equal(Object.keys(layout).length, 5)
  assert.equal(layout['e'].y, slotPoint(geometry, 4).y, 'the fifth card keeps a stable slot')
})

ok('overflow spends one slot on the stack cell', () => {
  assert.equal(visibleCount(3, 3), 3, 'exactly fits: everything shows')
  assert.equal(visibleCount(3, 4), 2, 'one over: two cards + the stack cell')
  assert.equal(visibleCount(3, 9), 2)
  assert.equal(visibleCount(1, 1), 1, 'a single-slot folder shows its one card')
  assert.equal(visibleCount(1, 5), 0, 'a single-slot folder that overflows IS the stack cell')
  assert.equal(visibleCount(6, 2), 2)
})

ok('reading order is row-major', () => {
  const cards = [card('d', 0, 200), card('b', 300, 0), card('a', 0, 0), card('c', 300, 200)]
  assert.deepEqual(readingOrder(cards), ['a', 'b', 'd', 'c'])
})

ok('reading order survives a promotion rewrite', () => {
  const geometry = rect(832, contentHeight(1, 3))
  const promoted = ['e', 'a', 'b', 'c', 'd']
  const layout = layoutFor(geometry, promoted)
  const back = readingOrder(Object.entries(layout).map(([cardId, point]) => card(cardId, point.x, point.y)))
  assert.deepEqual(back, promoted)
})

ok('slotIndexAt maps a point to the slot under it', () => {
  const geometry = rect(832, contentHeight(2, 3))
  assert.equal(slotIndexAt(geometry, { x: geometry.x + 40, y: geometry.y + 70 }), 0)
  assert.equal(slotIndexAt(geometry, { x: geometry.x + 32 + CARD_W + GAP_X + 10, y: geometry.y + 62 + 10 }), 1)
  assert.equal(slotIndexAt(geometry, { x: geometry.x + 40, y: geometry.y + 62 + CARD_H + GAP_Y + 10 }), 3, 'next row')
})

ok('a folder never renders below one column / one row — and does not grow to fit', () => {
  const tiny = frameRect({ x: 0, y: 0, width: 40, height: 10 })
  assert.equal(tiny.width, MIN_FRAME_WIDTH)
  assert.equal(tiny.height, MIN_FRAME_HEIGHT)
  const roomy = frameRect({ x: 0, y: 0, width: 900, height: 700 })
  assert.deepEqual(roomy, { x: 0, y: 0, width: 900, height: 700 }, 'the user size is respected as-is')
})

console.log(`\ngrid-layout: ${checks} checks passed`)
