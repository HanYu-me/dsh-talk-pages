/**
 * Routing rules, tested without a browser.
 *
 *   node test/edge-routing.test.mjs
 *
 * The failure this guards against: neighbours in a folder are ~12px apart, so a
 * facing-side connection is an invisible stub (and overlapping with the next one).
 */
import assert from 'node:assert/strict'
import { blockedToward, pickFaces } from '../src/client/edge-routing.ts'

const CARD_W = 224
const CARD_H = 120
const size = { width: CARD_W, height: CARD_H }
const opts = { cardWidth: CARD_W, cardHeight: CARD_H }

// --- far apart horizontally: the facing sides are fine -------------------
const farRight = pickFaces({ id: 'a', x: 0, y: 0 }, { id: 'b', x: 500, y: 0 }, [], opts)
assert.deepEqual(farRight, { fromHandle: 'r', toHandle: 'l' }, 'a long gap connects side to side')

const farLeft = pickFaces({ id: 'a', x: 500, y: 0 }, { id: 'b', x: 0, y: 0 }, [], opts)
assert.deepEqual(farLeft, { fromHandle: 'l', toHandle: 'r' }, 'direction flips the faces')

// --- neighbours 12px apart: facing sides, because nothing sits between --
// (the old rule looped through a horizontal face, which drew a dashed
// rectangle around the card in the stack drawer)
const neighbour = pickFaces(
  { id: 'a', x: 0, y: 0 },
  { id: 'b', x: CARD_W + 12, y: 0 },
  [],
  opts,
)
assert.deepEqual(neighbour, { fromHandle: 'r', toHandle: 'l' }, 'neighbours connect side to side')

// --- the same gap, but with a card in between: it has to loop ----------
const between = { id: 'm', x: CARD_W + 6, y: 0 }
const looped = pickFaces(
  { id: 'a', x: 0, y: 0 },
  { id: 'b', x: (CARD_W + 12) * 2, y: 0 },
  [between],
  opts,
)
assert.deepEqual(looped, { fromHandle: 'b', toHandle: 'b' }, 'a card in front of the facing side pushes the line to the vertical faces')
// --- blocked below → loop over the top instead ---------------------------
const below = { id: 'c', x: 40, y: CARD_H + 10 }
assert.equal(blockedToward({ id: 'a', x: 0, y: 0 }, 'b', [below], size), true, 'a card below blocks the bottom')
assert.equal(blockedToward({ id: 'a', x: 0, y: 0 }, 't', [below], size), false, 'the top stays free')

const blocked = pickFaces({ id: 'a', x: 0, y: 0 }, { id: 'b', x: CARD_W + 12, y: 0 }, [below], opts)
assert.deepEqual(blocked, { fromHandle: 'r', toHandle: 'l' }, 'facing sides are used even with a card below')

// --- vertically stacked neighbours use the horizontal faces --------------
const stacked = pickFaces({ id: 'a', x: 0, y: 0 }, { id: 'b', x: 0, y: CARD_H + 12 }, [], opts)
assert.deepEqual(stacked, { fromHandle: 'b', toHandle: 't' }, 'a tight stack connects top to bottom')


// --- far apart vertically keeps the straight connection -----------------
const tall = pickFaces({ id: 'a', x: 0, y: 0 }, { id: 'b', x: 0, y: 500 }, [], opts)
assert.deepEqual(tall, { fromHandle: 'b', toHandle: 't' }, 'a long vertical gap connects top to bottom')

// --- the real 48px grid gap also uses the facing sides -------------------
const gridGap = pickFaces(
  { id: 'a', x: 0, y: 0 },
  { id: 'b', x: CARD_W + 48, y: 0 },
  [],
  opts,
)
assert.deepEqual(gridGap, { fromHandle: 'r', toHandle: 'l' }, 'the 48px grid gap connects side to side')


// --- and the same pair, once far apart, goes back to facing sides --------
const sameButFar = pickFaces(
  { id: 'a', x: 0, y: 0 },
  { id: 'b', x: CARD_W + 48 + 200, y: 0 },
  [],
  opts,
)
assert.deepEqual(sameButFar, { fromHandle: 'r', toHandle: 'l' }, 'far apart uses the facing sides again')

console.log('edge-routing: 15 checks passed')
