---
name: talk-pages-layout
description: Rearrange the dsh-talk-pages conversation map (boxes, card positions, priorities, which conversations are on it) by writing command files. Use when the user asks to organize, group, lay out or clean up the 对话地图 / conversation map, e.g. "按行业整理个股研究对话".
---

# Rearranging the conversation map

The map plugin exposes a files-as-API under `~/.dsh/talk-pages/` (or `$DSH_HOME/talk-pages/`). Full reference: `docs/AGENT.md` in the dsh-talk-pages repo. Short version:

1. **Read state first.** `~/.dsh/talk-pages/map.json` (boxes + cards on the map). Page ids are workspace ids: `~/.dsh/storages/workspace.json` → `tables.workspaces[<id>]` has `title` and `sessionIds`; archived ids are in `global.archivedSessionIds`. A session's title is the last `"type":"session/title"` event in `~/.dsh/sessions/<workspace dir>/<session-id>/session.v4.jsonl.zstd` (`zstd -dc`).
2. **Plan the layout** from titles/content: one box per group (e.g. per industry). Card = 224×120, gaps 48 (x) / 56 (y), box padding ~32 with ~70 left at the top for the title. Member coordinates are absolute canvas coordinates and must fall inside the box rectangle.
3. **Write ONE command file** `{ "ops": [...] }` to `~/.dsh/talk-pages/inbox/<name>.tmp`, then rename it to `.json` (the watcher reads `*.json`). Ops: `createBox`, `updateBox`, `deleteBox`, `placeCards` (creates or updates a card for a session; `box: null` leaves a box; `priority` 1/2/3/null), `setPriority`, `removeCards`, `setPage`, `setSnap`.
4. **Verify.** Within ~1 s the file moves to `inbox/done/` (or `inbox/failed/` with `<name>.json.error.txt`); re-read `map.json` and report what changed. Never delete sessions: `removeCards` only takes cards off the map.

Do not edit `~/.dsh/storages/talk_pages.json` by hand — the running host owns it and will overwrite your change.
