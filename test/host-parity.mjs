/**
 * Host parity tripwire: the rebuilt bundle (lib/index.js) must expose the same
 * HTTP surface and the same runtime capabilities as the host that actually
 * shipped before this fork (test/fixtures/orig-lib.js, a saved copy of the
 * hand-patched bundle — names already renamed talk-map → talk-pages).
 *
 *   node test/host-parity.mjs
 *
 * Why a separate test: src/host had drifted from the shipped bundle, so a
 * rebuilt lib/index.js silently lost /talk-pages/digest/ensure (the client 404s
 * on push/spawn), /talk-pages/search-session, /talk-pages/client-boot and the
 * whole auto-push layer. Nothing else in the suite compares the two halves.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIG = path.join(ROOT, 'test/fixtures/orig-lib.js')
const BUILT = path.join(ROOT, 'lib/index.js')

const read = file => fs.readFileSync(file, 'utf8')

/** `route === "METHOD /talk-pages/…"` — the only place a route is declared. */
function routeStrings(source) {
  const out = new Set()
  for (const match of source.matchAll(/route === ['"]([^'"]+)['"]/g)) out.add(match[1])
  return out
}

/** `runtime.<name> = …` (not `==`, not a read) — capabilities the routes use. */
function runtimeAssignments(source) {
  const out = new Set()
  for (const match of source.matchAll(/runtime\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) out.add(match[1])
  return out
}

function sorted(values) {
  return [...values].sort()
}

function assertSameSet(label, actual, expected) {
  const onlyActual = sorted(actual).filter(value => !expected.has(value))
  const onlyExpected = sorted(expected).filter(value => !actual.has(value))
  assert.deepEqual(
    { missing: onlyExpected, extra: onlyActual },
    { missing: [], extra: [] },
    `${label} drifted from the shipped host — missing: ${JSON.stringify(onlyExpected)}, extra: ${JSON.stringify(onlyActual)}`,
  )
}

const orig = read(ORIG)
const built = read(BUILT)

// ---- 1. HTTP routes -------------------------------------------------------
const origRoutes = routeStrings(orig)
const builtRoutes = routeStrings(built)

// Guard against a vacuous pass (a rename of the `route` variable would empty
// both sets and still compare equal).
assert.ok(origRoutes.size >= 18, `route extraction is broken: only ${origRoutes.size} routes found in orig-lib.js`)
assert.ok(origRoutes.has('POST /talk-pages/digest/ensure'), 'orig-lib.js lost /talk-pages/digest/ensure — is the fixture the shipped bundle?')
assert.ok(builtRoutes.has('POST /talk-pages/digest/ensure'), 'the rebuilt host is missing /talk-pages/digest/ensure (the client calls it on push/spawn)')

assertSameSet('the host route table', builtRoutes, origRoutes)
assert.deepEqual(sorted(builtRoutes), sorted(origRoutes), 'route table parity')

// ---- 2. runtime capabilities ---------------------------------------------
const origRuntime = runtimeAssignments(orig)
const builtRuntime = runtimeAssignments(built)

assert.deepEqual(sorted(origRuntime), [
  'autoPushSessions', 'digest', 'modelDefault', 'presetDefault',
  'search', 'searchContext', 'searchSession', 'sessionQuery', 'spawner',
], 'orig-lib.js runtime set changed — the fixture is not the shipped host anymore')
assertSameSet('the runtime capability set', builtRuntime, origRuntime)

// ---- 3. every route the client calls is served (by BOTH hosts) -----------
// "If a client call exists for a route that orig-lib.js also lacks, report it
// instead of inventing it" — so a client-only route fails this check.
const clientSources = []
function collectClientSources(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectClientSources(full)
    else if (/\.(?:ts|tsx)$/.test(entry.name)) clientSources.push(read(full))
  }
}
collectClientSources(path.join(ROOT, 'src/client'))

const clientPaths = new Set()
for (const source of clientSources) {
  for (const match of source.matchAll(/\/talk-pages\/[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*/g)) {
    clientPaths.add(match[0])
  }
}
assert.ok(clientPaths.size >= 10, `client route extraction is broken: only ${clientPaths.size} paths found`)

const hostPaths = routes => new Set([...routes].map(route => route.slice(route.indexOf('/talk-pages/'))))
const origHostPaths = hostPaths(origRoutes)
const builtHostPaths = hostPaths(builtRoutes)

const unserved = sorted(clientPaths).filter(clientPath => !builtHostPaths.has(clientPath))
assert.deepEqual(unserved, [], `the client calls routes the rebuilt host does not serve: ${JSON.stringify(unserved)}`)
const invented = sorted(clientPaths).filter(clientPath => !origHostPaths.has(clientPath))
assert.deepEqual(invented, [], `the client calls routes the SHIPPED host never had (report, do not invent): ${JSON.stringify(invented)}`)

console.log(
  `host-parity: ${builtRoutes.size} routes + ${builtRuntime.size} runtime capabilities match the shipped host `
  + `(${clientPaths.size} client-called routes all served)`,
)
