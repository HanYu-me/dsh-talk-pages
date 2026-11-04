/**
 * The per-edge auto-push switch lives in the client bundle; the headless probe
 * cannot reach it (the fixture edge sits on a folded card), so the wiring is
 * asserted statically here.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync('client/client.js', 'utf8')

// 1. the menu offers the switch, both directions
assert.match(source, /开启自动推送/, 'missing 开启自动推送 label')
assert.match(source, /关闭自动推送/, 'missing 关闭自动推送 label')

// 2. the toggle flips injection.autoPush on the stored edge
assert.match(source, /autoPush: !auto/, 'toggle must invert the stored flag')

// 3. push and spawn go through the on-demand digest route
assert.match(source, /\/talk-pages\/digest\/ensure/, 'client must call /talk-pages/digest/ensure')
assert.match(source, /ensureDigest/, 'client must expose ensureDigest')

// 4. the push text keeps the reminder
assert.match(source, /以上是摘要提纲/, 'push text lost the reminder')

console.log('edge-autopush: 6 checks passed')
