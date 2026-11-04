#!/usr/bin/env node
/**
 * Regenerates the README screenshots (docs/screenshots/*.png) from the offline
 * harness in its fictional demo mode (?demo=1): no real conversation titles.
 *
 *   node scripts/build-client.mjs && node scripts/screenshots.mjs
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'docs/screenshots')
const PORT = 8794
const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(candidate => fs.existsSync(candidate))
if (CHROME === undefined) { console.error('no Chrome found'); process.exit(1) }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' }
const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://127.0.0.1:${PORT}`)
  const file = path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/test/index.html' : url.pathname))
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { response.writeHead(404).end(); return }
  response.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  response.end(fs.readFileSync(file))
})
await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve))

fs.mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1.5 })
const page = await context.newPage()
const wait = ms => page.waitForTimeout(ms)
const harness = (fn, arg) => page.evaluate(fn, arg)
const URL_ = `http://127.0.0.1:${PORT}/test/index.html?demo=1`

async function boot() {
  await page.goto(URL_)
  await page.waitForFunction(() => window.__harness !== undefined)
  await wait(400)
  if (await page.evaluate(() => document.querySelector('[class*="tm_panel"]') === null)) {
    await harness(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F', code: 'KeyF', altKey: true })))
  }
  await wait(1600)
}
const openPage = async (id) => { await harness((p) => { window.__harness.openPage(p) }, id); await wait(700) }

// 1. First boot, then compose the showcase layout for the first page and save it
//    as the demo state the harness restores on the next load.
await boot()
const payload = await harness(() => JSON.parse(JSON.stringify(window.__harness.state())))
const global = await harness(() => JSON.parse(JSON.stringify(window.__harness.globalState())))
const cardOf = sessionId => Object.entries(payload.cards).find(([, card]) => card.sessionId === sessionId)?.[0]
const PAGE = 'ws-daily'
const place = (sessionId, x, y, box, priority) => {
  const id = cardOf(sessionId)
  if (id === undefined) throw new Error(`no card for ${sessionId}`)
  const card = { ...payload.cards[id], x, y }
  delete card.boxId
  delete card.priority
  if (box !== undefined) card.boxId = box
  if (priority !== undefined) card.priority = priority
  payload.cards[id] = card
}
global.boxes = { ...global.boxes }
delete global.boxes[PAGE]
delete global.wsFrames[PAGE]
global.boxes['demo-site'] = { pageId: PAGE, title: '官网改版', free: true }
global.boxes['demo-content'] = { pageId: PAGE, title: '内容与素材', free: true }
global.wsFrames['demo-site'] = { x: 0, y: 0, width: 800, height: 260 }
global.wsFrames['demo-content'] = { x: 0, y: 330, width: 800, height: 260 }
global.wsColors = { ...global.wsColors, 'demo-site': 'blue', 'demo-content': 'green' }
global.activePage = PAGE
global.cameraByBoard = {}
global.layoutVersion = 5
global.snap = true
global.autoAdd = false
// The two boxes: free placement, members positioned by hand.
place('s1', 32, 70, 'demo-site', 1)
place('s11', 288, 70, 'demo-site', 1)
place('s12', 544, 70, 'demo-site')
place('s3', 32, 400, 'demo-content', 2)
place('s13', 288, 400, 'demo-content')
place('s4', 544, 400, 'demo-content')
// Loose cards to the right, outside any box.
place('s2', 900, 70, undefined, 3)
place('s5', 900, 330)
const link = (from, to) => { payload.edges[`edge-demo-${from}-${to}`] = { boardId: 'inbox', fromCardId: cardOf(from), toCardId: cardOf(to), injection: { kind: 'link' }, fromHandle: 'r', toHandle: 'l', createdAt: Date.now() } }
payload.edges = {}
link('s2', 's1')
link('s5', 's13')
payload.global = global
await harness((value) => { window.localStorage.setItem('dsh-talk-pages.demo-state.v1', JSON.stringify(value)) }, payload)

// 2. Reload into the composed layout; one conversation is archived.
await boot()
await harness(() => window.__harness.archive('s4'))
await openPage(PAGE)
await harness(() => { try { window.localStorage.setItem('dsh.talk-pages.priority-rail.open.v1', '0') } catch {} })
await page.reload()
await page.waitForFunction(() => window.__harness !== undefined)
await wait(2000)
if (await page.evaluate(() => document.querySelector('[class*="tm_panel"]') === null)) {
  await harness(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F', code: 'KeyF', altKey: true })))
  await wait(1600)
}
await harness(() => window.__harness.archive('s4'))
await openPage(PAGE)
await wait(900)
await page.screenshot({ path: path.join(OUT, '1-pages-boxes-priority.png') })

// 2b. The priority rail, opened.
await page.click('[class*="statusRailTab"]')
await wait(700)
await page.screenshot({ path: path.join(OUT, '6-priority-rail.png') })
await page.click('[class*="statusRailTab"]')
await wait(600)

// 3. Right-click a card: the priority menu.
const cardBox = await harness(() => {
  const el = document.querySelector('[data-talkmap-session="s5"]')
  const r = el.getBoundingClientRect()
  return { x: r.x, y: r.y }
})
await page.mouse.click(cardBox.x + 60, cardBox.y + 40, { button: 'right' })
await wait(500)
await page.screenshot({ path: path.join(OUT, '2-card-menu.png') })
await page.mouse.click(150, 500) // empty canvas: closes a menu without touching a card
await wait(400)

// 4. Right-click empty canvas → show / hide conversations.
await page.mouse.click(1000, 440, { button: 'right' })
await wait(450)
await harness(() => {
  const item = [...document.querySelectorAll('[role="menuitem"]')].find(el => el.textContent.includes('显示 / 隐藏对话'))
  item?.click()
})
await wait(600)
await page.screenshot({ path: path.join(OUT, '3-show-hide-menu.png') })
await page.mouse.click(150, 500) // empty canvas: closes a menu without touching a card
await wait(400)

// 5. The conversation picker (archived ones included).
await page.click('[data-talkmap-open-picker]')
await wait(700)
await page.screenshot({ path: path.join(OUT, '4-conversation-picker.png') })
await page.click('[class*="pickerCancel"]')
await wait(300)

// 6. Another page, to show the tab bar swapping the whole canvas.
await openPage('ws-physics')
await wait(500)
await page.screenshot({ path: path.join(OUT, '5-another-page.png') })

await browser.close()
server.close()
console.log('screenshots written to docs/screenshots/')
