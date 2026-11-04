/**
 * Pure checks for the edge sync state machine (no browser):
 *   node test/edge-sync.test.mjs
 *
 * The three states decide a colour and whether a packet animates, so getting
 * them backwards would make the map lie about its data.
 */
import assert from 'node:assert/strict'
import { FAR_BEHIND_MS, edgeSyncState, lineageSyncState } from '../src/client/edge-sync.ts'

const NOW = 1_700_000_000_000
const HOUR = 60 * 60 * 1000

// A link edge carries no context: never flows, never warns.
assert.equal(edgeSyncState({ kind: 'link', now: NOW }), 'idle', 'link edges are idle')
assert.equal(edgeSyncState({ kind: 'link', lastPushAt: NOW - 3 * HOUR, now: NOW }), 'idle')

// A fork line copied the history once and is not a live channel.
assert.equal(edgeSyncState({ kind: 'full', lastPushAt: NOW, sourceUpdatedAt: NOW, now: NOW }), 'idle')

// Never pushed: nothing to be in sync with.
assert.equal(edgeSyncState({ kind: 'digest', sourceUpdatedAt: NOW, now: NOW }), 'idle')

// Pushed after the last change (or at the same moment) → in sync → flowing.
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW, sourceUpdatedAt: NOW - HOUR, now: NOW }),
  'synced',
)
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW, sourceUpdatedAt: NOW + 2_000, now: NOW }),
  'synced',
  'a couple of seconds of clock skew still counts as the same moment',
)

// The source moved on after the push → stale, no flow.
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW - HOUR, sourceUpdatedAt: NOW, now: NOW }),
  'stale',
)

// Stale AND the push is old → far behind.
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW - FAR_BEHIND_MS - 1, sourceUpdatedAt: NOW, now: NOW }),
  'far',
)
assert.equal(FAR_BEHIND_MS, 12 * HOUR, 'the "far behind" threshold is 12 hours')

// Missing inputs never invent a state.
assert.equal(edgeSyncState({ kind: 'digest', now: NOW }), 'idle')
assert.equal(edgeSyncState({ kind: 'digest', lastPushAt: NOW, now: NOW }), 'idle')

// ---- lineage lines: provenance, judged by the two timestamps -----------
assert.equal(
  lineageSyncState({ parentUpdatedAt: NOW - HOUR, childUpdatedAt: NOW, now: NOW }),
  'synced',
  'a child written after its parent is current',
)
assert.equal(
  lineageSyncState({ parentUpdatedAt: NOW, childUpdatedAt: NOW - HOUR, now: NOW }),
  'stale',
  'a parent that moved after the child leaves the child behind',
)
assert.equal(
  lineageSyncState({ parentUpdatedAt: NOW, childUpdatedAt: NOW - FAR_BEHIND_MS - 1, now: NOW }),
  'far',
)
assert.equal(lineageSyncState({ now: NOW }), 'idle', 'unknown timestamps stay neutral')

// ---- a lineage line that HAS been pushed behaves like a channel -------
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW - HOUR, sourceUpdatedAt: NOW, now: NOW }),
  'stale',
  'pushed before the parent moved → the child fell behind',
)
assert.equal(
  edgeSyncState({ kind: 'digest', lastPushAt: NOW, sourceUpdatedAt: NOW - HOUR, now: NOW }),
  'synced',
  'pushed after the parent moved → in sync',
)

console.log('edge-sync: 16 checks passed')
