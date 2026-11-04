/**
 * End-to-end check of the phase-1 page model, in a real browser:
 *
 *   node test/pages-ui.mjs            (headless)
 *   node test/pages-ui.mjs --headed   (watch it)
 *
 * Loads the offline harness (test/index.html + the built client.dev.js) in
 * Chrome through playwright-core and drives the map like a user:
 *
 *   1. the tab bar lists one page per workspace;
 *   2. the v5 migration turned the old folders into boxes and stamped boxId;
 *   3. switching pages shows ONLY that page's cards and boxes;
 *   4. a free card keeps the position it was dropped at (snap off), and stays
 *      there (nothing re-slots it);
 *   5. ＋ 新建框 creates a box on the page, and dropping a card inside it sets
 *      Card.boxId;
 *   6. deleting the box keeps the card (ungroup, never a session delete).
 *
 * Screenshots land in test/shots/phase1-*.png.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PAGES_UI_PORT ?? 8793)
const SHOTS = path.join(ROOT, 'test/shots')
const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(candidate => fs.existsSync(candidate))
const headed = process.argv.includes('--headed')

if (CHROME === undefined) {
  console.error('pages-ui: no Chrome found — install Google Chrome or set it up first')
  process.exit(1)
}

// ---- static server (same file layout test/serve.mjs serves) -------------
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}
const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://127.0.0.1:${PORT}`)
  const rel = decodeURIComponent(url.pathname === '/' ? '/test/index.html' : url.pathname)
  const file = path.join(ROOT, rel)
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) {
    response.writeHead(404).end('not found')
    return
  }
  response.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  response.end(fs.readFileSync(file))
})
await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve))

const results = []
function check(name, passed, detail) {
  results.push({ name, passed, detail })
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}${detail === undefined ? '' : `  — ${detail}`}`)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: !headed })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const pageErrors = []
page.on('pageerror', error => pageErrors.push(String(error)))
page.on('console', (message) => {
  if (message.type() !== 'error') return
  // The bundle prints its boot breadcrumb with console.error on purpose
  // (it must survive the shell's console filters); that is not a failure.
  if (message.text().includes('client bundle evaluated')) return
  pageErrors.push(message.text())
})

const wait = ms => page.waitForTimeout(ms)
const harness = (fn, arg) => page.evaluate(fn, arg)
const nodeBoxes = () => harness(() => window.__harness.nodeBoxes())
const state = () => harness(() => window.__harness.state())
const globalState = () => harness(() => window.__harness.globalState())
const tabs = () => harness(() => window.__harness.pageTabs())
const openPage = async (pageId) => {
  await harness((id) => { window.__harness.openPage(id) }, pageId)
  await wait(650)
}
/** Card nodes mounted right now, folded/hidden ones included. */
const mountedCards = () => harness(() =>
  [...document.querySelectorAll('.react-flow__node[data-id^="card-"]')]
    .map(el => el.getAttribute('data-id')))
/** Cards actually painted (a folded card stays mounted but has no size). */
const paintedCards = async () => {
  const boxes = await nodeBoxes()
  return Object.entries(boxes.cards)
    .filter(([id, box]) => id.startsWith('card-') && box.w > 0 && box.h > 0)
    .map(([id]) => id)
}
/** Current flow→screen scale, read off React Flow's viewport transform. */
const viewportZoom = () => harness(() => {
  const el = document.querySelector('.react-flow__viewport')
  if (el === null) return 1
  const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
  return matrix.a || 1
})
const cardBox = async (cardId) => (await nodeBoxes()).cards[cardId]
const sessionCards = async () => {
  const payload = await state()
  return Object.fromEntries(Object.entries(payload.cards).map(([id, card]) => [id, card.sessionId]))
}
const cardIdForSession = async (sessionId) => {
  const map = await sessionCards()
  return Object.keys(map).find(id => map[id] === sessionId)
}
/**
 * Drag a card by a screen delta. React Flow's node drag starts on the FIRST
 * pointermove (its drag threshold eats that first delta) and applies deltas on
 * its own animation frame, so the helper warms up with a 2px move and only then
 * moves the measured distance — a 1:1 relationship between `delta` and where
 * the card ends up.
 */
