# dsh-talk-pages · 对话白板（按工作区分页）

DeepSeek Harness（dsh）的可视化对话白板：**每个工作区一页**，页内的对话卡片**自由摆放**，用**连线**表示关联，用**框**把几段对话收在一起。

- **分页**：顶部标签栏列出每个工作区（带对话数），点击切换；每页各自记住镜头位置，最后停留的页面重开仍在。
- **自由摆放**：卡片落在哪就在哪，插件不会替你重排。右上角「吸附」开关控制落下时是否对齐 16px 网格。
- **框**：「＋ 新建框」或在空白处右键新建；双击标签改名，右键换颜色，可拖动、可从四边四角缩放。把卡片拖进框里（卡片中心落在框内）即入框，拖出即自由。删除框只是解散，**不会删除任何对话**。框内保留槽位排布，放不下的折叠成堆叠格。
- **连线**：从卡片手柄拖到另一张卡片即建立关联；拖到空白处可分叉出一个带上下文的新对话。只在同一页内的卡片之间画线。
- **双击空白处**新建对话，卡片就生在点击处；双击卡片打开对话。
- 卡片正面显示标题、你最后说的话、相对时间和状态灯（运行中 / 等待 / 未读 / 中断），左侧状态栏只列带灯的卡片。

- **右键显示 / 隐藏对话**：在画布空白处右键 →「显示 / 隐藏对话…」，列出当前页面（工作区）的全部对话（含已归档），带 ✓ 的在地图上，点一下切换，列表保持打开可连续操作。
- **选择对话**：顶部「选择对话」弹窗列出全部对话（含已归档），勾选哪些放在地图上，应用后自动加入 / 移出；新对话默认不会自动出现（弹窗里可打开「自动加入新对话」）。
- **优先级**：右键卡片标记 高 / 中 / 低，卡片左侧出现色条和标签；左侧的「重点对话」栏按优先级列出所有已标记的卡片，点击即定位。侧栏里的置顶不影响地图。
- **框内自由摆放**：新建的框默认自由摆放（成员位置由你定，拖动框时成员跟着走）；右键框可切换成网格排列。
- **让对话来整理地图**：开一个新对话说「按行业整理个股研究」即可——插件提供文件接口（`~/.dsh/talk-pages/`），见 [docs/AGENT.md](docs/AGENT.md) 和 [skills/talk-pages-layout](skills/talk-pages-layout/SKILL.md)。

## 安装

```sh
dsh plugin add github:HanYu-me/dsh-talk-pages
```

构建产物已提交，无需构建。重启 dsh，侧栏底部出现按钮。

> 与 `dsh-talk-map` 使用不同的存储和接口，可以并存；但两者都在侧栏占一个按钮，建议只启用一个。已有的 talk-map 数据可用 `node scripts/migrate-from-talk-map.mjs` 一次性迁入（旧文件夹会变成同名的框）。

## 数据

画布数据（位置、框、连线、摘要）存放在 `$DSH_HOME/storages/talk_pages.json`。对话本身仍归 dsh 所有，插件只读取，分叉时才通过官方接口新建。

## 开发

```sh
npm install
npm run build:host                    # lib/index.js
node scripts/build-client.mjs         # client/client.dev.js（离线测试台用）
node scripts/build-client.mjs --publish   # 写 client/client.js，发布后必须重启 dsh
for t in test/*.test.mjs test/bundle-smoke.mjs; do node $t; done
node test/pages-ui.mjs                # 真实 Chrome 里跑页面/框/吸附的端到端检查
npm run harness                       # http://127.0.0.1:8791/test/index.html
```

设计说明见 [docs/SPEC.md](docs/SPEC.md)。

## 许可

[MIT](./LICENSE)
