/**
 * Behavioural checks on the Host bundle (lib/index.js): load the real plugin
 * into a fake cordis context with fake dsh services, then drive the real HTTP
 * handler. No browser, no dsh, no network.
 *
 *   node test/host-runtime.test.mjs   (after npm run build:host)
 *
 * The other host tests are static regexes; this one is the only place that
 * exercises the routes and the digest layer end to end — it is what catches a
 * route that answers the wrong shape, a digest that is not hash-skipped, and an
 * auto-push edge that never delivers. HOME points at a temp dir so the
 * client-boot breadcrumb cannot touch the real profile.
 */
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

const HOME = mkdtempSync(path.join(tmpdir(), 'dsh-talk-pages-host-'))
process.env.HOME = HOME

const { apply } = await import('../lib/index.js')

// ---- fake dsh services ----------------------------------------------------
const tables = new Map()
function table(name) {
  if (!tables.has(name)) tables.set(name, new Map())
  const map = tables.get(name)
  return {
    get: key => map.get(key),
    entries: () => map.entries(),
    keys: () => map.keys(),
    get size() { return map.size },
    async put(key, value) { map.set(key, value) },
    async delete(key) { return map.delete(key) },
    async update(key, fn) { const next = fn(map.get(key)); map.set(key, next); return next },
  }
}
let globalValue = { version: 1, activeBoard: 'inbox', cameraByBoard: {} }
const domain = {
  name: 'talk_pages',
  global: { get: () => globalValue, set: async value => { globalValue = value } },
  table,
  close: async () => {},
}

const injected = []
const liveSessions = new Set()
const agents = {
  get: id => (liveSessions.has(id)
    ? { inject: message => injected.push({ id, message }), followup() {} }
    : undefined),
  async create() {
    liveSessions.add('session-spawned')
    return {
      agent: { inject: message => injected.push({ id: 'session-spawned', message }), followup() {} },
      dispose: async () => {},
    }
  },
}
/** Bumped between digest calls so the transcript — and its hash — changes. */
let revision = 0
const searchCalls = []
const llmCalls = []
const sessionQuery = {
  async listSessions() {
    return [...new Set([...tables.get('cards')?.values() ?? []].map(card => card.sessionId))]
      .map(id => ({ header: { id, createdAt: 1, title: `title-${id}`, cwd: '/work/a' }, live: true, persisted: true }))
  },
  async readSurface(sessionId) {
    if (sessionId === 'missing') throw new Error('no surface')
    return {
      capturedThroughSeq: 10,
      events: [
        { type: 'user/message', seq: 1, data: { source: undefined, content: [{ type: 'text', text: `you told me about ${sessionId}` }] } },
        // An envelope turn: the host must skip it (it is not human text).
        { type: 'user/message', seq: 2, data: { source: { kind: 'runtime-context' }, content: [{ type: 'text', text: 'Time sampled while preparing turn 1' }] } },
        { type: 'assistant/message', seq: 3, data: { message: { content: [{ type: 'text', text: `answer about ${sessionId} rev=${revision}` }] } } },
      ],
    }
  },
  async searchSessions(request, exec) {
    searchCalls.push({ request, hasSignal: exec?.signal !== undefined })
    return {
      items: [
        { header: { id: 'session-a' }, bestMatch: { snippet: 'you told me about session-a', type: 'user/message', seq: 3 } },
        // Tool output is not conversation text: this hit must be dropped.
        { header: { id: 'session-b' }, bestMatch: { snippet: 'tool output only', type: 'tool/result', seq: 4 } },
      ],
    }
  },
  async searchEvents() {
    return {
      items: [
        { snippet: 'you told me about session-a\nsecond line', seq: 3 },
        { snippet: 'answer about session-a', seq: 4 },
      ],
    }
  },
  async filterEvents() {
    return [{ text: 'you told me about session-a. The needle is hello world here. tail', seq: 3 }]
  },
  async readEvent() {
    return {
      target: {
        type: 'user/message', seq: 3,
        data: { content: [{ type: 'text', text: 'first line\nhello world is on this line\nlast line' }] },
      },
      events: [{ type: 'tool/result', seq: 4, data: { content: [{ type: 'text', text: 'hello world tool noise' }] } }],
    }
  },
}
const llm = {
  async *stream(options) {
    llmCalls.push(options)
    yield { type: 'text-delta', text: JSON.stringify({ summary: 'the summary', keyFindings: ['k1'], nextStep: 'do next' }) }
    yield { type: 'finish', reason: { kind: 'stop' } }
  },
}
const listeners = new Map()
const services = {
  storageDomain: { open: async () => domain },
  webServer: { register: route => { services.route = route; return () => {} } },
  sessionQuery,
  llm,
  agentDefaultModel: { currentSelection: () => ({ provider: 'prov', model: 'mod' }) },
  agentPresets: { defaultId: 'preset-x' },
  agents,
  workspaceRegistry: { resolveByPath: async () => ({ attachSession: async () => {} }) },
  logger: { info() {}, warn(message) { services.warnings.push(message) }, warnings: [] },
  effect(callback) { return callback() },
  on(event, listener) {
    if (!listeners.has(event)) listeners.set(event, [])
    listeners.get(event).push(listener)
    return () => {}
  },
}

