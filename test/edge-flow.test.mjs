/**
 * Static checks on the built client + stylesheet.
 *
 * 未同步 = 灰色虚线；同步中 = 整条线透明度 0（看不见）。
 * 没有发光、没有流光、没有粒子。
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'

const bundle = fs.readFileSync('client/client.js', 'utf8')
const css = fs.readFileSync('src/client/talk-pages.module.css', 'utf8')

// 1. every edge renders through the custom component
assert.match(bundle, /type: TALK_MAP_EDGE_TYPE/, 'edges must use the custom renderer')
assert.match(bundle, /edgeTypes=\{?\s*edgeTypes|edgeTypes:/, 'edgeTypes must be registered on ReactFlow')

// 2. a dashed grey line, hidden entirely once synced
assert.match(bundle, /strokeDasharray: "6 5"/, 'the line must be dashed')
assert.match(bundle, /opacity: hidden \? 0 : 1/, 'a synced line must be invisible')
assert.match(bundle, /data\.structural !== true/, "fork links must never hide themselves")


// 4. direction: a hand-drawn arrowhead, oriented to the target face
assert.match(bundle, /M0 0 L-11 -5 L-11 5 Z/, 'the arrowhead must be drawn here')
assert.match(bundle, /arrowAngle/, 'the arrowhead must orient to the target face')

// 5. no travelling light and no particles
assert.ok(!/SWEEP_S/.test(bundle), 'the sweep must be gone')
assert.ok(!/SPARK/.test(bundle), 'spark particles must stay gone')
assert.ok(!/maskUnits/.test(bundle), 'the sweep mask must be gone')

// 6. routing: faces are computed, not hardcoded
assert.match(bundle, /pickFaces/, 'edges must use the routing module')
assert.match(bundle, /computedHandles/, 'stored edges must recompute their faces')


// 8. no leftover looks in the stylesheet
for (const gone of ['tmEdgeHead', 'tmEdgeMid', 'tmEdgeTail', 'tmEdgeComet', 'tmEdgeBloom', 'tmEdgeFlow', 'tmEdgeSweep']) {
  assert.ok(!css.includes(gone), 'the ' + gone + ' rule must be gone from the stylesheet')
}

// 7. the drawer draws the same links, with the same look and rule
assert.match(bundle, /drawerWires/, "the drawer must draw its links")
assert.match(bundle, /links: drawerWireLinks/, "the canvas must feed the drawer its links")

// 12. lines are routed around cards, on the gap grid
assert.match(bundle, /routeBetween/, 'edges must use the obstacle-avoiding router')
assert.match(bundle, /roundedPath/, 'the drawer must still draw rounded corners where it uses a polyline')
assert.match(bundle, /obstacles: obstaclesFor\(/, "the canvas must hand the obstacle list to the renderer")
assert.match(bundle, /snapToChannels/, "runs must be snapped to the gap centre")
console.log('edge-flow: 20 checks passed')
// 7. the drawer draws the same links, with the same look and rule
assert.match(bundle, /links: drawerWireLinks/, "the canvas must feed the drawer its links")