const dragCardBy = async (cardId, delta, steps = 16) => {
  const start = await cardBox(cardId)
  const grab = { x: start.x + 40, y: start.y + 14 }
  await page.mouse.move(grab.x, grab.y)
  await wait(60)
  await page.mouse.down()
  await page.mouse.move(grab.x + 2, grab.y + 2)
  await wait(90)
  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(
      grab.x + 2 + (delta.x * step) / steps,
      grab.y + 2 + (delta.y * step) / steps,
    )
    await wait(20)
  }
  // Let the last frame land before releasing.
  await wait(90)
  await page.mouse.up()
  await wait(900)
  return start
}
const clickMenuItem = async (needle) => {
  const clicked = await page.evaluate((text) => {
    const target = [...document.querySelectorAll('[role="menuitem"]')]
      .find(el => el.textContent.includes(text))
    if (target === undefined) return false
    target.click()
    return true
  }, needle)
  await wait(600)
  return clicked
}

try {
  fs.mkdirSync(SHOTS, { recursive: true })
  await page.goto(`http://127.0.0.1:${PORT}/test/index.html`)
  // The harness boots the plugin and opens the map through the plugin's own
  // hotkey; make sure the panel is really up before asserting anything.
  await page.waitForFunction(() => window.__harness !== undefined)
  await wait(400)
  if (await page.evaluate(() => document.querySelector('[class*="tm_panel"]') === null)) {
    await harness(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F', code: 'KeyF', altKey: true })))
  }
  await wait(1600)

  // ---- 1. one tab per workspace -------------------------------------
  const pageTabs = await tabs()
  check('tab bar lists one page per workspace',
    ['ws-daily', 'ws-medkit', 'ws-lab', 'ws-sync', 'ws-plan', 'ws-notes'].every(id => pageTabs.some(tab => tab.id === id)),
    JSON.stringify(pageTabs.map(tab => `${tab.id}:${tab.count}`)))
  check('exactly one tab is active', pageTabs.filter(tab => tab.active).length === 1,
    JSON.stringify(pageTabs.filter(tab => tab.active)))
  check('the first page is active by default', pageTabs.find(tab => tab.active)?.id === 'ws-daily',
    JSON.stringify(pageTabs.find(tab => tab.active)))

  // ---- 2. migration + auto-sync -------------------------------------
  const global1 = await globalState()
  check('v5 migration stamped layoutVersion 5', global1.layoutVersion === 5, String(global1.layoutVersion))
  const migratedBoxes = global1.boxes ?? {}
  check('old folders became boxes with the same id and page',
    ['ws-daily', 'ws-medkit', 'ws-lab', 'ws-sync'].every(id =>
      migratedBoxes[id]?.pageId === id && typeof migratedBoxes[id]?.title === 'string'),
    JSON.stringify(Object.keys(migratedBoxes)))
  const cardsAfterBoot = await state()
  check('migrated cards carry boxId (membership is stored on the card)',
    Object.values(cardsAfterBoot.cards).filter(card => card.boxId !== undefined).length >= 7,
    JSON.stringify(Object.values(cardsAfterBoot.cards).map(card => card.boxId).filter(Boolean)))

  // Free cards: the two box-less pages must have been filled by auto-sync.
  await openPage('ws-plan')
  const planPainted = await paintedCards()
  const planSessions = (await sessionCards())
  const planCardSessions = planPainted.map(id => planSessions[id]).sort()
  check('auto-sync added the box-less page\'s sessions as FREE cards',
    planCardSessions.join(',') === 's26,s27', JSON.stringify(planCardSessions))
  const planCards = (await state()).cards
  check('those cards have no boxId', planPainted.every((id) => planCards[id]?.boxId === undefined),
    JSON.stringify(planPainted.map(id => planCards[id]?.boxId)))
  await page.screenshot({ path: path.join(SHOTS, 'phase1-page-free-cards.png') })

  // ---- 3. page switching filters the canvas --------------------------
  await openPage('ws-daily')
  const sessionsById = await sessionCards()
  const dailyMounted = (await mountedCards()).map(id => sessionsById[id]).sort()
  // The daily box is ONE row tall, so 3 of its 5 cards fold into the stack cell
  // and React Flow does not even mount them — only this page's cards appear.
  check('the daily page mounts only its own cards',
    dailyMounted.length > 0 && dailyMounted.every(sessionId => ['s1', 's2', 's3', 's4', 's5'].includes(sessionId)),
    JSON.stringify(dailyMounted))
  check('and its overflow collapses into the stack cell',
    await harness(() => document.querySelector('.react-flow__node[data-id="stack-ws-daily"]') !== null))
  check('the daily tab counts every card of the page (folded ones included)',
    (await tabs()).find(tab => tab.id === 'ws-daily')?.count === 5,
    JSON.stringify((await tabs()).find(tab => tab.id === 'ws-daily')))
  const dailyFrames = Object.keys((await nodeBoxes()).frames)
  check('the daily page paints only its own box', dailyFrames.length === 1 && dailyFrames[0] === 'ws-daily',
    JSON.stringify(dailyFrames))
  check('an edge renders only while BOTH endpoints are on the page',
    (await harness(() => document.querySelectorAll('.react-flow__edge').length)) === 1,
    String(await harness(() => document.querySelectorAll('.react-flow__edge').length)))
  await page.screenshot({ path: path.join(SHOTS, 'phase1-page-daily.png') })

  await openPage('ws-medkit')
  const medkitSessions = (await paintedCards()).map(id => sessionsById[id]).sort()
  check('switching pages swaps the rendered cards', medkitSessions.join(',') === 's6,s7',
    JSON.stringify(medkitSessions))
  const medkitFrames = Object.keys((await nodeBoxes()).frames)
  check('and swaps the rendered box', medkitFrames.length === 1 && medkitFrames[0] === 'ws-medkit',
    JSON.stringify(medkitFrames))
  check('the page switch is persisted in global.activePage',
    (await globalState()).activePage === 'ws-medkit', String((await globalState()).activePage))
  check('no edge leaks in from another page',
    (await harness(() => document.querySelectorAll('.react-flow__edge').length)) === 0,
    String(await harness(() => document.querySelectorAll('.react-flow__edge').length)))

  // Per-page camera: zoom this page, leave, come back — the zoom must survive.
  await page.mouse.move(900, 600)
  await page.mouse.wheel(0, -240)
  await wait(1200)
  const medkitCamera = (await globalState()).cameraByBoard?.['page:ws-medkit']
  check('the camera is stored under page:<id>', medkitCamera !== undefined, JSON.stringify(medkitCamera))
  const zoomOnMedkit = await viewportZoom()
  await openPage('ws-lab')
  await openPage('ws-medkit')
  const zoomBack = await viewportZoom()
  check('each page keeps its own camera',
    Math.abs(zoomBack - zoomOnMedkit) < 0.02, `${zoomOnMedkit.toFixed(3)} → ${zoomBack.toFixed(3)}`)

  // ---- 4. a free card keeps its dropped position ---------------------
  await openPage('ws-plan')
  const snapToggle = '[data-talkmap-snap-toggle]'
  const snapBefore = await page.getAttribute(snapToggle, 'data-talkmap-snap-toggle')
  if (snapBefore === 'on') {
    await page.click(snapToggle)
    await wait(400)
  }
  check('the snap toggle turns off (and persists)',
    await page.getAttribute(snapToggle, 'data-talkmap-snap-toggle') === 'off'
      && (await globalState()).snap === false,
    String((await globalState()).snap))

  const freeSession = 's26'
  const freeCardId = await cardIdForSession(freeSession)
  const beforeDrop = await cardBox(freeCardId)
  const storedBefore = (await state()).cards[freeCardId]
  const dropDelta = { x: 160, y: 96 }
  const zoom = await viewportZoom()
  const flowDelta = { x: dropDelta.x / zoom, y: dropDelta.y / zoom }
  await dragCardBy(freeCardId, dropDelta)
  const afterDrop = await cardBox(freeCardId)
  const storedAfter = (await state()).cards[freeCardId]
  check('the free card lands where it was dropped (snap off)',
    Math.abs((afterDrop.x - beforeDrop.x) - dropDelta.x) <= 3
      && Math.abs((afterDrop.y - beforeDrop.y) - dropDelta.y) <= 3,
    `zoom ${zoom.toFixed(3)}: ${beforeDrop.x},${beforeDrop.y} → ${afterDrop.x},${afterDrop.y}`)
  check('the drop position is PERSISTED as the card\'s own x/y',
    Math.abs(storedAfter.x - storedBefore.x - flowDelta.x) <= 3
      && Math.abs(storedAfter.y - storedBefore.y - flowDelta.y) <= 3
      && storedAfter.boxId === undefined,
    `flow delta ${flowDelta.x.toFixed(1)},${flowDelta.y.toFixed(1)}: ${storedBefore.x},${storedBefore.y} → ${storedAfter.x},${storedAfter.y}`)
  await wait(1200)
  const settled = await cardBox(freeCardId)
  check('nothing re-slots a free card afterwards',
    Math.abs(settled.x - afterDrop.x) <= 1 && Math.abs(settled.y - afterDrop.y) <= 1,
    `${afterDrop.x},${afterDrop.y} → ${settled.x},${settled.y}`)
  await page.screenshot({ path: path.join(SHOTS, 'phase1-free-card-dropped.png') })

  // Snap back on: the next drop lands on the 16px grid.
  await page.click(snapToggle)
  await wait(400)
  await dragCardBy(freeCardId, { x: 67, y: 41 })
  const snapped = (await state()).cards[freeCardId]
  check('with 吸附 on, a dropped free card snaps to the 16px grid',
    Math.abs(snapped.x % 16) < 0.01 && Math.abs(snapped.y % 16) < 0.01,
    `${snapped.x},${snapped.y}`)

  // ---- 5. create a box and drop the card into it ---------------------
  const boxesBefore = Object.keys((await globalState()).boxes ?? {}).length
  await page.click('[data-talkmap-new-box]')
  await wait(700)
  const boxesAfterCreate = (await globalState()).boxes ?? {}
  const newBoxId = Object.keys(boxesAfterCreate).find(id => !(id in (global1.boxes ?? {})) && !id.startsWith('ws-'))
  check('＋ 新建框 creates a box on the active page',
    Object.keys(boxesAfterCreate).length === boxesBefore + 1
      && newBoxId !== undefined
      && boxesAfterCreate[newBoxId].pageId === 'ws-plan',
    JSON.stringify({ newBoxId, box: newBoxId === undefined ? null : boxesAfterCreate[newBoxId] }))
  const boxRect = (await nodeBoxes()).frames[newBoxId]
  check('the new box is painted on the canvas', boxRect !== undefined && boxRect.w > 0, JSON.stringify(boxRect))

  // Land the card's CENTRE on the box's centre: the drop rule reads the centre.
  const memberCard = await cardBox(freeCardId)
  const zoomForBox = await viewportZoom()
  const target = {
    x: boxRect.x + boxRect.w / 2 - (224 * zoomForBox) / 2,
    y: boxRect.y + boxRect.h / 2 - (120 * zoomForBox) / 2,
  }
  await dragCardBy(freeCardId, { x: target.x - memberCard.x, y: target.y - memberCard.y })
  await wait(500)
  const joined = (await state()).cards[freeCardId]
  check('dropping a free card inside a box sets Card.boxId', joined.boxId === newBoxId,
    JSON.stringify({ boxId: joined.boxId, expected: newBoxId }))
  check('the box now reports its member count',
    (await page.textContent(`[data-talkmap-workspace="${newBoxId}"]`))?.includes('1') === true,
    String(await page.textContent(`[data-talkmap-workspace="${newBoxId}"]`)))
  await page.screenshot({ path: path.join(SHOTS, 'phase1-box-with-card.png') })

  // 5b. dragging a member OUT joins nothing: it becomes free where it landed.
  // (Snap off again, so "where it landed" is exact rather than grid-rounded.)
  if (await page.getAttribute(snapToggle, 'data-talkmap-snap-toggle') === 'on') {
    await page.click(snapToggle)
    await wait(400)
  }
  const inside = await cardBox(freeCardId)
  const outsidePoint = { x: 120, y: 120 }
  await dragCardBy(freeCardId, { x: outsidePoint.x - inside.x, y: outsidePoint.y - inside.y })
  const freed = (await state()).cards[freeCardId]
  const freedBox = await cardBox(freeCardId)
  check('dragging a member out of a box makes it free again', freed.boxId === undefined,
    String(freed.boxId))
  check('and it stays exactly where it was dropped',
    Math.abs(freedBox.x - outsidePoint.x) <= 3 && Math.abs(freedBox.y - outsidePoint.y) <= 3,
    `${freedBox.x},${freedBox.y} vs ${outsidePoint.x},${outsidePoint.y}`)

  // 5c. …and dropping it back inside re-joins the box.
  const boxRect2 = (await nodeBoxes()).frames[newBoxId]
  const zoomBack2 = await viewportZoom()
  const backTarget = {
    x: boxRect2.x + boxRect2.w / 2 - (224 * zoomBack2) / 2,
    y: boxRect2.y + boxRect2.h / 2 - (120 * zoomBack2) / 2,
  }
  await dragCardBy(freeCardId, { x: backTarget.x - freedBox.x, y: backTarget.y - freedBox.y })
  check('dropping it back inside re-joins the box',
    (await state()).cards[freeCardId].boxId === newBoxId,
    String((await state()).cards[freeCardId].boxId))

  // 5d. the box is nameable (double-click its label) and colourable (menu).
  const label2 = await page.evaluate((boxId) => {
    const el = document.querySelector(`[data-talkmap-box-label="${boxId}"]`)
    const rect = el.getBoundingClientRect()
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  }, newBoxId)
  await page.mouse.dblclick(label2.x, label2.y)
  await wait(500)
  const renameOpen = await page.evaluate(() => document.querySelector('[class*="renameInput"]') !== null)
  check('double-clicking the label opens the rename dialog', renameOpen)
  if (renameOpen) {
    await page.fill('[class*="renameInput"]', '分组 A')
    await page.keyboard.press('Enter')
    await wait(700)
  }
  check('the box title is persisted in global.boxes',
    (await globalState()).boxes?.[newBoxId]?.title === '分组 A',
    JSON.stringify((await globalState()).boxes?.[newBoxId]))

  await page.mouse.click(label2.x, label2.y, { button: 'right' })
  await wait(450)
  await clickMenuItem('颜色')
  await clickMenuItem('蓝')
  const recoloured = (await globalState()).wsColors?.[newBoxId]
  check('a box colour is stored in global.wsColors',
    recoloured === 'blue', String(recoloured))
  await page.screenshot({ path: path.join(SHOTS, 'phase1-box-named.png') })

  // ---- 6. deleting a box keeps the cards ----------------------------
  const cardsBeforeDelete = Object.keys((await state()).cards).length
  const label = await page.evaluate((boxId) => {
    const el = document.querySelector(`[data-talkmap-box-label="${boxId}"]`)
    if (el === null) return null
    const rect = el.getBoundingClientRect()
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  }, newBoxId)
  check('the box label is clickable', label !== null, JSON.stringify(label))
  await page.mouse.click(label.x, label.y, { button: 'right' })
  await wait(450)
  check('the box menu offers the ungroup delete',
    await clickMenuItem('删除框'),
    'menu item 删除框（卡片保留）')
  await wait(600)
  const afterDelete = await state()
  const globalAfterDelete = await globalState()
  check('the box is gone', (globalAfterDelete.boxes ?? {})[newBoxId] === undefined,
    JSON.stringify(Object.keys(globalAfterDelete.boxes ?? {})))
  check('the card SURVIVES the box deletion',
    afterDelete.cards[freeCardId] !== undefined
      && afterDelete.cards[freeCardId].sessionId === freeSession,
    JSON.stringify(afterDelete.cards[freeCardId]))
  check('and is a free card again', afterDelete.cards[freeCardId].boxId === undefined,
    String(afterDelete.cards[freeCardId].boxId))
  check('no card was lost with the box', Object.keys(afterDelete.cards).length === cardsBeforeDelete,
    `${cardsBeforeDelete} → ${Object.keys(afterDelete.cards).length}`)
  check('the freed card is still painted', (await paintedCards()).includes(freeCardId), freeCardId)
  await page.screenshot({ path: path.join(SHOTS, 'phase1-box-deleted.png') })

  // ---- 6b. phase 2: free boxes, priority, picker ------------------------
  // A fresh box is FREE: members keep their positions, and moving the box carries them.
  await page.click('[data-talkmap-new-box]')
  await wait(700)
  const boxes2 = (await globalState()).boxes ?? {}
  const freeBoxId = Object.keys(boxes2).find(id => boxes2[id].free === true && boxes2[id].pageId === 'ws-plan')
  check('a new box is created free (members keep their own positions)', freeBoxId !== undefined,
    JSON.stringify(boxes2))
  const fr = (await nodeBoxes()).frames[freeBoxId]
  const zf = await viewportZoom()
  const cardNow = await cardBox(freeCardId)
  const dropAt = { x: fr.x + 40 * zf, y: fr.y + 70 * zf }
  await dragCardBy(freeCardId, { x: dropAt.x - cardNow.x, y: dropAt.y - cardNow.y })
  const inFree = (await state()).cards[freeCardId]
  const inFreeBox = await cardBox(freeCardId)
  check('a card dropped in a free box joins it', inFree.boxId === freeBoxId, String(inFree.boxId))
  check('and keeps the exact drop position (no slot snapping)',
    Math.abs(inFreeBox.x - dropAt.x) <= 20 && Math.abs(inFreeBox.y - dropAt.y) <= 20,
    `${inFreeBox.x},${inFreeBox.y} vs ${dropAt.x},${dropAt.y}`)
  await wait(1000)
  const settledFree = await cardBox(freeCardId)
  check('nothing re-slots a member of a free box',
    Math.abs(settledFree.x - inFreeBox.x) <= 1 && Math.abs(settledFree.y - inFreeBox.y) <= 1,
    `${inFreeBox.x},${inFreeBox.y} → ${settledFree.x},${settledFree.y}`)

  // Move the box by its label: the member must travel with it.
  const lbl = await page.evaluate((boxId) => {
    const el = document.querySelector(`[data-talkmap-box-label="${boxId}"]`)
    const rect = el.getBoundingClientRect()
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  }, freeBoxId)
  const storedBeforeMove = (await state()).cards[freeCardId]
  const frameBeforeMove = (await globalState()).wsFrames[freeBoxId]
  await page.mouse.move(lbl.x, lbl.y)
  await wait(60)
  await page.mouse.down()
  await page.mouse.move(lbl.x + 2, lbl.y + 2)
  await wait(90)
  for (let i = 1; i <= 14; i += 1) {
    await page.mouse.move(lbl.x + 2 + (120 * i) / 14, lbl.y + 2 + (60 * i) / 14)
    await wait(20)
  }
  await wait(90)
  await page.mouse.up()
  await wait(1100)
  const storedAfterMove = (await state()).cards[freeCardId]
  const frameAfterMove = (await globalState()).wsFrames[freeBoxId]
  const fdx = frameAfterMove.x - frameBeforeMove.x
  const fdy = frameAfterMove.y - frameBeforeMove.y
  check('the box moved', Math.abs(fdx) > 20 || Math.abs(fdy) > 20, `${fdx},${fdy}`)
  check('its member moved by the same delta',
    Math.abs((storedAfterMove.x - storedBeforeMove.x) - fdx) <= 1
      && Math.abs((storedAfterMove.y - storedBeforeMove.y) - fdy) <= 1
      && storedAfterMove.boxId === freeBoxId,
    `box ${fdx},${fdy}; card ${storedAfterMove.x - storedBeforeMove.x},${storedAfterMove.y - storedBeforeMove.y}`)

  // The box can be switched to the slot grid and back from its menu.
  const lbl2 = await page.evaluate((boxId) => {
    const el = document.querySelector(`[data-talkmap-box-label="${boxId}"]`)
    const rect = el.getBoundingClientRect()
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  }, freeBoxId)
  await page.mouse.click(lbl2.x, lbl2.y, { button: 'right' })
  await wait(450)
  await clickMenuItem('网格排列')
  check('the box menu switches it to the grid', (await globalState()).boxes[freeBoxId].free === false,
    JSON.stringify((await globalState()).boxes[freeBoxId]))
  await page.mouse.click(lbl2.x, lbl2.y, { button: 'right' })
  await wait(450)
  await clickMenuItem('自由摆放')
  check('and back to free placement', (await globalState()).boxes[freeBoxId].free === true)

  // Priority: right-click a card → mark high.
  const pc = await cardBox(freeCardId)
  await page.mouse.click(pc.x + 60, pc.y + 30, { button: 'right' })
  await wait(450)
  await clickMenuItem('高优先级')
  check('the card menu marks a high priority', (await state()).cards[freeCardId].priority === 1,
    String((await state()).cards[freeCardId].priority))
  check('the card wears its priority chip',
    await harness(() => document.querySelector('[data-talkmap-priority="1"]') !== null))
  check('the priority rail counts it',
    await harness(() => /1/.test(document.querySelector('[class*="statusRailTabCount"]')?.textContent ?? '')))
  await page.screenshot({ path: path.join(SHOTS, 'phase2-priority-free-box.png') })
  await page.mouse.click(pc.x + 60, pc.y + 30, { button: 'right' })
  await wait(450)
  await clickMenuItem('取消优先级')
  check('the mark can be cleared', (await state()).cards[freeCardId].priority === undefined)

  // Picker: untick a conversation → its card leaves the map; tick it → it returns free.
  const cardCountBefore = Object.keys((await state()).cards).length
  await page.click('[data-talkmap-open-picker]')
  await wait(500)
  const rowSel = `[data-talkmap-picker-row="${freeSession}"] input`
  check('the picker lists the conversation ticked', await page.isChecked(rowSel))
  await page.click(rowSel)
  await page.click('[data-talkmap-picker-apply]')
  await wait(800)
  check('unticking removes the card from the map',
    (await state()).cards[freeCardId] === undefined
      && Object.keys((await state()).cards).length === cardCountBefore - 1,
    String(Object.keys((await state()).cards).length))
  await page.click('[data-talkmap-open-picker]')
  await wait(500)
  check('the picker lists it unticked now', !(await page.isChecked(rowSel)))
  await page.click(rowSel)
  await page.click('[data-talkmap-picker-apply]')
  await wait(800)
  const readded = Object.values((await state()).cards).find(card => card.sessionId === freeSession)
  check('ticking brings it back as a free card', readded !== undefined && readded.boxId === undefined,
    JSON.stringify(readded))
  await page.screenshot({ path: path.join(SHOTS, 'phase2-after-picker.png') })

  // autoAdd off: the picker's switch is stored.
  await page.click('[data-talkmap-open-picker]')
  await wait(500)
  await page.click('[class*="pickerAuto"] input')
  await wait(500)
  check('auto-add can be switched off', (await globalState()).autoAdd === false,
    String((await globalState()).autoAdd))
  await page.click('[class*="pickerCancel"]')

  // ---- 7. no uncaught errors ----------------------------------------
  check('no uncaught page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
  server.close()
}

const failures = results.filter(result => result.passed !== true)
console.log(`\n${results.length - failures.length}/${results.length} checks passed`)
if (failures.length > 0) {
  console.log('failed:')
  for (const failure of failures) console.log(`  - ${failure.name}  (${failure.detail ?? ''})`)
  process.exitCode = 1
}