apply({ logger: services.logger, inject: (_deps, callback) => { callback(services) } })
assert.ok(services.route, 'webServer.register must have been called')

// ---- fake HTTP ------------------------------------------------------------
function request(method, url, body) {
  const payload = body === undefined ? '' : JSON.stringify(body)
  return {
    method,
    url,
    headers: { host: '127.0.0.1:9', 'content-type': 'application/json' },
    async *[Symbol.asyncIterator]() {
      if (payload !== '') yield Buffer.from(payload, 'utf8')
    },
  }
}
function response() {
  return {
    status: 0,
    headersSent: false,
    body: '',
    writeHead(status) { this.status = status; this.headersSent = true },
    write() {},
    end(chunk) { if (chunk !== undefined) this.body += String(chunk) },
  }
}
async function call(method, url, body) {
  const res = response()
  await services.route.handler(request(method, url, body), res)
  let json = null
  try { json = JSON.parse(res.body) } catch { /* non-JSON body */ }
  return { status: res.status, json }
}
function emit(event, ...args) {
  for (const listener of listeners.get(event) ?? []) listener(...args)
}

let checks = 0
async function ok(name, fn) {
  await fn()
  checks += 1
  console.log(`  ok ${name}`)
}

console.log('host-runtime')

try {
  await ok('GET /state serves the inbox board and the current global', async () => {
    const { status, json } = await call('GET', '/talk-pages/state')
    assert.equal(status, 200)
    assert.ok(json.boards.inbox)
    assert.deepEqual(json.global, globalValue)
  })

  await ok('GET /defaults reports the deployment model route and preset', async () => {
    const { status, json } = await call('GET', '/talk-pages/defaults')
    assert.equal(status, 200)
    assert.deepEqual(json, { model: { provider: 'prov', model: 'mod' }, preset: 'preset-x' })
  })

  await ok('POST /cards/upsert persists a card', async () => {
    const { status, json } = await call('POST', '/talk-pages/cards/upsert', {
      cards: { 'card-a': { boardId: 'inbox', sessionId: 'session-a', x: 1, y: 2, createdAt: 3 } },
    })
    assert.equal(status, 200)
    assert.equal(json.count, 1)
    assert.equal(tables.get('cards').get('card-a').sessionId, 'session-a')
  })

  await ok('POST /global keeps boxes / activePage / snap', async () => {
    const { status } = await call('POST', '/talk-pages/global', {
      global: {
        version: 1, activeBoard: 'inbox', cameraByBoard: {},
        boxes: { b1: { pageId: 'ws-a', title: 'A' } }, activePage: 'ws-a', snap: false,
      },
    })
    assert.equal(status, 200)
    assert.deepEqual(globalValue.boxes, { b1: { pageId: 'ws-a', title: 'A' } })
    assert.equal(globalValue.activePage, 'ws-a')
    assert.equal(globalValue.snap, false)
  })

  await ok('POST /digest/ensure generates a digest for the stored route', async () => {
    const { status, json } = await call('POST', '/talk-pages/digest/ensure', { sessionId: 'session-a' })
    assert.equal(status, 200)
    assert.equal(json.digest.summary, 'the summary')
    assert.equal(json.digest.model, 'prov/mod')
    assert.equal(json.digest.inputHash.length, 64)
  })

  await ok('POST /digest/ensure is hash-skipped on an unchanged transcript', async () => {
    const before = llmCalls.length
    const { status, json } = await call('POST', '/talk-pages/digest/ensure', { sessionId: 'session-a' })
    assert.equal(status, 200)
    assert.equal(json.digest.summary, 'the summary')
    assert.equal(llmCalls.length, before, 'an unchanged transcript must not reach the LLM')
  })

  await ok('POST /digest/refresh forces a regeneration with a producer-owned source', async () => {
    const before = llmCalls.length
    const { status, json } = await call('POST', '/talk-pages/digest/refresh', { sessionId: 'session-a' })
    assert.equal(status, 200)
    assert.equal(json.digest.summary, 'the summary')
    assert.equal(llmCalls.length, before + 1)
    assert.deepEqual(llmCalls.at(-1).messages[0].source, { kind: 'plugin:dsh-talk-pages' })
  })

  await ok('POST /search scopes by cwd and verifies hits against the visible transcript', async () => {
    const { status, json } = await call('POST', '/talk-pages/search', { query: 'hello world', cwd: '/work/a' })
    assert.equal(status, 200)
    assert.deepEqual(json.items.map(item => item.sessionId), ['session-a'])
    assert.match(json.items[0].blocks[0][0], /hello world/)
    assert.deepEqual(json.items[0].seqs, [3])
    assert.deepEqual(searchCalls.at(-1).request.filters, [{ kind: 'cwd', values: ['/work/a'] }])
    assert.equal(typeof searchCalls.at(-1).hasSignal, 'boolean')
    assert.equal(json.hasMore, false)
  })

  await ok('POST /search without cwd searches the whole corpus', async () => {
    await call('POST', '/talk-pages/search', { query: 'hello world' })
    assert.equal(searchCalls.at(-1).request.filters, undefined)
  })

  await ok('POST /search-session returns every hit inside one conversation', async () => {
    const { status, json } = await call('POST', '/talk-pages/search-session', { sessionId: 'session-a', query: 'hello' })
    assert.equal(status, 200)
    assert.equal(json.error, undefined)
    assert.deepEqual(json.blocks, [['you told me about session-a'], ['answer about session-a']])
    assert.deepEqual(json.seqs, [3, 4])
  })

  await ok('POST /search-context returns the passage around the hit', async () => {
    const { status, json } = await call('POST', '/talk-pages/search-context', { sessionId: 'session-a', seq: 3, query: 'hello world' })
    assert.equal(status, 200)
    assert.ok(json.lines.includes('hello world is on this line'), JSON.stringify(json))
    assert.ok(!json.lines.some(line => line.includes('tool noise')), 'tool events are not conversation context')
  })

  await ok('POST /client-boot leaves its breadcrumb under $HOME/.dsh', async () => {
    const { status, json } = await call('POST', '/talk-pages/client-boot', { phase: 'search-host-failed' })
    assert.equal(status, 200)
    assert.deepEqual(json, { ok: true })
    const log = readFileSync(path.join(HOME, '.dsh', 'talk-pages-client-boot.log'), 'utf8')
    assert.match(log, /search-host-failed/)
  })

  await ok('POST /last-user returns only the human text, never an envelope', async () => {
    const { status, json } = await call('POST', '/talk-pages/last-user', { sessionIds: ['session-a', 'missing'] })
    assert.equal(status, 200)
    assert.deepEqual(json.texts, { 'session-a': 'you told me about session-a' })
  })

  await ok('POST /inject answers 409 for a session that is not live', async () => {
    const { status, json } = await call('POST', '/talk-pages/inject', {
      sessionId: 'nope', parents: [{ sessionId: 'session-a', text: 'ctx' }],
    })
    assert.equal(status, 409)
    assert.equal(json.code, 'session-not-live')
  })

  await ok('POST /inject delivers through the live agent with the guard-rail footer', async () => {
    liveSessions.add('session-b')
    injected.length = 0
    const { status } = await call('POST', '/talk-pages/inject', {
      sessionId: 'session-b', parents: [{ sessionId: 'session-a', text: 'ctx text' }],
    })
    assert.equal(status, 200)
    assert.equal(injected.length, 1)
    assert.match(injected[0].message.content[0].text, /^ctx text/)
    assert.match(injected[0].message.content[0].text, /Background summary from another conversation/)
    assert.equal(injected[0].message.source.kind, 'plugin:dsh-talk-pages')
  })

  await ok('POST /spawn creates a card, an edge with lastPushAt and injects', async () => {
    injected.length = 0
    const { status, json } = await call('POST', '/talk-pages/spawn', {
      parents: [{ cardId: 'card-a', sessionId: 'session-a', text: 'inherit this' }],
      boardId: 'inbox', x: 10, y: 20, boxId: 'b1',
    })
    assert.equal(status, 200)
    assert.ok(json.sessionId.startsWith('session-'))
    assert.equal(json.card.boxId, 'b1')
    assert.equal(json.card.sessionId, json.sessionId)
    const edge = Object.values(json.edges)[0]
    assert.equal(edge.injection.kind, 'digest')
    assert.equal(edge.injection.injectedText, 'inherit this')
    assert.equal(typeof edge.lastPushAt, 'number')
    assert.equal(tables.get('cards').get(json.cardId).boxId, 'b1')
    assert.equal(injected.length, 1)
  })

  await ok('an autoPush edge delivers a changed digest and stamps the edge', async () => {
    const { status } = await call('POST', '/talk-pages/edges/upsert', {
      edges: {
        'edge-1': {
          boardId: 'inbox', fromCardId: 'card-a', toCardId: 'card-b',
          injection: { kind: 'link', autoPush: true }, createdAt: 1,
        },
      },
    })
    assert.equal(status, 200)
    assert.equal(tables.get('edges').get('edge-1').injection.autoPush, true)
    await call('POST', '/talk-pages/cards/upsert', {
      cards: {
        'card-a': { boardId: 'inbox', sessionId: 'session-a', x: 1, y: 2, createdAt: 3 },
        'card-b': { boardId: 'inbox', sessionId: 'session-b', x: 5, y: 6, createdAt: 7 },
      },
    })
    // The host re-reads the auto-push source set on edge changes; the storage
    // service emits this event, the fake carries it here.
    emit('domain/changed', {
      domain: 'talk_pages', table: 'edges', key: 'edge-1',
      operation: 'put', value: tables.get('edges').get('edge-1'),
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    injected.length = 0
    revision = 1 // the transcript moved on → the next digest is a NEW one
    const { status: refreshed, json } = await call('POST', '/talk-pages/digest/refresh', { sessionId: 'session-a' })
    assert.equal(refreshed, 200)
    assert.equal(json.digest.summary, 'the summary')
    await new Promise(resolve => setTimeout(resolve, 20))
    assert.equal(injected.length, 1, 'the digest must be pushed along the autoPush edge')
    assert.equal(injected[0].id, 'session-b')
    assert.match(injected[0].message.content[0].text, /【提醒】以上是摘要提纲/)
    assert.match(injected[0].message.content[0].text, /title-session-a/)
    assert.equal(typeof tables.get('edges').get('edge-1').lastPushAt, 'number')
  })

  await ok('a hash-skipped ensure does not push again', async () => {
    injected.length = 0
    await call('POST', '/talk-pages/digest/ensure', { sessionId: 'session-a' })
    await new Promise(resolve => setTimeout(resolve, 20))
    assert.equal(injected.length, 0)
  })
} finally {
  rmSync(HOME, { recursive: true, force: true })
}

console.log(`host-runtime: ${checks} checks passed`)
