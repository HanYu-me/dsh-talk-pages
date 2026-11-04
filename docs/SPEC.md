# dsh-talk-pages — design spec (phase 1)

Derived from an existing "talk map" plugin (this repo is its own plugin now: ids, routes,
storage domain and panel are all renamed `talk-pages` / `talk_pages`). The old model:
ONE canvas, every session in a folder per workspace, cards forced onto 272×176 slots.

## Target model
1. **Pages = workspaces.** One page per workspace (page id = the workspace/group id that
   `sessionWorkspaceIndex` returns for the session; sessions with no workspace go to page `__none__`
   titled "未归类"/"Unsorted"). A tab bar under the map header lists pages (title + card count);
   clicking switches the page. Each page keeps its own camera (`global.cameraByBoard["page:<id>"]`).
   Active page persists in new `global.activePage`. Only cards of the active page are rendered/routed.
2. **Free placement.** A card that is in no box renders at its stored `x,y` (no slot snapping, no
   auto reflow). A header toggle "吸附/Snap" (`global.snap`, default true) controls whether a dropped
   free card snaps to the 16px grid. Nothing ever moves a card the user placed.
3. **Boxes** (user containers, replace the old auto "workspace folders"). `global.boxes[boxId] =
   { pageId, title }`; geometry stays in `global.wsFrames[boxId]`, colour in `global.wsColors[boxId]`.
   `Card.boxId?: string` = membership (replaces `wsOverride`'s role). A box is nameable (double-click or
   context menu → rename dialog, already exists for folders), colourable, resizable (8 handles, existing
   `WsFrame`), movable, and keeps the existing slot-grid layout + overflow stack for its members.
   Create: toolbar button "＋ 新建框" (box at the viewport centre) and context-menu on empty canvas.
   Dragging a free card into a box (drop point inside the rect) joins it; dragging a member out joins nothing.
   Deleting a box UNGROUPS (cards become free, stay where they are) — it must never delete sessions.
4. **Links** unchanged (edges between cards, fork-by-edge, digests). Edges only draw between cards of the
   active page.
5. **Migration (LAYOUT_VERSION 5).** First load of an older store: every existing `wsFrames[wsId]` becomes
   `boxes[wsId] = { pageId: wsId, title: workspace title }` (same id, so geometry/colour carry over) and every
   card whose group (`wsOverride ?? sessionWs`) is `wsId` gets `boxId = wsId`. New sessions found for a page
   (auto-sync) are added as FREE cards on that page, laid out in a tidy row below existing content.
6. Storage: domain `talk_pages`; routes `/talk-pages/*`; host schema (`src/host/store.ts`) must accept the
   new fields (`Card.boxId`, `global.boxes`, `global.activePage`, `global.snap`) — zod strips unknown keys!
   Mirror them in `src/shared/model.ts` and `src/client/api.ts`.

## Rules
- Build: `npm run build:host` (lib/index.js) and `node scripts/build-client.mjs` (writes client/client.dev.js ONLY;
  `--publish` writes client/client.js — do NOT publish). Tests: `for t in test/*.test.mjs; do node $t; done`
  and `node test/bundle-smoke.mjs`. `test/host-digest.test.mjs` regex-matches the old tsdown output format;
  adapt it to esbuild output (do not weaken what it checks).
- Offline harness: `npm run harness` (test/serve.mjs, http://127.0.0.1:8791/test/index.html), drivable with
  playwright-core + `/Applications/Google Chrome.app`. Extend test/harness.js fake data with 2 workspaces so
  pages can be exercised.
- Keep the code style of the surrounding files; keep comments in English like the existing ones; UI copy goes
  through `src/client/i18n.ts` (zh + en).
- Never rewrite files wholesale; surgical edits. Do not touch node_modules, never commit.
