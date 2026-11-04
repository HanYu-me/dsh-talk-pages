/**
 * Agent API (src/host/agent-api.ts): command files change the map through the
 * same store the UI uses, and map.json mirrors it. Runs the real module (bundled
 * on the fly) against an in-memory store and a temp directory.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'talk-pages-agent-'))
const out = path.join(tmp, 'agent-api.mjs')
await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/host/agent-api.ts')],
  outfile: out, bundle: true, format: 'esm', platform: 'node', external: ['node:*'], logLevel: 'silent',
  nodePaths: [path.join(ROOT, 'node_modules')],
})
const { applyOps, snapshot, startAgentApi } = await import(pathToFileURL(out).href)

function table() {
  const map = new Map()
  return {
    get: key => map.get(key), entries: () => map.entries(), keys: () => map.keys(),
    get size() { return map.size },
    async put(key, value) { map.set(key, value) }, async delete(key) { return map.delete(key) },
  }
}
function fakeStore() {
  let global = { version: 1, activeBoard: 'inbox', cameraByBoard: {} }
  return { cards: table(), edges: table(), digests: table(), boards: table(), global: () => global, setGlobal: async (value) => { global = value } }
}

const store = fakeStore()
await applyOps(store, [
  { op: 'createBox', id: 'box-tech', page: 'ws-a', title: '科技', x: 0, y: 0, width: 800, height: 400, color: 'blue' },
  { op: 'placeCards', cards: [
    { session: 's1', x: 40, y: 60, box: 'box-tech', priority: 1 },
    { session: 's2', x: 300, y: 60, box: 'box-tech' },
    { session: 's3', x: 900, y: 0 },
  ] },
])
const g = store.global()
assert.equal(g.boxes['box-tech'].title, '科技')
assert.equal(g.boxes['box-tech'].free, true, 'boxes made by agents are free by default')
assert.deepEqual(g.wsFrames['box-tech'], { x: 0, y: 0, width: 800, height: 400 })
assert.equal(g.wsColors['box-tech'], 'blue')
const bySession = Object.fromEntries([...store.cards.entries()].map(([, card]) => [card.sessionId, card]))
assert.equal(bySession.s1.boxId, 'box-tech')
assert.equal(bySession.s1.priority, 1)
assert.equal(bySession.s3.boxId, undefined)

// Updating an existing card keeps its identity; null clears.
const before = [...store.cards.entries()].find(([, card]) => card.sessionId === 's1')[0]
await applyOps(store, [
  { op: 'placeCards', cards: [{ session: 's1', x: 100, box: null, priority: null }] },
  { op: 'setPriority', session: 's2', priority: 3 },
  { op: 'updateBox', id: 'box-tech', title: '科技股', free: false },
])
const after = [...store.cards.entries()].find(([, card]) => card.sessionId === 's1')
assert.equal(after[0], before)
assert.equal(after[1].x, 100)
assert.equal(after[1].y, 60)
assert.equal(after[1].boxId, undefined)
assert.equal(after[1].priority, undefined)
assert.equal(store.global().boxes['box-tech'].title, '科技股')
assert.equal(store.global().boxes['box-tech'].free, false)

// Deleting a box ungroups; removeCards drops cards and their edges.
await store.edges.put('e1', { fromCardId: [...store.cards.keys()][0], toCardId: [...store.cards.keys()][1] })
await applyOps(store, [{ op: 'deleteBox', id: 'box-tech' }, { op: 'removeCards', sessions: ['s2'] }])
assert.equal(store.global().boxes['box-tech'], undefined)
assert.equal([...store.cards.entries()].some(([, card]) => card.sessionId === 's2'), false)
assert.equal(store.edges.size, 0)

// Errors are loud.
await assert.rejects(applyOps(store, [{ op: 'updateBox', id: 'nope', title: 'x' }]), /unknown box/)
await assert.rejects(applyOps(store, [{ op: 'setPriority', session: 'ghost', priority: 1 }]), /not on the map/)

const snap = snapshot(store)
assert.equal(snap.cards.length, 2)
assert.ok(snap.note.includes('inbox'))

// File round trip: inbox → applied → done/, map.json written, bad file → failed/.
const dir = path.join(tmp, 'tp')
const live = fakeStore()
const logs = []
const stop = startAgentApi(Promise.resolve(live), message => logs.push(message), () => () => {}, dir)
await new Promise(resolve => setTimeout(resolve, 400))
fs.writeFileSync(path.join(dir, 'inbox', 'a.json'), JSON.stringify({ ops: [{ op: 'placeCards', cards: [{ session: 'sx', x: 1, y: 2 }] }] }))
fs.writeFileSync(path.join(dir, 'inbox', 'b.json'), '{ "ops": [ { "op": "teleport" } ] }')
await new Promise(resolve => setTimeout(resolve, 1800))
stop()
assert.equal([...live.cards.entries()].filter(([, card]) => card.sessionId === 'sx').length, 1, logs.join('\n'))
assert.equal(fs.readdirSync(path.join(dir, 'inbox', 'done')).length, 1)
assert.ok(fs.existsSync(path.join(dir, 'inbox', 'failed', 'b.json.error.txt')))
assert.ok(fs.existsSync(path.join(dir, 'map.json')))
assert.equal(JSON.parse(fs.readFileSync(path.join(dir, 'map.json'), 'utf8')).cards.length, 1)
fs.rmSync(tmp, { recursive: true, force: true })
console.log('agent-api: ok')
