/**
 * Static assertions on the Host bundle: the digest must be opt-in.
 *
 * The headless probe only loads the client bundle, so the host half is verified
 * here — cheap, and it fails loudly if a future edit re-enables per-turn digests
 * or drops the on-demand route.
 *
 * NOTE: the bundle is produced by scripts/build-host.mjs (esbuild, `var` + one
 * short statement per line), so the regexes below match esbuild's formatting.
 * Every check asserts the same contract as before the build migration — the
 * shipped host this plugin regressed from is test/fixtures/orig-lib.js.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync('lib/index.js', 'utf8')

// 1. per-turn generation is OFF by default
assert.match(source, /enabled: false, idleMs: 3e4/, 'DIGEST_DEFAULTS.enabled must default to false')

// 2. the turn/end gate only lets auto-push sessions through
assert.match(source, /if \(!this\.config\.enabled && !\(this\.config\.shouldAuto\?\.\(session\.id\) \?\? false\)\) return/, 'turn/end must be gated by config.enabled OR shouldAuto')

// 3. on-demand regeneration exists and is hash-aware (force: false)
assert.match(source, /async ensure\(sessionId\) \{\s*\n\s*return await this\.run\(sessionId, \{ force: false \}\)/, 'ensure() must use force: false so an unchanged transcript skips the LLM')

// 4. explicit refresh is still the forced path
assert.match(source, /async refresh\(sessionId\) \{\s*\n\s*return await this\.run\(sessionId, \{ force: true \}\)/, 'refresh() must stay forced')

// 5. the route the client calls
assert.match(source, /route === "POST \/talk-pages\/digest\/ensure"/, 'missing /talk-pages/digest/ensure route')

// 6. auto push is per edge and rides injectInto
assert.match(source, /injection\?\.autoPush !== true/, 'auto push must check injection.autoPush')
// 8. a delivery stamps the edge, which is what the sync animation reads
assert.match(source, /lastPushAt: pushedAt/, 'auto push must stamp the edge it delivered on')
assert.match(source, /runtime\.spawner\.injectInto\(target\.sessionId,/, 'auto push must deliver through the spawner')

// 7. the push text carries the "read the full conversation" reminder
assert.match(source, /【提醒】以上是摘要提纲/, 'host push text lost the reminder')

console.log('host-digest: 7 checks passed')
