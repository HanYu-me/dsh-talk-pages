# 让对话来整理地图（Agent API）

任何一个对话（或脚本）都可以不经过浏览器，直接重排对话地图。方式是**读一个快照文件、往一个收件夹里放命令文件**，两者都在 `$DSH_HOME/talk-pages/`（默认 `~/.dsh/talk-pages/`）。地图正开着时，改动会在约 1 秒内实时出现。

```
~/.dsh/talk-pages/
  map.json          只读快照：当前所有框和卡片（每次变化后自动重写）
  inbox/            放命令文件（*.json）。处理完移到 inbox/done/，出错移到 inbox/failed/ 并附 <名字>.error.txt
```

## 先弄清楚有哪些对话

| 要什么 | 去哪读 |
|---|---|
| 页面 = 工作区：id、名字、下面有哪些会话 | `~/.dsh/storages/workspace.json` → `tables.workspaces[<id>]`（`title`、`sessionIds`） |
| 会话标题 | `~/.dsh/sessions/<工作区目录>/<session-id>/session.v4.jsonl.zstd`，`zstd -dc` 后找 `"type":"session/title"` 的最后一行 `data.title` |
| 已归档的会话 | `workspace.json` → `global.archivedSessionIds` |
| 地图上现在有什么 | `~/.dsh/talk-pages/map.json` |

`map.json` 里每张卡片有 `cardId / session / x / y / box? / priority?`，每个框有 `page / title / free / color / x / y / width / height`。

## 命令文件

一个 JSON 文件，`ops` 按顺序执行；任何一步出错整个文件进 `failed/`（前面已经执行的步骤不回滚，所以请把相关操作写在同一个文件里并先检查）。**写文件时先写成 `.tmp` 再改名成 `.json`**，避免对方读到写了一半的文件。

```json
{ "ops": [
  { "op": "createBox", "id": "box-semi", "page": "<工作区id>", "title": "半导体",
    "x": 0, "y": 0, "width": 960, "height": 420, "color": "blue", "free": true },
  { "op": "placeCards", "cards": [
    { "session": "<会话id>", "x": 40, "y": 70, "box": "box-semi", "priority": 1 },
    { "session": "<会话id>", "x": 300, "y": 70, "box": "box-semi" }
  ] }
] }
```

| op | 字段 | 说明 |
|---|---|---|
| `createBox` | `page, title, x, y, width, height`，可选 `id, color, free` | 新建框。`free` 默认 true（成员位置自己定）；`false` = 成员自动排成网格 |
| `updateBox` | `id`，可选 `title, color(null=清除), free, x, y, width, height` | 改名、换色、挪动、缩放 |
| `deleteBox` | `id` | 删框，里面的卡片保留并变成自由卡片 |
| `placeCards` | `cards: [{ session, x?, y?, box?(null=移出框), priority?(1/2/3, null=清除) }]` | 没有卡片就新建（把对话放上地图，已归档的也行），有就更新 |
| `setPriority` | `session, priority(1 高/2 中/3 低/null)` | 标记重要性（会话必须已在地图上） |
| `removeCards` | `sessions: [...]` | 把这些对话移出地图（对话本身不动，相关连线一并删除） |
| `setPage` | `page` | 切换地图当前显示的页面 |
| `setSnap` | `enabled` | 开关「吸附」 |

坐标是画布坐标：一张卡片 224×120，卡片之间留 48/56 的间距，框的内边距约 32（顶部 70 左右留给标题）。**同一个框里的成员坐标是画布绝对坐标**，要落在框的矩形里才算框内。

## 例：按行业整理个股研究

> 把「投资学习」页面里所有个股研究对话，按行业排成框：先读 `~/.dsh/talk-pages/map.json` 和 workspace.json 弄清有哪些会话、标题是什么，按行业分组，每个行业一个框（4 列、间距按上面的尺寸算），写成一个命令文件放进 `~/.dsh/talk-pages/inbox/`。

仓库里的 `skills/talk-pages-layout/SKILL.md` 把这段说明做成了 skill，可以装给 Claude Code / dsh 的 skill 目录，之后直接说「按行业整理地图」就行。
