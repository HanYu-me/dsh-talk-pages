/**
 * Pure checks for the page model (no browser, no build):
 *   node test/pages.test.mjs
 *
 * What the UI relies on: a card's page is its box's page (or its session's
 * workspace), the tab bar counts what the canvas actually paints, and the v5
 * migration turns old folders into boxes WITHOUT moving anything.
 */
import assert from 'node:assert/strict'
import {
  LAYOUT_VERSION, buildPages, migrateToBoxes, pageCameraKey, pageOfBox, pageOfCard, resolveActivePage,
  sessionPageIndex,
} from '../src/client/pages.ts'

const UNSORTED = '__none__'

let checks = 0
function ok(name, fn) {
  fn()
  checks += 1
  console.log(`  ok ${name}`)
}

const card = (overrides) => ({ boardId: 'inbox', sessionId: 's1', x: 0, y: 0, createdAt: 1, ...overrides })

console.log('pages')

ok('the session index maps every session to its workspace', () => {
  const index = sessionPageIndex([
    { workspaceId: 'ws-a', sessionIds: ['s1', 's2'] },
    { workspaceId: 'ws-b', sessionIds: ['s3'] },
  ])
  assert.equal(index.get('s1'), 'ws-a')
  assert.equal(index.get('s3'), 'ws-b')
  assert.equal(index.get('nope'), undefined)
})

ok('a free card lives on its session\'s workspace page', () => {
  const sessionPage = new Map([['s1', 'ws-a']])
  assert.equal(pageOfCard(card({}), undefined, sessionPage), 'ws-a')
  assert.equal(pageOfCard(card({}), {}, sessionPage), 'ws-a')
})

ok('a card without a workspace falls into the unsorted page', () => {
  assert.equal(pageOfCard(card({ sessionId: 'orphan' }), {}, new Map()), UNSORTED)
})

ok('a boxed card follows its BOX, even across workspaces', () => {
  const sessionPage = new Map([['s1', 'ws-a']])
  const boxes = { box1: { pageId: 'ws-b', title: 'B' } }
  assert.equal(pageOfCard(card({ boxId: 'box1' }), boxes, sessionPage), 'ws-b')
})

ok('a dangling boxId does not hide a card (falls back to its session page)', () => {
  const sessionPage = new Map([['s1', 'ws-a']])
  assert.equal(pageOfCard(card({ boxId: 'gone' }), { box1: { pageId: 'ws-b', title: 'B' } }, sessionPage), 'ws-a')
})

ok('a box knows its page; a frame without a box row stands in for itself', () => {
  assert.equal(pageOfBox('box1', { box1: { pageId: 'ws-b', title: 'B' } }), 'ws-b')
  assert.equal(pageOfBox('legacy-folder', undefined), 'legacy-folder')
})

ok('the tab bar lists workspaces in order with live card counts', () => {
  const pages = buildPages({
    workspaces: [
      { workspaceId: 'ws-a', title: 'A' },
      { workspaceId: 'ws-b', title: 'B' },
    ],
    cards: {
      c1: card({ sessionId: 's1' }),
      c2: card({ sessionId: 's2' }),
      c3: card({ sessionId: 's3', boxId: 'box1' }),
      c4: card({ sessionId: 'blank' }),
    },
    boxes: { box1: { pageId: 'ws-b', title: 'B box' } },
    sessionPage: new Map([['s1', 'ws-a'], ['s2', 'ws-a'], ['s3', 'ws-a']]),
    isHidden: entry => entry.sessionId === 'blank',
    unsortedTitle: 'Unsorted',
  })
  assert.deepEqual(pages.map(page => [page.id, page.title, page.count]), [
    ['ws-a', 'A', 2],
    // c3 is boxed on ws-b even though its session belongs to ws-a.
    ['ws-b', 'B', 1],
  ])
})

ok('a page only a box references still gets a tab', () => {
  const pages = buildPages({
    workspaces: [{ workspaceId: 'ws-a', title: 'A' }],
    cards: {},
    boxes: { box1: { pageId: 'ws-deleted', title: 'Orphan box' } },
    sessionPage: new Map(),
    unsortedTitle: 'Unsorted',
  })
  assert.deepEqual(pages.map(page => page.id), ['ws-a', 'ws-deleted'])
  assert.equal(pages[1].title, 'Orphan box')
})

ok('unsorted appears only when it holds cards or is the active page', () => {
  const base = {
    workspaces: [{ workspaceId: 'ws-a', title: 'A' }],
    boxes: undefined,
    unsortedTitle: 'Unsorted',
  }
  const empty = buildPages({ ...base, cards: {}, sessionPage: new Map() })
  assert.deepEqual(empty.map(page => page.id), ['ws-a'])
  const withOrphan = buildPages({
    ...base,
    cards: { c1: card({ sessionId: 'orphan' }) },
    sessionPage: new Map(),
  })
  assert.deepEqual(withOrphan.map(page => page.id), ['ws-a', UNSORTED])
  assert.equal(withOrphan[1].title, 'Unsorted')
  assert.equal(withOrphan[1].count, 1)
  const activeEmpty = buildPages({ ...base, cards: {}, sessionPage: new Map(), activePage: UNSORTED })
  assert.deepEqual(activeEmpty.map(page => page.id), ['ws-a', UNSORTED])
})

ok('the active page survives only while it still exists', () => {
  const pages = [{ id: 'ws-a', title: 'A', count: 0 }, { id: 'ws-b', title: 'B', count: 0 }]
  assert.equal(resolveActivePage({ activePage: 'ws-b' }, pages), 'ws-b')
  assert.equal(resolveActivePage({ activePage: 'ws-gone' }, pages), 'ws-a')
  assert.equal(resolveActivePage(null, pages), 'ws-a')
  assert.equal(resolveActivePage({}, []), UNSORTED)
})

ok('cameras are namespaced per page', () => {
  assert.equal(pageCameraKey('ws-a'), 'page:ws-a')
})

ok('v5 migration turns every old folder into a box with the SAME id', () => {
  const migrated = migrateToBoxes({
    cards: {},
    wsFrames: {
      'ws-a': { x: 0, y: 0, width: 400, height: 300 },
      'ws-b': { x: 600, y: 0, width: 400, height: 300 },
    },
    boxes: undefined,
    sessionPage: new Map(),
    titles: new Map([['ws-a', 'Workspace A']]),
  })
  assert.equal(migrated.changed, true)
  assert.deepEqual(migrated.boxes['ws-a'], { pageId: 'ws-a', title: 'Workspace A' })
  // No title for ws-b: the id is the honest fallback.
  assert.deepEqual(migrated.boxes['ws-b'], { pageId: 'ws-b', title: 'ws-b' })
})

ok('v5 migration stamps boxId from wsOverride ?? session workspace', () => {
  const migrated = migrateToBoxes({
    cards: {
      grouped: card({ sessionId: 's1' }),
      overridden: card({ sessionId: 's2', wsOverride: 'ws-b' }),
      loose: card({ sessionId: 's3' }),
      frameless: card({ sessionId: 's4' }),
    },
    wsFrames: { 'ws-a': { x: 0, y: 0, width: 400, height: 300 }, 'ws-b': { x: 0, y: 0, width: 400, height: 300 } },
    boxes: undefined,
    // s4's workspace has no frame (it was never imported): it stays free.
    sessionPage: new Map([['s1', 'ws-a'], ['s2', 'ws-a'], ['s3', 'ws-a'], ['s4', 'ws-c']]),
    titles: new Map(),
  })
  assert.equal(migrated.cards.grouped.boxId, 'ws-a')
  assert.equal(migrated.cards.overridden.boxId, 'ws-b')
  assert.equal(migrated.cards.loose.boxId, 'ws-a')
  assert.equal(migrated.cards.frameless, undefined)
})

ok('v5 migration never moves a card', () => {
  const before = card({ sessionId: 's1', x: 123, y: 456 })
  const migrated = migrateToBoxes({
    cards: { c1: before },
    wsFrames: { 'ws-a': { x: 0, y: 0, width: 400, height: 300 } },
    boxes: undefined,
    sessionPage: new Map([['s1', 'ws-a']]),
    titles: new Map(),
  })
  assert.equal(migrated.cards.c1.x, 123)
  assert.equal(migrated.cards.c1.y, 456)
  assert.equal(LAYOUT_VERSION, 5)
})

ok('migration is idempotent: a migrated store reports no change', () => {
  const migrated = migrateToBoxes({
    cards: { c1: card({ boxId: 'ws-a' }) },
    wsFrames: { 'ws-a': { x: 0, y: 0, width: 400, height: 300 } },
    boxes: { 'ws-a': { pageId: 'ws-a', title: 'A' } },
    sessionPage: new Map([['s1', 'ws-a']]),
    titles: new Map(),
  })
  assert.equal(migrated.changed, false)
  assert.deepEqual(migrated.cards, {})
})

// ---- the host schema is the durable half: zod STRIPS unknown keys ---------
// (docs/SPEC.md §6: a new field that is not declared in src/host/store.ts is
// silently dropped on the way to storage — that is the trap this guards.)
const { cardSchema, globalSchema } = await import('../src/host/store.ts')

ok('the host card schema keeps boxId (and still accepts the legacy wsOverride)', () => {
  const card = cardSchema.parse({ boardId: 'inbox', sessionId: 's1', x: 1, y: 2, boxId: 'box1', createdAt: 3 })
  assert.equal(card.boxId, 'box1')
  const legacy = cardSchema.parse({ boardId: 'inbox', sessionId: 's2', x: 1, y: 2, wsOverride: 'ws-a', createdAt: 3 })
  assert.equal(legacy.wsOverride, 'ws-a')
  assert.equal(legacy.boxId, undefined)
})

ok('the host global schema keeps boxes / activePage / snap', () => {
  const global = globalSchema.parse({
    version: 1,
    activeBoard: 'inbox',
    cameraByBoard: { 'page:ws-a': { x: 0, y: 0, zoom: 1 } },
    layoutVersion: 5,
    boxes: { box1: { pageId: 'ws-a', title: 'A' } },
    wsFrames: { box1: { x: 0, y: 0, width: 400, height: 300 } },
    activePage: 'ws-a',
    snap: false,
  })
  assert.deepEqual(global.boxes, { box1: { pageId: 'ws-a', title: 'A' } })
  assert.equal(global.activePage, 'ws-a')
  assert.equal(global.snap, false)
})

console.log(`\npages: ${checks} checks passed (page model + host schema)`)
