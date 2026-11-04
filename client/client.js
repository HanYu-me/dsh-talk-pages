window.__ModuleLoader__.load({ id: "dsh-talk-pages", factory: (require) => {
	var module = { exports: {} };
	var exports = module.exports;
	"use strict";
	// Breadcrumb on disk: after a failed reload we need to know whether this bundle
	// was imported at all (see scripts/_.add-client-boot-log.mjs).
	// Evidence trail. The console line lands in the shell's crash report (its
	// console section survives); the POST retries because a fetch issued during
	// module evaluation can outrun the shell's request routing.
	console.error('[dsh-talk-pages] client bundle evaluated', new Date().toISOString());
	try {
		const ping = (phase) => { try { fetch('/talk-pages/client-boot', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phase }) }).catch(() => {}) } catch {} };
		ping('evaluate');
		setTimeout(() => { ping('alive-1s') }, 1000);
		setTimeout(() => { ping('alive-5s') }, 5000);
	} catch {}
	// A single plugin must never be able to kill the whole boot: the shell treats
	// "an entry did not activate" as fatal and exits. If this bundle fails to
	// evaluate (e.g. a reload re-imports it while the previous graph is alive),
	// degrade to an inert module and leave a trace instead of throwing.
	try {
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
var require_use_sync_external_store_shim_production = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js"(exports) {
    "use strict";
    var React = require("react");
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var useState10 = React.useState;
    var useEffect12 = React.useEffect;
    var useLayoutEffect3 = React.useLayoutEffect;
    var useDebugValue2 = React.useDebugValue;
    function useSyncExternalStore$2(subscribe3, getSnapshot2) {
      var value2 = getSnapshot2(), _useState = useState10({ inst: { value: value2, getSnapshot: getSnapshot2 } }), inst = _useState[0].inst, forceUpdate = _useState[1];
      useLayoutEffect3(
        function() {
          inst.value = value2;
          inst.getSnapshot = getSnapshot2;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
        },
        [subscribe3, value2, getSnapshot2]
      );
      useEffect12(
        function() {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          return subscribe3(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst });
          });
        },
        [subscribe3]
      );
      useDebugValue2(value2);
      return value2;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return true;
      }
    }
    function useSyncExternalStore$1(subscribe3, getSnapshot2) {
      return getSnapshot2();
    }
    var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
  }
});

// node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/use-sync-external-store/shim/index.js"(exports, module2) {
    "use strict";
    if (true) {
      module2.exports = require_use_sync_external_store_shim_production();
    } else {
      module2.exports = null;
    }
  }
});

// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
var require_with_selector_production = __commonJS({
  "node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js"(exports) {
    "use strict";
    var React = require("react");
    var shim = require_shim();
    function is(x, y) {
      return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    var objectIs = "function" === typeof Object.is ? Object.is : is;
    var useSyncExternalStore7 = shim.useSyncExternalStore;
    var useRef7 = React.useRef;
    var useEffect12 = React.useEffect;
    var useMemo5 = React.useMemo;
    var useDebugValue2 = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function(subscribe3, getSnapshot2, getServerSnapshot, selector2, isEqual) {
      var instRef = useRef7(null);
      if (null === instRef.current) {
        var inst = { hasValue: false, value: null };
        instRef.current = inst;
      } else inst = instRef.current;
      instRef = useMemo5(
        function() {
          function memoizedSelector(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = true;
              memoizedSnapshot = nextSnapshot;
              nextSnapshot = selector2(nextSnapshot);
              if (void 0 !== isEqual && inst.hasValue) {
                var currentSelection = inst.value;
                if (isEqual(currentSelection, nextSnapshot))
                  return memoizedSelection = currentSelection;
              }
              return memoizedSelection = nextSnapshot;
            }
            currentSelection = memoizedSelection;
            if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
            var nextSelection = selector2(nextSnapshot);
            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
              return memoizedSnapshot = nextSnapshot, currentSelection;
            memoizedSnapshot = nextSnapshot;
            return memoizedSelection = nextSelection;
          }
          var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
          return [
            function() {
              return memoizedSelector(getSnapshot2());
            },
            null === maybeGetServerSnapshot ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            }
          ];
        },
        [getSnapshot2, getServerSnapshot, selector2, isEqual]
      );
      var value2 = useSyncExternalStore7(subscribe3, instRef[0], instRef[1]);
      useEffect12(
        function() {
          inst.hasValue = true;
          inst.value = value2;
        },
        [value2]
      );
      useDebugValue2(value2);
      return value2;
    };
  }
});

// node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector = __commonJS({
  "node_modules/use-sync-external-store/shim/with-selector.js"(exports, module2) {
    "use strict";
    if (true) {
      module2.exports = require_with_selector_production();
    } else {
      module2.exports = null;
    }
  }
});

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/api.ts
async function requestJson(path, init2) {
  const response = await fetch(path, init2);
  if (!response.ok) {
    let detail = "";
    let code;
    try {
      const body = await response.json();
      detail = JSON.stringify(body);
      if (typeof body === "object" && body !== null) {
        const bodyCode = body.code;
        if (typeof bodyCode === "string") code = bodyCode;
      }
    } catch {
    }
    const error = new Error(`${path} → ${response.status} ${detail}`);
    if (code !== void 0) error.code = code;
    throw error;
  }
  return await response.json();
}
function postJson(path, body) {
  return requestJson(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}
var talkMapApi = {
  getState() {
    return requestJson("/talk-pages/state");
  },
  upsertCards(cards) {
    return postJson("/talk-pages/cards/upsert", { cards });
  },
  deleteCards(ids) {
    return postJson("/talk-pages/cards/delete", { ids });
  },
  upsertEdges(edges) {
    return postJson("/talk-pages/edges/upsert", { edges });
  },
  deleteEdges(ids) {
    return postJson("/talk-pages/edges/delete", { ids });
  },
  setGlobal(global) {
    return postJson("/talk-pages/global", { global });
  },
  spawn(request) {
    return postJson("/talk-pages/spawn", request);
  },
  injectContext(sessionId, parents) {
    return postJson("/talk-pages/inject", { sessionId, parents });
  },
  refreshDigest(sessionId) {
    return postJson("/talk-pages/digest/refresh", { sessionId });
  },
  /**
   * Regenerate ONLY if the conversation moved on: the Host hashes the
   * transcript and hands back the stored digest when it is still current.
   */
  ensureDigest(sessionId) {
    return postJson("/talk-pages/digest/ensure", { sessionId });
  },
  /**
   * The last message the USER sent, per session — what the card body shows now
   * that the LLM summary is gone. Read straight off the Host's session surface.
   */
  lastUserMessages(sessionIds) {
    return postJson("/talk-pages/last-user", { sessionIds });
  },
  /**
   * Full-text search across every conversation, done Host-side. This is the
   * fallback when the shared connection's RPC surface is unavailable, so the
   * drawer's search never silently degrades to title-only matching.
   */
  searchSessions(query, cwd) {
    return postJson("/talk-pages/search", cwd === void 0 ? { query } : { query, cwd });
  },
  /** Every extra hit inside ONE conversation (asked for explicitly). */
  searchSessionHits(sessionId, query) {
    return postJson("/talk-pages/search-session", { sessionId, query });
  },
  /** The passage around one hit — fetched only when the pointer rests on it. */
  searchContext(sessionId, seq, query) {
    return postJson("/talk-pages/search-context", { sessionId, seq, query });
  },
  ensureDir(path) {
    return postJson("/talk-pages/fs/ensure-dir", { path });
  },
  getDefaults() {
    return requestJson("/talk-pages/defaults");
  },
  /**
   * Subscribe to host-side domain changes (multi-tab sync, digest arrivals).
   * @returns disposer closing the EventSource.
   */
  subscribeChanges(onChange, onReload) {
    const source = new EventSource("/talk-pages/events");
    source.addEventListener("reload", () => {
      onReload?.();
    });
    source.addEventListener("change", (event) => {
      try {
        onChange(JSON.parse(event.data));
      } catch {
      }
    });
    return () => {
      source.close();
    };
  }
};

// src/client/i18n.ts
var zh = {
  "map.title": "对话地图 ·v2",
  "map.close": "关闭地图（Esc）",
  "map.back": "返回",
  "map.toggle": "对话地图",
  "map.empty": "这一页还是空的 —— 点右上角「选择对话」挑选要放上来的对话，或双击空白直接开新对话",
  "statusRail.title": "队列中的任务",
  "confirm.removeGroup.title": "删除这个分组？",
  "confirm.removeGroup.body": "分组里的 {n} 个会话会被移入回收站（可在回收站恢复），卡片和分组框同时从地图上移除。仍在运行的会话会先被停止。",
  "confirm.removeGroup.bodyHard": "这里没有回收站插件，{n} 个会话会被直接删除（无法恢复），卡片和分组框同时从地图上移除。",
  "confirm.removeGroup.ok": "移入回收站",
  "confirm.removeGroup.okHard": "直接删除",
  "confirm.cancel": "取消",
  "toast.workspaceTrashed": "已把 {n} 个会话移入回收站，分组已从地图移除",
  "toast.workspaceDeleted": "已直接删除 {n} 个会话，分组已从地图移除",
  "statusRail.open": "展开状态栏",
  "statusRail.close": "收起状态栏",
  "statusRail.empty": "暂时没有带状态的卡片",
  "statusRail.lamp.running": "运行中",
  "statusRail.lamp.waiting": "等你回复",
  "statusRail.lamp.done": "待查看",
  "statusRail.lamp.error": "异常终止",
  "map.sessions": "个会话",
  "map.loading": "正在加载地图……",
  "map.retry": "重试",
  "map.loadError": "地图数据加载失败：",
  "card.running": "正在运行",
  "card.ghostTitle": "会话已不存在",
  "card.remove": "移除卡片",
  "card.next": "下一步",
  "card.stale": "摘要已过期",
  "time.now": "刚刚",
  "time.m": " 分钟前",
  "time.h": " 小时前",
  "time.d": " 天前",
  "card.refresh": "重新生成摘要",
  "edge.injected": "注入",
  "spawn.heading": "连线分叉：开一个带上下文的新对话",
  "spawn.from": "来源",
  "spawn.hint": "以下内容将注入新对话作为背景，可以编辑：",
  "spawn.noDigest": "（这段对话还没有摘要——可以先点卡片右上角的 ⟳ 生成，或直接在这里手写要带过去的背景。）",
  "spawn.confirm": "开新对话",
  "spawn.busy": "创建中……",
  "spawn.cancel": "取消",
  "spawn.mode.none": "不继承",
  "spawn.mode.digest": "摘要注入",
  "spawn.mode.full": "完整对话",
  "spawn.noneHint": "全新对话，只保留一条关联线。输入第一句话（回车发送）：",
  "spawn.fullHint": "新对话将携带这段对话的完整历史继续（dsh 原生分叉）。",
  "spawn.needText": "注入内容不能为空",
  "spawn.needFirstMessage": "请输入第一句话",
  "edge.none": "关联",
  "edge.full": "完整分叉",
  "inject.header": "【上下文注入 · 来自】",
  "inject.recall": "【提醒】以上是摘要提纲，不是完整对话。需要细节（具体命令、参数、结论出处）时，请随时回到原会话「{title}」查看完整对话记录。",
  "inject.summary": "摘要：",
  "inject.findings": "关键结论：",
  "inject.next": "下一步：",
  "frame.ungrouped": "未分组",
  "card.waiting": "等你回复",
  "card.done": "待查看",
  "card.error": "异常终止",
  "card.draft": "待发送",
  "card.draftHint": "这个对话的输入框里还有没发出去的文字",
  "card.pinned": "已置顶",
  "rename.title": "重命名",
  "rename.placeholder": "新的标题",
  "rename.confirm": "确定",
  "rename.cancel": "取消",
  "rename.saving": "保存中…",
  "rename.failed": "改名失败，请重试",
  "rename.unavailable": "改名通道不可用（连接还没就绪）",
  "toast.renamed": "已重命名",
  "card.interrupted": "已中断",
  "card.interruptedHint": "上次关闭时这个对话还在跑",
  "card.clickHint": "单击打开",
  "color.toolbar": "工作区颜色",
  "color.clear": "清除颜色",
  "spawn.apiUnavailable": "界面服务还在初始化，稍等一下再试",
  "frame.unknown": "分组",
  "frame.hiddenTitle": "还有卡片被折叠在框外，放大分组框可见",
  "stack.open": "展开这一堆对话",
  "stack.total": "共 {n} 个对话",
  "stack.hint": "滚轮滚动",
  "stack.close": "收起（Esc）",
  "stack.searchPlaceholder": "搜这个抽屉里的卡片，回车开始",
  "stack.searching": "全文搜索中…",
  "stack.searchFailed": "全文搜索失败",
  "stack.searchDisabled": "全文搜索未启用（本机索引关闭）",
  "stack.peekHint": "点这行可以直接打开这条对话",
  "stack.moreHits": "＋ 查这条对话里的更多命中",
  "stack.agentMain": "主智能体",
  "stack.agentSub": "子智能体",
  "stack.roleUser": "你",
  "stack.roleAgent": "AI",
  "stack.titleHit": "标题命中",
  "map.hits": "地图上的卡片 · {n} 张",
  "map.noHit": "地图上没有找到匹配的卡片",
  "stack.agentMainHint": "你和 DSH 直接对话产生的会话",
  "stack.agentSubHint": "某个 Agent / 工具派生的子会话",
  "stack.moreLoading": "查询中…",
  "stack.noTitleMatch": "没有标题匹配的对话",
  "stack.contentHits": "全部对话里的命中 · {n} 条",
  "menu.empty": "（没有可选项）",
  "menu.search": "搜索…",
  "menu.alreadyImported": "已在地图 · 点击同步新会话",
  "menu.newWs": "＋ 新建工作区…",
  "menu.createAndImport": "创建并导入",
  "menu.working": "处理中……",
  "map.zoom100": "恢复 100% 缩放",
  "menu.newChat": "新对话",
  "menu.newChatIn": "新对话（{ws}）",
  "menu.pin": "置顶会话",
  "menu.unpin": "取消置顶",
  "menu.archive": "归档会话",
  "menu.deleteSession": "删除会话（回收站）",
  "menu.batch": "批量操作…",
  "batch.title": "批量操作",
  "batch.count": "已选 {n} 个对话",
  "batch.archive": "归档",
  "batch.delete": "删除",
  "batch.cancel": "取消",
  "toast.pinned": "已置顶",
  "toast.unpinned": "已取消置顶",
  "toast.pinFailed": "置顶失败：",
  "toast.archived": "已归档 {n} 个会话",
  "toast.deleted": "已把 {n} 个会话移入回收站",
  "toast.archiveFailed": "归档失败：",
  "toast.stopping": "这条会话还在跑，正在停止它再删除…",
  "toast.deleteFailed": "删除失败：",
  "toast.needUiWorkspace": "界面服务还没就绪，稍等一下再试",
  "menu.importWs": "导入工作区",
  "menu.importSession": "导入对话",
  "menu.toggleSessions": "显示 / 隐藏对话",
  "menu.moveGroup": "移动到分组（仅地图）",
  "menu.noGroup": "移出分组（自由卡片）",
  "menu.open": "打开对话",
  "menu.markUnread": "标为未读",
  "menu.viewDigest": "查看摘要",
  "digest.title": "这会推送到其他会话的摘要",
  "digest.pushLabel": "推送时（带时间戳的更新）",
  "digest.injectLabel": "新建会话时（背景注入）",
  "digest.empty": "这条对话还没有摘要，先刷新摘要再来看。",
  "digest.copy": "复制",
  "digest.close": "关闭",
  "global.searchPlaceholder": "b66 · 搜地图上的卡片（标题/正文）",
  "global.searchRun": "搜索",
  "global.searchTitle": "搜索地图",
  "font.group": "文字大小",
  "font.increase": "加大字号（每一项 +1）",
  "font.decrease": "减小字号（每一项 −1）",
  "font.reset": "恢复默认字号",
  "font.resetShort": "默认",
  "menu.rename": "重命名",
  "menu.renameWorkspace": "重命名工作区",
  "menu.removeCard": "从地图移除",
  "edge.push": "推送最新摘要",
  "edge.hideLineage": "隐藏所有血缘线",
  "edge.showLineage": "显示所有血缘线",
  "edge.pushNoDigest": "来源还没有摘要",
  "edge.delete": "删除连线",
  "edge.autoPushOn": "开启自动推送",
  "edge.autoPushOff": "关闭自动推送",
  "edge.autoPushHint": "这条对话每次有新内容时，自动把摘要推过去",
  "toast.pushed": "已推送给「{to}」",
  "toast.notLive": "目标对话未激活——先打开它一次再推送",
  "toast.pushFailed": "推送失败：",
  "push.header": "【来自「{from}」的更新 · {time}】",
  "lang.hint": "界面语言：{current} · 点击切换到{next}",
  "lang.auto": "自动",
  "lang.zh": "中文",
  "lang.en": "English",
  "menu.syncGroup": "同步该工作区的新会话",
  "menu.removeGroup": "删除分组（连同会话）",
  // Pages (one per workspace) and user boxes.
  "page.tabs": "页面",
  "page.unsorted": "未归类",
  "page.tabHint": "{title} · {n} 张卡片",
  "page.snap": "吸附",
  "page.snapHint": "拖动自由卡片时吸附到 16px 网格",
  "page.newBox": "＋ 新建框",
  "page.newBoxHint": "在当前页面的画布中央新建一个框",
  "box.defaultTitle": "新框",
  "menu.newBox": "新建框",
  "menu.renameBox": "重命名框",
  "menu.deleteBox": "删除框（卡片保留）",
  "menu.boxFree": "自由摆放成员",
  "menu.boxGrid": "网格排列成员（自动对齐）",
  "menu.priority1": "标记为 高优先级",
  "menu.priority2": "标记为 中优先级",
  "menu.priority3": "标记为 低优先级",
  "menu.priorityClear": "取消优先级",
  "card.priority1": "高",
  "card.priority2": "中",
  "card.priority3": "低",
  "priorityRail.title": "重点对话",
  "priorityRail.empty": "还没有标记。右键卡片，选「标记为 高/中/低优先级」",
  "priorityRail.open": "展开重点对话",
  "priorityRail.close": "收起重点对话",
  "picker.button": "选择对话",
  "picker.title": "选择放在地图上的对话",
  "picker.search": "搜索标题…",
  "picker.filterAll": "全部",
  "picker.filterOnMap": "已在地图",
  "picker.filterOff": "未在地图",
  "picker.filterArchived": "已归档",
  "picker.archivedTag": "已归档",
  "picker.selected": "已选 {n} 个",
  "picker.apply": "应用",
  "picker.cancel": "取消",
  "picker.selectShown": "选中当前列表",
  "picker.clearShown": "取消选中当前列表",
  "picker.autoAdd": "自动加入新对话",
  "picker.added": "已加入 {a} 个，移出 {r} 个",
  "picker.empty": "没有匹配的对话",
  "menu.pages": "页面",
  "menu.currentPage": "当前页",
  "toast.boxCreated": "已新建框，把卡片拖进来即可归入",
  "toast.boxDeleted": "已删除框「{title}」，卡片保留为自由卡片",
  "toast.importedOnPage": "已加入「{page}」页面",
  "menu.color": "颜色",
  "menu.colorCurrent": "当前",
  "color.red": "红",
  "color.orange": "橙",
  "color.yellow": "黄",
  "color.green": "绿",
  "color.teal": "青",
  "color.blue": "蓝",
  "color.purple": "紫",
  "color.gray": "灰"
};
var en = {
  "map.title": "Talk Map ·v2",
  "map.close": "Close map (Esc)",
  "map.back": "Back",
  "map.toggle": "Talk Map",
  "map.empty": "This page is empty — use “Choose conversations” above to pick what goes here, or double-click to start a chat",
  "statusRail.title": "Tasks in the queue",
  "confirm.removeGroup.title": "Delete this group?",
  "confirm.removeGroup.body": "Its {n} conversations go to the recycle bin (restorable from there) and the cards and frame leave the map. Anything still running is stopped first.",
  "confirm.removeGroup.bodyHard": "No recycle bin plugin answers here, so its {n} conversations are deleted outright (no undo) and the cards and frame leave the map.",
  "confirm.removeGroup.ok": "Move to recycle bin",
  "confirm.removeGroup.okHard": "Delete for good",
  "confirm.cancel": "Cancel",
  "toast.workspaceTrashed": "Moved {n} conversations to the recycle bin; the group is off the map",
  "toast.workspaceDeleted": "Deleted {n} conversations outright; the group is off the map",
  "statusRail.open": "Open the status rail",
  "statusRail.close": "Close the status rail",
  "statusRail.empty": "No card carries a status right now",
  "statusRail.lamp.running": "running",
  "statusRail.lamp.waiting": "waiting",
  "statusRail.lamp.done": "unread",
  "statusRail.lamp.error": "error",
  "map.sessions": "sessions",
  "map.loading": "Loading map…",
  "map.retry": "Retry",
  "map.loadError": "Failed to load map data:",
  "card.running": "running",
  "card.ghostTitle": "Session no longer exists",
  "card.remove": "Remove card",
  "card.next": "Next",
  "card.stale": "digest stale",
  "time.now": "now",
  "time.m": "m ago",
  "time.h": "h ago",
  "time.d": "d ago",
  "card.refresh": "Regenerate digest",
  "edge.injected": "injected",
  "spawn.heading": "Fork with context",
  "spawn.from": "From",
  "spawn.hint": "This text will be injected into the new session as background — edit freely:",
  "spawn.noDigest": "(No digest yet — hit ⟳ on the card first, or write the context to carry over by hand.)",
  "spawn.confirm": "Start session",
  "spawn.busy": "Creating…",
  "spawn.cancel": "Cancel",
  "spawn.mode.none": "No context",
  "spawn.mode.digest": "Inject digest",
  "spawn.mode.full": "Full history",
  "spawn.noneHint": "A fresh conversation, linked visually only. Type the first message (Enter sends):",
  "spawn.fullHint": "The new conversation continues with this one's FULL history (dsh-native fork).",
  "spawn.needText": "Injection text must not be empty",
  "spawn.needFirstMessage": "Type the first message",
  "edge.none": "linked",
  "edge.full": "full fork",
  "inject.header": "[Context injected from] ",
  "inject.recall": '[Note] This is a summary, not the full conversation. Go back to "{title}" whenever you need the details (exact commands, parameters, where a conclusion came from).',
  "inject.summary": "Summary: ",
  "inject.findings": "Key findings:",
  "inject.next": "Next step: ",
  "frame.ungrouped": "Ungrouped",
  "card.waiting": "needs you",
  "card.done": "unread",
  "card.error": "failed",
  "card.draft": "unsent",
  "card.draftHint": "This conversation has text typed but not sent",
  "card.pinned": "pinned",
  "rename.title": "Rename",
  "rename.placeholder": "New title",
  "rename.confirm": "Rename",
  "rename.cancel": "Cancel",
  "rename.saving": "Saving…",
  "rename.failed": "Rename failed, try again",
  "rename.unavailable": "Rename channel unavailable (connection not ready)",
  "toast.renamed": "Renamed",
  "card.interrupted": "interrupted",
  "card.interruptedHint": "This conversation was still running when the app closed",
  "card.clickHint": "click to open",
  "color.toolbar": "Workspace colour",
  "color.clear": "Clear colour",
  "spawn.apiUnavailable": "The UI services are still starting up — try again in a moment",
  "frame.unknown": "Group",
  "frame.hiddenTitle": "Some cards are folded outside the frame — enlarge it to see them",
  "stack.open": "Open this stack of conversations",
  "stack.total": "{n} conversations",
  "stack.searchPlaceholder": "Search this workspace (titles + content), Enter to run",
  "stack.searching": "Searching…",
  "stack.noTitleMatch": "No title matches",
  "stack.contentHits": "Matches in all conversations · {n}",
  "stack.searchFailed": "Full-text search failed",
  "stack.searchDisabled": "Full-text search is off (session index disabled)",
  "stack.peekHint": "Click the line to open this conversation",
  "stack.moreHits": "+ more hits in this conversation",
  "stack.agentMain": "main",
  "stack.agentSub": "sub-agent",
  "stack.titleHit": "title match",
  "map.hits": "Cards on the map · {n}",
  "map.noHit": "No card on the map matches that",
  "stack.roleUser": "you",
  "stack.roleAgent": "AI",
  "stack.agentMainHint": "A conversation you had with DSH",
  "stack.agentSubHint": "A session an agent or tool spawned",
  "stack.moreLoading": "Searching…",
  "stack.hint": "Scroll",
  "stack.close": "Close (Esc)",
  "menu.empty": "(nothing to pick)",
  "menu.search": "Search…",
  "menu.alreadyImported": "on map · click to sync new sessions",
  "menu.newWs": "＋ New workspace…",
  "menu.createAndImport": "Create & import",
  "menu.working": "Working…",
  "map.zoom100": "Reset zoom to 100%",
  "menu.newChat": "New conversation",
  "menu.newChatIn": "New conversation ({ws})",
  "menu.pin": "Pin conversation",
  "menu.unpin": "Unpin",
  "menu.archive": "Archive conversation",
  "menu.deleteSession": "Delete conversation (recycle bin)",
  "menu.batch": "Batch actions…",
  "batch.title": "Batch actions",
  "batch.count": "{n} selected",
  "batch.archive": "Archive",
  "batch.delete": "Delete",
  "batch.cancel": "Cancel",
  "toast.pinned": "Pinned",
  "toast.unpinned": "Unpinned",
  "toast.pinFailed": "Pin failed: ",
  "toast.archived": "Archived {n} conversation(s)",
  "toast.deleted": "Moved {n} conversation(s) into the recycle bin",
  "toast.archiveFailed": "Archive failed: ",
  "toast.stopping": "This conversation is still running — stopping it before deleting…",
  "toast.deleteFailed": "Delete failed: ",
  "toast.needUiWorkspace": "The UI services are still starting up — try again in a moment",
  "menu.importWs": "Import workspace",
  "menu.importSession": "Import conversation",
  "menu.toggleSessions": "Show / hide conversations",
  "menu.moveGroup": "Move to group (map only)",
  "menu.noGroup": "Remove from group (free card)",
  "menu.open": "Open conversation",
  "menu.markUnread": "Mark as unread",
  "global.searchPlaceholder": "b66 · Search cards on the map",
  "global.searchRun": "Search",
  "global.searchTitle": "Search the map",
  "font.group": "Text size",
  "font.increase": "Larger text (+1 on every style)",
  "font.decrease": "Smaller text (−1 on every style)",
  "font.reset": "Default text size",
  "font.resetShort": "Default",
  "menu.rename": "Rename",
  "menu.renameWorkspace": "Rename workspace",
  "menu.removeCard": "Remove from map",
  "edge.push": "Push latest digest",
  "edge.pushNoDigest": "source has no digest yet",
  "edge.delete": "Delete edge",
  "edge.hideLineage": "Hide all lineage lines",
  "edge.showLineage": "Show all lineage lines",
  "edge.autoPushOn": "Turn on auto push",
  "edge.autoPushOff": "Turn off auto push",
  "edge.autoPushHint": "Push the digest automatically whenever this conversation changes",
  "toast.pushed": 'Pushed to "{to}"',
  "toast.notLive": "Target conversation is not active — open it once, then push again",
  "toast.pushFailed": "Push failed: ",
  "push.header": '[Update from "{from}" · {time}]',
  "lang.hint": "Interface language: {current} · click to switch to {next}",
  "lang.auto": "Auto",
  "lang.zh": "中文",
  "lang.en": "English",
  "menu.syncGroup": "Sync new sessions of this workspace",
  "menu.removeGroup": "Delete group (with its conversations)",
  // Pages (one per workspace) and user boxes.
  "page.tabs": "Pages",
  "page.unsorted": "Unsorted",
  "page.tabHint": "{title} · {n} cards",
  "page.snap": "Snap",
  "page.snapHint": "Snap a dragged free card to the 16px grid",
  "page.newBox": "+ New box",
  "page.newBoxHint": "Create a box in the middle of this page",
  "box.defaultTitle": "New box",
  "menu.newBox": "New box",
  "menu.renameBox": "Rename box",
  "menu.deleteBox": "Delete box (keep cards)",
  "menu.boxFree": "Free placement of members",
  "menu.boxGrid": "Arrange members on a grid",
  "menu.priority1": "Mark as high priority",
  "menu.priority2": "Mark as medium priority",
  "menu.priority3": "Mark as low priority",
  "menu.priorityClear": "Clear priority",
  "card.priority1": "High",
  "card.priority2": "Med",
  "card.priority3": "Low",
  "priorityRail.title": "Key conversations",
  "priorityRail.empty": "Nothing marked yet. Right-click a card and choose a priority.",
  "priorityRail.open": "Show key conversations",
  "priorityRail.close": "Hide key conversations",
  "picker.button": "Choose conversations",
  "picker.title": "Choose what stays on the map",
  "picker.search": "Search titles…",
  "picker.filterAll": "All",
  "picker.filterOnMap": "On the map",
  "picker.filterOff": "Not on the map",
  "picker.filterArchived": "Archived",
  "picker.archivedTag": "Archived",
  "picker.selected": "{n} selected",
  "picker.apply": "Apply",
  "picker.cancel": "Cancel",
  "picker.selectShown": "Select listed",
  "picker.clearShown": "Deselect listed",
  "picker.autoAdd": "Add new conversations automatically",
  "picker.added": "Added {a}, removed {r}",
  "picker.empty": "No matching conversations",
  "menu.pages": "Pages",
  "menu.currentPage": "current page",
  "toast.boxCreated": "Box created — drop cards into it to group them",
  "toast.boxDeleted": "Deleted box “{title}”; its cards stay as free cards",
  "toast.importedOnPage": "Added to the “{page}” page",
  "menu.color": "Colour",
  "menu.colorCurrent": "current",
  "color.red": "Red",
  "color.orange": "Orange",
  "color.yellow": "Yellow",
  "color.green": "Green",
  "color.teal": "Teal",
  "color.blue": "Blue",
  "color.purple": "Purple",
  "color.gray": "Grey"
};
var preference = "auto";
var localeListeners = /* @__PURE__ */ new Set();
function documentLocale() {
  if (typeof document === "undefined") return "en";
  return (document.documentElement.lang ?? "").toLowerCase().startsWith("zh") ? "zh" : "en";
}
function activeLocale() {
  return preference === "auto" ? documentLocale() : preference;
}
function setLocalePref(next) {
  if (next === preference) return;
  preference = next;
  for (const listener of localeListeners) listener();
}
function subscribeLocale(listener) {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
}
function t(key, params) {
  const dict = activeLocale() === "zh" ? zh : en;
  const template = dict[key] ?? en[key] ?? key;
  if (params === void 0) return template;
  return template.replace(/\{(\w+)\}/g, (match, name2) => params[name2] ?? match);
}

// src/shared/model.ts
var INBOX_BOARD_ID = "inbox";
var UNSORTED_PAGE_ID = "__none__";

// src/client/canvas-store.ts
var FLUSH_DELAY_MS = 500;
var CAMERA_DELAY_MS = 800;
var state = { phase: "idle", cards: {}, edges: {}, digests: {}, global: null };
var listeners = /* @__PURE__ */ new Set();
function setState(next) {
  state = { ...state, ...next };
  setLocalePref(state.global?.locale ?? "auto");
  for (const listener of listeners) listener();
}
var dirtyCards = /* @__PURE__ */ new Set();
var flushTimer;
var cameraTimer;
var frameTimer;
var editSeq = 0;
function bumpEdits() {
  editSeq += 1;
}
var cardWritesInFlight = 0;
function trackCardWrite(promise) {
  cardWritesInFlight += 1;
  void promise.finally(() => {
    cardWritesInFlight -= 1;
  });
}
var undoStack = [];
var redoStack = [];
var lastUndoPush = 0;
function takeSnapshot() {
  return { cards: state.cards, edges: state.edges, global: state.global };
}
function pushUndo() {
  bumpEdits();
  const now2 = Date.now();
  if (now2 - lastUndoPush < 400 && undoStack.length > 0) return;
  lastUndoPush = now2;
  undoStack.push(takeSnapshot());
  if (undoStack.length > 50) undoStack.shift();
  redoStack.length = 0;
}
function restoreSnapshot(snapshot5) {
  const previousCards = state.cards;
  const previousEdges = state.edges;
  const currentCamera = state.global?.cameraByBoard;
  const global = snapshot5.global === null ? state.global : { ...snapshot5.global, cameraByBoard: currentCamera ?? snapshot5.global.cameraByBoard };
  setState({ cards: snapshot5.cards, edges: snapshot5.edges, ...global !== null ? { global } : {} });
  const goneCards = Object.keys(previousCards).filter((id2) => snapshot5.cards[id2] === void 0);
  const goneEdges = Object.keys(previousEdges).filter((id2) => snapshot5.edges[id2] === void 0);
  void (async () => {
    if (Object.keys(snapshot5.cards).length > 0) await talkMapApi.upsertCards({ ...snapshot5.cards });
    if (goneCards.length > 0) await talkMapApi.deleteCards(goneCards);
    if (Object.keys(snapshot5.edges).length > 0) await talkMapApi.upsertEdges({ ...snapshot5.edges });
    if (goneEdges.length > 0) await talkMapApi.deleteEdges(goneEdges);
    if (global !== null) await persistGlobal(global, "undo");
  })().catch((error) => {
    console.error("[dsh-talk-pages] undo sync failed:", error);
  });
}
var globalWritesInFlight = 0;
function persistGlobal(value2, label) {
  globalWritesInFlight += 1;
  return talkMapApi.setGlobal(value2).catch((error) => {
    console.error(`[dsh-talk-pages] ${label} save failed:`, error);
  }).finally(() => {
    globalWritesInFlight -= 1;
  });
}
var globalPersistTimer;
function scheduleGlobalPersist() {
  if (globalPersistTimer !== void 0) clearTimeout(globalPersistTimer);
  globalPersistTimer = setTimeout(() => {
    globalPersistTimer = void 0;
    const current = state.global;
    if (current === null) return;
    void persistGlobal(current, "layout-memory");
  }, 600);
}
function scheduleCardFlush() {
  if (flushTimer !== void 0) return;
  flushTimer = setTimeout(() => {
    flushTimer = void 0;
    void flushCards();
  }, FLUSH_DELAY_MS);
}
async function flushCards() {
  if (dirtyCards.size === 0) return;
  const payload = {};
  for (const id2 of dirtyCards) {
    const card = state.cards[id2];
    if (card !== void 0) payload[id2] = card;
  }
  dirtyCards.clear();
  if (Object.keys(payload).length === 0) return;
  cardWritesInFlight += 1;
  try {
    await talkMapApi.upsertCards(payload);
  } catch (error) {
    console.error("[dsh-talk-pages] card flush failed:", error);
    for (const id2 of Object.keys(payload)) dirtyCards.add(id2);
  } finally {
    cardWritesInFlight -= 1;
  }
}
var canvas = {
  get() {
    return state;
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  ensureLoaded() {
    if (state.phase === "loading" || state.phase === "ready") return;
    setState({ phase: "loading", error: void 0 });
    const timer4 = setTimeout(() => {
      if (state.phase !== "loading") return;
      setState({ phase: "error", error: "timeout" });
    }, 12e3);
    talkMapApi.getState().then((payload) => {
      clearTimeout(timer4);
      setState({
        phase: "ready",
        cards: payload.cards,
        edges: payload.edges,
        digests: payload.digests,
        global: payload.global
      });
    }).catch((error) => {
      clearTimeout(timer4);
      setState({ phase: "error", error: String(error) });
    });
  },
  /** Retry a failed or timed-out load (the error banner's button). */
  reload() {
    if (state.phase === "loading") return;
    setState({ phase: "pending", error: void 0 });
    this.ensureLoaded();
  },
  /** SSE mirror: applies host-confirmed changes (idempotent over our own writes). */
  connect() {
    return talkMapApi.subscribeChanges((change) => {
      if (change.table === "cards") {
        if (dirtyCards.has(change.key)) return;
        const cards = { ...state.cards };
        if (change.operation === "deleted") delete cards[change.key];
        else cards[change.key] = change.value;
        setState({ cards });
        return;
      }
      if (change.table === "edges") {
        const edges = { ...state.edges };
        if (change.operation === "deleted") delete edges[change.key];
        else edges[change.key] = change.value;
        setState({ edges });
        return;
      }
      if (change.table === "digests") {
        const digests = { ...state.digests };
        if (change.operation === "deleted") delete digests[change.key];
        else digests[change.key] = change.value;
        setState({ digests });
      }
    }, () => {
      canvas.refresh();
    });
  },
  moveCard(id2, x, y) {
    const card = state.cards[id2];
    if (card === void 0) return;
    pushUndo();
    setState({ cards: { ...state.cards, [id2]: { ...card, x, y } } });
    dirtyCards.add(id2);
    scheduleCardFlush();
  },
  /**
   * Batch position write — one undo frame, one state copy, one flush. The slot
   * layout moves a whole folder of cards at once (drop, resize, compaction),
   * and per-card calls would push an undo frame per card and post N times.
   */
  moveCards(points) {
    const cards = { ...state.cards };
    let changed = false;
    for (const [id2, point] of Object.entries(points)) {
      const card = cards[id2];
      if (card === void 0) continue;
      if (card.x === point.x && card.y === point.y) continue;
      cards[id2] = { ...card, x: point.x, y: point.y };
      dirtyCards.add(id2);
      changed = true;
    }
    if (!changed) return;
    pushUndo();
    setState({ cards });
    scheduleCardFlush();
  },
  /** Immediate-persist upsert (new cards from double-click / auto-placement). */
  addCards(entries) {
    pushUndo();
    setState({ cards: { ...state.cards, ...entries } });
    trackCardWrite(talkMapApi.upsertCards(entries).catch((error) => {
      console.error("[dsh-talk-pages] card upsert failed:", error);
    }));
  },
  /** Add edges: local state first, then persisted (no SSE round-trip needed). */
  addEdges(entries) {
    pushUndo();
    setState({ edges: { ...state.edges, ...entries } });
    void talkMapApi.upsertEdges(entries).catch((error) => {
      console.error("[dsh-talk-pages] edge upsert failed:", error);
    });
  },
  removeEdges(ids) {
    const present = ids.filter((id2) => state.edges[id2] !== void 0);
    if (present.length === 0) return;
    pushUndo();
    const edges = { ...state.edges };
    for (const id2 of present) delete edges[id2];
    setState({ edges });
    void talkMapApi.deleteEdges(present).catch((error) => {
      console.error("[dsh-talk-pages] edge delete failed:", error);
    });
  },
  /** Background re-sync with the server (missed SSE while the map was
   * closed or the server restarted). Skipped while local writes — card
   * positions or a global patch — are still in flight. */
  refresh() {
    if (state.phase !== "ready" || dirtyCards.size > 0 || globalWritesInFlight > 0 || cardWritesInFlight > 0) return;
    const seqAtStart = editSeq;
    talkMapApi.getState().then((payload) => {
      if (state.phase !== "ready" || dirtyCards.size > 0 || globalWritesInFlight > 0) return;
      if (seqAtStart !== editSeq) return;
      setState({
        cards: payload.cards,
        edges: payload.edges,
        digests: payload.digests,
        global: payload.global
      });
    }).catch(() => void 0);
  },
  /** Local mirror of a host-side spawn result (host already persisted it). */
  applySpawn(result) {
    pushUndo();
    setState({
      cards: { ...state.cards, [result.cardId]: result.card },
      edges: { ...state.edges, ...result.edges }
    });
  },
  removeCard(id2) {
    const card = state.cards[id2];
    if (card === void 0) return;
    pushUndo();
    const cards = { ...state.cards };
    delete cards[id2];
    if (state.global !== null) {
      const layoutMemory = {
        ...state.global.layoutMemory,
        [card.sessionId]: {
          x: card.x,
          y: card.y,
          ...card.colorTag !== void 0 ? { colorTag: card.colorTag } : {}
        }
      };
      const global = { ...state.global, layoutMemory };
      setState({ cards, global });
      scheduleGlobalPersist();
    } else {
      setState({ cards });
    }
    trackCardWrite(talkMapApi.deleteCards([id2]).catch((error) => {
      console.error("[dsh-talk-pages] card delete failed:", error);
    }));
  },
  /** Adopt a card into a user box (undefined = back to a free card). */
  setCardBox(id2, boxId) {
    const card = state.cards[id2];
    if (card === void 0) return;
    if (card.boxId === boxId) return;
    pushUndo();
    const next = { ...card };
    if (boxId === void 0) delete next.boxId;
    else next.boxId = boxId;
    setState({ cards: { ...state.cards, [id2]: next } });
    void talkMapApi.upsertCards({ [id2]: next }).catch((error) => {
      console.error("[dsh-talk-pages] card box save failed:", error);
    });
  },
  /** Mark a card's importance (1 high, 2 medium, 3 low; undefined clears it). */
  setCardPriority(id2, priority) {
    const card = state.cards[id2];
    if (card === void 0 || card.priority === priority) return;
    pushUndo();
    const next = { ...card };
    if (priority === void 0) delete next.priority;
    else next.priority = priority;
    setState({ cards: { ...state.cards, [id2]: next } });
    trackCardWrite(talkMapApi.upsertCards({ [id2]: next }).catch((error) => {
      console.error("[dsh-talk-pages] card priority save failed:", error);
    }));
  },
  /** Switch a box between the slot grid and free placement of its members. */
  setBoxFree(boxId, free) {
    if (state.global === null) return;
    const box = state.global.boxes?.[boxId];
    if (box === void 0 || box.free === true === free) return;
    pushUndo();
    const global = {
      ...state.global,
      boxes: { ...state.global.boxes, [boxId]: { ...box, free } }
    };
    setState({ global });
    void persistGlobal(global, "box");
  },
  /** Switch the rendered page (each page keeps its own camera). */
  setActivePage(pageId) {
    if (state.global === null || state.global.activePage === pageId) return;
    canvas.patchGlobalNow({ activePage: pageId });
  },
  /** Header 吸附/Snap switch: free cards snap to the grid on drop. */
  setSnap(enabled) {
    if (state.global === null || state.global.snap === enabled) return;
    canvas.patchGlobalNow({ snap: enabled });
  },
  /**
   * Create a user box on a page and return its id. Geometry starts at `rect`
   * (the canvas passes the viewport centre); the box is empty until cards are
   * dropped into it — creating a box never moves or creates a card.
   */
  createBox(pageId, rect, title) {
    if (state.global === null) return void 0;
    const boxId = `box-${crypto.randomUUID()}`;
    pushUndo();
    const global = {
      ...state.global,
      boxes: { ...state.global.boxes, [boxId]: { pageId, title, free: true } },
      wsFrames: { ...state.global.wsFrames, [boxId]: rect }
    };
    setState({ global });
    void persistGlobal(global, "box");
    return boxId;
  },
  /** Rename a box (the label chip and the tab bar read this title). */
  renameBox(boxId, title) {
    if (state.global === null) return;
    const box = state.global.boxes?.[boxId];
    if (box === void 0 || box.title === title) return;
    pushUndo();
    const global = {
      ...state.global,
      boxes: { ...state.global.boxes, [boxId]: { ...box, title } }
    };
    setState({ global });
    void persistGlobal(global, "box");
  },
  /**
   * Delete a box and UNGROUP its cards: every member becomes a free card at the
   * position it already had. Sessions, cards and edges are untouched — only the
   * container goes away.
   */
  deleteBox(boxId) {
    if (state.global === null) return;
    const box = state.global.boxes?.[boxId];
    if (box === void 0) return;
    pushUndo();
    const cards = { ...state.cards };
    const patches = {};
    for (const [cardId, card] of Object.entries(cards)) {
      if (card.boxId !== boxId) continue;
      const next = { ...card };
      delete next.boxId;
      cards[cardId] = next;
      patches[cardId] = next;
    }
    const boxes = { ...state.global.boxes };
    delete boxes[boxId];
    const wsFrames = { ...state.global.wsFrames };
    delete wsFrames[boxId];
    const global = { ...state.global, boxes, wsFrames };
    setState({ cards, global });
    if (Object.keys(patches).length > 0) {
      trackCardWrite(talkMapApi.upsertCards(patches).catch((error) => {
        console.error("[dsh-talk-pages] ungroup save failed:", error);
      }));
    }
    void persistGlobal(global, "box");
  },
  /**
   * One-time layout migration (LAYOUT_VERSION 5): write the migrated boxes and
   * card memberships in one pass. No undo frame — a migration is not an edit the
   * user made, and Cmd+Z must not be able to resurrect the old layout half-way.
   */
  migrateToBoxes(boxes, cards, layoutVersion) {
    if (state.global === null) return;
    const global = { ...state.global, layoutVersion, boxes };
    setState({ cards: { ...state.cards, ...cards }, global });
    if (Object.keys(cards).length > 0) {
      trackCardWrite(talkMapApi.upsertCards(cards).catch((error) => {
        console.error("[dsh-talk-pages] migration card save failed:", error);
      }));
    }
    void persistGlobal(global, "migration");
  },
  /** Manual frame geometry (drag/resize); local now, persisted debounced. */
  setWsFrameRect(workspaceId, rect) {
    if (state.global === null) return;
    pushUndo();
    const global = {
      ...state.global,
      wsFrames: { ...state.global.wsFrames, [workspaceId]: rect }
    };
    setState({ global });
    if (frameTimer !== void 0) clearTimeout(frameTimer);
    frameTimer = setTimeout(() => {
      frameTimer = void 0;
      const current = state.global;
      if (current === null) return;
      void persistGlobal(current, "frame");
    }, 600);
  },
  /** Recolor a workspace frame (undefined clears); persists immediately. */
  setWorkspaceColor(workspaceId, colorTag) {
    if (state.global === null) return;
    pushUndo();
    const wsColors = { ...state.global.wsColors };
    if (colorTag === void 0) delete wsColors[workspaceId];
    else wsColors[workspaceId] = colorTag;
    canvas.patchGlobalNow({ wsColors });
  },
  /** Immediate global patch (layout-version stamp etc.) — no debounce. */
  patchGlobalNow(patch) {
    if (state.global === null) return;
    const global = { ...state.global, ...patch };
    setState({ global });
    void persistGlobal(global, "global");
  },
  setCamera(boardId, camera) {
    if (state.global === null) return;
    const global = {
      ...state.global,
      cameraByBoard: { ...state.global.cameraByBoard, [boardId]: camera }
    };
    setState({ global });
    if (cameraTimer !== void 0) clearTimeout(cameraTimer);
    cameraTimer = setTimeout(() => {
      cameraTimer = void 0;
      const current = state.global;
      if (current === null) return;
      void persistGlobal(current, "camera");
    }, CAMERA_DELAY_MS);
  },
  /** Cmd/Ctrl+Z — board operations only (conversations are not undoable). */
  undo() {
    const snapshot5 = undoStack.pop();
    if (snapshot5 === void 0) return;
    redoStack.push(takeSnapshot());
    restoreSnapshot(snapshot5);
  },
  redo() {
    const snapshot5 = redoStack.pop();
    if (snapshot5 === void 0) return;
    undoStack.push(takeSnapshot());
    restoreSnapshot(snapshot5);
  },
  savedCamera(boardId) {
    return state.global?.cameraByBoard[boardId];
  },
  /** First card found for a session (M1: one board, at most one card each). */
  cardIdForSession(sessionId) {
    for (const [id2, card] of Object.entries(state.cards)) {
      if (card.sessionId === sessionId) return id2;
    }
    return void 0;
  }
};
function newCardId() {
  return `card-${crypto.randomUUID()}`;
}

// src/client/hotkey.ts
var DEFAULT_HOTKEY = "alt+KeyF";
function parseHotkey(value2) {
  const parts = value2.split("+");
  const code = parts[parts.length - 1] ?? "";
  return {
    alt: parts.includes("alt"),
    ctrl: parts.includes("ctrl"),
    meta: parts.includes("meta"),
    shift: parts.includes("shift"),
    code
  };
}
function hotkeyMatches(event, value2) {
  const hotkey = parseHotkey(value2);
  return event.altKey === hotkey.alt && event.ctrlKey === hotkey.ctrl && event.metaKey === hotkey.meta && event.shiftKey === hotkey.shift && event.code === hotkey.code;
}

// src/client/map-state.ts
var listeners2 = /* @__PURE__ */ new Set();
var state2 = { open: false };
function emit() {
  for (const listener of listeners2) listener();
}
var escGuards = /* @__PURE__ */ new Set();
var mapUi = {
  get() {
    return state2;
  },
  subscribe(listener) {
    listeners2.add(listener);
    return () => {
      listeners2.delete(listener);
    };
  },
  /**
   * Mirror of "the map panel is the selected main panel". The panel component
   * drives it from its own mount/unmount — the shell owns the real selection.
   */
  setOpen(open) {
    if (state2.open === open) return;
    state2 = { open };
    emit();
  },
  toggle() {
    if (state2.open) closeMapPanel();
    else openMapPanel();
  },
  claimEscape(id2) {
    escGuards.add(id2);
    return () => {
      escGuards.delete(id2);
    };
  },
  escapeClaimed() {
    return escGuards.size > 0;
  }
};
var MAP_PANEL_ID = "talk-pages";
var services;
function attachServices(next) {
  services = next;
}
function getServices() {
  return services;
}
function resolveUiWorkspace(current) {
  if (current.uiWorkspace !== void 0) return current.uiWorkspace;
  const get3 = current.ctx?.get;
  if (typeof get3 !== "function") return void 0;
  try {
    const value2 = get3.call(current.ctx, "uiWorkspace");
    return value2 === void 0 || value2 === null ? void 0 : value2;
  } catch {
    return void 0;
  }
}
function uiWorkspaceService() {
  const current = getServices();
  return current === void 0 ? void 0 : resolveUiWorkspace(current);
}
function resolveLayout(current) {
  if (current.layout !== void 0) return current.layout;
  const get3 = current.ctx?.get;
  if (typeof get3 !== "function") return void 0;
  try {
    const value2 = get3.call(current.ctx, "layout");
    return value2 === void 0 || value2 === null ? void 0 : value2;
  } catch {
    return void 0;
  }
}
var lastCurrentSessionId;
function readCurrentSessionId() {
  if (typeof localStorage === "undefined") return void 0;
  try {
    const raw = localStorage.getItem("dsh.sessions.current");
    if (raw === null || raw === "") return void 0;
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      const value2 = parsed.sessionId ?? parsed.id;
      return typeof value2 === "string" && value2 !== "" ? value2 : void 0;
    }
    const bare = trimmed.replace(/^"|"$/g, "");
    return bare === "" || bare === "null" ? void 0 : bare;
  } catch {
    return void 0;
  }
}
function currentSessionId() {
  const live = readCurrentSessionId();
  if (live !== void 0) {
    lastCurrentSessionId = live;
    return live;
  }
  return lastCurrentSessionId;
}
function openMapPanel() {
  lastCurrentSessionId = readCurrentSessionId();
  const current = getServices();
  const layout = current === void 0 ? void 0 : resolveLayout(current);
  if (layout === void 0) {
    mapUi.setOpen(true);
    return;
  }
  try {
    layout.selectPanel(MAP_PANEL_ID);
  } catch (error) {
    console.error("[dsh-talk-pages] selectPanel failed:", error);
    mapUi.setOpen(true);
  }
}
function closeMapPanel() {
  const current = getServices();
  const layout = current === void 0 ? void 0 : resolveLayout(current);
  if (layout === void 0) {
    mapUi.setOpen(false);
    return;
  }
  try {
    layout.selectPanel(null);
  } catch (error) {
    console.error("[dsh-talk-pages] selectPanel(null) failed:", error);
    mapUi.setOpen(false);
  }
}
var sidebarWide;
var sidebarHiddenByMap = false;
function reportSidebarWide(wide) {
  sidebarWide = wide;
}
function hideSidebarForMap() {
  if (sidebarHiddenByMap) return;
  if (sidebarWide !== true) return;
  const current = getServices();
  const layout = current === void 0 ? void 0 : resolveLayout(current);
  if (layout === void 0) return;
  try {
    layout.toggleSidebar();
    sidebarHiddenByMap = true;
  } catch (error) {
    console.error("[dsh-talk-pages] collapsing the sidebar failed:", error);
  }
}
function restoreSidebarAfterMap() {
  if (!sidebarHiddenByMap) return;
  sidebarHiddenByMap = false;
  const current = getServices();
  const layout = current === void 0 ? void 0 : resolveLayout(current);
  if (layout === void 0) return;
  try {
    layout.toggleSidebar();
  } catch (error) {
    console.error("[dsh-talk-pages] restoring the sidebar failed:", error);
  }
}
function connectionService() {
  return services?.connection;
}
function openSessionInUi(sessionId) {
  const current = getServices();
  if (current === void 0) return false;
  try {
    const ui = resolveUiWorkspace(current);
    if (ui !== void 0 && typeof ui.openSession === "function") {
      ui.openSession(sessionId);
      return true;
    }
    if (typeof current.sessions.open === "function") {
      current.sessions.open(sessionId);
      return true;
    }
  } catch (error) {
    console.error("[dsh-talk-pages] opening session failed:", sessionId, error);
    return false;
  }
  console.error("[dsh-talk-pages] this DSH build exposes no session navigation service; cannot open", sessionId);
  return false;
}
function forkSessionInUi(sessionId) {
  const current = getServices();
  if (current === void 0) return Promise.reject(new Error("dsh-talk-pages: services are not attached"));
  const ui = resolveUiWorkspace(current);
  if (ui !== void 0 && typeof ui.forkSession === "function") return ui.forkSession(sessionId);
  if (typeof current.sessions.fork === "function") return current.sessions.fork({ sessionId, increaseTitle: true });
  return Promise.reject(new Error("dsh-talk-pages: this DSH build exposes no fork API"));
}
var titleResolver;
function setTitleResolver(resolver) {
  titleResolver = resolver;
}
var titleTable = [];
function setTitleTable(next) {
  titleTable = next;
}
var cardTable = [];
function setCardTable(next) {
  cardTable = next;
}
function allCards() {
  return cardTable;
}

// src/client/MapOverlay.tsx
var import_react17 = require("react");

// src/client/font-scale.ts
var STORAGE_KEY = "dsh.talk-pages.font-step";
var MIN = -3;
var MAX = 9;
function read() {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  const value2 = raw === null ? 0 : Number(raw);
  return Number.isFinite(value2) ? Math.min(MAX, Math.max(MIN, Math.round(value2))) : 0;
}
var step = read();
var snapshot = step;
var listeners3 = /* @__PURE__ */ new Set();
function publish() {
  snapshot = step;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, String(step));
    } catch {
    }
  }
  for (const listener of listeners3) listener();
}
var fontScale = {
  getSnapshot() {
    return snapshot;
  },
  subscribe(listener) {
    listeners3.add(listener);
    return () => {
      listeners3.delete(listener);
    };
  },
  /** CSS value for the panel root. */
  css() {
    return `${snapshot}px`;
  },
  canDecrease() {
    return snapshot > MIN;
  },
  canIncrease() {
    return snapshot < MAX;
  },
  increase() {
    if (step >= MAX) return;
    step += 1;
    publish();
  },
  decrease() {
    if (step <= MIN) return;
    step -= 1;
    publish();
  },
  reset() {
    if (step === 0) return;
    step = 0;
    publish();
  }
};

// src/client/GlobalSearch.tsx
var import_react = require("react");

// src/client/snippet-text.ts
var NOISE_MARKER = /\[(?:tool\/result|assistant\/message|user\/message|system\/message|developer\/message|dsh-[a-z-]+)[^\]]*\]/gi;
var JSON_KEY = /"[A-Za-z0-9_$]+"\s*:\s*/g;
function unescape(value2) {
  return value2.replace(/\\r\\n|\\n|\\r/g, " ").replace(/\\t/g, " ").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function punctuationRatio(value2) {
  if (value2 === "") return 0;
  const noisy = value2.replace(/[^\s"{}[\],:]/g, "").length;
  return noisy / value2.length;
}
function looksSerialized(value2) {
  if (/\{\s*"|"\s*:\s*("|\[|\{|\d|true|false|null)/.test(value2)) return true;
  return (value2.match(/"/g) ?? []).length >= 4;
}
function keepProse(value2) {
  const quoted = [...value2.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map((match) => match[1]);
  const prose = quoted.map((part) => part.replace(/\\n|\\r|\\t/g, " ").trim()).filter((part) => part.length >= 6 && /[\u4e00-\u9fff]|[A-Za-z]/.test(part)).sort((a, b) => b.length - a.length).slice(0, 3);
  return prose.length > 0 ? prose.join(" … ") : "";
}
function cleanSnippet(raw, query) {
  let text = unescape(String(raw ?? ""));
  if (looksSerialized(text)) {
    const prose = keepProse(text);
    if (prose !== "") text = prose;
  }
  text = text.replace(NOISE_MARKER, " ");
  text = text.replace(JSON_KEY, " ");
  text = text.replace(/[{}\[\]]/g, " ");
  text = text.replace(/"{2,}/g, " ");
  text = text.replace(/^[\s"',;:]+|[\s"',;:]+$/g, "");
  text = text.replace(/\s{2,}/g, " ").trim();
  if (punctuationRatio(text) > 0.28) {
    const needle = query.trim().toLowerCase();
    const at = needle === "" ? 0 : text.toLowerCase().indexOf(needle);
    const start2 = Math.max(0, at - 60);
    const end = Math.min(text.length, at + 90);
    const window2 = text.slice(start2, end).replace(/[{}[\]]/g, " ").replace(/\s{2,}/g, " ").trim();
    text = (start2 > 0 ? "…" : "") + window2 + (end < text.length ? "…" : "");
  }
  text = text.split(/\s{2,}|…/).filter((part) => {
    const value2 = part.trim();
    if (value2 === "") return false;
    if (/^[A-Za-z0-9_$.-]{1,40}$/.test(value2)) return false;
    if (/^[A-Za-z0-9_$]{6,}\s*:/.test(value2) && value2.length < 60) return false;
    if (/^[0-9a-f]{16,}$/i.test(value2)) return false;
    return true;
  }).join(" ").trim();
  return text === "" ? String(raw ?? "").trim() : text;
}

// dsh-css: dsh-css:src/client/talk-pages.module.css
var __tagId = "dsh-talk-pages/talk-pages.module.css";
var __css = `.tm_toggleButton { display: flex; align-items: center; justify-content: center; gap: 6px; width: 32px; height: 32px; padding: 0; border: none; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; } .tm_toggleButton:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_toggleButtonActive { background: var(--dsw-alias-interactive-bg-active); color: var(--dsw-alias-brand-primary); } .tm_toggleRow { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 10px; border: none; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(13px + var(--tm-font-step, 0px)); cursor: pointer; text-align: left; } .tm_toggleRow:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_toggleLabel { white-space: nowrap; } .tm_toggleIcon { width: 18px; height: 18px; flex: none; } .tm_panel { height: 100%; min-height: 0; box-sizing: border-box; display: flex; flex-direction: column; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); } .tm_header { display: flex; align-items: center; gap: 10px; padding: 10px 14px 10px max(14px, calc(var(--dsh-frame-leading-clearance, 0px) + 10px)); border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); flex: none; } .tm_backButton { display: inline-flex; align-items: center; gap: 6px; flex: none; height: 38px; padding: 0 18px 0 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(14px + var(--tm-font-step, 0px)); font-weight: 600; line-height: 1; cursor: pointer; } .tm_backButton:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_globalSearch { position: relative; display: flex; align-items: center; gap: 6px; margin-right: 8px; } .tm_globalSearchInput { width: 200px; font: inherit; font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06)); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 5px 9px; outline: none; } .tm_globalSearchInput:focus { border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.3)); } .tm_globalSearchButton { font: inherit; font-size: calc(11.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 5px 10px; cursor: pointer; } .tm_globalSearchButton:hover { color: var(--dsw-alias-label-primary); } .tm_globalSearchBackdrop { position: fixed; inset: 0; z-index: 70; background: rgba(0, 0, 0, 0.45); display: flex; align-items: flex-start; justify-content: center; padding-top: 9vh; } .tm_globalSearchPanel { width: min(980px, 92vw); max-height: 76vh; display: flex; flex-direction: column; border-radius: 14px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); box-shadow: 0 22px 60px rgba(0, 0, 0, 0.5); overflow: hidden; } .tm_globalSearchHead { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--dsw-alias-border-l2); } .tm_globalSearchTitle { font-size: calc(13px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_globalSearchBody { padding: 0 16px 14px; overflow-y: auto; overscroll-behavior: contain; } .tm_searchInlineLoading { display: flex; align-items: center; padding: 4px 0 2px 10px; } .tm_searchInlineLoading > span { width: 62%; } .tm_drawerScrollSensor { width: 100%; height: 1px; opacity: 0; } .tm_fontGroup { display: flex; align-items: center; gap: 4px; margin-right: 6px; } .tm_fontButton { display: inline-flex; align-items: center; justify-content: center; gap: 3px; min-width: 46px; height: 28px; padding: 0 8px; line-height: 1; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font: inherit; font-size: calc(12px + var(--tm-font-step, 0px)); cursor: pointer; } .tm_fontButton:hover:not(:disabled) { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.3)); } .tm_fontButton:disabled { opacity: 0.4; cursor: default; } .tm_fontGlyphSmall, .tm_fontGlyphLarge { display: inline-block; width: calc(9px + 0px); text-align: center; line-height: 1; } .tm_fontGlyphSmall, .tm_fontGlyphLarge { font-size: calc(13px + var(--tm-font-step, 0px)); } .tm_fontSign { display: inline-block; font-size: calc(10px + var(--tm-font-step, 0px)); line-height: 1; transform: translateY(-3px); } .tm_fontReset { min-width: 50px; } .tm_fontReset { min-width: 44px; } .tm_headerSpace { flex: 1; } .tm_langButton { flex: none; min-width: 72px; height: 34px; padding: 0 14px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(13px + var(--tm-font-step, 0px)); cursor: pointer; white-space: nowrap; } .tm_langButton:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_closeButton { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 38px; height: 38px; padding: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; } .tm_closeButton:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_zoomResetLabel { font-size: calc(9px + var(--tm-font-step, 0px)); font-weight: 700; letter-spacing: -0.5px; } .tm_pageTabs { display: flex; align-items: center; gap: 8px; flex: none; min-height: 40px; padding: 6px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-base); overflow: hidden; } .tm_pageTabScroll { display: flex; align-items: center; gap: 6px; min-width: 0; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; } .tm_pageTab { display: inline-flex; align-items: center; gap: 6px; flex: none; max-width: 220px; height: 28px; padding: 0 10px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(12px + var(--tm-font-step, 0px)); font-weight: 600; cursor: pointer; white-space: nowrap; } .tm_pageTab:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_pageTabActive { border-color: var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); } .tm_pageTabTitle { overflow: hidden; text-overflow: ellipsis; } .tm_pageTabCount { flex: none; min-width: 18px; padding: 0 5px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-tertiary); font-size: calc(10px + var(--tm-font-step, 0px)); font-weight: 600; line-height: 16px; text-align: center; } .tm_pageTabsSpace { flex: 1; min-width: 8px; } .tm_pageAction { flex: none; height: 28px; padding: 0 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(12px + var(--tm-font-step, 0px)); font-weight: 600; cursor: pointer; white-space: nowrap; } .tm_pageAction:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_pageActionOn { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); } .tm_canvas { flex: 1; min-height: 0; position: relative; } @media (prefers-reduced-motion: reduce) { .tm_canvas .react-flow__edge circle { opacity: 0.28; } } .tm_canvas .react-flow__node { transition: transform 200ms cubic-bezier(0.2, 0.8, 0.25, 1); } .tm_canvas .react-flow__node.dragging, .tm_canvas .react-flow__node.tmDragging { transition: none; } .tm_canvas .react-flow__nodesselection, .tm_canvas .react-flow__nodesselection-rect { display: none !important; pointer-events: none !important; } .tm_card { position: relative; width: 224px; min-height: 104px; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); box-shadow: 0 1px 3px var(--dsw-alias-bg-mask-1); font-size: calc(13px + var(--tm-font-step, 0px)); } .tm_cardSelected { border-color: var(--dsw-alias-brand-primary); } .tm_cardGhost { opacity: 0.55; border-style: dashed; } .tm_cardTop { display: flex; align-items: center; gap: 6px; min-width: 0; } .tm_cardTitle { font-weight: 600; font-size: calc(13px + var(--tm-font-step, 0px)); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; } .tm_runningDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; animation: tm_talkmap-pulse 1.6s ease-in-out infinite; } @keyframes tm_talkmap-pulse { 50% { opacity: 0.35; } } .tm_cardNext { display: flex; align-items: baseline; gap: 6px; font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); min-width: 0; } .tm_cardNextLabel { flex: none; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-brand-primary); font-weight: 600; } .tm_cardNextText { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; } .tm_cardStale { flex: none; color: var(--dsw-alias-state-warn-primary); font-size: calc(12px + var(--tm-font-step, 0px)); } .tm_cardFooter { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_cardTime { flex: none; } .tm_cardChip { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border-radius: 999px; font-size: calc(10px + var(--tm-font-step, 0px)); font-weight: 600; white-space: nowrap; border: 1px solid transparent; } .tm_cardChipRunning { color: #ffffff; background: rgba(255, 255, 255, 0.14); border-color: rgba(255, 255, 255, 0.35); } .tm_cardChipWaiting { color: rgb(245, 178, 46); background: rgba(245, 178, 46, 0.14); border-color: rgba(245, 178, 46, 0.42); } .tm_cardChipDone { color: rgb(52, 199, 89); background: rgba(52, 199, 89, 0.14); border-color: rgba(52, 199, 89, 0.42); } .tm_cardChipError { color: rgb(242, 78, 78); background: rgba(242, 78, 78, 0.14); border-color: rgba(242, 78, 78, 0.45); } .tm_cardChipDraft { color: rgb(255, 197, 61); background: rgba(255, 197, 61, 0.18); border-color: rgba(255, 197, 61, 0.5); } .tm_cardChipInterrupted { color: rgb(214, 158, 92); background: rgba(214, 158, 92, 0.14); border-color: rgba(214, 158, 92, 0.42); } .tm_cardSummary { font-size: calc(12px + var(--tm-font-step, 0px)); line-height: 1.45; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; } .tm_cardBadgeWaiting { padding: 1px 7px; border-radius: 999px; font-size: calc(10px + var(--tm-font-step, 0px)); color: var(--dsw-alias-state-warn-label); background: var(--dsw-alias-state-warn-tertiary); } .tm_cardBadgeDone { padding: 1px 7px; border-radius: 999px; font-size: calc(10px + var(--tm-font-step, 0px)); color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-state-success-tertiary); } .tm_cardLampRunning { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.34), 0 0 16px 2px rgba(255, 255, 255, 0.2), 0 0 40px 9px rgba(255, 255, 255, 0.1); } .tm_dialogBackdrop { position: fixed; inset: 0; z-index: 80; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(2px); animation: tm_tmFadeIn 140ms ease-out; } .tm_digestDialog { width: min(720px, 86vw); max-height: 82vh; display: flex; flex-direction: column; gap: 8px; padding: 16px 18px 14px; border-radius: 14px; background: var(--dsw-alias-bg-elevated, #232323); border: 1px solid rgba(255, 255, 255, 0.09); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45); animation: tm_tmRiseIn 200ms cubic-bezier(0.16, 1, 0.3, 1); } .tm_digestDialogHead { display: flex; align-items: baseline; gap: 8px; min-width: 0; } .tm_digestDialogTitle { font-size: calc(13px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_digestDialogFrom { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); } .tm_digestLabel { margin-top: 4px; font-size: calc(10.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary, rgba(255, 255, 255, 0.5)); } .tm_digestText { width: 100%; min-height: 96px; max-height: 30vh; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.04); color: var(--dsw-alias-label-primary); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: calc(11.5px + var(--tm-font-step, 0px)); line-height: 1.62; resize: none; } .tm_digestEmpty { padding: 18px 4px; font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); } .tm_digestActions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; } .tm_renameBackdrop { position: fixed; inset: 0; z-index: 40; background: rgba(0, 0, 0, 0.42); display: flex; align-items: flex-start; justify-content: center; padding-top: 22vh; } .tm_renameDialog { width: min(420px, 90vw); background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; box-shadow: 0 18px 42px rgba(0, 0, 0, 0.42); padding: 16px 16px 12px; display: flex; flex-direction: column; gap: 10px; } .tm_renameHeading { font-size: calc(13px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_renameInput { width: 100%; box-sizing: border-box; font: inherit; font-size: calc(13px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06)); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 8px 10px; outline: none; } .tm_renameInput:focus { border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.35)); } .tm_renameError { font-size: calc(12px + var(--tm-font-step, 0px)); color: rgb(242, 78, 78); } .tm_renameActions { display: flex; justify-content: flex-end; gap: 8px; } .tm_renameButton { font: inherit; font-size: calc(12.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 6px 12px; cursor: pointer; } .tm_renameButton:hover { color: var(--dsw-alias-label-primary); } .tm_renamePrimary { color: #0b0b0c; background: rgb(255, 214, 106); border-color: rgb(255, 214, 106); } .tm_renamePrimary:disabled { opacity: 0.5; cursor: default; } .tm_cardPin { display: inline-flex; align-items: center; flex: none; color: rgb(255, 214, 106); filter: drop-shadow(0 0 5px rgba(255, 214, 106, 0.85)); animation: tm_talkmap-pin-glow 2.6s ease-in-out infinite; } @keyframes tm_talkmap-pin-glow { 0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 214, 106, 0.6)); opacity: 0.92; } 50% { filter: drop-shadow(0 0 9px rgba(255, 214, 106, 1)); opacity: 1; } } .tm_cardReticle { position: absolute; inset: -5px; pointer-events: none; filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.45)); } .tm_cardReticle i { position: absolute; width: 13px; height: 13px; border: 2px solid rgba(255, 255, 255, 0.9); } .tm_cardReticle i:nth-child(1) { left: 0; top: 0; border-right: 0; border-bottom: 0; border-top-left-radius: 4px; } .tm_cardReticle i:nth-child(2) { right: 0; top: 0; border-left: 0; border-bottom: 0; border-top-right-radius: 4px; } .tm_cardReticle i:nth-child(3) { left: 0; bottom: 0; border-right: 0; border-top: 0; border-bottom-left-radius: 4px; } .tm_cardReticle i:nth-child(4) { right: 0; bottom: 0; border-left: 0; border-top: 0; border-bottom-right-radius: 4px; } .tm_cardQuiet { opacity: 0.62; transition: opacity 140ms ease; } .tm_cardQuiet:hover { opacity: 1; } .tm_stackBadgeBusy { color: rgb(255, 197, 61); border-color: rgba(255, 197, 61, 0.5); } @property --tm-ring-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; } .tm_cardLampRunning::after { content: ''; position: absolute; inset: -2px; border-radius: 12px; padding: 2px; background: conic-gradient( from var(--tm-ring-angle), rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 190deg, rgba(255, 255, 255, 0.18) 250deg, rgba(255, 255, 255, 0.55) 292deg, rgba(255, 255, 255, 1) 325deg, rgba(255, 255, 255, 0.4) 352deg, rgba(255, 255, 255, 0) 360deg ); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: tm_talkmap-ring-sweep 1.8s linear infinite; pointer-events: none; } @keyframes tm_talkmap-ring-sweep { to { --tm-ring-angle: 360deg; } } .tm_cardLampDone { animation: tm_talkmap-lamp-green 2.8s ease-in-out infinite; } .tm_cardLampError { animation: tm_talkmap-lamp-red 1.9s ease-in-out infinite; } .tm_cardLampWaiting { animation: tm_talkmap-lamp-amber 3.4s ease-in-out infinite; } @keyframes tm_talkmap-lamp-green { 0%, 100% { box-shadow: inset 0 0 0 1px rgba(52, 199, 89, 0.40), 0 0 14px 1px rgba(52, 199, 89, 0.26), 0 0 34px 8px rgba(52, 199, 89, 0.11); } 50% { box-shadow: inset 0 0 0 1px rgba(52, 199, 89, 0.72), 0 0 24px 5px rgba(52, 199, 89, 0.46), 0 0 62px 20px rgba(52, 199, 89, 0.22); } } @keyframes tm_talkmap-lamp-amber { 0%, 100% { box-shadow: inset 0 0 0 1px rgba(245, 178, 46, 0.42), 0 0 14px 1px rgba(245, 178, 46, 0.24), 0 0 34px 8px rgba(245, 178, 46, 0.11); } 50% { box-shadow: inset 0 0 0 1px rgba(245, 178, 46, 0.72), 0 0 24px 5px rgba(245, 178, 46, 0.44), 0 0 60px 19px rgba(245, 178, 46, 0.20); } } @keyframes tm_talkmap-lamp-red { 0%, 100% { box-shadow: inset 0 0 0 1px rgba(242, 78, 78, 0.46), 0 0 14px 1px rgba(242, 78, 78, 0.28), 0 0 34px 8px rgba(242, 78, 78, 0.12); } 50% { box-shadow: inset 0 0 0 1px rgba(242, 78, 78, 0.80), 0 0 26px 6px rgba(242, 78, 78, 0.52), 0 0 66px 22px rgba(242, 78, 78, 0.26); } } .tm_cardRemove { align-self: flex-start; padding: 3px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(12px + var(--tm-font-step, 0px)); cursor: pointer; } .tm_cardRemove:hover { background: var(--dsw-alias-interactive-bg-hover-danger); color: var(--dsw-alias-state-error-primary); } .tm_cardHandle { width: 10px; height: 10px; background: var(--dsw-alias-border-l3); border: 2px solid var(--dsw-alias-bg-layer-1); opacity: 0; } .tm_card:hover .tm_cardHandle, .tm_canvasConnecting .tm_cardHandle { opacity: 1; } .tm_cardHandle:hover { background: var(--dsw-alias-brand-primary); } .tm_cardRefresh { flex: none; margin-left: auto; width: 22px; height: 22px; padding: 0; border: none; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-tertiary); font-size: calc(13px + var(--tm-font-step, 0px)); line-height: 1; cursor: pointer; opacity: 0; transition: opacity 120ms ease; } .tm_card:hover .tm_cardRefresh { opacity: 1; } .tm_cardRefresh:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_cardRefreshBusy { opacity: 1; animation: tm_talkmap-spin 1s linear infinite; } @keyframes tm_talkmap-spin { to { transform: rotate(360deg); } } .tm_spawnPanel { position: absolute; right: 24px; top: 24px; z-index: 6; width: 420px; max-width: calc(100% - 48px); display: flex; flex-direction: column; gap: 8px; padding: 16px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 8px 30px var(--dsw-alias-bg-mask-2); } .tm_spawnHeading { font-size: calc(14px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_spawnFrom { font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); } .tm_spawnModes { display: flex; gap: 6px; } .tm_spawnModeBtn { flex: 1; padding: 5px 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(12px + var(--tm-font-step, 0px)); cursor: pointer; } .tm_spawnModeBtn:hover { background: var(--dsw-alias-interactive-bg-hover); } .tm_spawnModeActive { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-interactive-bg-active); } .tm_spawnHint { font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_spawnTextarea { width: 100%; resize: vertical; min-height: 140px; padding: 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: calc(13px + var(--tm-font-step, 0px)); line-height: 1.5; font-family: inherit; } .tm_spawnError { font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-state-error-primary); word-break: break-all; } .tm_spawnActions { display: flex; justify-content: flex-end; gap: 8px; } .tm_spawnBtnPrimary { padding: 6px 16px; border: none; border-radius: 8px; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-label-primary-foreground); font-size: calc(13px + var(--tm-font-step, 0px)); cursor: pointer; } .tm_spawnBtnPrimary:hover { background: var(--dsw-alias-button-primary-hover); } .tm_spawnBtnPrimary:disabled { background: var(--dsw-alias-button-primary-dimmed); cursor: default; } .tm_spawnBtnGhost { padding: 6px 16px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(13px + var(--tm-font-step, 0px)); cursor: pointer; } .tm_spawnBtnGhost:hover { background: var(--dsw-alias-interactive-bg-hover); } .tm_wsFrame { position: relative; border: 1.5px dashed var(--dsw-alias-border-l2); border-radius: 16px; background: transparent; } .tm_wsFrameBlocked { border-color: rgb(242, 78, 78) !important; box-shadow: 0 0 0 1px rgba(242, 78, 78, 0.45) inset; } .tm_wsFrameSelected { border-style: solid; border-color: var(--dsw-alias-brand-primary); } .tm_wsFrameLabel { position: absolute; top: -12px; left: 14px; display: flex; align-items: center; gap: 6px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l1); background: var(--dsw-alias-bg-layer-1); font-size: calc(12px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-secondary); white-space: nowrap; pointer-events: auto; cursor: grab; z-index: 5; } .tm_wsFrameLabel:active { cursor: grabbing; } .tm_wsFrameEdge { position: absolute; pointer-events: auto; cursor: grab; } .tm_wsFrameEdge:active { cursor: grabbing; } .tm_wsFrameCount { font-weight: 400; color: var(--dsw-alias-label-tertiary); } .tm_menu { position: absolute; z-index: 60; min-width: 200px; max-width: 280px; max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; padding: 6px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 8px 30px var(--dsw-alias-bg-mask-2); } .tm_menuTitle { flex: none; padding: 4px 10px 6px; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_menuSearch { flex: none; box-sizing: border-box; width: calc(100% - 8px); margin: 2px 4px 6px; padding: 5px 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 7px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: calc(12px + var(--tm-font-step, 0px)); font-family: inherit; } .tm_menuHint { font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-dimmed); } .tm_menuPreview { flex: none; padding: 0 10px 4px; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); word-break: break-all; } .tm_menuError { flex: none; padding: 0 10px 4px; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-state-error-primary); word-break: break-all; } .tm_menuEmpty { padding: 8px 10px; font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_menuItem { flex: none; display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; padding: 6px 10px; border: none; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-primary); font-size: calc(13px + var(--tm-font-step, 0px)); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .tm_menuIcon { flex: none; width: 14px; height: 14px; color: var(--dsw-alias-label-secondary); } .tm_menuItemDanger { color: rgb(242, 78, 78); } .tm_menuItemDanger .tm_menuIcon { color: rgb(242, 78, 78); } .tm_menuItem:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); } .tm_menuItem:disabled { color: var(--dsw-alias-label-dimmed); cursor: default; } .tm_wsFrameHidden { font-weight: 400; color: var(--dsw-alias-state-warn-primary); } .tm_emptyHint { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: calc(13px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); pointer-events: none; z-index: 4; } .tm_toast { position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%); z-index: 8; max-width: 70%; padding: 7px 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 4px 16px var(--dsw-alias-bg-mask-2); font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-primary); pointer-events: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .tm_stackCell { position: relative; width: 224px; height: 104px; cursor: pointer; } .tm_stackSheetBack, .tm_stackSheetMid { position: absolute; inset: 0; border-radius: 12px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); } .tm_stackSheetBack { transform: translate(11px, 11px) scale(0.95); opacity: 0.35; } .tm_stackSheetMid { transform: translate(5px, 5px) scale(0.977); opacity: 0.6; } .tm_stackFace { position: absolute; inset: 0; box-sizing: border-box; display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; padding: 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-1); transition: border-color 140ms ease, transform 140ms ease; } .tm_stackCell:hover .tm_stackFace { border-color: var(--dsw-alias-brand-primary); transform: translateY(-1px); } .tm_stackFaceTitle { font-size: calc(13px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; } .tm_stackBadge { flex: none; padding: 1px 8px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); font-size: calc(11px + var(--tm-font-step, 0px)); font-variant-numeric: tabular-nums; } .tm_drawerBackdrop { position: absolute; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-mask-2); } .tm_drawer { width: min(1120px, 94%); max-height: 84%; box-sizing: border-box; display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l1); border-radius: 16px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 18px 48px var(--dsw-alias-bg-mask-2); overflow: hidden; } .tm_drawerHead { display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1); } .tm_drawerTitle { font-size: calc(14px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_drawerCount { font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_drawerSpace { flex: 1; } .tm_drawerHint { font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); } .tm_drawerClose { flex: none; width: 30px; height: 30px; padding: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(16px + var(--tm-font-step, 0px)); line-height: 1; cursor: pointer; } .tm_drawerClose:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); } .tm_drawerHits > .tm_drawerHit { animation: tm_tmPopIn 240ms cubic-bezier(0.16, 1, 0.3, 1) both; } .tm_drawerHits > .tm_drawerHit:nth-child(1) { animation-delay: 20ms; } .tm_drawerHits > .tm_drawerHit:nth-child(2) { animation-delay: 34ms; } .tm_drawerHits > .tm_drawerHit:nth-child(3) { animation-delay: 48ms; } .tm_drawerHits > .tm_drawerHit:nth-child(4) { animation-delay: 62ms; } .tm_drawerHits > .tm_drawerHit:nth-child(5) { animation-delay: 76ms; } .tm_drawerHits > .tm_drawerHit:nth-child(n+6) { animation-delay: 90ms; } .tm_searchLoading { display: flex; flex-direction: column; gap: 8px; padding: 6px 0 2px; } .tm_searchLoadingBar { position: relative; height: 2px; border-radius: 2px; overflow: hidden; background: rgba(255, 255, 255, 0.07); } .tm_searchLoadingBar > i { position: absolute; inset: 0 auto 0 0; width: 34%; border-radius: 2px; background: linear-gradient(90deg, transparent, var(--dsw-alias-brand-primary), transparent); animation: tm_tmSlideBar 1150ms cubic-bezier(0.4, 0, 0.2, 1) infinite; } @keyframes tm_tmSlideBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(320%); } } .tm_searchSkeletonRow { display: flex; flex-direction: column; gap: 6px; padding: 9px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 9px; } .tm_searchSkeletonTitle, .tm_searchSkeletonLine { display: block; height: 9px; border-radius: 4px; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.12), rgba(255,255,255,0.05)); background-size: 220% 100%; animation: tm_tmShimmer 1300ms ease-in-out infinite; } .tm_searchSkeletonTitle { width: 38%; } .tm_searchSkeletonLine { width: 78%; } @keyframes tm_tmShimmer { 0% { background-position: 120% 0; } 100% { background-position: -60% 0; } } @media (prefers-reduced-motion: reduce) { .tm_drawerHits > .tm_drawerHit, .tm_searchLoadingBar > i, .tm_searchSkeletonTitle, .tm_searchSkeletonLine { animation: none; } } @keyframes tm_tmFadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes tm_tmFadeOut { from { opacity: 1; } to { opacity: 0; } } @keyframes tm_tmRiseIn { from { opacity: 0; transform: translateY(26px) scale(0.94); } 60% { opacity: 1; } to { opacity: 1; transform: none; } } @keyframes tm_tmRiseOut { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(10px) scale(0.985); } } @keyframes tm_tmPopIn { from { opacity: 0; transform: translateY(6px) scale(0.97); } to { opacity: 1; transform: none; } } @keyframes tm_tmCardIn { from { opacity: 0; transform: translateY(6px) scale(0.99); } to { opacity: 1; transform: none; } } .tm_drawerBackdrop { animation: tm_tmFadeIn 180ms cubic-bezier(0.16, 1, 0.3, 1) both; } .tm_drawerBackdropOut { animation: tm_tmFadeOut 130ms ease-in both; } .tm_drawer { animation: tm_tmRiseIn 260ms cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; } .tm_drawerOut { animation: tm_tmRiseOut 150ms cubic-bezier(0.4, 0, 0.7, 0.2) both; } .tm_globalSearchBackdrop { animation: tm_tmFadeIn 130ms ease-out both; } .tm_globalSearchPanel { animation: tm_tmRiseIn 240ms cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity; } .tm_menu { animation: tm_tmPopIn 120ms cubic-bezier(0.2, 0.9, 0.25, 1) both; } .tm_card { transition: transform 120ms ease-out, box-shadow 160ms ease-out, opacity 160ms ease-out; } .tm_card:hover { transform: translateY(-1px); } .tm_reactFlowNodeEnter { animation: tm_tmCardIn 170ms cubic-bezier(0.2, 0.9, 0.25, 1) both; } .tm_stackCell { transition: transform 120ms ease-out, box-shadow 160ms ease-out; } .tm_stackCell:hover { transform: translateY(-2px); } .tm_wsFrameLabel { transition: color 120ms ease-out, background 120ms ease-out, box-shadow 120ms ease-out; } .tm_wsFrameLabel:hover { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35); } .tm_toast { animation: tm_tmRiseIn 160ms cubic-bezier(0.2, 0.9, 0.25, 1) both; } .tm_snippetCode { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.94em; padding: 0 3px; border-radius: 4px; background: rgba(255, 255, 255, 0.08); } .tm_snippetLink { color: var(--dsw-alias-brand-primary); } @media (prefers-reduced-motion: reduce) { .tm_drawerBackdrop, .tm_drawerBackdropOut, .tm_drawer, .tm_drawerOut, .tm_globalSearchBackdrop, .tm_globalSearchPanel, .tm_menu, .tm_toast, .tm_reactFlowNodeEnter { animation: none; } .tm_card, .tm_stackCell, .tm_wsFrameLabel { transition: none; } .tm_card:hover, .tm_stackCell:hover { transform: none; } } .tm_drawerSearchRow { display: flex; align-items: center; gap: 8px; padding: 0 14px 8px; } .tm_drawerSearch { flex: 1; min-width: 0; font: inherit; font-size: calc(12.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06)); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 6px 10px; outline: none; } .tm_drawerSearch:focus { border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.3)); } .tm_drawerSearchGo { flex: none; font: inherit; font-size: calc(11.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 5px 10px; cursor: pointer; } .tm_drawerSearchGo:hover { color: var(--dsw-alias-label-primary); } .tm_drawerSearchState { font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); flex: none; } .tm_drawerSearchError { flex: none; max-width: 52%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(11px + var(--tm-font-step, 0px)); color: rgb(242, 78, 78); } .tm_drawerEmpty { grid-column: 1 / -1; padding: 10px 4px; font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); } .tm_drawerHits { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 6px; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l2); } .tm_drawerHitsHead { font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); letter-spacing: 0.04em; } .tm_drawerHit { display: flex; flex-direction: column; gap: 3px; text-align: left; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 9px; background: transparent; color: var(--dsw-alias-label-primary); font: inherit; cursor: pointer; } .tm_drawerHit:hover { border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.3)); } .tm_drawerRoleChip { flex: none; margin-right: 6px; padding: 0 5px; border-radius: 4px; font-size: calc(9.5px + var(--tm-font-step, 0px)); line-height: 1.6; color: var(--dsw-alias-label-secondary); background: rgba(255, 255, 255, 0.07); } .tm_drawerRoleChip[data-talkmap-role="user"] { color: rgba(160, 210, 255, 0.95); background: rgba(90, 160, 255, 0.14); } .tm_hitMark { color: #0b0b0c; background: rgb(255, 214, 106); border-radius: 3px; padding: 0 2px; } .tm_drawerHitHead { display: flex; align-items: center; gap: 6px; min-width: 0; } .tm_drawerAgentChip { flex: none; padding: 1px 6px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l2); font-size: calc(10px + var(--tm-font-step, 0px)); line-height: 1.5; color: var(--dsw-alias-label-secondary); letter-spacing: 0.02em; } .tm_drawerAgentChipSub { color: rgb(255, 214, 106); border-color: rgba(255, 214, 106, 0.5); background: rgba(255, 214, 106, 0.1); } .tm_drawerHitTitle { display: block; width: 100%; text-align: left; font: inherit; font-size: calc(12.5px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-primary); background: transparent; border: none; padding: 0 0 2px; cursor: pointer; } .tm_drawerHitTitle:hover { color: var(--dsw-alias-brand-primary); } .tm_peek { position: fixed; z-index: 80; width: min(500px, 88vw); max-height: 42vh; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-layer-1); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55); } .tm_peekTitle { font-size: calc(11.5px + var(--tm-font-step, 0px)); font-weight: 600; color: var(--dsw-alias-label-secondary); padding-bottom: 4px; margin-bottom: 2px; border-bottom: 1px solid var(--dsw-alias-border-l2); } .tm_peekLine { font-size: calc(12px + var(--tm-font-step, 0px)); line-height: 1.55; color: var(--dsw-alias-label-primary); white-space: pre-wrap; word-break: break-word; } .tm_peekHint { margin-top: 6px; font-size: calc(10.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); opacity: 0.7; } .tm_drawerHitMore { align-self: flex-start; margin-top: 2px; font: inherit; font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); background: transparent; border: none; padding: 2px 0 2px 10px; cursor: pointer; } .tm_drawerHitMore:hover { color: var(--dsw-alias-brand-primary); } .tm_drawerHitBlock { display: flex; flex-direction: column; gap: 1px; margin-top: 4px; padding-left: 2px; } .tm_drawerHitLine { display: block; width: 100%; text-align: left; font: inherit; font-size: calc(11.5px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); background: transparent; border: none; padding: 2px 0 2px 10px; border-left: 2px solid var(--dsw-alias-border-l2); cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .tm_drawerHitLine:hover { color: var(--dsw-alias-label-primary); border-left-color: var(--dsw-alias-brand-primary); } .tm_drawerScroll { overscroll-behavior: contain; scroll-behavior: auto; flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; display: grid; grid-template-columns: repeat(auto-fill, 224px); justify-content: center; align-content: start; gap: 12px; padding: 16px; } .tm_drawerCard[draggable="true"] { cursor: grab; } .tm_drawerCard[data-talkmap-drag="1"] { cursor: grabbing; opacity: 0.55; transform: scale(0.98); } .tm_cardLinks { display: flex; flex-wrap: wrap; gap: 4px; margin: 2px 0 4px; } .tm_cardLinkChip { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 6px; border-radius: 4px; font-size: calc(9.5px + var(--tm-font-step, 0px)); line-height: 1.7; color: var(--dsw-alias-label-secondary); background: rgba(255, 255, 255, 0.06); } .tm_cardLinkChip[data-talkmap-link="out"] { color: rgba(255, 214, 106, 0.9); background: rgba(255, 214, 106, 0.12); } .tm_drawerCard { width: 224px; box-sizing: border-box; text-align: left; font: inherit; cursor: pointer; background: var(--dsw-alias-bg-layer-1); } .tm_drawerCard:hover { border-color: var(--dsw-alias-brand-primary); } .tm_wsFrameResize { position: absolute; z-index: 2; pointer-events: auto; opacity: 0.5; } .tm_wsFrameResize:hover { opacity: 1; border-color: var(--dsw-alias-brand-primary); } .tm_wsFrameResizeN { cursor: ns-resize; border-top: 3px solid var(--dsw-alias-border-l3); border-radius: 14px 14px 0 0; } .tm_wsFrameResizeS { cursor: ns-resize; border-bottom: 3px solid var(--dsw-alias-border-l3); border-radius: 0 0 14px 14px; } .tm_wsFrameResizeW { cursor: ew-resize; border-left: 3px solid var(--dsw-alias-border-l3); border-radius: 14px 0 0 14px; } .tm_wsFrameResizeE { cursor: ew-resize; border-right: 3px solid var(--dsw-alias-border-l3); border-radius: 0 14px 14px 0; } .tm_wsFrameResizeNw, .tm_wsFrameResizeNe, .tm_wsFrameResizeSw, .tm_wsFrameResizeSe { width: 26px; height: 26px; z-index: 3; } .tm_wsFrameResizeNw { cursor: nwse-resize; border-left: 3px solid var(--dsw-alias-border-l3); border-top: 3px solid var(--dsw-alias-border-l3); border-top-left-radius: 14px; } .tm_wsFrameResizeNe { cursor: nesw-resize; border-right: 3px solid var(--dsw-alias-border-l3); border-top: 3px solid var(--dsw-alias-border-l3); border-top-right-radius: 14px; } .tm_wsFrameResizeSw { cursor: nesw-resize; border-left: 3px solid var(--dsw-alias-border-l3); border-bottom: 3px solid var(--dsw-alias-border-l3); border-bottom-left-radius: 14px; } .tm_wsFrameResizeSe { cursor: nwse-resize; border-right: 3px solid var(--dsw-alias-border-l3); border-bottom: 3px solid var(--dsw-alias-border-l3); border-bottom-right-radius: 14px; } .tm_batchBar { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 20; display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 8px 24px var(--dsw-alias-bg-mask-2); } .tm_batchCount { font-size: calc(12px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-secondary); white-space: nowrap; } .tm_batchSpace { width: 6px; } .tm_batchAction { padding: 5px 14px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; background: transparent; color: var(--dsw-alias-label-primary); font-size: calc(12px + var(--tm-font-step, 0px)); cursor: pointer; white-space: nowrap; } .tm_batchAction:hover:not(:disabled) { background: var(--dsw-alias-interactive-bg-hover); } .tm_batchAction:disabled { opacity: 0.5; cursor: default; } .tm_batchDanger { color: var(--dsw-alias-state-error-primary); } .tm_pickBox { position: absolute; top: 6px; right: 6px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--dsw-alias-border-l3); border-radius: 4px; background: var(--dsw-alias-bg-base); color: transparent; font-size: calc(11px + var(--tm-font-step, 0px)); line-height: 1; pointer-events: none; } .tm_pickBoxChecked { border-color: var(--dsw-alias-brand-primary); background: var(--dsw-alias-brand-primary); color: #fff; } .tm_colorToolbar { position: absolute; top: 12px; left: 12px; z-index: 20; display: flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; background: var(--dsw-alias-bg-layer-1); box-shadow: 0 6px 20px var(--dsw-alias-bg-mask-2); } .tm_colorToolbarLabel { font-size: calc(11px + var(--tm-font-step, 0px)); color: var(--dsw-alias-label-tertiary); margin-right: 2px; white-space: nowrap; } .tm_colorSwatch { width: 16px; height: 16px; padding: 0; border: 1px solid var(--dsw-alias-border-l2); border-radius: 50%; cursor: pointer; } .tm_colorSwatch:hover { transform: scale(1.15); } .tm_colorSwatchClear { display: flex; align-items: center; justify-content: center; background: transparent; color: var(--dsw-alias-label-secondary); font-size: calc(12px + var(--tm-font-step, 0px)); line-height: 1; } .tm_colorSwatchClear:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-hover); } .tm_drawerWires { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: visible; } .tm_drawerScroll { position: relative; } .tm_drawerScroll > .tm_card, .tm_drawerScroll > [data-stack-card] { position: relative; z-index: 1; } .tm_canvas .react-flow__edges { z-index: 0 !important; } .tm_canvas .react-flow__nodes { z-index: 1 !important; } .tm_statusRail { position: absolute; left: 0; top: 0; bottom: 0; z-index: 6; pointer-events: none; --rail-card-w: 224px; --rail-pad: 10px; --rail-card-outer: calc(var(--rail-card-w) + 26px); --rail-w: calc(var(--rail-card-outer) + var(--rail-pad) * 2 + 2px); } .tm_statusRailPanel { position: absolute; left: 0; top: 0; bottom: 0; width: var(--rail-w); box-sizing: border-box; padding: var(--rail-pad); display: flex; flex-direction: column; gap: 8px; background: var(--dsw-alias-bg-elevated, rgba(18, 20, 26, 0.94)); border-right: 1px solid var(--dsw-alias-border-secondary); box-shadow: 6px 0 26px rgba(0, 0, 0, 0.32); backdrop-filter: blur(10px); transform: translateX(-101%); transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 320ms ease; pointer-events: none; } .tm_statusRail[data-open="1"] .tm_statusRailPanel { transform: translateX(0); pointer-events: auto; } .tm_statusRailHead { display: flex; align-items: baseline; gap: 8px; padding: 2px 4px 0; } .tm_statusRailTitle { flex: 1; font-size: 12px; letter-spacing: 0.02em; color: var(--dsw-alias-label-secondary); } .tm_statusRailCount { font-size: 11px; color: var(--dsw-alias-label-tertiary, #6b7280); font-variant-numeric: tabular-nums; } .tm_statusRailList { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 2px 0 14px; } .tm_statusRailEmpty { padding: 8px 4px; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); } .tm_statusRailSlot { position: relative; } .tm_statusRailSlot[draggable="true"] { cursor: grab; } .tm_statusRailSlot[draggable="true"]:active { cursor: grabbing; } .tm_statusRailCard { width: var(--rail-card-w); min-height: 84px; cursor: grab; transition: transform 120ms ease, box-shadow 120ms ease; } .tm_statusRailCard:active { cursor: grabbing; } .tm_statusRailSlotFloating { pointer-events: none; } .tm_statusRailCardDragging { cursor: grabbing; transform: scale(1.02) rotate(-0.3deg); box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55); opacity: 0.97; } .tm_statusRailCard:hover { transform: translateY(-1px); } .tm_statusRailTab { position: absolute; top: 50%; left: 0; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 30px; padding: 13px 7px; border: 1px solid rgba(255, 255, 255, 0.16); border-left: none; border-radius: 0 11px 11px 0; background: rgba(38, 42, 52, 0.42); backdrop-filter: blur(16px) saturate(1.5); -webkit-backdrop-filter: blur(16px) saturate(1.5); box-shadow: 3px 0 14px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08); color: var(--dsw-alias-label-primary); cursor: pointer; font: inherit; pointer-events: auto; transition: left 320ms cubic-bezier(0.22, 0.61, 0.36, 1), color 140ms ease, background 140ms ease; } .tm_statusRail[data-open="1"] .tm_statusRailTab { left: calc(var(--rail-w) - 1px); } .tm_statusRailTab:hover { color: #ffffff; background: rgba(58, 64, 78, 0.55); } .tm_statusRailTabCount { font-size: 10px; line-height: 1; padding: 2px 4px; border-radius: 999px; background: var(--dsw-alias-brand-primary); color: #0b0d12; font-variant-numeric: tabular-nums; } .tm_dangerBackdrop { position: absolute; inset: 0; z-index: 40; display: flex; align-items: center; justify-content: center; background: rgba(8, 10, 14, 0.55); backdrop-filter: blur(2px); } .tm_dangerDialog { width: min(420px, calc(100% - 48px)); padding: 18px 18px 14px; border: 1px solid var(--dsw-alias-border-secondary); border-radius: 14px; background: var(--dsw-alias-bg-elevated, #16181f); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55); } .tm_dangerTitle { font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary); } .tm_dangerBody { margin-top: 8px; font-size: 12.5px; line-height: 1.6; color: var(--dsw-alias-label-secondary); } .tm_dangerActions { margin-top: 16px; display: flex; justify-content: flex-end; gap: 8px; } .tm_dangerCancel, .tm_dangerOk { padding: 6px 14px; border-radius: 8px; font: inherit; font-size: 12.5px; cursor: pointer; } .tm_dangerCancel { border: 1px solid var(--dsw-alias-border-secondary); background: transparent; color: var(--dsw-alias-label-secondary); } .tm_dangerCancel:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-interactive-bg-hover); } .tm_dangerOk { border: 1px solid rgba(242, 78, 78, 0.55); background: rgba(242, 78, 78, 0.16); color: #ff6b6b; } .tm_dangerOk:hover { background: rgba(242, 78, 78, 0.28); color: #ff8a8a; } .tm_statusRailGhost { visibility: hidden; } .tm_statusRailFloating { position: fixed; z-index: 20; pointer-events: none; } .tm_priorityHigh { --tm-priority: #f24e4e; } .tm_priorityMid { --tm-priority: #f5b22e; } .tm_priorityLow { --tm-priority: #4e9bf2; } .tm_priorityHigh, .tm_priorityMid, .tm_priorityLow { box-shadow: inset 4px 0 0 var(--tm-priority); } .tm_priorityChip { margin-left: auto; color: var(--tm-priority); background: color-mix(in srgb, var(--tm-priority) 16%, transparent); border: 1px solid color-mix(in srgb, var(--tm-priority) 46%, transparent); } .tm_pickerMask { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.45); } .tm_picker { width: min(680px, calc(100vw - 48px)); max-height: min(720px, calc(100vh - 64px)); display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary); box-shadow: 0 18px 60px rgba(0, 0, 0, 0.5); font-size: calc(13px + var(--tm-font-step, 0px)); } .tm_pickerHead, .tm_pickerFoot { display: flex; align-items: center; gap: 10px; padding: 12px 16px; flex: none; } .tm_pickerHead { border-bottom: 1px solid var(--dsw-alias-border-l1); } .tm_pickerFoot { border-top: 1px solid var(--dsw-alias-border-l1); } .tm_pickerTitle { font-weight: 600; flex: 1; } .tm_pickerClose { border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 15px; } .tm_pickerTools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px 16px; flex: none; } .tm_pickerSearch { flex: 1; min-width: 160px; font: inherit; color: inherit; background: var(--dsw-alias-bg-layer-2, rgba(255, 255, 255, 0.06)); border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 6px 10px; outline: none; } .tm_pickerFilters { display: flex; gap: 4px; } .tm_pickerFilter, .tm_pickerCancel, .tm_pickerApply { font: inherit; color: var(--dsw-alias-label-secondary); background: transparent; border: 1px solid var(--dsw-alias-border-l2); border-radius: 999px; padding: 4px 12px; cursor: pointer; } .tm_pickerFilterOn { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.4)); background: var(--dsw-alias-interactive-bg-hover); } .tm_pickerApply { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l3, rgba(255, 255, 255, 0.4)); font-weight: 600; } .tm_pickerBulk { display: flex; gap: 10px; } .tm_pickerLink { border: 0; background: transparent; color: var(--dsw-alias-label-secondary); cursor: pointer; font: inherit; text-decoration: underline; padding: 0; } .tm_pickerList { overflow-y: auto; padding: 0 16px 8px; flex: 1; min-height: 120px; } .tm_pickerEmpty { padding: 28px 0; text-align: center; color: var(--dsw-alias-label-secondary); } .tm_pickerGroupTitle { position: sticky; top: 0; padding: 8px 0 4px; font-weight: 600; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-1); } .tm_pickerRow { display: flex; align-items: center; gap: 10px; padding: 5px 4px; border-radius: 6px; cursor: pointer; } .tm_pickerRow:hover { background: var(--dsw-alias-interactive-bg-hover); } .tm_pickerRowTitle { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .tm_pickerTag { font-size: 0.85em; padding: 1px 7px; border-radius: 999px; border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-secondary); } .tm_pickerTime { color: var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary)); min-width: 40px; text-align: right; } .tm_pickerAuto { display: flex; align-items: center; gap: 6px; flex: 1; color: var(--dsw-alias-label-secondary); } .tm_pickerCount { color: var(--dsw-alias-label-secondary); }`;
if (typeof document !== "undefined") {
  const __selector = "style[data-plugin-css=" + JSON.stringify(__tagId) + "]";
  if (document.querySelector(__selector) === null) {
    const __tag = document.createElement("style");
    __tag.dataset.plugin = "dsh-talk-pages";
    __tag.dataset.pluginCss = __tagId;
    __tag.textContent = __css;
    document.head.appendChild(__tag);
  }
}
var talk_pages_default = { "backButton": "tm_backButton", "batchAction": "tm_batchAction", "batchBar": "tm_batchBar", "batchCount": "tm_batchCount", "batchDanger": "tm_batchDanger", "batchSpace": "tm_batchSpace", "canvas": "tm_canvas", "canvasConnecting": "tm_canvasConnecting", "card": "tm_card", "cardBadgeDone": "tm_cardBadgeDone", "cardBadgeWaiting": "tm_cardBadgeWaiting", "cardChip": "tm_cardChip", "cardChipDone": "tm_cardChipDone", "cardChipDraft": "tm_cardChipDraft", "cardChipError": "tm_cardChipError", "cardChipInterrupted": "tm_cardChipInterrupted", "cardChipRunning": "tm_cardChipRunning", "cardChipWaiting": "tm_cardChipWaiting", "cardFooter": "tm_cardFooter", "cardGhost": "tm_cardGhost", "cardHandle": "tm_cardHandle", "cardLampDone": "tm_cardLampDone", "cardLampError": "tm_cardLampError", "cardLampRunning": "tm_cardLampRunning", "cardLampWaiting": "tm_cardLampWaiting", "cardLinkChip": "tm_cardLinkChip", "cardLinks": "tm_cardLinks", "cardNext": "tm_cardNext", "cardNextLabel": "tm_cardNextLabel", "cardNextText": "tm_cardNextText", "cardPin": "tm_cardPin", "cardQuiet": "tm_cardQuiet", "cardRefresh": "tm_cardRefresh", "cardRefreshBusy": "tm_cardRefreshBusy", "cardRemove": "tm_cardRemove", "cardReticle": "tm_cardReticle", "cardSelected": "tm_cardSelected", "cardStale": "tm_cardStale", "cardSummary": "tm_cardSummary", "cardTime": "tm_cardTime", "cardTitle": "tm_cardTitle", "cardTop": "tm_cardTop", "closeButton": "tm_closeButton", "colorSwatch": "tm_colorSwatch", "colorSwatchClear": "tm_colorSwatchClear", "colorToolbar": "tm_colorToolbar", "colorToolbarLabel": "tm_colorToolbarLabel", "dangerActions": "tm_dangerActions", "dangerBackdrop": "tm_dangerBackdrop", "dangerBody": "tm_dangerBody", "dangerCancel": "tm_dangerCancel", "dangerDialog": "tm_dangerDialog", "dangerOk": "tm_dangerOk", "dangerTitle": "tm_dangerTitle", "dialogBackdrop": "tm_dialogBackdrop", "digestActions": "tm_digestActions", "digestDialog": "tm_digestDialog", "digestDialogFrom": "tm_digestDialogFrom", "digestDialogHead": "tm_digestDialogHead", "digestDialogTitle": "tm_digestDialogTitle", "digestEmpty": "tm_digestEmpty", "digestLabel": "tm_digestLabel", "digestText": "tm_digestText", "drawer": "tm_drawer", "drawerAgentChip": "tm_drawerAgentChip", "drawerAgentChipSub": "tm_drawerAgentChipSub", "drawerBackdrop": "tm_drawerBackdrop", "drawerBackdropOut": "tm_drawerBackdropOut", "drawerCard": "tm_drawerCard", "drawerClose": "tm_drawerClose", "drawerCount": "tm_drawerCount", "drawerEmpty": "tm_drawerEmpty", "drawerHead": "tm_drawerHead", "drawerHint": "tm_drawerHint", "drawerHit": "tm_drawerHit", "drawerHitBlock": "tm_drawerHitBlock", "drawerHitHead": "tm_drawerHitHead", "drawerHitLine": "tm_drawerHitLine", "drawerHitMore": "tm_drawerHitMore", "drawerHitTitle": "tm_drawerHitTitle", "drawerHits": "tm_drawerHits", "drawerHitsHead": "tm_drawerHitsHead", "drawerOut": "tm_drawerOut", "drawerRoleChip": "tm_drawerRoleChip", "drawerScroll": "tm_drawerScroll", "drawerScrollSensor": "tm_drawerScrollSensor", "drawerSearch": "tm_drawerSearch", "drawerSearchError": "tm_drawerSearchError", "drawerSearchGo": "tm_drawerSearchGo", "drawerSearchRow": "tm_drawerSearchRow", "drawerSearchState": "tm_drawerSearchState", "drawerSpace": "tm_drawerSpace", "drawerTitle": "tm_drawerTitle", "drawerWires": "tm_drawerWires", "emptyHint": "tm_emptyHint", "fontButton": "tm_fontButton", "fontGlyphLarge": "tm_fontGlyphLarge", "fontGlyphSmall": "tm_fontGlyphSmall", "fontGroup": "tm_fontGroup", "fontReset": "tm_fontReset", "fontSign": "tm_fontSign", "globalSearch": "tm_globalSearch", "globalSearchBackdrop": "tm_globalSearchBackdrop", "globalSearchBody": "tm_globalSearchBody", "globalSearchButton": "tm_globalSearchButton", "globalSearchHead": "tm_globalSearchHead", "globalSearchInput": "tm_globalSearchInput", "globalSearchPanel": "tm_globalSearchPanel", "globalSearchTitle": "tm_globalSearchTitle", "header": "tm_header", "headerSpace": "tm_headerSpace", "hitMark": "tm_hitMark", "langButton": "tm_langButton", "menu": "tm_menu", "menuEmpty": "tm_menuEmpty", "menuError": "tm_menuError", "menuHint": "tm_menuHint", "menuIcon": "tm_menuIcon", "menuItem": "tm_menuItem", "menuItemDanger": "tm_menuItemDanger", "menuPreview": "tm_menuPreview", "menuSearch": "tm_menuSearch", "menuTitle": "tm_menuTitle", "pageAction": "tm_pageAction", "pageActionOn": "tm_pageActionOn", "pageTab": "tm_pageTab", "pageTabActive": "tm_pageTabActive", "pageTabCount": "tm_pageTabCount", "pageTabScroll": "tm_pageTabScroll", "pageTabTitle": "tm_pageTabTitle", "pageTabs": "tm_pageTabs", "pageTabsSpace": "tm_pageTabsSpace", "panel": "tm_panel", "peek": "tm_peek", "peekHint": "tm_peekHint", "peekLine": "tm_peekLine", "peekTitle": "tm_peekTitle", "pickBox": "tm_pickBox", "pickBoxChecked": "tm_pickBoxChecked", "picker": "tm_picker", "pickerApply": "tm_pickerApply", "pickerAuto": "tm_pickerAuto", "pickerBulk": "tm_pickerBulk", "pickerCancel": "tm_pickerCancel", "pickerClose": "tm_pickerClose", "pickerCount": "tm_pickerCount", "pickerEmpty": "tm_pickerEmpty", "pickerFilter": "tm_pickerFilter", "pickerFilterOn": "tm_pickerFilterOn", "pickerFilters": "tm_pickerFilters", "pickerFoot": "tm_pickerFoot", "pickerGroupTitle": "tm_pickerGroupTitle", "pickerHead": "tm_pickerHead", "pickerLink": "tm_pickerLink", "pickerList": "tm_pickerList", "pickerMask": "tm_pickerMask", "pickerRow": "tm_pickerRow", "pickerRowTitle": "tm_pickerRowTitle", "pickerSearch": "tm_pickerSearch", "pickerTag": "tm_pickerTag", "pickerTime": "tm_pickerTime", "pickerTitle": "tm_pickerTitle", "pickerTools": "tm_pickerTools", "priorityChip": "tm_priorityChip", "priorityHigh": "tm_priorityHigh", "priorityLow": "tm_priorityLow", "priorityMid": "tm_priorityMid", "reactFlowNodeEnter": "tm_reactFlowNodeEnter", "renameActions": "tm_renameActions", "renameBackdrop": "tm_renameBackdrop", "renameButton": "tm_renameButton", "renameDialog": "tm_renameDialog", "renameError": "tm_renameError", "renameHeading": "tm_renameHeading", "renameInput": "tm_renameInput", "renamePrimary": "tm_renamePrimary", "runningDot": "tm_runningDot", "searchInlineLoading": "tm_searchInlineLoading", "searchLoading": "tm_searchLoading", "searchLoadingBar": "tm_searchLoadingBar", "searchSkeletonLine": "tm_searchSkeletonLine", "searchSkeletonRow": "tm_searchSkeletonRow", "searchSkeletonTitle": "tm_searchSkeletonTitle", "snippetCode": "tm_snippetCode", "snippetLink": "tm_snippetLink", "spawnActions": "tm_spawnActions", "spawnBtnGhost": "tm_spawnBtnGhost", "spawnBtnPrimary": "tm_spawnBtnPrimary", "spawnError": "tm_spawnError", "spawnFrom": "tm_spawnFrom", "spawnHeading": "tm_spawnHeading", "spawnHint": "tm_spawnHint", "spawnModeActive": "tm_spawnModeActive", "spawnModeBtn": "tm_spawnModeBtn", "spawnModes": "tm_spawnModes", "spawnPanel": "tm_spawnPanel", "spawnTextarea": "tm_spawnTextarea", "stackBadge": "tm_stackBadge", "stackBadgeBusy": "tm_stackBadgeBusy", "stackCell": "tm_stackCell", "stackFace": "tm_stackFace", "stackFaceTitle": "tm_stackFaceTitle", "stackSheetBack": "tm_stackSheetBack", "stackSheetMid": "tm_stackSheetMid", "statusRail": "tm_statusRail", "statusRailCard": "tm_statusRailCard", "statusRailCardDragging": "tm_statusRailCardDragging", "statusRailCount": "tm_statusRailCount", "statusRailEmpty": "tm_statusRailEmpty", "statusRailFloating": "tm_statusRailFloating", "statusRailGhost": "tm_statusRailGhost", "statusRailHead": "tm_statusRailHead", "statusRailList": "tm_statusRailList", "statusRailPanel": "tm_statusRailPanel", "statusRailSlot": "tm_statusRailSlot", "statusRailSlotFloating": "tm_statusRailSlotFloating", "statusRailTab": "tm_statusRailTab", "statusRailTabCount": "tm_statusRailTabCount", "statusRailTitle": "tm_statusRailTitle", "toast": "tm_toast", "toggleButton": "tm_toggleButton", "toggleButtonActive": "tm_toggleButtonActive", "toggleIcon": "tm_toggleIcon", "toggleLabel": "tm_toggleLabel", "toggleRow": "tm_toggleRow", "wsFrame": "tm_wsFrame", "wsFrameBlocked": "tm_wsFrameBlocked", "wsFrameCount": "tm_wsFrameCount", "wsFrameEdge": "tm_wsFrameEdge", "wsFrameHidden": "tm_wsFrameHidden", "wsFrameLabel": "tm_wsFrameLabel", "wsFrameResize": "tm_wsFrameResize", "wsFrameResizeE": "tm_wsFrameResizeE", "wsFrameResizeN": "tm_wsFrameResizeN", "wsFrameResizeNe": "tm_wsFrameResizeNe", "wsFrameResizeNw": "tm_wsFrameResizeNw", "wsFrameResizeS": "tm_wsFrameResizeS", "wsFrameResizeSe": "tm_wsFrameResizeSe", "wsFrameResizeSw": "tm_wsFrameResizeSw", "wsFrameResizeW": "tm_wsFrameResizeW", "wsFrameSelected": "tm_wsFrameSelected", "zoomResetLabel": "tm_zoomResetLabel" };

// src/client/markdown-inline.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function stripBlockMarkers(text) {
  return text.replace(/^\s{0,3}#{1,6}\s+/, "").replace(/^\s{0,3}>\s?/, "").replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/, "").replace(/^\s{0,3}`{3,}.*$/, "").replace(/\s{2,}$/, "");
}
function highlight(text, query, keyPrefix) {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [text];
  const haystack = text.toLowerCase();
  const parts = [];
  let cursor = 0;
  let index2 = 0;
  while (cursor < text.length) {
    const at = haystack.indexOf(needle, cursor);
    if (at < 0) {
      parts.push(text.slice(cursor));
      break;
    }
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", { className: talk_pages_default["hitMark"], children: text.slice(at, at + needle.length) }, `${keyPrefix}-m${index2++}`)
    );
    cursor = at + needle.length;
  }
  return parts;
}
var INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)|(~~[^~]+~~)|(\[[^\]]+\]\([^)]+\))/g;
function renderMarkdownInline(raw, query) {
  const text = stripBlockMarkers(cleanSnippet(raw, query));
  const nodes = [];
  let plain = "";
  let cursor = 0;
  let token = 0;
  const push = (content, plainText) => {
    nodes.push(content);
    plain += plainText;
  };
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > cursor) {
      const chunk = text.slice(cursor, at);
      push(highlight(chunk, query, `t${token++}`), chunk);
    }
    const [whole] = match;
    if (whole.startsWith("`")) {
      const body = whole.slice(1, -1);
      push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { className: talk_pages_default["snippetCode"], children: highlight(body, query, `c${token}`) }, `c${token++}`), body);
    } else if (whole.startsWith("**") || whole.startsWith("__")) {
      const body = whole.slice(2, -2);
      push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: highlight(body, query, `s${token}`) }, `s${token++}`), body);
    } else if (whole.startsWith("~~")) {
      const body = whole.slice(2, -2);
      push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("s", { children: highlight(body, query, `d${token}`) }, `d${token++}`), body);
    } else if (whole.startsWith("[")) {
      const label = whole.replace(/^\[([^\]]+)\].*$/, "$1");
      push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: talk_pages_default["snippetLink"], children: highlight(label, query, `l${token}`) }, `l${token++}`), label);
    } else {
      const body = whole.slice(1, -1);
      push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: highlight(body, query, `e${token}`) }, `e${token++}`), body);
    }
    cursor = at + whole.length;
  }
  if (cursor < text.length) {
    const tail = text.slice(cursor);
    push(highlight(tail, query, `t${token++}`), tail);
  }
  return { nodes, plain };
}

// src/client/SearchResults.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function SearchResults(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: talk_pages_default["drawerHits"], "data-talkmap-local-results": "", children: [
    props.hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: talk_pages_default["drawerEmpty"], children: props.empty }) : null,
    props.hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: talk_pages_default["drawerHit"], "data-talkmap-search-hit": hit.sessionId, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: talk_pages_default["drawerHitHead"], children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          className: talk_pages_default["drawerHitTitle"],
          onClick: () => {
            props.onOpenSession(hit.sessionId);
          },
          children: renderMarkdownInline(hit.title, props.query).nodes
        }
      ) }),
      hit.blocks.map((block, index2) => {
        const needle = props.query.trim().toLowerCase();
        const line = block.find((entry) => entry.toLowerCase().includes(needle)) ?? block[0] ?? "";
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            className: talk_pages_default["drawerHitLine"],
            "data-talkmap-search-line": hit.sessionId,
            onClick: () => {
              props.onOpenSession(hit.sessionId);
            },
            children: renderMarkdownInline(line, props.query).nodes
          },
          index2
        );
      })
    ] }, hit.sessionId))
  ] });
}

// src/client/search-store.ts
var TTL_MS = 12 * 60 * 60 * 1e3;
function keyFor(scope) {
  return `dsh.talk-pages.search.${scope}.v1`;
}
function saveSearch(scope, value2) {
  try {
    if (typeof localStorage === "undefined") return;
    const payload = { ...value2, at: Date.now() };
    localStorage.setItem(keyFor(scope), JSON.stringify(payload));
  } catch {
  }
}
function loadSearch(scope) {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(keyFor(scope));
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.query !== "string" || !Array.isArray(parsed?.hits)) return null;
    if (Date.now() - Number(parsed.at ?? 0) > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
function clearSearch(scope) {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(keyFor(scope));
  } catch {
  }
}

// src/client/GlobalSearch.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var GLOBAL_SCOPE = "global";
function GlobalSearch(props) {
  const remembered = loadSearch(GLOBAL_SCOPE);
  const [query, setQuery] = (0, import_react.useState)(remembered?.query ?? "");
  const [submitted, setSubmitted] = (0, import_react.useState)("");
  const [hits, setHits] = (0, import_react.useState)(remembered?.hits ?? []);
  const [searching, setSearching] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (submitted === "") return;
    const release = mapUi.claimEscape("global-search");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      dismiss();
      release();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  }, [submitted]);
  const dismiss = () => {
    setSubmitted("");
    setHits([]);
    setQuery("");
    clearSearch(GLOBAL_SCOPE);
  };
  const run = (value2) => {
    const needle = value2.trim().toLowerCase();
    if (needle === "") {
      setSubmitted("");
      setHits([]);
      return;
    }
    setSubmitted(value2.trim());
    setSearching(false);
    setError(null);
    const views = allCards().filter((card) => card.title.toLowerCase().includes(needle) || card.preview.toLowerCase().includes(needle)).map((card) => {
      const titleHit = card.title.toLowerCase().includes(needle);
      return {
        sessionId: card.sessionId,
        title: card.workspaceTitle === "" ? card.title : card.title + " · " + card.workspaceTitle,
        // A title hit already shows its title: no second, identical line.
        blocks: titleHit || card.preview === "" ? [] : [[card.preview]],
        seqs: [null],
        roles: [null],
        byTitle: titleHit
      };
    });
    setHits(views);
    saveSearch(GLOBAL_SCOPE, { query: value2.trim(), hits: views });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: talk_pages_default["globalSearch"], children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "input",
      {
        className: talk_pages_default["globalSearchInput"],
        value: query,
        placeholder: t("global.searchPlaceholder"),
        "aria-label": t("global.searchPlaceholder"),
        "data-talkmap-global-search": "",
        onChange: (event) => {
          setQuery(event.target.value);
        },
        onKeyDown: (event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          run(query);
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "button",
      {
        type: "button",
        className: talk_pages_default["globalSearchButton"],
        title: t("global.searchRun"),
        "aria-label": t("global.searchRun"),
        "data-talkmap-global-search-run": "",
        onClick: () => {
          run(query);
        },
        children: t("global.searchRun")
      }
    ),
    submitted !== "" || hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: talk_pages_default["globalSearchBackdrop"],
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) dismiss();
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: talk_pages_default["globalSearchPanel"], role: "dialog", "aria-label": t("global.searchTitle"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: talk_pages_default["globalSearchHead"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: talk_pages_default["globalSearchTitle"], children: [
              t("global.searchTitle"),
              "「",
              submitted,
              "」"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: talk_pages_default["drawerSpace"] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                type: "button",
                className: talk_pages_default["drawerClose"],
                title: t("stack.close"),
                "aria-label": t("stack.close"),
                onClick: dismiss,
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: talk_pages_default["globalSearchBody"], children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            SearchResults,
            {
              query: submitted === "" ? query : submitted,
              hits,
              empty: t("map.noHit"),
              onOpenSession: (sessionId) => {
                props.onOpenSession(sessionId);
              }
            }
          ) })
        ] })
      }
    ) : null
  ] });
}

// src/client/MapCanvas.tsx
var import_react13 = require("react");

// node_modules/@xyflow/react/dist/esm/index.js
var import_jsx_runtime4 = require("react/jsx-runtime");
var import_react3 = require("react");

// node_modules/classcat/index.js
function cc(names) {
  if (typeof names === "string" || typeof names === "number") return "" + names;
  let out = "";
  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (let k in names) {
      if (names[k]) out += (out && " ") + k;
    }
  }
  return out;
}

// node_modules/d3-dispatch/dist/d3-dispatch.mjs
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t4; i < n; ++i) {
    if (!(t4 = arguments[i] + "") || t4 in _ || /[\s.]/.test(t4)) throw new Error("illegal type: " + t4);
    _[t4] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t4) {
    var name2 = "", i = t4.indexOf(".");
    if (i >= 0) name2 = t4.slice(i + 1), t4 = t4.slice(0, i);
    if (t4 && !types.hasOwnProperty(t4)) throw new Error("unknown type: " + t4);
    return { type: t4, name: name2 };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t4, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n) if ((t4 = (typename = T[i]).type) && (t4 = get(_[t4], typename.name))) return t4;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t4 = (typename = T[i]).type) _[t4] = set(_[t4], typename.name, callback);
      else if (callback == null) for (t4 in _) _[t4] = set(_[t4], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t4 in _) copy[t4] = _[t4].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t4; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t4 = this._[type], i = 0, n = t4.length; i < n; ++i) t4[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t4 = this._[type], i = 0, n = t4.length; i < n; ++i) t4[i].value.apply(that, args);
  }
};
function get(type, name2) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name2) {
      return c.value;
    }
  }
}
function set(type, name2, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name2) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name2, value: callback });
  return type;
}

// node_modules/d3-selection/dist/d3-selection.mjs
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name2) {
  var prefix = name2 += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name2.slice(0, i)) !== "xmlns") name2 = name2.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name2 } : name2;
}
function creatorInherit(name2) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name2) : document2.createElementNS(uri, name2);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator(name2) {
  var fullname = namespace(name2);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {
}
function selector(selector2) {
  return selector2 == null ? none : function() {
    return this.querySelector(selector2);
  };
}
function selection_select(select2) {
  if (typeof select2 !== "function") select2 = selector(select2);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}
function empty() {
  return [];
}
function selectorAll(selector2) {
  return selector2 == null ? empty : function() {
    return this.querySelectorAll(selector2);
  };
}
function arrayAll(select2) {
  return function() {
    return array(select2.apply(this, arguments));
  };
}
function selection_selectAll(select2) {
  if (typeof select2 === "function") select2 = arrayAll(select2);
  else select2 = selectorAll(select2);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select2.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}
function matcher(selector2) {
  return function() {
    return this.matches(selector2);
  };
}
function childMatcher(selector2) {
  return function(node) {
    return node.matches(selector2);
  };
}
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selection_selectChild(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selection_selectChildren(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}
function sparse(update) {
  return new Array(update.length);
}
function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector2) {
    return this._parent.querySelector(selector2);
  },
  querySelectorAll: function(selector2) {
    return this._parent.querySelectorAll(selector2);
  }
};
function constant(x) {
  return function() {
    return x;
  };
}
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function selection_data(value2, key) {
  if (!arguments.length) return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value2 !== "function") value2 = constant(value2);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value2.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}
function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove();
  else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}
function selection_order() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}
function selection_sort(compare) {
  if (!compare) compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
function selection_nodes() {
  return Array.from(this);
}
function selection_node() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
}
function selection_size() {
  let size = 0;
  for (const node of this) ++size;
  return size;
}
function selection_empty() {
  return !this.node();
}
function selection_each(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}
function attrRemove(name2) {
  return function() {
    this.removeAttribute(name2);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name2, value2) {
  return function() {
    this.setAttribute(name2, value2);
  };
}
function attrConstantNS(fullname, value2) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value2);
  };
}
function attrFunction(name2, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null) this.removeAttribute(name2);
    else this.setAttribute(name2, v);
  };
}
function attrFunctionNS(fullname, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function selection_attr(name2, value2) {
  var fullname = namespace(name2);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value2 == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value2 === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value2));
}
function defaultView(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove(name2) {
  return function() {
    this.style.removeProperty(name2);
  };
}
function styleConstant(name2, value2, priority) {
  return function() {
    this.style.setProperty(name2, value2, priority);
  };
}
function styleFunction(name2, value2, priority) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null) this.style.removeProperty(name2);
    else this.style.setProperty(name2, v, priority);
  };
}
function selection_style(name2, value2, priority) {
  return arguments.length > 1 ? this.each((value2 == null ? styleRemove : typeof value2 === "function" ? styleFunction : styleConstant)(name2, value2, priority == null ? "" : priority)) : styleValue(this.node(), name2);
}
function styleValue(node, name2) {
  return node.style.getPropertyValue(name2) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name2);
}
function propertyRemove(name2) {
  return function() {
    delete this[name2];
  };
}
function propertyConstant(name2, value2) {
  return function() {
    this[name2] = value2;
  };
}
function propertyFunction(name2, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (v == null) delete this[name2];
    else this[name2] = v;
  };
}
function selection_property(name2, value2) {
  return arguments.length > 1 ? this.each((value2 == null ? propertyRemove : typeof value2 === "function" ? propertyFunction : propertyConstant)(name2, value2)) : this.node()[name2];
}
function classArray(string2) {
  return string2.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name2) {
    var i = this._names.indexOf(name2);
    if (i < 0) {
      this._names.push(name2);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name2) {
    var i = this._names.indexOf(name2);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name2) {
    return this._names.indexOf(name2) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value2) {
  return function() {
    (value2.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function selection_classed(name2, value2) {
  var names = classArray(name2 + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }
  return this.each((typeof value2 === "function" ? classedFunction : value2 ? classedTrue : classedFalse)(names, value2));
}
function textRemove() {
  this.textContent = "";
}
function textConstant(value2) {
  return function() {
    this.textContent = value2;
  };
}
function textFunction(value2) {
  return function() {
    var v = value2.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function selection_text(value2) {
  return arguments.length ? this.each(value2 == null ? textRemove : (typeof value2 === "function" ? textFunction : textConstant)(value2)) : this.node().textContent;
}
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value2) {
  return function() {
    this.innerHTML = value2;
  };
}
function htmlFunction(value2) {
  return function() {
    var v = value2.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function selection_html(value2) {
  return arguments.length ? this.each(value2 == null ? htmlRemove : (typeof value2 === "function" ? htmlFunction : htmlConstant)(value2)) : this.node().innerHTML;
}
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}
function selection_raise() {
  return this.each(raise);
}
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
  return this.each(lower);
}
function selection_append(name2) {
  var create2 = typeof name2 === "function" ? name2 : creator(name2);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}
function constantNull() {
  return null;
}
function selection_insert(name2, before) {
  var create2 = typeof name2 === "function" ? name2 : creator(name2), select2 = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
  });
}
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
function selection_remove() {
  return this.each(remove);
}
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value2) {
  return arguments.length ? this.property("__data__", value2) : this.node().__data__;
}
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t4) {
    var name2 = "", i = t4.indexOf(".");
    if (i >= 0) name2 = t4.slice(i + 1), t4 = t4.slice(0, i);
    return { type: t4, name: name2 };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}
function onAdd(typename, value2, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value2);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value2;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value: value2, listener, options };
    if (!on) this.__on = [o];
    else on.push(o);
  };
}
function selection_on(typename, value2, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t4;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t4 = typenames[i]).type === o.type && t4.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }
  on = value2 ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value2, options));
  return this;
}
function dispatchEvent(node, type, params) {
  var window2 = defaultView(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function selection_dispatch(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};
function select(selector2) {
  return typeof selector2 === "string" ? new Selection([[document.querySelector(selector2)]], [document.documentElement]) : new Selection([[selector2]], root);
}
var nextId = 0;
function local() {
  return new Local();
}
function Local() {
  this._ = "@" + (++nextId).toString(36);
}
Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id2 = this._;
    while (!(id2 in node)) if (!(node = node.parentNode)) return;
    return node[id2];
  },
  set: function(node, value2) {
    return node[this._] = value2;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};
function sourceEvent(event) {
  let sourceEvent2;
  while (sourceEvent2 = event.sourceEvent) event = sourceEvent2;
  return event;
}
function pointer(event, node) {
  event = sourceEvent(event);
  if (node === void 0) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// node_modules/d3-drag/dist/d3-drag.mjs
var nonpassive = { passive: false };
var nonpassivecapture = { capture: true, passive: false };
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function nodrag(view) {
  var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", noevent, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}
var constant2 = (x) => () => x;
function DragEvent(type, {
  sourceEvent: sourceEvent2,
  subject,
  target,
  identifier,
  active,
  x,
  y,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x, enumerable: true, configurable: true },
    y: { value: y, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value2 = this._.on.apply(this._, arguments);
  return value2 === this._ ? this : value2;
};
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag() {
  var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners7 = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag2(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter2.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    nodrag(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter2.call(this, event, d)) return;
    var touches = event.changedTouches, c = container.call(this, event, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners7.copy(), p = pointer(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag2,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null) return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type, event2, touch2) {
      var p0 = p, n;
      switch (type) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        // falls through
        case "drag":
          p = pointer(touch2 || event2, container2), n = active;
          break;
      }
      dispatch2.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event2,
          subject: s,
          target: drag2,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag2.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant2(!!_), drag2) : filter2;
  };
  drag2.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant2(_), drag2) : container;
  };
  drag2.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant2(_), drag2) : subject;
  };
  drag2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant2(!!_), drag2) : touchable;
  };
  drag2.on = function() {
    var value2 = listeners7.on.apply(listeners7, arguments);
    return value2 === listeners7 ? drag2 : value2;
  };
  drag2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag2) : Math.sqrt(clickDistance2);
  };
  return drag2;
}

// node_modules/d3-color/dist/d3-color.mjs
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value2) {
  return Math.max(0, Math.min(255, Math.round(value2) || 0));
}
function hex(value2) {
  value2 = clampi(value2);
  return (value2 < 16 ? "0" : "") + value2.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value2) {
  value2 = (value2 || 0) % 360;
  return value2 < 0 ? value2 + 360 : value2;
}
function clampt(value2) {
  return Math.max(0, Math.min(1, value2 || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
var radians = Math.PI / 180;
var degrees = 180 / Math.PI;
var K = 18;
var Xn = 0.96422;
var Yn = 1;
var Zn = 0.82521;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;
function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b) x = z = y;
  else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}
function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}
function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}
define(Lab, lab, extend(Color, {
  brighter(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb() {
    var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.033454 * z),
      lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));
function xyz2lab(t4) {
  return t4 > t3 ? Math.pow(t4, 1 / 3) : t4 / t2 + t0;
}
function lab2xyz(t4) {
  return t4 > t1 ? t4 * t4 * t4 : t2 * (t4 - t0);
}
function lrgb2rgb(x) {
  return 255 * (x <= 31308e-7 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * degrees;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}
function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}
function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}
function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * radians;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}
define(Hcl, hcl, extend(Color, {
  brighter(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));
var A = -0.14861;
var B = 1.78277;
var C = -0.29227;
var D = -0.90649;
var E = 1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;
function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb)) o = rgbConvert(o);
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB), bl = b - l, k = (E * (g - l) - C * bl) / D, s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}
function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}
function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define(Cubehelix, cubehelix, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh2 = Math.cos(h), sinh2 = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh2 + B * sinh2)),
      255 * (l + a * (C * cosh2 + D * sinh2)),
      255 * (l + a * (E * cosh2)),
      this.opacity
    );
  }
}));

// node_modules/d3-interpolate/dist/d3-interpolate.mjs
function basis(t12, v0, v1, v2, v3) {
  var t22 = t12 * t12, t32 = t22 * t12;
  return ((1 - 3 * t12 + 3 * t22 - t32) * v0 + (4 - 6 * t22 + 3 * t32) * v1 + (1 + 3 * t12 + 3 * t22 - 3 * t32) * v2 + t32 * v3) / 6;
}
function basis$1(values) {
  var n = values.length - 1;
  return function(t4) {
    var i = t4 <= 0 ? t4 = 0 : t4 >= 1 ? (t4 = 1, n - 1) : Math.floor(t4 * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t4 - i / n) * n, v0, v1, v2, v3);
  };
}
function basisClosed(values) {
  var n = values.length;
  return function(t4) {
    var i = Math.floor(((t4 %= 1) < 0 ? ++t4 : t4) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t4 - i / n) * n, v0, v1, v2, v3);
  };
}
var constant3 = (x) => () => x;
function linear(a, d) {
  return function(t4) {
    return a + t4 * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t4) {
    return Math.pow(a + t4 * b, y);
  };
}
function hue$1(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant3(isNaN(a) ? b : a);
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant3(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant3(isNaN(a) ? b : a);
}
var rgb2 = (function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb3(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t4) {
      start2.r = r(t4);
      start2.g = g(t4);
      start2.b = b(t4);
      start2.opacity = opacity(t4);
      return start2 + "";
    };
  }
  rgb3.gamma = rgbGamma;
  return rgb3;
})(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t4) {
      color2.r = r(t4);
      color2.g = g(t4);
      color2.b = b(t4);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis$1);
var rgbBasisClosed = rgbSpline(basisClosed);
function numberArray(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
  return function(t4) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t4) + b[i] * t4;
    return c;
  };
}
function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
function genericArray(a, b) {
  var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
  for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];
  return function(t4) {
    for (i = 0; i < na; ++i) c[i] = x[i](t4);
    return c;
  };
}
function date(a, b) {
  var d = /* @__PURE__ */ new Date();
  return a = +a, b = +b, function(t4) {
    return d.setTime(a * (1 - t4) + b * t4), d;
  };
}
function number(a, b) {
  return a = +a, b = +b, function(t4) {
    return a * (1 - t4) + b * t4;
  };
}
function object(a, b) {
  var i = {}, c = {}, k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};
  for (k in b) {
    if (k in a) {
      i[k] = value(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }
  return function(t4) {
    for (k in i) c[k] = i[k](t4);
    return c;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t4) {
    return b(t4) + "";
  };
}
function string(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm;
      else s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs;
    else s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t4) {
    for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t4);
    return s.join("");
  });
}
function value(a, b) {
  var t4 = typeof b, c;
  return b == null || t4 === "boolean" ? constant3(b) : (t4 === "number" ? number : t4 === "string" ? (c = color(b)) ? (b = c, rgb2) : string : b instanceof color ? rgb2 : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : number)(a, b);
}
var degrees2 = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees2,
    skewX: Math.atan(skewX) * degrees2,
    scaleX,
    scaleY
  };
}
var svgNode;
function parseCss(value2) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value2 + "");
  return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value2) {
  if (value2 == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value2);
  if (!(value2 = svgNode.transform.baseVal.consolidate())) return identity;
  value2 = value2.matrix;
  return decompose(value2.a, value2.b, value2.c, value2.d, value2.e, value2.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number(xa, xb) }, { i: i - 2, x: number(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;
      else if (b - a > 180) a += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number(xa, xb) }, { i: i - 2, x: number(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null;
    return function(t4) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t4);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
var epsilon2 = 1e-12;
function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var zoom = (function zoomRho(rho, rho2, rho4) {
  function zoom3(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t4) {
        return [
          ux0 + t4 * dx,
          uy0 + t4 * dy,
          w0 * Math.exp(rho * t4 * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b02 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b12 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b02 * b02 + 1) - b02), r1 = Math.log(Math.sqrt(b12 * b12 + 1) - b12);
      S = (r1 - r0) / rho;
      i = function(t4) {
        var s = t4 * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = Math.abs(S) * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom3.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom3;
})(Math.SQRT2, 2, 4);
function hsl2(hue) {
  return function(start2, end) {
    var h = hue((start2 = hsl(start2)).h, (end = hsl(end)).h), s = nogamma(start2.s, end.s), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
    return function(t4) {
      start2.h = h(t4);
      start2.s = s(t4);
      start2.l = l(t4);
      start2.opacity = opacity(t4);
      return start2 + "";
    };
  };
}
var hsl_default = hsl2(hue$1);
var hslLong = hsl2(nogamma);
function hcl2(hue) {
  return function(start2, end) {
    var h = hue((start2 = hcl(start2)).h, (end = hcl(end)).h), c = nogamma(start2.c, end.c), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
    return function(t4) {
      start2.h = h(t4);
      start2.c = c(t4);
      start2.l = l(t4);
      start2.opacity = opacity(t4);
      return start2 + "";
    };
  };
}
var hcl_default = hcl2(hue$1);
var hclLong = hcl2(nogamma);
function cubehelix2(hue) {
  return (function cubehelixGamma(y) {
    y = +y;
    function cubehelix3(start2, end) {
      var h = hue((start2 = cubehelix(start2)).h, (end = cubehelix(end)).h), s = nogamma(start2.s, end.s), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
      return function(t4) {
        start2.h = h(t4);
        start2.s = s(t4);
        start2.l = l(Math.pow(t4, y));
        start2.opacity = opacity(t4);
        return start2 + "";
      };
    }
    cubehelix3.gamma = cubehelixGamma;
    return cubehelix3;
  })(1);
}
var cubehelix_default = cubehelix2(hue$1);
var cubehelixLong = cubehelix2(nogamma);

// node_modules/d3-timer/dist/d3-timer.mjs
var frame = 0;
var timeout$1 = 0;
var interval$1 = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t4 = new Timer();
  t4.restart(callback, delay, time);
  return t4;
}
function timerFlush() {
  now();
  ++frame;
  var t4 = taskHead, e;
  while (t4) {
    if ((e = clockNow - t4._time) >= 0) t4._call.call(void 0, e);
    t4 = t4._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t02, t12 = taskHead, t22, time = Infinity;
  while (t12) {
    if (t12._call) {
      if (time > t12._time) time = t12._time;
      t02 = t12, t12 = t12._next;
    } else {
      t22 = t12._next, t12._next = null;
      t12 = t02 ? t02._next = t22 : taskHead = t22;
    }
  }
  taskTail = t02;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, Math.ceil(time - clock.now() - clockSkew) + 1);
    if (interval$1) interval$1 = clearInterval(interval$1);
  } else {
    if (!interval$1) clockLast = clock.now(), interval$1 = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
function timeout(callback, delay, time) {
  var t4 = new Timer();
  delay = delay == null ? 0 : +delay;
  t4.restart((elapsed) => {
    t4.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t4;
}

// node_modules/d3-ease/dist/d3-ease.mjs
function cubicInOut(t4) {
  return ((t4 *= 2) <= 1 ? t4 * t4 * t4 : (t4 -= 2) * t4 * t4 + 2) / 2;
}
var exponent = 3;
var polyIn = (function custom(e) {
  e = +e;
  function polyIn2(t4) {
    return Math.pow(t4, e);
  }
  polyIn2.exponent = custom;
  return polyIn2;
})(exponent);
var polyOut = (function custom2(e) {
  e = +e;
  function polyOut2(t4) {
    return 1 - Math.pow(1 - t4, e);
  }
  polyOut2.exponent = custom2;
  return polyOut2;
})(exponent);
var polyInOut = (function custom3(e) {
  e = +e;
  function polyInOut2(t4) {
    return ((t4 *= 2) <= 1 ? Math.pow(t4, e) : 2 - Math.pow(2 - t4, e)) / 2;
  }
  polyInOut2.exponent = custom3;
  return polyInOut2;
})(exponent);
var pi = Math.PI;
var halfPi = pi / 2;
function tpmt(x) {
  return (Math.pow(2, -10 * x) - 9765625e-10) * 1.0009775171065494;
}
var b1 = 4 / 11;
var b2 = 6 / 11;
var b3 = 8 / 11;
var b4 = 3 / 4;
var b5 = 9 / 11;
var b6 = 10 / 11;
var b7 = 15 / 16;
var b8 = 21 / 22;
var b9 = 63 / 64;
var b0 = 1 / b1 / b1;
var overshoot = 1.70158;
var backIn = (function custom4(s) {
  s = +s;
  function backIn2(t4) {
    return (t4 = +t4) * t4 * (s * (t4 - 1) + t4);
  }
  backIn2.overshoot = custom4;
  return backIn2;
})(overshoot);
var backOut = (function custom5(s) {
  s = +s;
  function backOut2(t4) {
    return --t4 * t4 * ((t4 + 1) * s + t4) + 1;
  }
  backOut2.overshoot = custom5;
  return backOut2;
})(overshoot);
var backInOut = (function custom6(s) {
  s = +s;
  function backInOut2(t4) {
    return ((t4 *= 2) < 1 ? t4 * t4 * ((s + 1) * t4 - s) : (t4 -= 2) * t4 * ((s + 1) * t4 + s) + 2) / 2;
  }
  backInOut2.overshoot = custom6;
  return backInOut2;
})(overshoot);
var tau = 2 * Math.PI;
var amplitude = 1;
var period = 0.3;
var elasticIn = (function custom7(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticIn2(t4) {
    return a * tpmt(- --t4) * Math.sin((s - t4) / p);
  }
  elasticIn2.amplitude = function(a2) {
    return custom7(a2, p * tau);
  };
  elasticIn2.period = function(p2) {
    return custom7(a, p2);
  };
  return elasticIn2;
})(amplitude, period);
var elasticOut = (function custom8(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticOut2(t4) {
    return 1 - a * tpmt(t4 = +t4) * Math.sin((t4 + s) / p);
  }
  elasticOut2.amplitude = function(a2) {
    return custom8(a2, p * tau);
  };
  elasticOut2.period = function(p2) {
    return custom8(a, p2);
  };
  return elasticOut2;
})(amplitude, period);
var elasticInOut = (function custom9(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticInOut2(t4) {
    return ((t4 = t4 * 2 - 1) < 0 ? a * tpmt(-t4) * Math.sin((s - t4) / p) : 2 - a * tpmt(t4) * Math.sin((s + t4) / p)) / 2;
  }
  elasticInOut2.amplitude = function(a2) {
    return custom9(a2, p * tau);
  };
  elasticInOut2.period = function(p2) {
    return custom9(a, p2);
  };
  return elasticInOut2;
})(amplitude, period);

// node_modules/d3-transition/dist/d3-transition.mjs
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name2, id2, index2, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id2 in schedules) return;
  create(node, id2, {
    name: name2,
    index: index2,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule2 = get2(node, id2);
  if (schedule2.state > CREATED) throw new Error("too late; already scheduled");
  return schedule2;
}
function set2(node, id2) {
  var schedule2 = get2(node, id2);
  if (schedule2.state > STARTED) throw new Error("too late; already running");
  return schedule2;
}
function get2(node, id2) {
  var schedule2 = node.__transition;
  if (!schedule2 || !(schedule2 = schedule2[id2])) throw new Error("transition not found");
  return schedule2;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule2, 0, self.time);
  function schedule2(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed) start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED) return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;
      if (o.state === STARTED) return timeout(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t4 = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t4);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules) return;
    delete node.__transition;
  }
}
function interrupt(node, name2) {
  var schedules = node.__transition, schedule2, active, empty2 = true, i;
  if (!schedules) return;
  name2 = name2 == null ? null : name2 + "";
  for (i in schedules) {
    if ((schedule2 = schedules[i]).name !== name2) {
      empty2 = false;
      continue;
    }
    active = schedule2.state > STARTING && schedule2.state < ENDING;
    schedule2.state = ENDED;
    schedule2.timer.stop();
    schedule2.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
    delete schedules[i];
  }
  if (empty2) delete node.__transition;
}
function selection_interrupt(name2) {
  return this.each(function() {
    interrupt(this, name2);
  });
}
function tweenRemove(id2, name2) {
  var tween0, tween1;
  return function() {
    var schedule2 = set2(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name2) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule2.tween = tween1;
  };
}
function tweenFunction(id2, name2, value2) {
  var tween0, tween1;
  if (typeof value2 !== "function") throw new Error();
  return function() {
    var schedule2 = set2(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t4 = { name: name2, value: value2 }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name2) {
          tween1[i] = t4;
          break;
        }
      }
      if (i === n) tween1.push(t4);
    }
    schedule2.tween = tween1;
  };
}
function transition_tween(name2, value2) {
  var id2 = this._id;
  name2 += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t4; i < n; ++i) {
      if ((t4 = tween[i]).name === name2) {
        return t4.value;
      }
    }
    return null;
  }
  return this.each((value2 == null ? tweenRemove : tweenFunction)(id2, name2, value2));
}
function tweenValue(transition2, name2, value2) {
  var id2 = transition2._id;
  transition2.each(function() {
    var schedule2 = set2(this, id2);
    (schedule2.value || (schedule2.value = {}))[name2] = value2.apply(this, arguments);
  });
  return function(node) {
    return get2(node, id2).value[name2];
  };
}
function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? number : b instanceof color ? rgb2 : (c = color(b)) ? (b = c, rgb2) : string)(a, b);
}
function attrRemove2(name2) {
  return function() {
    this.removeAttribute(name2);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name2, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name2);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrFunction2(name2, interpolate2, value2) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value2(this), string1;
    if (value1 == null) return void this.removeAttribute(name2);
    string0 = this.getAttribute(name2);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate2, value2) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value2(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function transition_attr(name2, value2) {
  var fullname = namespace(name2), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name2, typeof value2 === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name2, value2)) : value2 == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value2));
}
function attrInterpolate(name2, i) {
  return function(t4) {
    this.setAttribute(name2, i.call(this, t4));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t4) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t4));
  };
}
function attrTweenNS(fullname, value2) {
  var t02, i0;
  function tween() {
    var i = value2.apply(this, arguments);
    if (i !== i0) t02 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t02;
  }
  tween._value = value2;
  return tween;
}
function attrTween(name2, value2) {
  var t02, i0;
  function tween() {
    var i = value2.apply(this, arguments);
    if (i !== i0) t02 = (i0 = i) && attrInterpolate(name2, i);
    return t02;
  }
  tween._value = value2;
  return tween;
}
function transition_attrTween(name2, value2) {
  var key = "attr." + name2;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value2 == null) return this.tween(key, null);
  if (typeof value2 !== "function") throw new Error();
  var fullname = namespace(name2);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value2));
}
function delayFunction(id2, value2) {
  return function() {
    init(this, id2).delay = +value2.apply(this, arguments);
  };
}
function delayConstant(id2, value2) {
  return value2 = +value2, function() {
    init(this, id2).delay = value2;
  };
}
function transition_delay(value2) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value2 === "function" ? delayFunction : delayConstant)(id2, value2)) : get2(this.node(), id2).delay;
}
function durationFunction(id2, value2) {
  return function() {
    set2(this, id2).duration = +value2.apply(this, arguments);
  };
}
function durationConstant(id2, value2) {
  return value2 = +value2, function() {
    set2(this, id2).duration = value2;
  };
}
function transition_duration(value2) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value2 === "function" ? durationFunction : durationConstant)(id2, value2)) : get2(this.node(), id2).duration;
}
function easeConstant(id2, value2) {
  if (typeof value2 !== "function") throw new Error();
  return function() {
    set2(this, id2).ease = value2;
  };
}
function transition_ease(value2) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value2)) : get2(this.node(), id2).ease;
}
function easeVarying(id2, value2) {
  return function() {
    var v = value2.apply(this, arguments);
    if (typeof v !== "function") throw new Error();
    set2(this, id2).ease = v;
  };
}
function transition_easeVarying(value2) {
  if (typeof value2 !== "function") throw new Error();
  return this.each(easeVarying(this._id, value2));
}
function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition2) {
  if (transition2._id !== this._id) throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}
function start(name2) {
  return (name2 + "").trim().split(/^|\s+/).every(function(t4) {
    var i = t4.indexOf(".");
    if (i >= 0) t4 = t4.slice(0, i);
    return !t4 || t4 === "start";
  });
}
function onFunction(id2, name2, listener) {
  var on0, on1, sit = start(name2) ? init : set2;
  return function() {
    var schedule2 = sit(this, id2), on = schedule2.on;
    if (on !== on0) (on1 = (on0 = on).copy()).on(name2, listener);
    schedule2.on = on1;
  };
}
function transition_on(name2, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get2(this.node(), id2).on.on(name2) : this.each(onFunction(id2, name2, listener));
}
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id2) return;
    if (parent) parent.removeChild(this);
  };
}
function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select2) {
  var name2 = this._name, id2 = this._id;
  if (typeof select2 !== "function") select2 = selector(select2);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name2, id2, i, subgroup, get2(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name2, id2);
}
function transition_selectAll(select2) {
  var name2 = this._name, id2 = this._id;
  if (typeof select2 !== "function") select2 = selectorAll(select2);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select2.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child = children2[k]) {
            schedule(child, name2, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name2, id2);
}
var Selection2 = selection.prototype.constructor;
function transition_selection() {
  return new Selection2(this._groups, this._parents);
}
function styleNull(name2, interpolate2) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name2), string1 = (this.style.removeProperty(name2), styleValue(this, name2));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name2) {
  return function() {
    this.style.removeProperty(name2);
  };
}
function styleConstant2(name2, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name2);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function styleFunction2(name2, interpolate2, value2) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name2), value1 = value2(this), string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name2), styleValue(this, name2));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name2) {
  var on0, on1, listener0, key = "style." + name2, event = "end." + key, remove2;
  return function() {
    var schedule2 = set2(this, id2), on = schedule2.on, listener = schedule2.value[key] == null ? remove2 || (remove2 = styleRemove2(name2)) : void 0;
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule2.on = on1;
  };
}
function transition_style(name2, value2, priority) {
  var i = (name2 += "") === "transform" ? interpolateTransformCss : interpolate;
  return value2 == null ? this.styleTween(name2, styleNull(name2, i)).on("end.style." + name2, styleRemove2(name2)) : typeof value2 === "function" ? this.styleTween(name2, styleFunction2(name2, i, tweenValue(this, "style." + name2, value2))).each(styleMaybeRemove(this._id, name2)) : this.styleTween(name2, styleConstant2(name2, i, value2), priority).on("end.style." + name2, null);
}
function styleInterpolate(name2, i, priority) {
  return function(t4) {
    this.style.setProperty(name2, i.call(this, t4), priority);
  };
}
function styleTween(name2, value2, priority) {
  var t4, i0;
  function tween() {
    var i = value2.apply(this, arguments);
    if (i !== i0) t4 = (i0 = i) && styleInterpolate(name2, i, priority);
    return t4;
  }
  tween._value = value2;
  return tween;
}
function transition_styleTween(name2, value2, priority) {
  var key = "style." + (name2 += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value2 == null) return this.tween(key, null);
  if (typeof value2 !== "function") throw new Error();
  return this.tween(key, styleTween(name2, value2, priority == null ? "" : priority));
}
function textConstant2(value2) {
  return function() {
    this.textContent = value2;
  };
}
function textFunction2(value2) {
  return function() {
    var value1 = value2(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function transition_text(value2) {
  return this.tween("text", typeof value2 === "function" ? textFunction2(tweenValue(this, "text", value2)) : textConstant2(value2 == null ? "" : value2 + ""));
}
function textInterpolate(i) {
  return function(t4) {
    this.textContent = i.call(this, t4);
  };
}
function textTween(value2) {
  var t02, i0;
  function tween() {
    var i = value2.apply(this, arguments);
    if (i !== i0) t02 = (i0 = i) && textInterpolate(i);
    return t02;
  }
  tween._value = value2;
  return tween;
}
function transition_textTween(value2) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value2 == null) return this.tween(key, null);
  if (typeof value2 !== "function") throw new Error();
  return this.tween(key, textTween(value2));
}
function transition_transition() {
  var name2 = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get2(node, id0);
        schedule(node, name2, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name2, id1);
}
function transition_end() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0) resolve();
    } };
    that.each(function() {
      var schedule2 = set2(this, id2), on = schedule2.on;
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule2.on = on1;
    });
    if (size === 0) resolve();
  });
}
var id = 0;
function Transition(groups, parents, name2, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name2;
  this._id = id2;
}
function transition(name2) {
  return selection().transition(name2);
}
function newId() {
  return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function selection_transition(name2) {
  var id2, timing;
  if (name2 instanceof Transition) {
    id2 = name2._id, name2 = name2._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name2 = name2 == null ? null : name2 + "";
  }
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name2, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name2, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

// node_modules/d3-zoom/dist/d3-zoom.mjs
var constant4 = (x) => () => x;
function ZoomEvent(type, {
  sourceEvent: sourceEvent2,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
  return node.__zoom;
}
function nopropagation2(event) {
  event.stopImmediatePropagation();
}
function noevent2(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function defaultFilter2(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom2() {
  var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta2 = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate2 = zoom, listeners7 = dispatch("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom3(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom3.transform = function(collection, transform2, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule2(collection, transform2, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom3.scaleBy = function(selection2, k, p, event) {
    zoom3.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };
  zoom3.scaleTo = function(selection2, k, p, event) {
    zoom3.transform(selection2, function() {
      var e = extent.apply(this, arguments), t02 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t02.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t02, k1), p0, p1), e, translateExtent);
    }, p, event);
  };
  zoom3.translateBy = function(selection2, x, y, event) {
    zoom3.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom3.translateTo = function(selection2, x, y, p, event) {
    zoom3.transform(selection2, function() {
      var e = extent.apply(this, arguments), t4 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t4.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x = p0[0] - p1[0] * transform2.k, y = p0[1] - p1[1] * transform2.k;
    return x === transform2.x && y === transform2.y ? transform2 : new Transform(transform2.k, x, y);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule2(transition2, transform2, point, event) {
    transition2.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate2(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function(t4) {
        if (t4 === 1) t4 = b;
        else {
          var l = i(t4), k = w / l[2];
          t4 = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t4);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform2) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners7.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom3,
          transform: this.that.__zoom,
          dispatch: listeners7
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var g = gesture(this, args).event(event), t4 = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t4.k * Math.pow(2, wheelDelta2.apply(this, arguments)))), p = pointer(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t4.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t4.k === k) return;
    else {
      g.mouse = [p, t4.invert(p)];
      interrupt(this);
      g.start();
    }
    noevent2(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t4, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments)) return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    nodrag(event.view);
    nopropagation2(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();
    function mousemoved(event2) {
      noevent2(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent2(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var t02 = this.__zoom, p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t02.invert(p0), k1 = t02.k * (event.shiftKey ? 0.5 : 2), t12 = constrain(translate(scale(t02, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent2(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule2, t12, p0, event);
    else select(this).call(zoom3.transform, t12, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t4, p;
    nopropagation2(event);
    for (i = 0; i < n; ++i) {
      t4 = touches[i], p = pointer(t4, this);
      p = [p, this.__zoom.invert(p), t4.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t4, p, l;
    noevent2(event);
    for (i = 0; i < n; ++i) {
      t4 = touches[i], p = pointer(t4, this);
      if (g.touch0 && g.touch0[2] === t4.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t4.identifier) g.touch1[0] = p;
    }
    t4 = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t4 = scale(t4, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t4, p, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t4;
    nopropagation2(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t4 = touches[i];
      if (g.touch0 && g.touch0[2] === t4.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t4.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t4 = pointer(t4, this);
        if (Math.hypot(touchfirst[0] - t4[0], touchfirst[1] - t4[1]) < tapDistance) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }
  zoom3.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta2 = typeof _ === "function" ? _ : constant4(+_), zoom3) : wheelDelta2;
  };
  zoom3.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant4(!!_), zoom3) : filter2;
  };
  zoom3.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant4(!!_), zoom3) : touchable;
  };
  zoom3.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant4([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom3) : extent;
  };
  zoom3.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom3) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom3.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom3) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom3.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom3) : constrain;
  };
  zoom3.duration = function(_) {
    return arguments.length ? (duration = +_, zoom3) : duration;
  };
  zoom3.interpolate = function(_) {
    return arguments.length ? (interpolate2 = _, zoom3) : interpolate2;
  };
  zoom3.on = function() {
    var value2 = listeners7.on.apply(listeners7, arguments);
    return value2 === listeners7 ? zoom3 : value2;
  };
  zoom3.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom3) : Math.sqrt(clickDistance2);
  };
  zoom3.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom3) : tapDistance;
  };
  return zoom3;
}

// node_modules/@xyflow/system/dist/esm/index.js
var errorMessages = {
  error001: (lib = "react") => `Seems like you have not used ${lib === "svelte" ? "SvelteFlowProvider" : "ReactFlowProvider"} as an ancestor. Help: https://${lib}flow.dev/error#001`,
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => "The parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id2) => `The old edge with id=${id2} does not exist.`,
  error009: (type) => `Marker type "${type}" doesn't exist.`,
  error008: (handleType, { id: id2, sourceHandle, targetHandle }) => `Couldn't create edge for ${handleType} handle id: "${handleType === "source" ? sourceHandle : targetHandle}", edge id: ${id2}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id2) => `Node with id "${id2}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (lib = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${lib}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.",
  error016: (id2) => `Edge with id "${id2}" does not exist, it may have been removed. This can happen when an edge is deleted before the "onEdgeClick" handler is called.`
};
var infiniteExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
];
var elementSelectionKeys = ["Enter", " ", "Escape"];
var defaultAriaLabelConfig = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction, x, y }) => `Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var ConnectionMode;
(function(ConnectionMode2) {
  ConnectionMode2["Strict"] = "strict";
  ConnectionMode2["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function(PanOnScrollMode2) {
  PanOnScrollMode2["Free"] = "free";
  PanOnScrollMode2["Vertical"] = "vertical";
  PanOnScrollMode2["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function(SelectionMode2) {
  SelectionMode2["Partial"] = "partial";
  SelectionMode2["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));
var initialConnection = {
  inProgress: false,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var ConnectionLineType;
(function(ConnectionLineType2) {
  ConnectionLineType2["Bezier"] = "default";
  ConnectionLineType2["Straight"] = "straight";
  ConnectionLineType2["Step"] = "step";
  ConnectionLineType2["SmoothStep"] = "smoothstep";
  ConnectionLineType2["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function(MarkerType2) {
  MarkerType2["Arrow"] = "arrow";
  MarkerType2["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));
var Position;
(function(Position2) {
  Position2["Left"] = "left";
  Position2["Top"] = "top";
  Position2["Right"] = "right";
  Position2["Bottom"] = "bottom";
})(Position || (Position = {}));
var oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};
var isEdgeBase = (element) => !!element && typeof element === "object" && "id" in element && "source" in element && "target" in element;
var isNodeBase = (element) => !!element && typeof element === "object" && "id" in element && "position" in element && !("source" in element) && !("target" in element);
var isInternalNodeBase = (element) => !!element && typeof element === "object" && "id" in element && "internals" in element && !("source" in element) && !("target" in element);
var getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
  const { width, height } = getNodeDimensions(node);
  const origin = node.origin ?? nodeOrigin;
  const offsetX = width * origin[0];
  const offsetY = height * origin[1];
  return {
    x: node.position.x - offsetX,
    y: node.position.y - offsetY
  };
};
var getNodesBounds = (nodes, params = { nodeOrigin: [0, 0] }) => {
  if (false) {
    console.warn("Please use `getNodesBounds` from `useReactFlow`/`useSvelteFlow` hook to ensure correct values for sub flows. If not possible, you have to provide a nodeLookup to support sub flows.");
  }
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let hasNode = false;
  const box = nodes.reduce((currBox, nodeOrId) => {
    const isId = typeof nodeOrId === "string";
    let currentNode = !params.nodeLookup && !isId ? nodeOrId : void 0;
    if (params.nodeLookup) {
      currentNode = isId ? params.nodeLookup.get(nodeOrId) : !isInternalNodeBase(nodeOrId) ? params.nodeLookup.get(nodeOrId.id) : nodeOrId;
    }
    if (!currentNode) {
      return currBox;
    }
    hasNode = true;
    return getBoundsOfBoxes(currBox, nodeToBox(currentNode, params.nodeOrigin));
  }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
  return hasNode ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
};
var getInternalNodesBounds = (nodeLookup, params = {}) => {
  let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
  let hasVisibleNodes = false;
  nodeLookup.forEach((node) => {
    if (params.filter === void 0 || params.filter(node)) {
      box = getBoundsOfBoxes(box, nodeToBox(node));
      hasVisibleNodes = true;
    }
  });
  return hasVisibleNodes ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
};
var getNodesInside = (nodes, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false) => {
  const paneX = (rect.x - tx) / tScale;
  const paneY = (rect.y - ty) / tScale;
  const paneWidth = rect.width / tScale;
  const paneHeight = rect.height / tScale;
  const visibleNodes = [];
  for (const node of nodes.values()) {
    const { measured, selectable = true, hidden = false } = node;
    if (excludeNonSelectableNodes && !selectable || hidden) {
      continue;
    }
    const width = measured.width ?? node.width ?? node.initialWidth ?? 0;
    const height = measured.height ?? node.height ?? node.initialHeight ?? 0;
    const { x, y } = node.internals.positionAbsolute;
    const overlappingArea = getRectsOverlappingArea(paneX, paneY, paneWidth, paneHeight, x, y, width, height);
    const area = width * height;
    const partiallyVisible = partially && overlappingArea > 0;
    const forceInitialRender = !node.internals.handleBounds;
    const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;
    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  }
  return visibleNodes;
};
var getConnectedEdges = (nodes, edges) => {
  const nodeIds = /* @__PURE__ */ new Set();
  nodes.forEach((node) => {
    nodeIds.add(node.id);
  });
  return edges.filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target));
};
function getFitViewNodes(nodeLookup, options) {
  const fitViewNodes = /* @__PURE__ */ new Map();
  const optionNodeIds = options?.nodes ? new Set(options.nodes.map((node) => node.id)) : null;
  nodeLookup.forEach((n) => {
    let isVisible;
    if (options?.includeHiddenNodes) {
      const { width, height } = getNodeDimensions(n);
      isVisible = width > 0 && height > 0;
    } else {
      isVisible = Boolean(n.measured.width && n.measured.height && !n.hidden);
    }
    if (isVisible && (!optionNodeIds || optionNodeIds.has(n.id))) {
      fitViewNodes.set(n.id, n);
    }
  });
  return fitViewNodes;
}
async function fitViewport({ nodes, width, height, panZoom, minZoom, maxZoom }, options) {
  if (nodes.size === 0) {
    return true;
  }
  const nodesToFit = getFitViewNodes(nodes, options);
  const bounds = getInternalNodesBounds(nodesToFit);
  const viewport = getViewportForBounds(bounds, width, height, options?.minZoom ?? minZoom, options?.maxZoom ?? maxZoom, options?.padding ?? 0.1);
  await panZoom.setViewport(viewport, {
    duration: options?.duration,
    ease: options?.ease,
    interpolate: options?.interpolate
  });
  return true;
}
function calculateNodePosition({ nodeId, nextPosition, nodeLookup, nodeOrigin = [0, 0], nodeExtent, onError }) {
  const node = nodeLookup.get(nodeId);
  const parentNode = node.parentId ? nodeLookup.get(node.parentId) : void 0;
  const { x: parentX, y: parentY } = parentNode ? parentNode.internals.positionAbsolute : { x: 0, y: 0 };
  const origin = node.origin ?? nodeOrigin;
  let extent = node.extent || nodeExtent;
  if (node.extent === "parent" && !node.expandParent) {
    if (!parentNode) {
      onError?.("005", errorMessages["error005"]());
    } else {
      const { width: parentWidth, height: parentHeight } = getNodeDimensions(parentNode);
      if (parentWidth && parentHeight) {
        extent = [
          [parentX, parentY],
          [parentX + parentWidth, parentY + parentHeight]
        ];
      }
    }
  } else if (parentNode && isCoordinateExtent(node.extent)) {
    extent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
    ];
  }
  const positionAbsolute = isCoordinateExtent(extent) ? clampPosition(nextPosition, extent, node.measured) : nextPosition;
  if (node.measured.width === void 0 || node.measured.height === void 0) {
    onError?.("015", errorMessages["error015"]());
  }
  return {
    position: {
      x: positionAbsolute.x - parentX + (node.measured.width ?? 0) * origin[0],
      y: positionAbsolute.y - parentY + (node.measured.height ?? 0) * origin[1]
    },
    positionAbsolute
  };
}
async function getElementsToRemove({ nodesToRemove = [], edgesToRemove = [], nodes, edges, onBeforeDelete }) {
  const nodeIds = new Set(nodesToRemove.map((node) => node.id));
  const matchingNodes = [];
  for (const node of nodes) {
    if (node.deletable === false) {
      continue;
    }
    const isIncluded = nodeIds.has(node.id);
    const parentHit = !isIncluded && node.parentId && matchingNodes.find((n) => n.id === node.parentId);
    if (isIncluded || parentHit) {
      matchingNodes.push(node);
    }
  }
  const edgeIds = new Set(edgesToRemove.map((edge) => edge.id));
  const deletableEdges = edges.filter((edge) => edge.deletable !== false);
  const connectedEdges = getConnectedEdges(matchingNodes, deletableEdges);
  const matchingEdges = connectedEdges;
  for (const edge of deletableEdges) {
    const isIncluded = edgeIds.has(edge.id);
    if (isIncluded && !matchingEdges.find((e) => e.id === edge.id)) {
      matchingEdges.push(edge);
    }
  }
  if (!onBeforeDelete) {
    return {
      edges: matchingEdges,
      nodes: matchingNodes
    };
  }
  const onBeforeDeleteResult = await onBeforeDelete({
    nodes: matchingNodes,
    edges: matchingEdges
  });
  if (typeof onBeforeDeleteResult === "boolean") {
    return onBeforeDeleteResult ? { edges: matchingEdges, nodes: matchingNodes } : { edges: [], nodes: [] };
  }
  return onBeforeDeleteResult;
}
var clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
var clampPosition = (position = { x: 0, y: 0 }, extent, dimensions) => ({
  x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
  y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0))
});
function clampPositionToParent(childPosition, childDimensions, parent) {
  const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
  const { x: parentX, y: parentY } = parent.internals.positionAbsolute;
  return clampPosition(childPosition, [
    [parentX, parentY],
    [parentX + parentWidth, parentY + parentHeight]
  ], childDimensions);
}
var calcAutoPanVelocity = (value2, min, max) => {
  if (value2 < min) {
    return clamp(Math.abs(value2 - min), 1, min) / min;
  } else if (value2 > max) {
    return -clamp(Math.abs(value2 - max), 1, min) / min;
  }
  return 0;
};
var calcAutoPan = (pos, bounds, speed = 15, distance2 = 40) => {
  const xMovement = calcAutoPanVelocity(pos.x, distance2, bounds.width - distance2) * speed;
  const yMovement = calcAutoPanVelocity(pos.y, distance2, bounds.height - distance2) * speed;
  return [xMovement, yMovement];
};
var getBoundsOfBoxes = (box1, box2) => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2)
});
var rectToBox = ({ x, y, width, height }) => ({
  x,
  y,
  x2: x + width,
  y2: y + height
});
var boxToRect = ({ x, y, x2, y2 }) => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y
});
var nodeToRect = (node, nodeOrigin = [0, 0]) => {
  const { x, y } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  return {
    x,
    y,
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
  };
};
var nodeToBox = (node, nodeOrigin = [0, 0]) => {
  const { x, y } = isInternalNodeBase(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  return {
    x,
    y,
    x2: x + (node.measured?.width ?? node.width ?? node.initialWidth ?? 0),
    y2: y + (node.measured?.height ?? node.height ?? node.initialHeight ?? 0)
  };
};
var getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
var getRectsOverlappingArea = (aX, aY, aWidth, aHeight, bX, bY, bWidth, bHeight) => {
  const xOverlap = Math.max(0, Math.min(aX + aWidth, bX + bWidth) - Math.max(aX, bX));
  const yOverlap = Math.max(0, Math.min(aY + aHeight, bY + bHeight) - Math.max(aY, bY));
  return Math.ceil(xOverlap * yOverlap);
};
var getOverlappingArea = (rectA, rectB) => getRectsOverlappingArea(rectA.x, rectA.y, rectA.width, rectA.height, rectB.x, rectB.y, rectB.width, rectB.height);
var isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
var isNumeric = (n) => !isNaN(n) && isFinite(n);
var createDevWarn = (lib, helpUrl) => (id2, message) => {
  if (false) {
    console.warn(`[${lib}]: ${message} Help: ${helpUrl}error#${id2}`);
  }
};
var snapPosition = (position, snapGrid = [1, 1]) => {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1])
  };
};
var pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) => {
  const position = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale
  };
  return snapToGrid ? snapPosition(position, snapGrid) : position;
};
var rendererPointToPoint = ({ x, y }, [tx, ty, tScale]) => {
  return {
    x: x * tScale + tx,
    y: y * tScale + ty
  };
};
function parsePadding(padding, viewport) {
  if (typeof padding === "number") {
    return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
  }
  if (typeof padding === "string" && padding.endsWith("px")) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(paddingValue);
    }
  }
  if (typeof padding === "string" && padding.endsWith("%")) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(viewport * paddingValue * 0.01);
    }
  }
  console.error(`The padding value "${padding}" is invalid. Please provide a number or a string with a valid unit (px or %).`);
  return 0;
}
function parsePaddings(padding, width, height) {
  if (typeof padding === "string" || typeof padding === "number") {
    const paddingY = parsePadding(padding, height);
    const paddingX = parsePadding(padding, width);
    return {
      top: paddingY,
      right: paddingX,
      bottom: paddingY,
      left: paddingX,
      x: paddingX * 2,
      y: paddingY * 2
    };
  }
  if (typeof padding === "object") {
    const top = parsePadding(padding.top ?? padding.y ?? 0, height);
    const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
    const left = parsePadding(padding.left ?? padding.x ?? 0, width);
    const right = parsePadding(padding.right ?? padding.x ?? 0, width);
    return { top, right, bottom, left, x: left + right, y: top + bottom };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function calculateAppliedPaddings(bounds, x, y, zoom3, width, height) {
  const { x: left, y: top } = rendererPointToPoint(bounds, [x, y, zoom3]);
  const { x: boundRight, y: boundBottom } = rendererPointToPoint({ x: bounds.x + bounds.width, y: bounds.y + bounds.height }, [x, y, zoom3]);
  const right = width - boundRight;
  const bottom = height - boundBottom;
  return {
    left: Math.floor(left),
    top: Math.floor(top),
    right: Math.floor(right),
    bottom: Math.floor(bottom)
  };
}
var getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding) => {
  const p = parsePaddings(padding, width, height);
  const xZoom = (width - p.x) / bounds.width;
  const yZoom = (height - p.y) / bounds.height;
  const zoom3 = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom3, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;
  const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);
  const offset = {
    left: Math.min(newPadding.left - p.left, 0),
    top: Math.min(newPadding.top - p.top, 0),
    right: Math.min(newPadding.right - p.right, 0),
    bottom: Math.min(newPadding.bottom - p.bottom, 0)
  };
  return {
    x: x - offset.left + offset.right,
    y: y - offset.top + offset.bottom,
    zoom: clampedZoom
  };
};
var isMacOs = () => typeof navigator !== "undefined" && navigator?.userAgent?.indexOf("Mac") >= 0;
function isCoordinateExtent(extent) {
  return extent !== void 0 && extent !== null && extent !== "parent";
}
function getNodeDimensions(node) {
  return {
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
  };
}
function nodeHasDimensions(node) {
  return (node.measured?.width ?? node.width ?? node.initialWidth) !== void 0 && (node.measured?.height ?? node.height ?? node.initialHeight) !== void 0;
}
function evaluateAbsolutePosition(position, dimensions = { width: 0, height: 0 }, parentId, nodeLookup, nodeOrigin) {
  const positionAbsolute = { ...position };
  const parent = nodeLookup.get(parentId);
  if (parent) {
    const origin = parent.origin || nodeOrigin;
    positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
    positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
  }
  return positionAbsolute;
}
function areSetsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
}
function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function mergeAriaLabelConfig(partial) {
  return { ...defaultAriaLabelConfig, ...partial || {} };
}
function isAttributionVisible(library) {
  if (typeof document === "undefined")
    return true;
  const pane = document.querySelector(`.${library}-flow__pane`);
  if (!pane || !pane.isConnected)
    return true;
  const paneStyle = getComputedStyle(pane);
  if (paneStyle.display === "none")
    return true;
  if (paneStyle.visibility === "hidden" || paneStyle.visibility === "collapse")
    return true;
  if (paneStyle.opacity === "0")
    return true;
  if (paneStyle.width === "0" && paneStyle.height === "0")
    return true;
  const paneRect = pane.getBoundingClientRect();
  if (paneRect.width === 0 && paneRect.height === 0)
    return true;
  const attr = document.querySelector(`.${library}-flow__attribution`);
  if (!attr || !attr.isConnected)
    return false;
  const style2 = getComputedStyle(attr);
  if (style2.display === "none")
    return false;
  if (style2.visibility === "hidden" || style2.visibility === "collapse")
    return false;
  if (style2.opacity === "0")
    return false;
  const rect = attr.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0)
    return false;
  return true;
}
var warningDisplayed = false;
function handleAttributionWarning(library) {
  if (warningDisplayed || true) {
    return;
  }
  warningDisplayed = true;
  const framework = `${library.charAt(0).toUpperCase() + library.slice(1)} Flow`;
  setTimeout(() => {
    if (!isAttributionVisible(library)) {
      console.warn(`${framework}: It seems like you are hiding the attribution. Please only do this when you are subscribed to ${framework} Pro: https://${library}flow.dev/remove-attr
%cYou can ignore this warning if you are subscribed.`, "font-style: italic;");
    }
  }, 1e3);
}
function getConnectionStatus(isValid) {
  return isValid === null ? null : isValid ? "valid" : "invalid";
}
function getPointerPosition(event, { snapGrid = [0, 0], snapToGrid = false, transform: transform2, containerBounds }) {
  const { x, y } = getEventPosition(event);
  const pointerPos = pointToRendererPoint({ x: x - (containerBounds?.left ?? 0), y: y - (containerBounds?.top ?? 0) }, transform2);
  const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;
  return {
    xSnapped,
    ySnapped,
    ...pointerPos
  };
}
var getDimensions = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight
});
var getHostForElement = (element) => element?.getRootNode?.() || window?.document;
var inputTags = ["INPUT", "SELECT", "TEXTAREA"];
function isInputDOMNode(event) {
  const target = event.composedPath?.()?.[0] || event.target;
  if (target?.nodeType !== 1)
    return false;
  const isInput = inputTags.includes(target.nodeName) || target.hasAttribute("contenteditable");
  return isInput || !!target.closest(".nokey");
}
var isMouseEvent = (event) => "clientX" in event;
var getEventPosition = (event, bounds) => {
  const isMouse = isMouseEvent(event);
  const evtX = isMouse ? event.clientX : event.touches?.[0].clientX;
  const evtY = isMouse ? event.clientY : event.touches?.[0].clientY;
  return {
    x: evtX - (bounds?.left ?? 0),
    y: evtY - (bounds?.top ?? 0)
  };
};
var getHandleBounds = (type, nodeElement, nodeBounds, zoom3, nodeId) => {
  const handles = nodeElement.querySelectorAll(`.${type}`);
  if (!handles || !handles.length) {
    return null;
  }
  return Array.from(handles).map((handle) => {
    const handleBounds = handle.getBoundingClientRect();
    return {
      id: handle.getAttribute("data-handleid"),
      type,
      nodeId,
      position: handle.getAttribute("data-handlepos"),
      x: (handleBounds.left - nodeBounds.left) / zoom3,
      y: (handleBounds.top - nodeBounds.top) / zoom3,
      ...getDimensions(handle)
    };
  });
};
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const offsetX = Math.abs(centerX - sourceX);
  const offsetY = Math.abs(centerY - sourceY);
  return [centerX, centerY, offsetX, offsetY];
}
function calculateControlOffset(distance2, curvature) {
  if (distance2 >= 0) {
    return 0.5 * distance2;
  }
  return curvature * 25 * Math.sqrt(-distance2);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}
function getElevatedEdgeZIndex({ sourceNode, targetNode, selected: selected2 = false, zIndex = 0, elevateOnSelect = false, zIndexMode = "basic" }) {
  if (zIndexMode === "manual") {
    return zIndex;
  }
  const edgeZ = elevateOnSelect && selected2 ? zIndex + 1e3 : zIndex;
  const nodeZ = Math.max(sourceNode.parentId || elevateOnSelect && sourceNode.selected ? sourceNode.internals.z : 0, targetNode.parentId || elevateOnSelect && targetNode.selected ? targetNode.internals.z : 0);
  return edgeZ + nodeZ;
}
function isEdgeVisible({ sourceNode, targetNode, width, height, transform: transform2 }) {
  const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));
  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }
  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }
  const viewRect = {
    x: -transform2[0] / transform2[2],
    y: -transform2[1] / transform2[2],
    width: width / transform2[2],
    height: height / transform2[2]
  };
  return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
}
var getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `xy-edge__${source}${sourceHandle || ""}-${target}${targetHandle || ""}`;
var connectionExists = (edge, edges) => {
  return edges.some((el) => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
};
var addEdge = (edgeParams, edges, options = {}) => {
  if (!edgeParams.source || !edgeParams.target) {
    options.onError?.("006", errorMessages["error006"]());
    return edges;
  }
  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  let edge;
  if (isEdgeBase(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: edgeIdGenerator(edgeParams)
    };
  }
  if (connectionExists(edge, edges)) {
    return edges;
  }
  if (edge.sourceHandle === null) {
    delete edge.sourceHandle;
  }
  if (edge.targetHandle === null) {
    delete edge.targetHandle;
  }
  return edges.concat(edge);
};
function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
var handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 }
};
var getDirection = ({ source, sourcePosition = Position.Bottom, target }) => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
var distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
var isBetween = (a, b, c) => a.x === b.x && b.x === c.x && (b.y - a.y) * (c.y - b.y) >= 0 || a.y === b.y && b.y === c.y && (b.x - a.x) * (c.x - b.x) >= 0;
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset, stepPosition }) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped
  });
  const dirAccessor = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];
  let points = [];
  let centerX, centerY;
  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };
  const [, , defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y
  });
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    if (dirAccessor === "x") {
      centerX = center.x ?? sourceGapped.x + (targetGapped.x - sourceGapped.x) * stepPosition;
      centerY = center.y ?? (sourceGapped.y + targetGapped.y) / 2;
    } else {
      centerX = center.x ?? (sourceGapped.x + targetGapped.x) / 2;
      centerY = center.y ?? sourceGapped.y + (targetGapped.y - sourceGapped.y) * stepPosition;
    }
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y }
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY }
    ];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }
    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }
  const gappedSource = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
  const gappedTarget = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
  const pathPoints = [];
  for (const point of [source, gappedSource, ...points, gappedTarget, target]) {
    const [a, b] = pathPoints.slice(-2);
    if (b && isBetween(a, b, point)) {
      pathPoints.pop();
    }
    pathPoints.push(point);
  }
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;
  if (a.x === x && x === c.x || a.y === y && y === c.y) {
    return `L${x} ${y}`;
  }
  if (a.y === y) {
    const xDir2 = a.x < c.x ? -1 : 1;
    const yDir2 = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir2},${y}Q ${x},${y} ${x},${y + bendSize * yDir2}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20, stepPosition = 0.5 }) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
    stepPosition
  });
  let path = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    path += getBend(points[i - 1], points[i], points[i + 1], borderRadius);
  }
  path += `L${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return [path, labelX, labelY, offsetX, offsetY];
}
function isNodeInitialized(node) {
  return node && !!(node.internals.handleBounds || node.handles?.length) && !!(node.measured.width || node.width || node.initialWidth);
}
function getEdgePosition(params) {
  const { sourceNode, targetNode } = params;
  if (!isNodeInitialized(sourceNode) || !isNodeInitialized(targetNode)) {
    return null;
  }
  const sourceHandleBounds = sourceNode.internals.handleBounds || toHandleBounds(sourceNode.handles);
  const targetHandleBounds = targetNode.internals.handleBounds || toHandleBounds(targetNode.handles);
  const sourceHandle = getHandle$1(sourceHandleBounds?.source ?? [], params.sourceHandle);
  const targetHandle = getHandle$1(
    // when connection type is loose we can define all handles as sources and connect source -> source
    params.connectionMode === ConnectionMode.Strict ? targetHandleBounds?.target ?? [] : (targetHandleBounds?.target ?? []).concat(targetHandleBounds?.source ?? []),
    params.targetHandle
  );
  if (!sourceHandle || !targetHandle) {
    params.onError?.("008", errorMessages["error008"](!sourceHandle ? "source" : "target", {
      id: params.id,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle
    }));
    return null;
  }
  const sourcePosition = sourceHandle?.position || Position.Bottom;
  const targetPosition = targetHandle?.position || Position.Top;
  const source = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
  const target = getHandlePosition(targetNode, targetHandle, targetPosition);
  return {
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y,
    sourcePosition,
    targetPosition
  };
}
function toHandleBounds(handles) {
  if (!handles) {
    return null;
  }
  const source = [];
  const target = [];
  for (const handle of handles) {
    handle.width = handle.width ?? 1;
    handle.height = handle.height ?? 1;
    if (handle.type === "source") {
      source.push(handle);
    } else if (handle.type === "target") {
      target.push(handle);
    }
  }
  return {
    source,
    target
  };
}
function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
  const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
  const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
  const { width, height } = handle ?? getNodeDimensions(node);
  if (center) {
    return { x: x + width / 2, y: y + height / 2 };
  }
  const position = handle?.position ?? fallbackPosition;
  switch (position) {
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Left:
      return { x, y: y + height / 2 };
  }
}
function getHandle$1(bounds, handleId) {
  if (!bounds) {
    return null;
  }
  return (!handleId ? bounds[0] : bounds.find((d) => d.id === handleId)) || null;
}
function getMarkerId(marker, id2) {
  if (!marker) {
    return "";
  }
  if (typeof marker === "string") {
    return marker;
  }
  const idPrefix = id2 ? `${id2}__` : "";
  return `${idPrefix}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
}
function createMarkerIds(edges, { id: id2, defaultColor, defaultMarkerStart, defaultMarkerEnd }) {
  const ids = /* @__PURE__ */ new Set();
  return edges.reduce((markers, edge) => {
    [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
      if (marker && typeof marker === "object") {
        const markerId = getMarkerId(marker, id2);
        if (!ids.has(markerId)) {
          markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
          ids.add(markerId);
        }
      }
    });
    return markers;
  }, []).sort((a, b) => a.id.localeCompare(b.id));
}
var SELECTED_NODE_Z = 1e3;
var ROOT_PARENT_Z_INCREMENT = 10;
var defaultOptions = {
  nodeOrigin: [0, 0],
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: "basic",
  defaults: {}
};
var adoptUserNodesDefaultOptions = {
  ...defaultOptions,
  checkEquality: true
};
function mergeObjects(base, incoming) {
  const result = { ...base };
  for (const key in incoming) {
    if (incoming[key] !== void 0) {
      result[key] = incoming[key];
    }
  }
  return result;
}
function updateAbsolutePositions(nodeLookup, parentLookup, options) {
  const _options = mergeObjects(defaultOptions, options);
  for (const node of nodeLookup.values()) {
    if (node.parentId) {
      updateChildNode(node, nodeLookup, parentLookup, _options);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(node, _options.nodeOrigin);
      const extent = isCoordinateExtent(node.extent) ? node.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
      node.internals.positionAbsolute = clampedPosition;
    }
  }
}
function parseHandles(userNode, internalNode) {
  if (!userNode.handles) {
    return !userNode.measured ? void 0 : internalNode?.internals.handleBounds;
  }
  const source = [];
  const target = [];
  for (const handle of userNode.handles) {
    const handleBounds = {
      id: handle.id,
      width: handle.width ?? 1,
      height: handle.height ?? 1,
      nodeId: userNode.id,
      x: handle.x,
      y: handle.y,
      position: handle.position,
      type: handle.type
    };
    if (handle.type === "source") {
      source.push(handleBounds);
    } else if (handle.type === "target") {
      target.push(handleBounds);
    }
  }
  return {
    source,
    target
  };
}
function isManualZIndexMode(zIndexMode) {
  return zIndexMode === "manual";
}
function adoptUserNodes(nodes, nodeLookup, parentLookup, options = {}) {
  const _options = mergeObjects(adoptUserNodesDefaultOptions, options);
  const rootParentIndex = { i: 0 };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ = _options?.elevateNodesOnSelect && !isManualZIndexMode(_options.zIndexMode) ? SELECTED_NODE_Z : 0;
  let nodesInitialized = nodes.length > 0;
  let hasSelectedNodes = false;
  nodeLookup.clear();
  parentLookup.clear();
  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);
    if (_options.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, _options.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : _options.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));
      internalNode = {
        ..._options.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height
        },
        internals: {
          positionAbsolute: clampedPosition,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, _options.zIndexMode),
          userNode
        }
      };
      nodeLookup.set(userNode.id, internalNode);
    }
    if ((internalNode.measured === void 0 || internalNode.measured.width === void 0 || internalNode.measured.height === void 0) && !internalNode.hidden) {
      nodesInitialized = false;
    }
    if (userNode.parentId) {
      updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex);
    }
    hasSelectedNodes ||= userNode.selected ?? false;
  }
  return { nodesInitialized, hasSelectedNodes };
}
function updateParentLookup(node, parentLookup) {
  if (!node.parentId) {
    return;
  }
  const childNodes = parentLookup.get(node.parentId);
  if (childNodes) {
    childNodes.set(node.id, node);
  } else {
    parentLookup.set(node.parentId, /* @__PURE__ */ new Map([[node.id, node]]));
  }
}
function updateChildNode(node, nodeLookup, parentLookup, options, rootParentIndex) {
  const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = mergeObjects(defaultOptions, options);
  const parentId = node.parentId;
  const parentNode = nodeLookup.get(parentId);
  if (!parentNode) {
    console.warn(`Parent node ${parentId} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  updateParentLookup(node, parentLookup);
  if (rootParentIndex && !parentNode.parentId && parentNode.internals.rootParentIndex === void 0 && zIndexMode === "auto") {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }
  if (rootParentIndex && parentNode.internals.rootParentIndex !== void 0) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }
  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const { positionAbsolute } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;
  if (positionChanged || z !== node.internals.z) {
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
        z
      }
    });
  }
}
function calculateZ(node, selectedNodeZ, zIndexMode) {
  const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;
  if (isManualZIndexMode(zIndexMode)) {
    return zIndex;
  }
  return zIndex + (node.selected ? selectedNodeZ : 0);
}
function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode) {
  const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
  const childDimensions = getNodeDimensions(childNode);
  const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
  const clampedPosition = isCoordinateExtent(childNode.extent) ? clampPosition(positionWithOrigin, childNode.extent, childDimensions) : positionWithOrigin;
  let absolutePosition = clampPosition({ x: parentX + clampedPosition.x, y: parentY + clampedPosition.y }, nodeExtent, childDimensions);
  if (childNode.extent === "parent") {
    absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
  }
  const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
  const parentZ = parentNode.internals.z ?? 0;
  return {
    x: absolutePosition.x,
    y: absolutePosition.y,
    z: parentZ >= childZ ? parentZ + 1 : childZ
  };
}
function handleExpandParent(children2, nodeLookup, parentLookup, nodeOrigin = [0, 0]) {
  const changes = [];
  const parentExpansions = /* @__PURE__ */ new Map();
  for (const child of children2) {
    const parent = nodeLookup.get(child.parentId);
    if (!parent) {
      continue;
    }
    const parentRect = parentExpansions.get(child.parentId)?.expandedRect ?? nodeToRect(parent);
    const expandedRect = getBoundsOfRects(parentRect, child.rect);
    parentExpansions.set(child.parentId, { expandedRect, parent });
  }
  if (parentExpansions.size > 0) {
    parentExpansions.forEach(({ expandedRect, parent }, parentId) => {
      const positionAbsolute = parent.internals.positionAbsolute;
      const dimensions = getNodeDimensions(parent);
      const origin = parent.origin ?? nodeOrigin;
      const xChange = expandedRect.x < positionAbsolute.x ? Math.round(Math.abs(positionAbsolute.x - expandedRect.x)) : 0;
      const yChange = expandedRect.y < positionAbsolute.y ? Math.round(Math.abs(positionAbsolute.y - expandedRect.y)) : 0;
      const newWidth = Math.max(dimensions.width, Math.round(expandedRect.width));
      const newHeight = Math.max(dimensions.height, Math.round(expandedRect.height));
      const widthChange = (newWidth - dimensions.width) * origin[0];
      const heightChange = (newHeight - dimensions.height) * origin[1];
      if (xChange > 0 || yChange > 0 || widthChange || heightChange) {
        changes.push({
          id: parentId,
          type: "position",
          position: {
            x: parent.position.x - xChange + widthChange,
            y: parent.position.y - yChange + heightChange
          }
        });
        parentLookup.get(parentId)?.forEach((childNode) => {
          if (!children2.some((child) => child.id === childNode.id)) {
            changes.push({
              id: childNode.id,
              type: "position",
              position: {
                x: childNode.position.x + xChange,
                y: childNode.position.y + yChange
              }
            });
          }
        });
      }
      if (dimensions.width < expandedRect.width || dimensions.height < expandedRect.height || xChange || yChange) {
        changes.push({
          id: parentId,
          type: "dimensions",
          setAttributes: true,
          dimensions: {
            width: newWidth + (xChange ? origin[0] * xChange - widthChange : 0),
            height: newHeight + (yChange ? origin[1] * yChange - heightChange : 0)
          }
        });
      }
    });
  }
  return changes;
}
function updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent, zIndexMode) {
  const viewportNode = domNode?.querySelector(".xyflow__viewport");
  let updatedInternals = false;
  if (!viewportNode) {
    return { changes: [], updatedInternals };
  }
  const changes = [];
  const style2 = window.getComputedStyle(viewportNode);
  const { m22: zoom3 } = new window.DOMMatrixReadOnly(style2.transform);
  const parentExpandChildren = [];
  for (const update of updates.values()) {
    const node = nodeLookup.get(update.id);
    if (!node) {
      continue;
    }
    if (node.hidden) {
      nodeLookup.set(node.id, {
        ...node,
        internals: {
          ...node.internals,
          handleBounds: void 0
        }
      });
      updatedInternals = true;
      continue;
    }
    const dimensions = getDimensions(update.nodeElement);
    const dimensionChanged = node.measured.width !== dimensions.width || node.measured.height !== dimensions.height;
    const doUpdate = !!(dimensions.width && dimensions.height && (dimensionChanged || !node.internals.handleBounds || update.force));
    if (doUpdate) {
      const nodeBounds = update.nodeElement.getBoundingClientRect();
      const extent = isCoordinateExtent(node.extent) ? node.extent : nodeExtent;
      let { positionAbsolute } = node.internals;
      if (node.parentId && node.extent === "parent") {
        const parentNode = nodeLookup.get(node.parentId);
        if (parentNode) {
          positionAbsolute = clampPositionToParent(positionAbsolute, dimensions, parentNode);
        }
      } else if (extent) {
        positionAbsolute = clampPosition(positionAbsolute, extent, dimensions);
      }
      const newNode = {
        ...node,
        measured: dimensions,
        internals: {
          ...node.internals,
          positionAbsolute,
          handleBounds: {
            source: getHandleBounds("source", update.nodeElement, nodeBounds, zoom3, node.id),
            target: getHandleBounds("target", update.nodeElement, nodeBounds, zoom3, node.id)
          }
        }
      };
      nodeLookup.set(node.id, newNode);
      if (node.parentId) {
        updateChildNode(newNode, nodeLookup, parentLookup, { nodeOrigin, zIndexMode });
      }
      updatedInternals = true;
      if (dimensionChanged) {
        changes.push({
          id: node.id,
          type: "dimensions",
          dimensions
        });
        if (node.expandParent && node.parentId) {
          parentExpandChildren.push({
            id: node.id,
            parentId: node.parentId,
            rect: nodeToRect(newNode, nodeOrigin)
          });
        }
      }
    }
  }
  if (parentExpandChildren.length > 0) {
    const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
    changes.push(...parentExpandChanges);
  }
  return { changes, updatedInternals };
}
async function panBy({ delta, panZoom, transform: transform2, translateExtent, width, height }) {
  if (!panZoom || !delta.x && !delta.y) {
    return false;
  }
  const nextViewport = await panZoom.setViewportConstrained({
    x: transform2[0] + delta.x,
    y: transform2[1] + delta.y,
    zoom: transform2[2]
  }, [
    [0, 0],
    [width, height]
  ], translateExtent);
  const transformChanged = !!nextViewport && (nextViewport.x !== transform2[0] || nextViewport.y !== transform2[1] || nextViewport.k !== transform2[2]);
  return transformChanged;
}
function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
  let key = nodeId;
  const nodeMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
  connectionLookup.set(key, nodeMap.set(connectionKey, connection));
  key = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
  connectionLookup.set(key, typeMap.set(connectionKey, connection));
  if (handleId) {
    key = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key) || /* @__PURE__ */ new Map();
    connectionLookup.set(key, handleMap.set(connectionKey, connection));
  }
}
function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
  connectionLookup.clear();
  edgeLookup.clear();
  for (const edge of edges) {
    const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;
    const connection = { edgeId: edge.id, source: sourceNode, target: targetNode, sourceHandle, targetHandle };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;
    addConnectionToLookup("source", connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup("target", connection, sourceKey, connectionLookup, targetNode, targetHandle);
    edgeLookup.set(edge.id, edge);
  }
}
function isParentSelected(node, nodeLookup) {
  if (!node.parentId) {
    return false;
  }
  const parentNode = nodeLookup.get(node.parentId);
  if (!parentNode) {
    return false;
  }
  if (parentNode.selected) {
    return true;
  }
  return isParentSelected(parentNode, nodeLookup);
}
function hasSelector(target, selector2, domNode) {
  let current = target;
  do {
    if (current?.matches?.(selector2))
      return true;
    if (current === domNode)
      return false;
    current = current?.parentElement;
  } while (current);
  return false;
}
function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId, onlyDragNode) {
  const dragItems = /* @__PURE__ */ new Map();
  for (const [id2, node] of nodeLookup) {
    const isDragged = onlyDragNode ? node.id === nodeId : node.selected || node.id === nodeId;
    if (isDragged && (onlyDragNode || !node.parentId || !isParentSelected(node, nodeLookup)) && (node.draggable || nodesDraggable && typeof node.draggable === "undefined")) {
      const internalNode = nodeLookup.get(id2);
      if (internalNode) {
        dragItems.set(id2, {
          id: id2,
          position: internalNode.position || { x: 0, y: 0 },
          distance: {
            x: mousePos.x - internalNode.internals.positionAbsolute.x,
            y: mousePos.y - internalNode.internals.positionAbsolute.y
          },
          extent: internalNode.extent,
          parentId: internalNode.parentId,
          origin: internalNode.origin,
          expandParent: internalNode.expandParent,
          internals: {
            positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 }
          },
          measured: {
            width: internalNode.measured.width ?? 0,
            height: internalNode.measured.height ?? 0
          }
        });
      }
    }
  }
  return dragItems;
}
function getEventHandlerParams({ nodeId, dragItems, nodeLookup, dragging = true }) {
  const nodesFromDragItems = [];
  for (const [id2, dragItem] of dragItems) {
    const node2 = nodeLookup.get(id2)?.internals.userNode;
    if (node2) {
      nodesFromDragItems.push({
        ...node2,
        position: dragItem.position,
        dragging
      });
    }
  }
  if (!nodeId) {
    return [nodesFromDragItems[0], nodesFromDragItems];
  }
  const node = nodeLookup.get(nodeId)?.internals.userNode;
  return [
    !node ? nodesFromDragItems[0] : {
      ...node,
      position: dragItems.get(nodeId)?.position || node.position,
      dragging
    },
    nodesFromDragItems
  ];
}
function calculateSnapOffset({ dragItems, snapGrid, x, y }) {
  const refDragItem = dragItems.values().next().value;
  if (!refDragItem) {
    return null;
  }
  const refPos = {
    x: x - refDragItem.distance.x,
    y: y - refDragItem.distance.y
  };
  const refPosSnapped = snapPosition(refPos, snapGrid);
  return {
    x: refPosSnapped.x - refPos.x,
    y: refPosSnapped.y - refPos.y
  };
}
function XYDrag({ onNodeMouseDown, getStoreItems, onDragStart, onDrag, onDragStop }) {
  let lastPos = { x: null, y: null };
  let autoPanId = 0;
  let dragItems = /* @__PURE__ */ new Map();
  let autoPanStarted = false;
  let mousePosition = { x: 0, y: 0 };
  let containerBounds = null;
  let dragStarted = false;
  let d3Selection = null;
  let abortDrag = false;
  let nodePositionsChanged = false;
  let dragEvent = null;
  function update({ noDragClassName, handleSelector, domNode, isSelectable, nodeId, nodeClickDistance = 0 }) {
    d3Selection = select(domNode);
    function updateNodes({ x, y }) {
      const { nodeLookup, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onNodeDrag, onSelectionDrag, onError, updateNodePositions } = getStoreItems();
      lastPos = { x, y };
      let hasChange = false;
      const isMultiDrag = dragItems.size > 1;
      const nodesBox = isMultiDrag && nodeExtent ? rectToBox(getInternalNodesBounds(dragItems)) : null;
      const multiDragSnapOffset = isMultiDrag && snapToGrid ? calculateSnapOffset({
        dragItems,
        snapGrid,
        x,
        y
      }) : null;
      for (const [id2, dragItem] of dragItems) {
        if (!nodeLookup.has(id2)) {
          continue;
        }
        let nextPosition = { x: x - dragItem.distance.x, y: y - dragItem.distance.y };
        if (snapToGrid) {
          nextPosition = multiDragSnapOffset ? {
            x: Math.round(nextPosition.x + multiDragSnapOffset.x),
            y: Math.round(nextPosition.y + multiDragSnapOffset.y)
          } : snapPosition(nextPosition, snapGrid);
        }
        let adjustedNodeExtent = null;
        if (isMultiDrag && nodeExtent && !dragItem.extent && nodesBox) {
          const { positionAbsolute: positionAbsolute2 } = dragItem.internals;
          const x1 = positionAbsolute2.x - nodesBox.x + nodeExtent[0][0];
          const x2 = positionAbsolute2.x + dragItem.measured.width - nodesBox.x2 + nodeExtent[1][0];
          const y1 = positionAbsolute2.y - nodesBox.y + nodeExtent[0][1];
          const y2 = positionAbsolute2.y + dragItem.measured.height - nodesBox.y2 + nodeExtent[1][1];
          adjustedNodeExtent = [
            [x1, y1],
            [x2, y2]
          ];
        }
        const { position, positionAbsolute } = calculateNodePosition({
          nodeId: id2,
          nextPosition,
          nodeLookup,
          nodeExtent: adjustedNodeExtent ? adjustedNodeExtent : nodeExtent,
          nodeOrigin,
          onError
        });
        hasChange = hasChange || dragItem.position.x !== position.x || dragItem.position.y !== position.y;
        dragItem.position = position;
        dragItem.internals.positionAbsolute = positionAbsolute;
      }
      nodePositionsChanged = nodePositionsChanged || hasChange;
      if (!hasChange) {
        return;
      }
      updateNodePositions(dragItems, true);
      if (dragEvent && (onDrag || onNodeDrag || !nodeId && onSelectionDrag)) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodeLookup
        });
        onDrag?.(dragEvent, dragItems, currentNode, currentNodes);
        onNodeDrag?.(dragEvent, currentNode, currentNodes);
        if (!nodeId) {
          onSelectionDrag?.(dragEvent, currentNodes);
        }
      }
    }
    async function autoPan() {
      if (!containerBounds) {
        return;
      }
      const { transform: transform2, panBy: panBy2, autoPanSpeed, autoPanOnNodeDrag } = getStoreItems();
      if (!autoPanOnNodeDrag) {
        autoPanStarted = false;
        cancelAnimationFrame(autoPanId);
        return;
      }
      const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds, autoPanSpeed);
      if (xMovement !== 0 || yMovement !== 0) {
        lastPos.x = (lastPos.x ?? 0) - xMovement / transform2[2];
        lastPos.y = (lastPos.y ?? 0) - yMovement / transform2[2];
        if (await panBy2({ x: xMovement, y: yMovement })) {
          updateNodes(lastPos);
        }
      }
      autoPanId = requestAnimationFrame(autoPan);
    }
    function startDrag(event) {
      const { nodeLookup, multiSelectionActive, nodesDraggable, transform: transform2, snapGrid, snapToGrid, selectNodesOnDrag, onNodeDragStart, onSelectionDragStart, unselectNodesAndEdges } = getStoreItems();
      dragStarted = true;
      const isUnselectedNodeDrag = !!nodeId && !multiSelectionActive && !nodeLookup.get(nodeId)?.selected;
      if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
        if (!nodeLookup.get(nodeId)?.selected) {
          unselectNodesAndEdges();
        }
      }
      if (isSelectable && selectNodesOnDrag && nodeId) {
        onNodeMouseDown?.(nodeId);
      }
      const pointerPos = getPointerPosition(event.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      lastPos = pointerPos;
      dragItems = getDragItems(nodeLookup, nodesDraggable, pointerPos, nodeId, isUnselectedNodeDrag);
      if (dragItems.size > 0 && (onDragStart || onNodeDragStart || !nodeId && onSelectionDragStart)) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodeLookup
        });
        onDragStart?.(event.sourceEvent, dragItems, currentNode, currentNodes);
        onNodeDragStart?.(event.sourceEvent, currentNode, currentNodes);
        if (!nodeId) {
          onSelectionDragStart?.(event.sourceEvent, currentNodes);
        }
      }
    }
    const d3DragInstance = drag().clickDistance(nodeClickDistance).on("start", (event) => {
      const { domNode: domNode2, nodeDragThreshold, transform: transform2, snapGrid, snapToGrid } = getStoreItems();
      containerBounds = domNode2?.getBoundingClientRect() || null;
      abortDrag = false;
      nodePositionsChanged = false;
      dragEvent = event.sourceEvent;
      if (nodeDragThreshold === 0) {
        startDrag(event);
      }
      const pointerPos = getPointerPosition(event.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      lastPos = pointerPos;
      mousePosition = getEventPosition(event.sourceEvent, containerBounds);
    }).on("drag", (event) => {
      const { autoPanOnNodeDrag, transform: transform2, snapGrid, snapToGrid, nodeDragThreshold, nodeLookup } = getStoreItems();
      const pointerPos = getPointerPosition(event.sourceEvent, { transform: transform2, snapGrid, snapToGrid, containerBounds });
      dragEvent = event.sourceEvent;
      if (event.sourceEvent.type === "touchmove" && event.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      nodeId && !nodeLookup.has(nodeId)) {
        abortDrag = true;
      }
      if (abortDrag) {
        return;
      }
      if (!autoPanStarted && autoPanOnNodeDrag && dragStarted) {
        autoPanStarted = true;
        autoPan();
      }
      if (!dragStarted) {
        const currentMousePosition = getEventPosition(event.sourceEvent, containerBounds);
        const x = currentMousePosition.x - mousePosition.x;
        const y = currentMousePosition.y - mousePosition.y;
        const distance2 = Math.sqrt(x * x + y * y);
        if (distance2 > nodeDragThreshold) {
          startDrag(event);
        }
      }
      if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems && dragStarted) {
        mousePosition = getEventPosition(event.sourceEvent, containerBounds);
        updateNodes(pointerPos);
      }
    }).on("end", (event) => {
      if (!dragStarted || abortDrag) {
        if (abortDrag && dragItems.size > 0) {
          getStoreItems().updateNodePositions(dragItems, false);
        }
        return;
      }
      autoPanStarted = false;
      dragStarted = false;
      cancelAnimationFrame(autoPanId);
      if (dragItems.size > 0) {
        const { nodeLookup, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStoreItems();
        if (nodePositionsChanged) {
          updateNodePositions(dragItems, false);
          nodePositionsChanged = false;
        }
        if (onDragStop || onNodeDragStop || !nodeId && onSelectionDragStop) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodeLookup,
            dragging: false
          });
          onDragStop?.(event.sourceEvent, dragItems, currentNode, currentNodes);
          onNodeDragStop?.(event.sourceEvent, currentNode, currentNodes);
          if (!nodeId) {
            onSelectionDragStop?.(event.sourceEvent, currentNodes);
          }
        }
      }
    }).filter((event) => {
      const target = event.target;
      const isDraggable = !event.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, domNode)) && (!handleSelector || hasSelector(target, handleSelector, domNode));
      return isDraggable;
    });
    d3Selection.call(d3DragInstance);
  }
  function destroy() {
    d3Selection?.on(".drag", null);
  }
  return {
    update,
    destroy
  };
}
function getNodesWithinDistance(position, nodeLookup, distance2) {
  const nodes = [];
  const rect = {
    x: position.x - distance2,
    y: position.y - distance2,
    width: distance2 * 2,
    height: distance2 * 2
  };
  for (const node of nodeLookup.values()) {
    if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
      nodes.push(node);
    }
  }
  return nodes;
}
var ADDITIONAL_DISTANCE = 250;
function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
  let closestHandles = [];
  let minDistance = Infinity;
  const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
  for (const node of closeNodes) {
    const allHandles = [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
    for (const handle of allHandles) {
      if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
        continue;
      }
      const { x, y } = getHandlePosition(node, handle, handle.position, true);
      const distance2 = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
      if (distance2 > connectionRadius) {
        continue;
      }
      if (distance2 < minDistance) {
        closestHandles = [{ ...handle, x, y }];
        minDistance = distance2;
      } else if (distance2 === minDistance) {
        closestHandles.push({ ...handle, x, y });
      }
    }
  }
  if (!closestHandles.length) {
    return null;
  }
  if (closestHandles.length > 1) {
    const oppositeHandleType = fromHandle.type === "source" ? "target" : "source";
    return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
  }
  return closestHandles[0];
}
function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    return null;
  }
  const handles = connectionMode === "strict" ? node.internals.handleBounds?.[handleType] : [...node.internals.handleBounds?.source ?? [], ...node.internals.handleBounds?.target ?? []];
  const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;
  return handle && withAbsolutePosition ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) } : handle;
}
function getHandleType(edgeUpdaterType, handleDomNode) {
  if (edgeUpdaterType) {
    return edgeUpdaterType;
  } else if (handleDomNode?.classList.contains("target")) {
    return "target";
  } else if (handleDomNode?.classList.contains("source")) {
    return "source";
  }
  return null;
}
function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
  let isValid = null;
  if (isHandleValid) {
    isValid = true;
  } else if (isInsideConnectionRadius && !isHandleValid) {
    isValid = false;
  }
  return isValid;
}
var alwaysValid = () => true;
function onPointerDown(event, { connectionMode, connectionRadius, handleId, nodeId, edgeUpdaterType, isTarget, domNode, nodeLookup, lib, autoPanOnConnect, flowId, panBy: panBy2, cancelConnection, onConnectStart, onConnect, onConnectEnd, isValidConnection = alwaysValid, onReconnectEnd, updateConnection, getTransform, getFromHandle, autoPanSpeed, dragThreshold = 1, handleDomNode }) {
  const doc = getHostForElement(event.target);
  let autoPanId = 0;
  let closestHandle;
  const { x, y } = getEventPosition(event);
  const handleType = getHandleType(edgeUpdaterType, handleDomNode);
  const containerBounds = domNode?.getBoundingClientRect();
  let connectionStarted = false;
  if (!containerBounds || !handleType) {
    return;
  }
  const fromHandleInternal = getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode);
  if (!fromHandleInternal) {
    return;
  }
  let position = getEventPosition(event, containerBounds);
  let autoPanStarted = false;
  let connection = null;
  let isValid = false;
  let resultHandleDomNode = null;
  function autoPan() {
    if (!autoPanOnConnect || !containerBounds) {
      return;
    }
    const [x2, y2] = calcAutoPan(position, containerBounds, autoPanSpeed);
    panBy2({ x: x2, y: y2 });
    autoPanId = requestAnimationFrame(autoPan);
  }
  const fromHandle = {
    ...fromHandleInternal,
    nodeId,
    type: handleType,
    position: fromHandleInternal.position
  };
  const fromInternalNode = nodeLookup.get(nodeId);
  const from = getHandlePosition(fromInternalNode, fromHandle, Position.Left, true);
  let previousConnection = {
    inProgress: true,
    isValid: null,
    from,
    fromHandle,
    fromPosition: fromHandle.position,
    fromNode: fromInternalNode,
    to: position,
    toHandle: null,
    toPosition: oppositePosition[fromHandle.position],
    toNode: null,
    pointer: position
  };
  function startConnection() {
    connectionStarted = true;
    updateConnection(previousConnection);
    onConnectStart?.(event, { nodeId, handleId, handleType });
  }
  if (dragThreshold === 0) {
    startConnection();
  }
  function onPointerMove(event2) {
    if (!connectionStarted) {
      const { x: evtX, y: evtY } = getEventPosition(event2);
      const dx = evtX - x;
      const dy = evtY - y;
      const nextConnectionStarted = dx * dx + dy * dy > dragThreshold * dragThreshold;
      if (!nextConnectionStarted) {
        return;
      }
      startConnection();
    }
    if (!getFromHandle() || !fromHandle) {
      onPointerUp(event2);
      return;
    }
    const transform2 = getTransform();
    position = getEventPosition(event2, containerBounds);
    closestHandle = getClosestHandle(pointToRendererPoint(position, transform2, false, [1, 1]), connectionRadius, nodeLookup, fromHandle);
    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }
    const result = isValidHandle(event2, {
      handle: closestHandle,
      connectionMode,
      fromNodeId: nodeId,
      fromHandleId: handleId,
      fromType: isTarget ? "target" : "source",
      isValidConnection,
      doc,
      lib,
      flowId,
      nodeLookup
    });
    resultHandleDomNode = result.handleDomNode;
    connection = result.connection;
    isValid = isConnectionValid(!!closestHandle, result.isValid);
    const fromInternalNode2 = nodeLookup.get(nodeId);
    const from2 = fromInternalNode2 ? getHandlePosition(fromInternalNode2, fromHandle, Position.Left, true) : previousConnection.from;
    const newConnection = {
      ...previousConnection,
      from: from2,
      isValid,
      to: result.toHandle && isValid ? rendererPointToPoint({ x: result.toHandle.x, y: result.toHandle.y }, transform2) : position,
      toHandle: result.toHandle,
      toPosition: isValid && result.toHandle ? result.toHandle.position : oppositePosition[fromHandle.position],
      toNode: result.toHandle ? nodeLookup.get(result.toHandle.nodeId) : null,
      pointer: position
    };
    updateConnection(newConnection);
    previousConnection = newConnection;
  }
  function onPointerUp(event2) {
    if ("touches" in event2 && event2.touches.length > 0) {
      return;
    }
    if (connectionStarted) {
      if ((closestHandle || resultHandleDomNode) && connection && isValid) {
        onConnect?.(connection);
      }
      const { inProgress, ...connectionState } = previousConnection;
      const finalConnectionState = {
        ...connectionState,
        toPosition: previousConnection.toHandle ? previousConnection.toPosition : null
      };
      onConnectEnd?.(event2, finalConnectionState);
      if (edgeUpdaterType) {
        onReconnectEnd?.(event2, finalConnectionState);
      }
    }
    cancelConnection();
    cancelAnimationFrame(autoPanId);
    autoPanStarted = false;
    isValid = false;
    connection = null;
    resultHandleDomNode = null;
    doc.removeEventListener("mousemove", onPointerMove);
    doc.removeEventListener("mouseup", onPointerUp);
    doc.removeEventListener("touchmove", onPointerMove);
    doc.removeEventListener("touchend", onPointerUp);
  }
  doc.addEventListener("mousemove", onPointerMove);
  doc.addEventListener("mouseup", onPointerUp);
  doc.addEventListener("touchmove", onPointerMove);
  doc.addEventListener("touchend", onPointerUp);
}
function isValidHandle(event, { handle, connectionMode, fromNodeId, fromHandleId, fromType, doc, lib, flowId, isValidConnection = alwaysValid, nodeLookup }) {
  const isTarget = fromType === "target";
  const handleDomNode = handle ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle?.nodeId}-${handle?.id}-${handle?.type}"]`) : null;
  const { x, y } = getEventPosition(event);
  const handleBelow = doc.elementFromPoint(x, y);
  const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;
  const result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: null,
    toHandle: null
  };
  if (handleToCheck) {
    const handleType = getHandleType(void 0, handleToCheck);
    const handleNodeId = handleToCheck.getAttribute("data-nodeid");
    const handleId = handleToCheck.getAttribute("data-handleid");
    const connectable = handleToCheck.classList.contains("connectable");
    const connectableEnd = handleToCheck.classList.contains("connectableend");
    if (!handleNodeId || !handleType) {
      return result;
    }
    const connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId
    };
    result.connection = connection;
    const isConnectable = connectable && connectableEnd;
    const isValid = isConnectable && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId);
    result.isValid = isValid && isValidConnection(connection);
    result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
  }
  return result;
}
var XYHandle = {
  onPointerDown,
  isValid: isValidHandle
};
function XYMinimap({ domNode, panZoom, getTransform, getViewScale }) {
  const selection2 = select(domNode);
  function update({ translateExtent, width, height, zoomStep = 1, pannable = true, zoomable = true, inversePan = false }) {
    const zoomHandler = (event) => {
      if (event.sourceEvent.type !== "wheel" || !panZoom) {
        return;
      }
      const transform2 = getTransform();
      const factor = event.sourceEvent.ctrlKey && isMacOs() ? 10 : 1;
      const pinchDelta = -event.sourceEvent.deltaY * (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 2e-3) * zoomStep;
      const nextZoom = transform2[2] * Math.pow(2, pinchDelta * factor);
      panZoom.scaleTo(nextZoom);
    };
    let panStart = [0, 0];
    const panStartHandler = (event) => {
      if (event.sourceEvent.type === "mousedown" || event.sourceEvent.type === "touchstart") {
        panStart = [
          event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
          event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY
        ];
      }
    };
    const panHandler = (event) => {
      const transform2 = getTransform();
      if (event.sourceEvent.type !== "mousemove" && event.sourceEvent.type !== "touchmove" || !panZoom) {
        return;
      }
      const panCurrent = [
        event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
        event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY
      ];
      const panDelta = [panCurrent[0] - panStart[0], panCurrent[1] - panStart[1]];
      panStart = panCurrent;
      const moveScale = getViewScale() * Math.max(transform2[2], Math.log(transform2[2])) * (inversePan ? -1 : 1);
      const position = {
        x: transform2[0] - panDelta[0] * moveScale,
        y: transform2[1] - panDelta[1] * moveScale
      };
      const extent = [
        [0, 0],
        [width, height]
      ];
      panZoom.setViewportConstrained({
        x: position.x,
        y: position.y,
        zoom: transform2[2]
      }, extent, translateExtent);
    };
    const zoomAndPanHandler = zoom2().on("start", panStartHandler).on("zoom", pannable ? panHandler : null).on("zoom.wheel", zoomable ? zoomHandler : null);
    selection2.call(zoomAndPanHandler, {});
  }
  function destroy() {
    selection2.on("zoom", null);
  }
  return {
    update,
    destroy,
    pointer
  };
}
var transformToViewport = (transform2) => ({
  x: transform2.x,
  y: transform2.y,
  zoom: transform2.k
});
var viewportToTransform = ({ x, y, zoom: zoom3 }) => identity2.translate(x, y).scale(zoom3);
var isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
var isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
var defaultEase = (t4) => ((t4 *= 2) <= 1 ? t4 * t4 * t4 : (t4 -= 2) * t4 * t4 + 2) / 2;
var getD3Transition = (selection2, duration = 0, ease = defaultEase, onEnd = () => {
}) => {
  const hasDuration = typeof duration === "number" && duration > 0;
  if (!hasDuration) {
    onEnd();
  }
  return hasDuration ? selection2.transition().duration(duration).ease(ease).on("end", onEnd) : selection2;
};
var wheelDelta = (event) => {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * factor;
};
function createPanOnScrollHandler({ zoomPanValues, noWheelClassName, d3Selection, d3Zoom, panOnScrollMode, panOnScrollSpeed, zoomOnPinch, onPanZoomStart, onPanZoom, onPanZoomEnd }) {
  return (event) => {
    if (isWrappedWithClass(event, noWheelClassName)) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    const currentZoom = d3Selection.property("__zoom").k || 1;
    if (event.ctrlKey && zoomOnPinch) {
      const point = pointer(event);
      const pinchDelta = wheelDelta(event);
      const zoom3 = currentZoom * Math.pow(2, pinchDelta);
      d3Zoom.scaleTo(d3Selection, zoom3, point, event);
      return;
    }
    const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
    let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
    let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
    if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
      deltaX = event.deltaY * deltaNormalize;
      deltaY = 0;
    }
    d3Zoom.translateBy(
      d3Selection,
      -(deltaX / currentZoom) * panOnScrollSpeed,
      -(deltaY / currentZoom) * panOnScrollSpeed,
      // @ts-ignore
      { internal: true }
    );
    const nextViewport = transformToViewport(d3Selection.property("__zoom"));
    clearTimeout(zoomPanValues.panScrollTimeout);
    if (!zoomPanValues.isPanScrolling) {
      zoomPanValues.isPanScrolling = true;
      onPanZoomStart?.(event, nextViewport);
    } else {
      onPanZoom?.(event, nextViewport);
    }
    zoomPanValues.panScrollTimeout = setTimeout(() => {
      onPanZoomEnd?.(event, nextViewport);
      zoomPanValues.isPanScrolling = false;
    }, 150);
  };
}
function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }) {
  return function(event, d) {
    const isWheel = event.type === "wheel";
    const preventZoom = !preventScrolling && isWheel && !event.ctrlKey;
    const hasNoWheelClass = isWrappedWithClass(event, noWheelClassName);
    if (event.ctrlKey && isWheel && hasNoWheelClass) {
      event.preventDefault();
    }
    if (preventZoom || hasNoWheelClass) {
      return null;
    }
    event.preventDefault();
    d3ZoomHandler.call(this, event, d);
  };
}
function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }) {
  return (event) => {
    if (event.sourceEvent?.internal) {
      return;
    }
    const viewport = transformToViewport(event.transform);
    zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
    zoomPanValues.isZoomingOrPanning = true;
    zoomPanValues.prevViewport = viewport;
    if (event.sourceEvent?.type === "mousedown") {
      onDraggingChange(true);
    }
    if (onPanZoomStart) {
      onPanZoomStart?.(event.sourceEvent, viewport);
    }
  };
}
function createPanZoomHandler({ zoomPanValues, panOnDrag, onPaneContextMenu, onTransformChange, onPanZoom }) {
  return (event) => {
    zoomPanValues.usedRightMouseButton = !!(onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0));
    if (!event.sourceEvent?.sync) {
      onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
    }
    if (onPanZoom && !event.sourceEvent?.internal) {
      onPanZoom?.(event.sourceEvent, transformToViewport(event.transform));
    }
  };
}
function createPanZoomEndHandler({ zoomPanValues, panOnDrag, panOnScroll, onDraggingChange, onPanZoomEnd, onPaneContextMenu }) {
  return (event) => {
    if (event.sourceEvent?.internal) {
      return;
    }
    zoomPanValues.isZoomingOrPanning = false;
    if (onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) && !zoomPanValues.usedRightMouseButton && event.sourceEvent) {
      onPaneContextMenu(event.sourceEvent);
    }
    zoomPanValues.usedRightMouseButton = false;
    onDraggingChange(false);
    if (onPanZoomEnd) {
      const viewport = transformToViewport(event.transform);
      zoomPanValues.prevViewport = viewport;
      clearTimeout(zoomPanValues.timerId);
      zoomPanValues.timerId = setTimeout(
        () => {
          onPanZoomEnd?.(event.sourceEvent, viewport);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        panOnScroll ? 150 : 0
      );
    }
  };
}
function createFilter({ panActivationKeyPressed, zoomActivationKeyPressed, zoomOnScroll, zoomOnPinch, panOnDrag, panOnScroll, zoomOnDoubleClick, userSelectionActive, noWheelClassName, noPanClassName, lib, connectionInProgress }) {
  return (event) => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event.ctrlKey;
    const isWheelEvent = event.type === "wheel";
    if (event.button === 1 && event.type === "mousedown" && (isWrappedWithClass(event, `${lib}-flow__node`) || isWrappedWithClass(event, `${lib}-flow__edge`) || isWrappedWithClass(event, `${lib}-flow__selection`) || isWrappedWithClass(event, `${lib}-flow__nodesselection`))) {
      return true;
    }
    if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
      return false;
    }
    if (userSelectionActive) {
      return false;
    }
    if (connectionInProgress && !isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event, noWheelClassName) && isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event, noPanClassName) && (!isWheelEvent || panOnScroll && isWheelEvent && !zoomActivationKeyPressed)) {
      return false;
    }
    if (!zoomOnPinch && event.ctrlKey && isWheelEvent) {
      return false;
    }
    if (!zoomOnPinch && event.type === "touchstart" && event.touches?.length > 1) {
      event.preventDefault();
      return false;
    }
    if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
      return false;
    }
    if (!panOnDrag && (event.type === "mousedown" || event.type === "touchstart")) {
      return false;
    }
    if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === "mousedown") {
      return false;
    }
    const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event.button) || !event.button || event.button <= 1;
    return (!event.ctrlKey || isWheelEvent || panActivationKeyPressed) && buttonAllowed;
  };
}
function XYPanZoom({ domNode, minZoom, maxZoom, translateExtent, viewport, onPanZoom, onPanZoomStart, onPanZoomEnd, onDraggingChange }) {
  const zoomPanValues = {
    isZoomingOrPanning: false,
    usedRightMouseButton: false,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: false
  };
  const bbox = domNode.getBoundingClientRect();
  let cachedExtent = [
    [0, 0],
    [bbox.width, bbox.height]
  ];
  const extentResizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry?.contentRect) {
      cachedExtent = [
        [0, 0],
        [entry.contentRect.width, entry.contentRect.height]
      ];
    }
  }) : null;
  extentResizeObserver?.observe(domNode);
  const d3ZoomInstance = zoom2().extent(() => cachedExtent).scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
  const d3Selection = select(domNode).call(d3ZoomInstance);
  setViewportConstrained({
    x: viewport.x,
    y: viewport.y,
    zoom: clamp(viewport.zoom, minZoom, maxZoom)
  }, [
    [0, 0],
    [bbox.width, bbox.height]
  ], translateExtent);
  const d3ZoomHandler = d3Selection.on("wheel.zoom");
  const d3DblClickZoomHandler = d3Selection.on("dblclick.zoom");
  d3ZoomInstance.wheelDelta(wheelDelta);
  async function setTransform(transform2, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value : zoom).transform(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), transform2);
      });
    }
    return false;
  }
  function update({ noWheelClassName, noPanClassName, onPaneContextMenu, userSelectionActive, panOnScroll, panOnDrag, panOnScrollMode, panOnScrollSpeed, preventScrolling, zoomOnPinch, zoomOnScroll, zoomOnDoubleClick, panActivationKeyPressed = false, zoomActivationKeyPressed, lib, onTransformChange, connectionInProgress, paneClickDistance, selectionOnDrag }) {
    if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
      d3ZoomInstance.on("zoom", null);
    }
    const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;
    d3ZoomInstance.clickDistance(selectionOnDrag ? Infinity : !isNumeric(paneClickDistance) || paneClickDistance < 0 ? 0 : paneClickDistance);
    const wheelHandler = isPanOnScroll ? createPanOnScrollHandler({
      zoomPanValues,
      noWheelClassName,
      d3Selection,
      d3Zoom: d3ZoomInstance,
      panOnScrollMode,
      panOnScrollSpeed,
      zoomOnPinch,
      onPanZoomStart,
      onPanZoom,
      onPanZoomEnd
    }) : createZoomOnScrollHandler({
      noWheelClassName,
      preventScrolling,
      d3ZoomHandler
    });
    d3Selection.on("wheel.zoom", wheelHandler, { passive: false });
    const startHandler = createPanZoomStartHandler({
      zoomPanValues,
      onDraggingChange,
      onPanZoomStart
    });
    d3ZoomInstance.on("start", startHandler);
    const panZoomHandler = createPanZoomHandler({
      zoomPanValues,
      panOnDrag,
      onPaneContextMenu: !!onPaneContextMenu,
      onPanZoom,
      onTransformChange
    });
    d3ZoomInstance.on("zoom", panZoomHandler);
    const panZoomEndHandler = createPanZoomEndHandler({
      zoomPanValues,
      panOnDrag,
      panOnScroll,
      onPaneContextMenu,
      onPanZoomEnd,
      onDraggingChange
    });
    d3ZoomInstance.on("end", panZoomEndHandler);
    const filter2 = createFilter({
      panActivationKeyPressed,
      zoomActivationKeyPressed,
      panOnDrag,
      zoomOnScroll,
      panOnScroll,
      zoomOnDoubleClick,
      zoomOnPinch,
      userSelectionActive,
      noPanClassName,
      noWheelClassName,
      lib,
      connectionInProgress
    });
    d3ZoomInstance.filter(filter2);
    if (zoomOnDoubleClick) {
      d3Selection.on("dblclick.zoom", d3DblClickZoomHandler);
    } else {
      d3Selection.on("dblclick.zoom", null);
    }
  }
  function destroy() {
    d3ZoomInstance.on("zoom", null);
    extentResizeObserver?.disconnect();
  }
  async function setViewportConstrained(viewport2, extent, translateExtent2) {
    const nextTransform = viewportToTransform(viewport2);
    const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent2);
    if (contrainedTransform) {
      await setTransform(contrainedTransform);
    }
    return contrainedTransform;
  }
  async function setViewport(viewport2, options) {
    const nextTransform = viewportToTransform(viewport2);
    await setTransform(nextTransform, options);
    return nextTransform;
  }
  function syncViewport(viewport2) {
    if (d3Selection) {
      const nextTransform = viewportToTransform(viewport2);
      const currentTransform = d3Selection.property("__zoom");
      if (currentTransform.k !== viewport2.zoom || currentTransform.x !== viewport2.x || currentTransform.y !== viewport2.y) {
        d3ZoomInstance?.transform(d3Selection, nextTransform, null, { sync: true });
      }
    }
  }
  function getViewport() {
    const transform2 = d3Selection ? transform(d3Selection.node()) : { x: 0, y: 0, k: 1 };
    return { x: transform2.x, y: transform2.y, zoom: transform2.k };
  }
  async function scaleTo(zoom3, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value : zoom).scaleTo(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), zoom3);
      });
    }
    return false;
  }
  async function scaleBy(factor, options) {
    if (d3Selection) {
      return new Promise((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === "linear" ? value : zoom).scaleBy(getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)), factor);
      });
    }
    return false;
  }
  function setScaleExtent(scaleExtent) {
    d3ZoomInstance?.scaleExtent(scaleExtent);
  }
  function setTranslateExtent(translateExtent2) {
    d3ZoomInstance?.translateExtent(translateExtent2);
  }
  function setClickDistance(distance2) {
    const validDistance = !isNumeric(distance2) || distance2 < 0 ? 0 : distance2;
    d3ZoomInstance?.clickDistance(validDistance);
  }
  return {
    update,
    destroy,
    setViewport,
    setViewportConstrained,
    getViewport,
    scaleTo,
    scaleBy,
    setScaleExtent,
    setTranslateExtent,
    syncViewport,
    setClickDistance
  };
}
var ResizeControlVariant;
(function(ResizeControlVariant2) {
  ResizeControlVariant2["Line"] = "line";
  ResizeControlVariant2["Handle"] = "handle";
})(ResizeControlVariant || (ResizeControlVariant = {}));
function getResizeDirection({ width, prevWidth, height, prevHeight, affectsX, affectsY }) {
  const deltaWidth = width - prevWidth;
  const deltaHeight = height - prevHeight;
  const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];
  if (deltaWidth && affectsX) {
    direction[0] = direction[0] * -1;
  }
  if (deltaHeight && affectsY) {
    direction[1] = direction[1] * -1;
  }
  return direction;
}
function getControlDirection(controlPosition) {
  const isHorizontal = controlPosition.includes("right") || controlPosition.includes("left");
  const isVertical = controlPosition.includes("bottom") || controlPosition.includes("top");
  const affectsX = controlPosition.includes("left");
  const affectsY = controlPosition.includes("top");
  return {
    isHorizontal,
    isVertical,
    affectsX,
    affectsY
  };
}
function getLowerExtentClamp(lowerExtent, lowerBound) {
  return Math.max(0, lowerBound - lowerExtent);
}
function getUpperExtentClamp(upperExtent, upperBound) {
  return Math.max(0, upperExtent - upperBound);
}
function getSizeClamp(size, minSize, maxSize) {
  return Math.max(0, minSize - size, size - maxSize);
}
function xor(a, b) {
  return a ? !b : b;
}
function getDimensionsAfterResize(startValues, controlDirection, pointerPosition, boundaries, keepAspectRatio, nodeOrigin, extent, childExtent) {
  let { affectsX, affectsY } = controlDirection;
  const { isHorizontal, isVertical } = controlDirection;
  const isDiagonal = isHorizontal && isVertical;
  const { xSnapped, ySnapped } = pointerPosition;
  const { minWidth, maxWidth, minHeight, maxHeight } = boundaries;
  const { x: startX, y: startY, width: startWidth, height: startHeight, aspectRatio } = startValues;
  let distX = Math.floor(isHorizontal ? xSnapped - startValues.pointerX : 0);
  let distY = Math.floor(isVertical ? ySnapped - startValues.pointerY : 0);
  const newWidth = startWidth + (affectsX ? -distX : distX);
  const newHeight = startHeight + (affectsY ? -distY : distY);
  const originOffsetX = -nodeOrigin[0] * startWidth;
  const originOffsetY = -nodeOrigin[1] * startHeight;
  let clampX = getSizeClamp(newWidth, minWidth, maxWidth);
  let clampY = getSizeClamp(newHeight, minHeight, maxHeight);
  if (extent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + distX + originOffsetX, extent[0][0]);
    } else if (!affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + newWidth + originOffsetX, extent[1][0]);
    }
    if (affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + distY + originOffsetY, extent[0][1]);
    } else if (!affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + newHeight + originOffsetY, extent[1][1]);
    }
    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }
  if (childExtent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + distX, childExtent[0][0]);
    } else if (!affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + newWidth, childExtent[1][0]);
    }
    if (affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + distY, childExtent[0][1]);
    } else if (!affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + newHeight, childExtent[1][1]);
    }
    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }
  if (keepAspectRatio) {
    if (isHorizontal) {
      const aspectHeightClamp = getSizeClamp(newWidth / aspectRatio, minHeight, maxHeight) * aspectRatio;
      clampX = Math.max(clampX, aspectHeightClamp);
      if (extent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
          aspectExtentClamp = getUpperExtentClamp(startY + originOffsetY + newWidth / aspectRatio, extent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp = getLowerExtentClamp(startY + originOffsetY + (affectsX ? distX : -distX) / aspectRatio, extent[0][1]) * aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }
      if (childExtent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsX && !affectsY && isDiagonal) {
          aspectExtentClamp = getLowerExtentClamp(startY + newWidth / aspectRatio, childExtent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp = getUpperExtentClamp(startY + (affectsX ? distX : -distX) / aspectRatio, childExtent[0][1]) * aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }
    }
    if (isVertical) {
      const aspectWidthClamp = getSizeClamp(newHeight * aspectRatio, minWidth, maxWidth) / aspectRatio;
      clampY = Math.max(clampY, aspectWidthClamp);
      if (extent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
          aspectExtentClamp = getUpperExtentClamp(startX + newHeight * aspectRatio + originOffsetX, extent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp = getLowerExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio + originOffsetX, extent[0][0]) / aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }
      if (childExtent) {
        let aspectExtentClamp = 0;
        if (!affectsX && !affectsY || affectsY && !affectsX && isDiagonal) {
          aspectExtentClamp = getLowerExtentClamp(startX + newHeight * aspectRatio, childExtent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp = getUpperExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio, childExtent[0][0]) / aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }
    }
  }
  distY = distY + (distY < 0 ? clampY : -clampY);
  distX = distX + (distX < 0 ? clampX : -clampX);
  if (keepAspectRatio) {
    if (isDiagonal) {
      if (newWidth > newHeight * aspectRatio) {
        distY = (xor(affectsX, affectsY) ? -distX : distX) / aspectRatio;
      } else {
        distX = (xor(affectsX, affectsY) ? -distY : distY) * aspectRatio;
      }
    } else {
      if (isHorizontal) {
        distY = distX / aspectRatio;
        affectsY = affectsX;
      } else {
        distX = distY * aspectRatio;
        affectsX = affectsY;
      }
    }
  }
  const x = affectsX ? startX + distX : startX;
  const y = affectsY ? startY + distY : startY;
  return {
    width: startWidth + (affectsX ? -distX : distX),
    height: startHeight + (affectsY ? -distY : distY),
    x: nodeOrigin[0] * distX * (!affectsX ? 1 : -1) + x,
    y: nodeOrigin[1] * distY * (!affectsY ? 1 : -1) + y
  };
}
var initPrevValues = { width: 0, height: 0, x: 0, y: 0 };
var initStartValues = {
  ...initPrevValues,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function nodeToChildExtent(child, parent, nodeOrigin) {
  const x = parent.position.x + child.position.x;
  const y = parent.position.y + child.position.y;
  const width = child.measured.width ?? 0;
  const height = child.measured.height ?? 0;
  const originOffsetX = nodeOrigin[0] * width;
  const originOffsetY = nodeOrigin[1] * height;
  return [
    [x - originOffsetX, y - originOffsetY],
    [x + width - originOffsetX, y + height - originOffsetY]
  ];
}
function XYResizer({ domNode, nodeId, getStoreItems, onChange, onEnd }) {
  const selection2 = select(domNode);
  let params = {
    controlDirection: getControlDirection("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: false
  };
  function update({ controlPosition, boundaries, keepAspectRatio, resizeDirection, onResizeStart, onResize, onResizeEnd, shouldResize }) {
    let prevValues = { ...initPrevValues };
    let startValues = { ...initStartValues };
    params = {
      boundaries,
      resizeDirection,
      keepAspectRatio,
      controlDirection: getControlDirection(controlPosition)
    };
    let node = void 0;
    let containerBounds = null;
    let childNodes = [];
    let parentNode = void 0;
    let nodeExtent = void 0;
    let childExtent = void 0;
    const dragHandler = drag().on("start", (event) => {
      const { nodeLookup, transform: transform2, snapGrid, snapToGrid, nodeOrigin, paneDomNode } = getStoreItems();
      node = nodeLookup.get(nodeId);
      if (!node) {
        return;
      }
      containerBounds = paneDomNode?.getBoundingClientRect() ?? null;
      const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, {
        transform: transform2,
        snapGrid,
        snapToGrid,
        containerBounds
      });
      prevValues = {
        width: node.measured.width ?? 0,
        height: node.measured.height ?? 0,
        x: node.position.x ?? 0,
        y: node.position.y ?? 0
      };
      startValues = {
        ...prevValues,
        pointerX: xSnapped,
        pointerY: ySnapped,
        aspectRatio: prevValues.width / prevValues.height
      };
      parentNode = void 0;
      nodeExtent = isCoordinateExtent(node.extent) ? node.extent : void 0;
      if (node.parentId && (node.extent === "parent" || node.expandParent)) {
        parentNode = nodeLookup.get(node.parentId);
      }
      if (parentNode && node.extent === "parent") {
        nodeExtent = [
          [0, 0],
          [parentNode.measured.width, parentNode.measured.height]
        ];
      }
      childNodes = [];
      childExtent = void 0;
      for (const [childId, child] of nodeLookup) {
        if (child.parentId === nodeId) {
          childNodes.push({
            id: childId,
            position: { ...child.position },
            extent: child.extent
          });
          if (child.extent === "parent" || child.expandParent) {
            const extent = nodeToChildExtent(child, node, child.origin ?? nodeOrigin);
            if (childExtent) {
              childExtent = [
                [Math.min(extent[0][0], childExtent[0][0]), Math.min(extent[0][1], childExtent[0][1])],
                [Math.max(extent[1][0], childExtent[1][0]), Math.max(extent[1][1], childExtent[1][1])]
              ];
            } else {
              childExtent = extent;
            }
          }
        }
      }
      onResizeStart?.(event, { ...prevValues });
    }).on("drag", (event) => {
      const { transform: transform2, snapGrid, snapToGrid, nodeOrigin: storeNodeOrigin } = getStoreItems();
      const pointerPosition = getPointerPosition(event.sourceEvent, {
        transform: transform2,
        snapGrid,
        snapToGrid,
        containerBounds
      });
      const childChanges = [];
      if (!node) {
        return;
      }
      const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;
      const change = {};
      const nodeOrigin = node.origin ?? storeNodeOrigin;
      const { width, height, x, y } = getDimensionsAfterResize(startValues, params.controlDirection, pointerPosition, params.boundaries, params.keepAspectRatio, nodeOrigin, nodeExtent, childExtent);
      const isWidthChange = width !== prevWidth;
      const isHeightChange = height !== prevHeight;
      const isXPosChange = x !== prevX && isWidthChange;
      const isYPosChange = y !== prevY && isHeightChange;
      if (!isXPosChange && !isYPosChange && !isWidthChange && !isHeightChange) {
        return;
      }
      const lastValid = {
        prevValues: { ...prevValues },
        startX: startValues.x,
        startY: startValues.y,
        childNodes: childNodes.map((child) => ({
          ...child,
          position: { ...child.position }
        }))
      };
      if (isXPosChange || isYPosChange || nodeOrigin[0] === 1 || nodeOrigin[1] === 1) {
        change.x = isXPosChange ? x : prevValues.x;
        change.y = isYPosChange ? y : prevValues.y;
        prevValues.x = change.x;
        prevValues.y = change.y;
        if (childNodes.length > 0) {
          const xChange = x - prevX;
          const yChange = y - prevY;
          for (const childNode of childNodes) {
            childNode.position = {
              x: childNode.position.x - xChange + nodeOrigin[0] * (width - prevWidth),
              y: childNode.position.y - yChange + nodeOrigin[1] * (height - prevHeight)
            };
            childChanges.push(childNode);
          }
        }
      }
      if (isWidthChange || isHeightChange) {
        change.width = isWidthChange && (!params.resizeDirection || params.resizeDirection === "horizontal") ? width : prevValues.width;
        change.height = isHeightChange && (!params.resizeDirection || params.resizeDirection === "vertical") ? height : prevValues.height;
        prevValues.width = change.width;
        prevValues.height = change.height;
      }
      if (parentNode && node.expandParent) {
        const xLimit = nodeOrigin[0] * (change.width ?? 0);
        if (change.x && change.x < xLimit) {
          prevValues.x = xLimit;
          startValues.x = startValues.x - (change.x - xLimit);
        }
        const yLimit = nodeOrigin[1] * (change.height ?? 0);
        if (change.y && change.y < yLimit) {
          prevValues.y = yLimit;
          startValues.y = startValues.y - (change.y - yLimit);
        }
      }
      const direction = getResizeDirection({
        width: prevValues.width,
        prevWidth,
        height: prevValues.height,
        prevHeight,
        affectsX: params.controlDirection.affectsX,
        affectsY: params.controlDirection.affectsY
      });
      const nextValues = { ...prevValues, direction };
      const callResize = shouldResize?.(event, nextValues);
      if (callResize === false) {
        prevValues = lastValid.prevValues;
        startValues.x = lastValid.startX;
        startValues.y = lastValid.startY;
        childNodes.forEach((child, i) => {
          child.position = lastValid.childNodes[i].position;
        });
        return;
      }
      onResize?.(event, nextValues);
      onChange(change, childChanges);
    }).on("end", (event) => {
      onResizeEnd?.(event, { ...prevValues });
      onEnd?.({ ...prevValues });
    });
    selection2.call(dragHandler);
  }
  function destroy() {
    selection2.on(".drag", null);
  }
  return {
    update,
    destroy
  };
}

// node_modules/zustand/esm/traditional.mjs
var import_react2 = __toESM(require("react"), 1);
var import_with_selector = __toESM(require_with_selector(), 1);

// node_modules/zustand/esm/vanilla.mjs
var import_meta = {};
var createStoreImpl = (createState) => {
  let state3;
  const listeners7 = /* @__PURE__ */ new Set();
  const setState2 = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state3) : partial;
    if (!Object.is(nextState, state3)) {
      const previousState = state3;
      state3 = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state3, nextState);
      listeners7.forEach((listener) => listener(state3, previousState));
    }
  };
  const getState = () => state3;
  const getInitialState2 = () => initialState;
  const subscribe3 = (listener) => {
    listeners7.add(listener);
    return () => listeners7.delete(listener);
  };
  const destroy = () => {
    if ((import_meta.env ? import_meta.env.MODE : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners7.clear();
  };
  const api = { setState: setState2, getState, getInitialState: getInitialState2, subscribe: subscribe3, destroy };
  const initialState = state3 = createState(setState2, getState, api);
  return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

// node_modules/zustand/esm/traditional.mjs
var { useDebugValue } = import_react2.default;
var { useSyncExternalStoreWithSelector } = import_with_selector.default;
var identity3 = (arg) => arg;
function useStoreWithEqualityFn(api, selector2 = identity3, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector2,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
var createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
  const api = createStore(createState);
  const useBoundStoreWithEqualityFn = (selector2, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector2, equalityFn);
  Object.assign(useBoundStoreWithEqualityFn, api);
  return useBoundStoreWithEqualityFn;
};
var createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;

// node_modules/zustand/esm/shallow.mjs
function shallow$1(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [key, value2] of objA) {
      if (!Object.is(value2, objB.get(key))) {
        return false;
      }
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const value2 of objA) {
      if (!objB.has(value2)) {
        return false;
      }
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (const keyA of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !Object.is(objA[keyA], objB[keyA])) {
      return false;
    }
  }
  return true;
}

// node_modules/@xyflow/react/dist/esm/index.js
var import_react_dom = require("react-dom");
var StoreContext = (0, import_react3.createContext)(null);
var Provider$1 = StoreContext.Provider;
var zustandErrorMessage = errorMessages["error001"]("react");
function useStore(selector2, equalityFn) {
  const store = (0, import_react3.useContext)(StoreContext);
  if (store === null) {
    throw new Error(zustandErrorMessage);
  }
  return useStoreWithEqualityFn(store, selector2, equalityFn);
}
function useStoreApi() {
  const store = (0, import_react3.useContext)(StoreContext);
  if (store === null) {
    throw new Error(zustandErrorMessage);
  }
  return (0, import_react3.useMemo)(() => ({
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe
  }), [store]);
}
var style = { display: "none" };
var ariaLiveStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
};
var ARIA_NODE_DESC_KEY = "react-flow__node-desc";
var ARIA_EDGE_DESC_KEY = "react-flow__edge-desc";
var ARIA_LIVE_MESSAGE = "react-flow__aria-live";
var ariaLiveSelector = (s) => s.ariaLiveMessage;
var ariaLabelConfigSelector = (s) => s.ariaLabelConfig;
function AriaLiveMessage({ rfId }) {
  const ariaLiveMessage = useStore(ariaLiveSelector);
  return (0, import_jsx_runtime4.jsx)("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle, children: ariaLiveMessage });
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
  const ariaLabelConfig = useStore(ariaLabelConfigSelector);
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(0, import_jsx_runtime4.jsx)("div", { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style, children: disableKeyboardA11y ? ariaLabelConfig["node.a11yDescription.default"] : ariaLabelConfig["node.a11yDescription.keyboardDisabled"] }), (0, import_jsx_runtime4.jsx)("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style, children: ariaLabelConfig["edge.a11yDescription.default"] }), !disableKeyboardA11y && (0, import_jsx_runtime4.jsx)(AriaLiveMessage, { rfId })] });
}
var Panel = (0, import_react3.forwardRef)(({ position = "top-left", children: children2, className, style: style2, ...rest }, ref) => {
  const positionClasses = `${position}`.split("-");
  return (0, import_jsx_runtime4.jsx)("div", { className: cc(["react-flow__panel", className, ...positionClasses]), style: style2, ref, ...rest, children: children2 });
});
Panel.displayName = "Panel";
var link = `https://reactflow.dev${true ? "?utm_source=attribution" : "/attribution"}`;
function Attribution({ proOptions, position = "bottom-right" }) {
  (0, import_react3.useEffect)(() => {
    if (true) {
      return;
    }
    handleAttributionWarning("react");
  }, []);
  if (proOptions?.hideAttribution) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)(Panel, { position, className: "react-flow__attribution", "data-message": `Please only hide this attribution when you are subscribed to React Flow Pro: ${link}`, children: (0, import_jsx_runtime4.jsx)("a", { href: link, target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
var selector$l = (s) => {
  const selectedNodes = [];
  const selectedEdges = [];
  for (const [, node] of s.nodeLookup) {
    if (node.selected) {
      selectedNodes.push(node.internals.userNode);
    }
  }
  for (const [, edge] of s.edgeLookup) {
    if (edge.selected) {
      selectedEdges.push(edge);
    }
  }
  return { selectedNodes, selectedEdges };
};
var selectId = (obj) => obj.id;
function areEqual$1(a, b) {
  return shallow$1(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) && shallow$1(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId));
}
function SelectionListenerInner({ onSelectionChange }) {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore(selector$l, areEqual$1);
  (0, import_react3.useEffect)(() => {
    const params = { nodes: selectedNodes, edges: selectedEdges };
    onSelectionChange?.(params);
    store.getState().onSelectionChangeHandlers.forEach((fn) => fn(params));
  }, [selectedNodes, selectedEdges, onSelectionChange]);
  return null;
}
var changeSelector = (s) => !!s.onSelectionChangeHandlers;
function SelectionListener({ onSelectionChange }) {
  const storeHasSelectionChangeHandlers = useStore(changeSelector);
  if (onSelectionChange || storeHasSelectionChangeHandlers) {
    return (0, import_jsx_runtime4.jsx)(SelectionListenerInner, { onSelectionChange });
  }
  return null;
}
var defaultNodeOrigin = [0, 0];
var defaultViewport = { x: 0, y: 0, zoom: 1 };
var reactFlowFieldsToTrack = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig",
  "zIndexMode"
];
var fieldsToTrack = [...reactFlowFieldsToTrack, "rfId"];
var selector$k = (s) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges
});
var initPrevValues2 = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: infiniteExtent,
  nodeOrigin: defaultNodeOrigin,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: true,
  noPanClassName: "nopan",
  rfId: "1"
};
function StoreUpdater(props) {
  const { setNodes, setEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset, setDefaultNodesAndEdges } = useStore(selector$k, shallow$1);
  const store = useStoreApi();
  (0, import_react3.useEffect)(() => {
    setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
    return () => {
      previousFields.current = initPrevValues2;
      reset();
    };
  }, []);
  const previousFields = (0, import_react3.useRef)(initPrevValues2);
  (0, import_react3.useEffect)(
    () => {
      for (const fieldName of fieldsToTrack) {
        const fieldValue = props[fieldName];
        const previousFieldValue = previousFields.current[fieldName];
        if (fieldValue === previousFieldValue)
          continue;
        if (typeof props[fieldName] === "undefined")
          continue;
        if (fieldName === "nodes")
          setNodes(fieldValue);
        else if (fieldName === "edges")
          setEdges(fieldValue);
        else if (fieldName === "minZoom")
          setMinZoom(fieldValue);
        else if (fieldName === "maxZoom")
          setMaxZoom(fieldValue);
        else if (fieldName === "translateExtent")
          setTranslateExtent(fieldValue);
        else if (fieldName === "nodeExtent")
          setNodeExtent(fieldValue);
        else if (fieldName === "ariaLabelConfig")
          store.setState({ ariaLabelConfig: mergeAriaLabelConfig(fieldValue) });
        else if (fieldName === "fitView")
          store.setState({ fitViewQueued: fieldValue });
        else if (fieldName === "fitViewOptions")
          store.setState({ fitViewOptions: fieldValue });
        else
          store.setState({ [fieldName]: fieldValue });
      }
      previousFields.current = props;
    },
    // Only re-run the effect if one of the fields we track changes
    fieldsToTrack.map((fieldName) => props[fieldName])
  );
  return null;
}
function getMediaQuery() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return null;
  }
  return window.matchMedia("(prefers-color-scheme: dark)");
}
function useColorModeClass(colorMode) {
  const [colorModeClass, setColorModeClass] = (0, import_react3.useState)(colorMode === "system" ? null : colorMode);
  (0, import_react3.useEffect)(() => {
    if (colorMode !== "system") {
      setColorModeClass(colorMode);
      return;
    }
    const mediaQuery = getMediaQuery();
    const updateColorModeClass = () => setColorModeClass(mediaQuery?.matches ? "dark" : "light");
    updateColorModeClass();
    mediaQuery?.addEventListener("change", updateColorModeClass);
    return () => {
      mediaQuery?.removeEventListener("change", updateColorModeClass);
    };
  }, [colorMode]);
  return colorModeClass !== null ? colorModeClass : getMediaQuery()?.matches ? "dark" : "light";
}
var defaultDoc = typeof document !== "undefined" ? document : null;
function useKeyPress(keyCode = null, options = { target: defaultDoc, actInsideInputWithModifier: true }) {
  const [keyPressed, setKeyPressed] = (0, import_react3.useState)(false);
  const modifierPressed = (0, import_react3.useRef)(false);
  const pressedKeys = (0, import_react3.useRef)(/* @__PURE__ */ new Set([]));
  const [keyCodes, keysToWatch] = (0, import_react3.useMemo)(() => {
    if (keyCode !== null) {
      const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      const keys = keyCodeArr.filter((kc) => typeof kc === "string").map((kc) => kc.replace(/\+/g, "\n").replace("\n\n", "\n+").split("\n"));
      const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
      return [keys, keysFlat];
    }
    return [[], []];
  }, [keyCode]);
  (0, import_react3.useEffect)(() => {
    const target = options?.target ?? defaultDoc;
    const actInsideInputWithModifier = options?.actInsideInputWithModifier ?? true;
    if (keyCode !== null) {
      const downHandler = (event) => {
        modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
        const preventAction = (!modifierPressed.current || modifierPressed.current && !actInsideInputWithModifier) && isInputDOMNode(event);
        if (preventAction) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        pressedKeys.current.add(event[keyOrCode]);
        if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
          const target2 = event.composedPath?.()?.[0] || event.target;
          const isInteractiveElement = target2?.nodeName === "BUTTON" || target2?.nodeName === "A";
          if (options.preventDefault !== false && (modifierPressed.current || !isInteractiveElement)) {
            event.preventDefault();
          }
          setKeyPressed(true);
        }
      };
      const upHandler = (event) => {
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
          setKeyPressed(false);
          pressedKeys.current.clear();
        } else {
          pressedKeys.current.delete(event[keyOrCode]);
        }
        if (event.key === "Meta") {
          pressedKeys.current.clear();
        }
        modifierPressed.current = false;
      };
      const resetHandler = () => {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };
      target?.addEventListener("keydown", downHandler);
      target?.addEventListener("keyup", upHandler);
      window.addEventListener("blur", resetHandler);
      window.addEventListener("contextmenu", resetHandler);
      return () => {
        target?.removeEventListener("keydown", downHandler);
        target?.removeEventListener("keyup", upHandler);
        window.removeEventListener("blur", resetHandler);
        window.removeEventListener("contextmenu", resetHandler);
      };
    }
  }, [keyCode, setKeyPressed]);
  return keyPressed;
}
function isMatchingKey(keyCodes, pressedKeys, isUp) {
  return keyCodes.filter((keys) => isUp || keys.length === pressedKeys.size).some((keys) => keys.every((k) => pressedKeys.has(k)));
}
function useKeyOrCode(eventCode, keysToWatch) {
  return keysToWatch.includes(eventCode) ? "code" : "key";
}
var useViewportHelper = () => {
  const store = useStoreApi();
  return (0, import_react3.useMemo)(() => {
    return {
      zoomIn: async (options) => {
        const { panZoom } = store.getState();
        return panZoom ? panZoom.scaleBy(1.2, options) : false;
      },
      zoomOut: async (options) => {
        const { panZoom } = store.getState();
        return panZoom ? panZoom.scaleBy(1 / 1.2, options) : false;
      },
      zoomTo: async (zoomLevel, options) => {
        const { panZoom } = store.getState();
        return panZoom ? panZoom.scaleTo(zoomLevel, options) : false;
      },
      getZoom: () => store.getState().transform[2],
      setViewport: async (viewport, options) => {
        const { transform: [tX, tY, tZoom], panZoom } = store.getState();
        if (!panZoom) {
          return false;
        }
        await panZoom.setViewport({
          x: viewport.x ?? tX,
          y: viewport.y ?? tY,
          zoom: viewport.zoom ?? tZoom
        }, options);
        return true;
      },
      getViewport: () => {
        const [x, y, zoom3] = store.getState().transform;
        return { x, y, zoom: zoom3 };
      },
      setCenter: async (x, y, options) => {
        return store.getState().setCenter(x, y, options);
      },
      fitBounds: async (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = store.getState();
        const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);
        if (!panZoom) {
          return false;
        }
        await panZoom.setViewport(viewport, {
          duration: options?.duration,
          ease: options?.ease,
          interpolate: options?.interpolate
        });
        return true;
      },
      screenToFlowPosition: (clientPosition, options = {}) => {
        const { transform: transform2, snapGrid, snapToGrid, domNode } = store.getState();
        if (!domNode) {
          return clientPosition;
        }
        const { x: domX, y: domY } = domNode.getBoundingClientRect();
        const correctedPosition = {
          x: clientPosition.x - domX,
          y: clientPosition.y - domY
        };
        const _snapGrid = options.snapGrid ?? snapGrid;
        const _snapToGrid = options.snapToGrid ?? snapToGrid;
        return pointToRendererPoint(correctedPosition, transform2, _snapToGrid, _snapGrid);
      },
      flowToScreenPosition: (flowPosition) => {
        const { transform: transform2, domNode } = store.getState();
        if (!domNode) {
          return flowPosition;
        }
        const { x: domX, y: domY } = domNode.getBoundingClientRect();
        const rendererPosition = rendererPointToPoint(flowPosition, transform2);
        return {
          x: rendererPosition.x + domX,
          y: rendererPosition.y + domY
        };
      }
    };
  }, []);
};
function applyChanges(changes, elements) {
  const updatedElements = [];
  const changesMap = /* @__PURE__ */ new Map();
  const addItemChanges = [];
  for (const change of changes) {
    if (change.type === "add") {
      addItemChanges.push(change);
      continue;
    } else if (change.type === "remove" || change.type === "replace") {
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);
      if (elementChanges) {
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }
  for (const element of elements) {
    const changes2 = changesMap.get(element.id);
    if (!changes2) {
      updatedElements.push(element);
      continue;
    }
    if (changes2[0].type === "remove") {
      continue;
    }
    if (changes2[0].type === "replace") {
      updatedElements.push({ ...changes2[0].item });
      continue;
    }
    const updatedElement = { ...element };
    for (const change of changes2) {
      applyChange(change, updatedElement);
    }
    updatedElements.push(updatedElement);
  }
  if (addItemChanges.length) {
    addItemChanges.forEach((change) => {
      if (change.index !== void 0) {
        updatedElements.splice(change.index, 0, { ...change.item });
      } else {
        updatedElements.push({ ...change.item });
      }
    });
  }
  return updatedElements;
}
function applyChange(change, element) {
  switch (change.type) {
    case "select": {
      element.selected = change.selected;
      break;
    }
    case "position": {
      if (typeof change.position !== "undefined") {
        element.position = change.position;
      }
      if (typeof change.dragging !== "undefined") {
        element.dragging = change.dragging;
      }
      break;
    }
    case "dimensions": {
      if (typeof change.dimensions !== "undefined") {
        element.measured = {
          ...change.dimensions
        };
        if (change.setAttributes) {
          if (change.setAttributes === true || change.setAttributes === "width") {
            element.width = change.dimensions.width;
          }
          if (change.setAttributes === true || change.setAttributes === "height") {
            element.height = change.dimensions.height;
          }
        }
      }
      if (typeof change.resizing === "boolean") {
        element.resizing = change.resizing;
      }
      break;
    }
  }
}
function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}
function createSelectionChange(id2, selected2) {
  return {
    id: id2,
    type: "select",
    selected: selected2
  };
}
function getSelectionChanges(items, selectedIds = /* @__PURE__ */ new Set()) {
  const changes = [];
  for (const [id2, item] of items) {
    const willBeSelected = selectedIds.has(id2);
    if (!(item.selected === void 0 && !willBeSelected) && item.selected !== willBeSelected) {
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }
  return changes;
}
function getElementsDiffChanges({ items = [], lookup }) {
  const changes = [];
  const itemsLookup = new Map(items.map((item) => [item.id, item]));
  for (const [index2, item] of items.entries()) {
    const lookupItem = lookup.get(item.id);
    const storeItem = lookupItem?.internals?.userNode ?? lookupItem;
    if (storeItem !== void 0 && storeItem !== item) {
      changes.push({ id: item.id, item, type: "replace" });
    }
    if (storeItem === void 0) {
      changes.push({ item, type: "add", index: index2 });
    }
  }
  for (const [id2] of lookup) {
    const nextNode = itemsLookup.get(id2);
    if (nextNode === void 0) {
      changes.push({ id: id2, type: "remove" });
    }
  }
  return changes;
}
function elementToRemoveChange(item) {
  return {
    id: item.id,
    type: "remove"
  };
}
var defaultOnError = createDevWarn("React Flow", "https://reactflow.dev/");
function addEdge2(edgeParams, edges, options = {}) {
  return addEdge(edgeParams, edges, {
    ...options,
    onError: options.onError ?? defaultOnError
  });
}
var isNode = (element) => isNodeBase(element);
var isEdge = (element) => isEdgeBase(element);
function fixedForwardRef(render) {
  return (0, import_react3.forwardRef)(render);
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react3.useLayoutEffect : import_react3.useEffect;
function useQueue(runQueue) {
  const [serial, setSerial] = (0, import_react3.useState)(BigInt(0));
  const [queue] = (0, import_react3.useState)(() => createQueue(() => setSerial((n) => n + BigInt(1))));
  useIsomorphicLayoutEffect(() => {
    const queueItems = queue.get();
    if (queueItems.length) {
      runQueue(queueItems);
      queue.reset();
    }
  }, [serial]);
  return queue;
}
function createQueue(cb) {
  let queue = [];
  return {
    get: () => queue,
    reset: () => {
      queue = [];
    },
    push: (item) => {
      queue.push(item);
      cb();
    }
  };
}
var BatchContext = (0, import_react3.createContext)(null);
function BatchProvider({ children: children2 }) {
  const store = useStoreApi();
  const nodeQueueHandler = (0, import_react3.useCallback)((queueItems) => {
    const { nodes = [], setNodes, hasDefaultNodes, onNodesChange, nodeLookup, fitViewQueued, onNodesChangeMiddlewareMap } = store.getState();
    let next = nodes;
    for (const payload of queueItems) {
      next = typeof payload === "function" ? payload(next) : payload;
    }
    let changes = getElementsDiffChanges({
      items: next,
      lookup: nodeLookup
    });
    for (const middleware of onNodesChangeMiddlewareMap.values()) {
      changes = middleware(changes);
    }
    if (hasDefaultNodes) {
      setNodes(next);
    }
    if (changes.length > 0) {
      onNodesChange?.(changes);
    } else if (fitViewQueued) {
      window.requestAnimationFrame(() => {
        const { fitViewQueued: fitViewQueued2, nodes: nodes2, setNodes: setNodes2 } = store.getState();
        if (fitViewQueued2) {
          setNodes2(nodes2);
        }
      });
    }
  }, []);
  const nodeQueue = useQueue(nodeQueueHandler);
  const edgeQueueHandler = (0, import_react3.useCallback)((queueItems) => {
    const { edges = [], setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();
    let next = edges;
    for (const payload of queueItems) {
      next = typeof payload === "function" ? payload(next) : payload;
    }
    if (hasDefaultEdges) {
      setEdges(next);
    } else if (onEdgesChange) {
      onEdgesChange(getElementsDiffChanges({
        items: next,
        lookup: edgeLookup
      }));
    }
  }, []);
  const edgeQueue = useQueue(edgeQueueHandler);
  const value2 = (0, import_react3.useMemo)(() => ({ nodeQueue, edgeQueue }), []);
  return (0, import_jsx_runtime4.jsx)(BatchContext.Provider, { value: value2, children: children2 });
}
function useBatchContext() {
  const batchContext = (0, import_react3.useContext)(BatchContext);
  if (!batchContext) {
    throw new Error("useBatchContext must be used within a BatchProvider");
  }
  return batchContext;
}
var selector$j = (s) => !!s.panZoom;
function useReactFlow() {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();
  const batchContext = useBatchContext();
  const viewportInitialized = useStore(selector$j);
  const generalHelper = (0, import_react3.useMemo)(() => {
    const getInternalNode = (id2) => store.getState().nodeLookup.get(id2);
    const setNodes = (payload) => {
      batchContext.nodeQueue.push(payload);
    };
    const setEdges = (payload) => {
      batchContext.edgeQueue.push(payload);
    };
    const getNodeRect = (node) => {
      const { nodeLookup, nodeOrigin } = store.getState();
      const nodeToUse = isNode(node) ? node : nodeLookup.get(node.id);
      const position = nodeToUse.parentId ? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.measured, nodeToUse.parentId, nodeLookup, nodeOrigin) : nodeToUse.position;
      const nodeWithPosition = {
        ...nodeToUse,
        position,
        width: nodeToUse.measured?.width ?? nodeToUse.width,
        height: nodeToUse.measured?.height ?? nodeToUse.height
      };
      return nodeToRect(nodeWithPosition, nodeToUse.parentId ? void 0 : nodeOrigin);
    };
    const updateNode = (id2, nodeUpdate, options = { replace: false }) => {
      setNodes((prevNodes) => prevNodes.map((node) => {
        if (node.id === id2) {
          const nextNode = typeof nodeUpdate === "function" ? nodeUpdate(node) : nodeUpdate;
          return options.replace && isNode(nextNode) ? nextNode : { ...node, ...nextNode };
        }
        return node;
      }));
    };
    const updateEdge = (id2, edgeUpdate, options = { replace: false }) => {
      setEdges((prevEdges) => prevEdges.map((edge) => {
        if (edge.id === id2) {
          const nextEdge = typeof edgeUpdate === "function" ? edgeUpdate(edge) : edgeUpdate;
          return options.replace && isEdge(nextEdge) ? nextEdge : { ...edge, ...nextEdge };
        }
        return edge;
      }));
    };
    return {
      getNodes: () => store.getState().nodes.map((n) => ({ ...n })),
      getNode: (id2) => getInternalNode(id2)?.internals.userNode,
      getInternalNode,
      getEdges: () => {
        const { edges = [] } = store.getState();
        return edges.map((e) => ({ ...e }));
      },
      getEdge: (id2) => store.getState().edgeLookup.get(id2),
      setNodes,
      setEdges,
      addNodes: (payload) => {
        const newNodes = Array.isArray(payload) ? payload : [payload];
        batchContext.nodeQueue.push((nodes) => [...nodes, ...newNodes]);
      },
      addEdges: (payload) => {
        const newEdges = Array.isArray(payload) ? payload : [payload];
        batchContext.edgeQueue.push((edges) => [...edges, ...newEdges]);
      },
      toObject: () => {
        const { nodes = [], edges = [], transform: transform2 } = store.getState();
        const [x, y, zoom3] = transform2;
        return {
          nodes: nodes.map((n) => ({ ...n })),
          edges: edges.map((e) => ({ ...e })),
          viewport: {
            x,
            y,
            zoom: zoom3
          }
        };
      },
      deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
        const { nodes, edges, onNodesDelete, onEdgesDelete, triggerNodeChanges, triggerEdgeChanges, onDelete, onBeforeDelete } = store.getState();
        const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
          nodesToRemove,
          edgesToRemove,
          nodes,
          edges,
          onBeforeDelete
        });
        const hasMatchingEdges = matchingEdges.length > 0;
        const hasMatchingNodes = matchingNodes.length > 0;
        if (hasMatchingEdges) {
          const edgeChanges = matchingEdges.map(elementToRemoveChange);
          onEdgesDelete?.(matchingEdges);
          triggerEdgeChanges(edgeChanges);
        }
        if (hasMatchingNodes) {
          const nodeChanges = matchingNodes.map(elementToRemoveChange);
          onNodesDelete?.(matchingNodes);
          triggerNodeChanges(nodeChanges);
        }
        if (hasMatchingNodes || hasMatchingEdges) {
          onDelete?.({ nodes: matchingNodes, edges: matchingEdges });
        }
        return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (nodeOrRect, partially = true, nodes) => {
        const isRect = isRectObject(nodeOrRect);
        const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
        const hasNodesOption = nodes !== void 0;
        if (!nodeRect) {
          return [];
        }
        const { nodeOrigin } = store.getState();
        return (nodes || store.getState().nodes).filter((n) => {
          const internalNode = store.getState().nodeLookup.get(n.id);
          if (internalNode && !isRect && (n.id === nodeOrRect.id || !internalNode.internals.positionAbsolute)) {
            return false;
          }
          const currNodeRect = nodeToRect(hasNodesOption ? n : internalNode, nodeOrigin);
          const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
          const partiallyVisible = partially && overlappingArea > 0;
          return partiallyVisible || overlappingArea >= currNodeRect.width * currNodeRect.height || overlappingArea >= nodeRect.width * nodeRect.height;
        });
      },
      isNodeIntersecting: (nodeOrRect, area, partially = true) => {
        const isRect = isRectObject(nodeOrRect);
        const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
        if (!nodeRect) {
          return false;
        }
        const overlappingArea = getOverlappingArea(nodeRect, area);
        const partiallyVisible = partially && overlappingArea > 0;
        return partiallyVisible || overlappingArea >= area.width * area.height || overlappingArea >= nodeRect.width * nodeRect.height;
      },
      updateNode,
      updateNodeData: (id2, dataUpdate, options = { replace: false }) => {
        updateNode(id2, (node) => {
          const nextData = typeof dataUpdate === "function" ? dataUpdate(node) : dataUpdate;
          return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
        }, options);
      },
      updateEdge,
      updateEdgeData: (id2, dataUpdate, options = { replace: false }) => {
        updateEdge(id2, (edge) => {
          const nextData = typeof dataUpdate === "function" ? dataUpdate(edge) : dataUpdate;
          return options.replace ? { ...edge, data: nextData } : { ...edge, data: { ...edge.data, ...nextData } };
        }, options);
      },
      getNodesBounds: (nodes) => {
        const { nodeLookup, nodeOrigin } = store.getState();
        return getNodesBounds(nodes, { nodeLookup, nodeOrigin });
      },
      getHandleConnections: ({ type, id: id2, nodeId }) => Array.from(store.getState().connectionLookup.get(`${nodeId}-${type}${id2 ? `-${id2}` : ""}`)?.values() ?? []),
      getNodeConnections: ({ type, handleId, nodeId }) => Array.from(store.getState().connectionLookup.get(`${nodeId}${type ? handleId ? `-${type}-${handleId}` : `-${type}` : ""}`)?.values() ?? []),
      fitView: async (options) => {
        const fitViewResolver = store.getState().fitViewResolver ?? withResolvers();
        store.setState({ fitViewQueued: true, fitViewOptions: options, fitViewResolver });
        batchContext.nodeQueue.push((nodes) => [...nodes]);
        return fitViewResolver.promise;
      }
    };
  }, []);
  return (0, import_react3.useMemo)(() => {
    return {
      ...generalHelper,
      ...viewportHelper,
      viewportInitialized
    };
  }, [viewportInitialized]);
}
var selected = (item) => item.selected;
var win$1 = typeof window !== "undefined" ? window : void 0;
function useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode }) {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const deleteKeyPressed = useKeyPress(deleteKeyCode, { actInsideInputWithModifier: false });
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode, { target: win$1 });
  (0, import_react3.useEffect)(() => {
    if (deleteKeyPressed) {
      const { edges, nodes } = store.getState();
      deleteElements({ nodes: nodes.filter(selected), edges: edges.filter(selected) });
      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);
  (0, import_react3.useEffect)(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
}
function useResizeHandler(domNode) {
  const store = useStoreApi();
  (0, import_react3.useEffect)(() => {
    const updateDimensions = () => {
      if (!domNode.current || !(domNode.current.checkVisibility?.() ?? true)) {
        return false;
      }
      const size = getDimensions(domNode.current);
      if (size.height === 0 || size.width === 0) {
        store.getState().onError?.("004", errorMessages["error004"]());
      }
      store.setState({ width: size.width || 500, height: size.height || 500 });
    };
    if (domNode.current) {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(domNode.current);
      return () => {
        window.removeEventListener("resize", updateDimensions);
        resizeObserver.disconnect();
      };
    }
  }, []);
}
var containerStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};
var selector$i = (s) => ({
  userSelectionActive: s.userSelectionActive,
  lib: s.lib,
  connectionInProgress: s.connection.inProgress
});
function ZoomPane({ onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panActivationKeyPressed, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children: children2, noWheelClassName, noPanClassName, onViewportChange, isControlledViewport, paneClickDistance, selectionOnDrag }) {
  const store = useStoreApi();
  const zoomPane = (0, import_react3.useRef)(null);
  const { userSelectionActive, lib, connectionInProgress } = useStore(selector$i, shallow$1);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  const panZoom = (0, import_react3.useRef)();
  useResizeHandler(zoomPane);
  const onTransformChange = (0, import_react3.useCallback)((transform2) => {
    onViewportChange?.({ x: transform2[0], y: transform2[1], zoom: transform2[2] });
    if (!isControlledViewport) {
      store.setState({ transform: transform2 });
    }
  }, [onViewportChange, isControlledViewport]);
  (0, import_react3.useEffect)(() => {
    if (zoomPane.current) {
      panZoom.current = XYPanZoom({
        domNode: zoomPane.current,
        minZoom,
        maxZoom,
        translateExtent,
        viewport: defaultViewport2,
        onDraggingChange: (paneDragging) => store.setState((prevState) => prevState.paneDragging === paneDragging ? prevState : { paneDragging }),
        onPanZoomStart: (event, vp) => {
          const { onViewportChangeStart, onMoveStart } = store.getState();
          onMoveStart?.(event, vp);
          onViewportChangeStart?.(vp);
        },
        onPanZoom: (event, vp) => {
          const { onViewportChange: onViewportChange2, onMove } = store.getState();
          onMove?.(event, vp);
          onViewportChange2?.(vp);
        },
        onPanZoomEnd: (event, vp) => {
          const { onViewportChangeEnd, onMoveEnd } = store.getState();
          onMoveEnd?.(event, vp);
          onViewportChangeEnd?.(vp);
        }
      });
      const { x, y, zoom: zoom3 } = panZoom.current.getViewport();
      store.setState({
        panZoom: panZoom.current,
        transform: [x, y, zoom3],
        domNode: zoomPane.current.closest(".react-flow")
      });
      return () => {
        panZoom.current?.destroy();
      };
    }
  }, []);
  (0, import_react3.useEffect)(() => {
    panZoom.current?.update({
      onPaneContextMenu,
      zoomOnScroll,
      zoomOnPinch,
      panOnScroll,
      panActivationKeyPressed,
      panOnScrollSpeed,
      panOnScrollMode,
      zoomOnDoubleClick,
      panOnDrag,
      zoomActivationKeyPressed,
      preventScrolling,
      noPanClassName,
      userSelectionActive,
      noWheelClassName,
      lib,
      onTransformChange,
      connectionInProgress,
      selectionOnDrag,
      paneClickDistance
    });
  }, [
    onPaneContextMenu,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    panActivationKeyPressed,
    panOnScrollSpeed,
    panOnScrollMode,
    zoomOnDoubleClick,
    panOnDrag,
    zoomActivationKeyPressed,
    preventScrolling,
    noPanClassName,
    userSelectionActive,
    noWheelClassName,
    lib,
    onTransformChange,
    connectionInProgress,
    selectionOnDrag,
    paneClickDistance
  ]);
  return (0, import_jsx_runtime4.jsx)("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle, children: children2 });
}
var selector$h = (s) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect
});
function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useStore(selector$h, shallow$1);
  const isActive = userSelectionActive && userSelectionRect;
  if (!isActive) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)("div", { className: "react-flow__selection react-flow__container", style: {
    width: userSelectionRect.width,
    height: userSelectionRect.height,
    transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`
  } });
}
var wrapHandler = (handler, containerRef) => {
  return (event) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler?.(event);
  };
};
var selector$g = (s) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
  dragging: s.paneDragging,
  panBy: s.panBy,
  autoPanSpeed: s.autoPanSpeed
});
function Pane({ isSelecting, selectionKeyPressed, selectionMode = SelectionMode.Full, panOnDrag, autoPanOnSelection, paneClickDistance, selectionOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children: children2 }) {
  const autoPanId = (0, import_react3.useRef)(0);
  const store = useStoreApi();
  const { userSelectionActive, elementsSelectable, dragging, panBy: panBy2, autoPanSpeed } = useStore(selector$g, shallow$1);
  const isSelectionEnabled = elementsSelectable && (isSelecting || userSelectionActive);
  const container = (0, import_react3.useRef)(null);
  const containerBounds = (0, import_react3.useRef)();
  const selectedNodeIds = (0, import_react3.useRef)(/* @__PURE__ */ new Set());
  const selectedEdgeIds = (0, import_react3.useRef)(/* @__PURE__ */ new Set());
  const connectionEndedOnPane = (0, import_react3.useRef)(false);
  const selectionInProgress = (0, import_react3.useRef)(false);
  const position = (0, import_react3.useRef)({ x: 0, y: 0 });
  const autoPanStarted = (0, import_react3.useRef)(false);
  const onClick = (event) => {
    if (selectionInProgress.current || connectionEndedOnPane.current || store.getState().connection.inProgress) {
      selectionInProgress.current = false;
      connectionEndedOnPane.current = false;
      return;
    }
    const { connectionClickStartHandle, connection, onClickConnectEnd, resetSelectedElements } = store.getState();
    if (connectionClickStartHandle) {
      const connectionClone = structuredClone(connection);
      delete connectionClone.inProgress;
      connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
      onClickConnectEnd?.(event.nativeEvent, connectionClone);
      store.setState({ connectionClickStartHandle: null });
    }
    onPaneClick?.(event);
    resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };
  const onContextMenu = (event) => {
    if (Array.isArray(panOnDrag) && panOnDrag?.includes(2)) {
      event.preventDefault();
      return;
    }
    onPaneContextMenu?.(event);
  };
  const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : void 0;
  const onClickCapture = (event) => {
    if (selectionInProgress.current) {
      event.stopPropagation();
      selectionInProgress.current = false;
    }
  };
  const onPointerDownCapture = (event) => {
    if (event.pointerType === "touch" && panOnDrag !== false && !selectionKeyPressed) {
      return;
    }
    const { domNode, transform: transform2 } = store.getState();
    containerBounds.current = domNode?.getBoundingClientRect();
    if (!containerBounds.current)
      return;
    const eventTargetIsContainer = event.target === container.current;
    const isNoKeyEvent = !eventTargetIsContainer && !!event.target.closest(".nokey");
    const isSelectionActive = selectionOnDrag && eventTargetIsContainer || selectionKeyPressed;
    if (isNoKeyEvent || !isSelecting || !isSelectionActive || event.button !== 0 || !event.isPrimary) {
      return;
    }
    event.target?.setPointerCapture?.(event.pointerId);
    selectionInProgress.current = false;
    const { x, y } = getEventPosition(event.nativeEvent, containerBounds.current);
    const userSelectionStartPosition = pointToRendererPoint({ x, y }, transform2);
    store.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: userSelectionStartPosition.x,
        startY: userSelectionStartPosition.y,
        x,
        y
      }
    });
    if (!eventTargetIsContainer) {
      event.stopPropagation();
      event.preventDefault();
    }
  };
  function commitUserSelectionRect(mouseX, mouseY) {
    const { userSelectionRect } = store.getState();
    if (!userSelectionRect) {
      return;
    }
    const { transform: transform2, nodeLookup, edgeLookup, connectionLookup, triggerNodeChanges, triggerEdgeChanges, defaultEdgeOptions } = store.getState();
    const userStartPosition = { x: userSelectionRect.startX, y: userSelectionRect.startY };
    const { x: screenStartX, y: screenStartY } = rendererPointToPoint(userStartPosition, transform2);
    const nextUserSelectRect = {
      startX: userStartPosition.x,
      startY: userStartPosition.y,
      x: mouseX < screenStartX ? mouseX : screenStartX,
      y: mouseY < screenStartY ? mouseY : screenStartY,
      width: Math.abs(mouseX - screenStartX),
      height: Math.abs(mouseY - screenStartY)
    };
    const prevSelectedNodeIds = selectedNodeIds.current;
    const prevSelectedEdgeIds = selectedEdgeIds.current;
    selectedNodeIds.current = new Set(getNodesInside(nodeLookup, nextUserSelectRect, transform2, selectionMode === SelectionMode.Partial, true).map((node) => node.id));
    selectedEdgeIds.current = /* @__PURE__ */ new Set();
    const edgesSelectable = defaultEdgeOptions?.selectable ?? true;
    for (const nodeId of selectedNodeIds.current) {
      const connections = connectionLookup.get(nodeId);
      if (!connections)
        continue;
      for (const { edgeId } of connections.values()) {
        const edge = edgeLookup.get(edgeId);
        if (edge && (edge.selectable ?? edgesSelectable)) {
          selectedEdgeIds.current.add(edgeId);
        }
      }
    }
    if (!areSetsEqual(prevSelectedNodeIds, selectedNodeIds.current)) {
      const changes = getSelectionChanges(nodeLookup, selectedNodeIds.current);
      triggerNodeChanges(changes);
    }
    if (!areSetsEqual(prevSelectedEdgeIds, selectedEdgeIds.current)) {
      const changes = getSelectionChanges(edgeLookup, selectedEdgeIds.current);
      triggerEdgeChanges(changes);
    }
    store.setState({
      userSelectionRect: nextUserSelectRect,
      userSelectionActive: true,
      nodesSelectionActive: false
    });
  }
  function autoPan() {
    if (!autoPanOnSelection || !containerBounds.current) {
      return;
    }
    const [x, y] = calcAutoPan(position.current, containerBounds.current, autoPanSpeed);
    panBy2({ x, y }).then((panned) => {
      if (!selectionInProgress.current || !panned) {
        autoPanId.current = requestAnimationFrame(autoPan);
        return;
      }
      const { x: mx, y: my } = position.current;
      commitUserSelectionRect(mx, my);
      autoPanId.current = requestAnimationFrame(autoPan);
    });
  }
  const cleanupAutoPan = () => {
    cancelAnimationFrame(autoPanId.current);
    autoPanId.current = 0;
    autoPanStarted.current = false;
  };
  (0, import_react3.useEffect)(() => {
    return () => cleanupAutoPan();
  }, []);
  const onPointerMove = (event) => {
    const { userSelectionRect, transform: transform2, resetSelectedElements } = store.getState();
    if (!containerBounds.current || !userSelectionRect) {
      return;
    }
    const { x: mouseX, y: mouseY } = getEventPosition(event.nativeEvent, containerBounds.current);
    position.current = { x: mouseX, y: mouseY };
    const screenStart = rendererPointToPoint({ x: userSelectionRect.startX, y: userSelectionRect.startY }, transform2);
    if (!selectionInProgress.current) {
      const requiredDistance = selectionKeyPressed ? 0 : paneClickDistance;
      const distance2 = Math.hypot(mouseX - screenStart.x, mouseY - screenStart.y);
      if (distance2 <= requiredDistance) {
        return;
      }
      resetSelectedElements();
      onSelectionStart?.(event);
    }
    selectionInProgress.current = true;
    if (!autoPanStarted.current) {
      autoPan();
      autoPanStarted.current = true;
    }
    commitUserSelectionRect(mouseX, mouseY);
  };
  const onPointerUp = (event) => {
    if (!isSelectionEnabled) {
      if (event.target === container.current && store.getState().connection.inProgress) {
        connectionEndedOnPane.current = true;
      }
      return;
    }
    if (event.button !== 0) {
      return;
    }
    event.target?.releasePointerCapture?.(event.pointerId);
    if (!userSelectionActive && event.target === container.current && store.getState().userSelectionRect) {
      onClick?.(event);
    }
    store.setState({
      userSelectionActive: false,
      userSelectionRect: null
    });
    if (selectionInProgress.current) {
      onSelectionEnd?.(event);
      store.setState({
        nodesSelectionActive: selectedNodeIds.current.size > 0
      });
    }
    cleanupAutoPan();
  };
  const onPointerCancel = (event) => {
    event.target?.releasePointerCapture?.(event.pointerId);
    cleanupAutoPan();
  };
  const draggable = panOnDrag === true || Array.isArray(panOnDrag) && panOnDrag.includes(0);
  return (0, import_jsx_runtime4.jsxs)("div", { className: cc(["react-flow__pane", { draggable, dragging, selection: isSelecting }]), onClick: isSelectionEnabled ? void 0 : wrapHandler(onClick, container), onContextMenu: wrapHandler(onContextMenu, container), onWheel: wrapHandler(onWheel, container), onPointerEnter: isSelectionEnabled ? void 0 : onPaneMouseEnter, onPointerMove: isSelectionEnabled ? onPointerMove : onPaneMouseMove, onPointerUp, onPointerCancel: isSelectionEnabled ? onPointerCancel : void 0, onPointerDownCapture: isSelectionEnabled ? onPointerDownCapture : void 0, onClickCapture: isSelectionEnabled ? onClickCapture : void 0, onPointerLeave: onPaneMouseLeave, ref: container, style: containerStyle, children: [children2, (0, import_jsx_runtime4.jsx)(UserSelection, {})] });
}
function handleNodeClick({ id: id2, store, unselect = false, nodeRef }) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeLookup, onError } = store.getState();
  const node = nodeLookup.get(id2);
  if (!node) {
    onError?.("012", errorMessages["error012"](id2));
    return;
  }
  store.setState({ nodesSelectionActive: false });
  if (!node.selected) {
    addSelectedNodes([id2]);
  } else if (unselect || node.selected && multiSelectionActive) {
    unselectNodesAndEdges({ nodes: [node], edges: [] });
    requestAnimationFrame(() => nodeRef?.current?.blur());
  }
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, nodeClickDistance }) {
  const store = useStoreApi();
  const [dragging, setDragging] = (0, import_react3.useState)(false);
  const xyDrag = (0, import_react3.useRef)();
  (0, import_react3.useEffect)(() => {
    if (disabled) {
      return;
    }
    xyDrag.current = XYDrag({
      getStoreItems: () => store.getState(),
      onNodeMouseDown: (id2) => {
        handleNodeClick({
          id: id2,
          store,
          nodeRef
        });
      },
      onDragStart: () => {
        setDragging(true);
      },
      onDragStop: () => {
        setDragging(false);
      }
    });
    return () => {
      xyDrag.current?.destroy();
      xyDrag.current = void 0;
    };
  }, [disabled, store, nodeRef]);
  (0, import_react3.useEffect)(() => {
    if (disabled || !nodeRef.current || !xyDrag.current) {
      return;
    }
    xyDrag.current.update({
      noDragClassName,
      handleSelector,
      domNode: nodeRef.current,
      isSelectable,
      nodeId,
      nodeClickDistance
    });
  }, [noDragClassName, handleSelector, disabled, isSelectable, nodeRef, nodeId, nodeClickDistance]);
  return dragging;
}
var selectedAndDraggable = (nodesDraggable) => (n) => n.selected && (n.draggable || nodesDraggable && typeof n.draggable === "undefined");
function useMoveSelectedNodes() {
  const store = useStoreApi();
  const moveSelectedNodes = (0, import_react3.useCallback)((params) => {
    const { nodeExtent, snapToGrid, snapGrid, nodesDraggable, onError, updateNodePositions, nodeLookup, nodeOrigin } = store.getState();
    const nodeUpdates = /* @__PURE__ */ new Map();
    const isSelected = selectedAndDraggable(nodesDraggable);
    const xVelo = snapToGrid ? snapGrid[0] : 5;
    const yVelo = snapToGrid ? snapGrid[1] : 5;
    const xDiff = params.direction.x * xVelo * params.factor;
    const yDiff = params.direction.y * yVelo * params.factor;
    for (const [, node] of nodeLookup) {
      if (!isSelected(node)) {
        continue;
      }
      let nextPosition = {
        x: node.internals.positionAbsolute.x + xDiff,
        y: node.internals.positionAbsolute.y + yDiff
      };
      if (snapToGrid) {
        nextPosition = snapPosition(nextPosition, snapGrid);
      }
      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: node.id,
        nextPosition,
        nodeLookup,
        nodeExtent,
        nodeOrigin,
        onError
      });
      node.position = position;
      node.internals.positionAbsolute = positionAbsolute;
      nodeUpdates.set(node.id, node);
    }
    updateNodePositions(nodeUpdates);
  }, []);
  return moveSelectedNodes;
}
var NodeIdContext = (0, import_react3.createContext)(null);
var Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
var useNodeId = () => {
  const nodeId = (0, import_react3.useContext)(NodeIdContext);
  return nodeId;
};
var selector$f = (s) => ({
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
  rfId: s.rfId
});
var HandleConfigContext = (0, import_react3.createContext)(null);
function HandleConfigProvider({ children: children2 }) {
  const config = useStore(selector$f, shallow$1);
  return (0, import_jsx_runtime4.jsx)(HandleConfigContext.Provider, { value: config, children: children2 });
}
function useHandleConfig() {
  const config = (0, import_react3.useContext)(HandleConfigContext);
  if (!config) {
    throw new Error("useHandleConfig must be used within a HandleConfigProvider");
  }
  return config;
}
var idleConnectingState = {
  connectingFrom: false,
  connectingTo: false,
  clickConnecting: false,
  isPossibleEndHandle: true,
  connectionInProcess: false,
  clickConnectionInProcess: false,
  valid: false
};
var connectingSelector = (nodeId, handleId, type) => (state3) => {
  const { connectionClickStartHandle: clickHandle, connectionMode, connection } = state3;
  const { fromHandle, toHandle, isValid } = connection;
  if (!fromHandle && !clickHandle) {
    return idleConnectingState;
  }
  const connectingTo = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === type;
  return {
    connectingFrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === type,
    connectingTo,
    clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.id === handleId && clickHandle?.type === type,
    isPossibleEndHandle: connectionMode === ConnectionMode.Strict ? fromHandle?.type !== type : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id,
    connectionInProcess: !!fromHandle,
    clickConnectionInProcess: !!clickHandle,
    valid: connectingTo && isValid
  };
};
function HandleComponent({ type = "source", position = Position.Top, isValidConnection, isConnectable = true, isConnectableStart = true, isConnectableEnd = true, id: id2, onConnect, children: children2, className, onMouseDown, onTouchStart, ...rest }, ref) {
  const handleId = id2 || null;
  const isTarget = type === "target";
  const store = useStoreApi();
  const nodeId = useNodeId();
  const { connectOnClick, noPanClassName, rfId } = useHandleConfig();
  const { connectingFrom, connectingTo, clickConnecting, isPossibleEndHandle, connectionInProcess, clickConnectionInProcess, valid } = useStore(connectingSelector(nodeId, handleId, type), shallow$1);
  if (!nodeId) {
    store.getState().onError?.("010", errorMessages["error010"]());
  }
  const onConnectExtended = (params) => {
    const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
    const edgeParams = {
      ...defaultEdgeOptions,
      ...params
    };
    if (hasDefaultEdges) {
      const { edges, setEdges, onError } = store.getState();
      setEdges(addEdge2(edgeParams, edges, { onError }));
    }
    onConnectAction?.(edgeParams);
    onConnect?.(edgeParams);
  };
  const onPointerDown2 = (event) => {
    if (!nodeId) {
      return;
    }
    const isMouseTriggered = isMouseEvent(event.nativeEvent);
    if (isConnectableStart && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) {
      const currentStore = store.getState();
      XYHandle.onPointerDown(event.nativeEvent, {
        handleDomNode: event.currentTarget,
        autoPanOnConnect: currentStore.autoPanOnConnect,
        connectionMode: currentStore.connectionMode,
        connectionRadius: currentStore.connectionRadius,
        domNode: currentStore.domNode,
        nodeLookup: currentStore.nodeLookup,
        lib: currentStore.lib,
        isTarget,
        handleId,
        nodeId,
        flowId: currentStore.rfId,
        panBy: currentStore.panBy,
        cancelConnection: currentStore.cancelConnection,
        onConnectStart: currentStore.onConnectStart,
        onConnectEnd: (...args) => store.getState().onConnectEnd?.(...args),
        updateConnection: currentStore.updateConnection,
        onConnect: onConnectExtended,
        isValidConnection: isValidConnection || ((...args) => store.getState().isValidConnection?.(...args) ?? true),
        getTransform: () => store.getState().transform,
        getFromHandle: () => store.getState().connection.fromHandle,
        autoPanSpeed: currentStore.autoPanSpeed,
        dragThreshold: currentStore.connectionDragThreshold
      });
    }
    if (isMouseTriggered) {
      onMouseDown?.(event);
    } else {
      onTouchStart?.(event);
    }
  };
  const onClick = (event) => {
    const { onClickConnectStart, onClickConnectEnd, connectionClickStartHandle, connectionMode, isValidConnection: isValidConnectionStore, lib, rfId: flowId, nodeLookup, connection: connectionState } = store.getState();
    if (!nodeId || !connectionClickStartHandle && !isConnectableStart) {
      return;
    }
    if (!connectionClickStartHandle) {
      onClickConnectStart?.(event.nativeEvent, { nodeId, handleId, handleType: type });
      store.setState({ connectionClickStartHandle: { nodeId, type, id: handleId } });
      return;
    }
    const doc = getHostForElement(event.target);
    const isValidConnectionHandler = isValidConnection || isValidConnectionStore;
    const { connection, isValid } = XYHandle.isValid(event.nativeEvent, {
      handle: {
        nodeId,
        id: handleId,
        type
      },
      connectionMode,
      fromNodeId: connectionClickStartHandle.nodeId,
      fromHandleId: connectionClickStartHandle.id || null,
      fromType: connectionClickStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId,
      doc,
      lib,
      nodeLookup
    });
    if (isValid && connection) {
      onConnectExtended(connection);
    }
    const connectionClone = structuredClone(connectionState);
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
    onClickConnectEnd?.(event, connectionClone);
    store.setState({ connectionClickStartHandle: null });
  };
  return (0, import_jsx_runtime4.jsx)("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, "data-id": `${rfId}-${nodeId}-${handleId}-${type}`, className: cc([
    "react-flow__handle",
    `react-flow__handle-${position}`,
    "nodrag",
    noPanClassName,
    className,
    {
      source: !isTarget,
      target: isTarget,
      connectable: isConnectable,
      connectablestart: isConnectableStart,
      connectableend: isConnectableEnd,
      clickconnecting: clickConnecting,
      connectingfrom: connectingFrom,
      connectingto: connectingTo,
      valid,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: isConnectable && (!connectionInProcess || isPossibleEndHandle) && (connectionInProcess || clickConnectionInProcess ? isConnectableEnd : isConnectableStart)
    }
  ]), onMouseDown: onPointerDown2, onTouchStart: onPointerDown2, onClick: connectOnClick ? onClick : void 0, ref, ...rest, children: children2 });
}
var Handle = (0, import_react3.memo)(fixedForwardRef(HandleComponent));
function InputNode({ data, isConnectable, sourcePosition = Position.Bottom }) {
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [data?.label, (0, import_jsx_runtime4.jsx)(Handle, { type: "source", position: sourcePosition, isConnectable })] });
}
function DefaultNode({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }) {
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(0, import_jsx_runtime4.jsx)(Handle, { type: "target", position: targetPosition, isConnectable }), data?.label, (0, import_jsx_runtime4.jsx)(Handle, { type: "source", position: sourcePosition, isConnectable })] });
}
function GroupNode() {
  return null;
}
function OutputNode({ data, isConnectable, targetPosition = Position.Top }) {
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(0, import_jsx_runtime4.jsx)(Handle, { type: "target", position: targetPosition, isConnectable }), data?.label] });
}
var arrowKeyDiffs = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
var builtinNodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
  group: GroupNode
};
function getNodeInlineStyleDimensions(node) {
  if (node.internals.handleBounds === void 0) {
    return {
      width: node.width ?? node.initialWidth ?? node.style?.width,
      height: node.height ?? node.initialHeight ?? node.style?.height
    };
  }
  return {
    width: node.width ?? node.style?.width,
    height: node.height ?? node.style?.height
  };
}
var selector$e = (s) => {
  const { width, height, x, y } = getInternalNodesBounds(s.nodeLookup, {
    filter: (node) => !!node.selected
  });
  return {
    width: isNumeric(width) ? width : null,
    height: isNumeric(height) ? height : null,
    userSelectionActive: s.userSelectionActive,
    transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]}) translate(${x}px,${y}px)`
  };
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
  const store = useStoreApi();
  const { width, height, transformString, userSelectionActive } = useStore(selector$e, shallow$1);
  const moveSelectedNodes = useMoveSelectedNodes();
  const nodeRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    if (!disableKeyboardA11y) {
      nodeRef.current?.focus({
        preventScroll: true
      });
    }
  }, [disableKeyboardA11y]);
  const shouldRender = !userSelectionActive && width !== null && height !== null;
  useDrag({
    nodeRef,
    disabled: !shouldRender
  });
  if (!shouldRender) {
    return null;
  }
  const onContextMenu = onSelectionContextMenu ? (event) => {
    const selectedNodes = store.getState().nodes.filter((n) => n.selected);
    onSelectionContextMenu(event, selectedNodes);
  } : void 0;
  const onKeyDown = (event) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      event.preventDefault();
      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1
      });
    }
  };
  return (0, import_jsx_runtime4.jsx)("div", { className: cc(["react-flow__nodesselection", "react-flow__container", noPanClassName]), style: {
    transform: transformString
  }, children: (0, import_jsx_runtime4.jsx)("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu, tabIndex: disableKeyboardA11y ? void 0 : -1, onKeyDown: disableKeyboardA11y ? void 0 : onKeyDown, style: {
    width,
    height
  } }) });
}
var win = typeof window !== "undefined" ? window : void 0;
var selector$d = (s) => {
  return { nodesSelectionActive: s.nodesSelectionActive, userSelectionActive: s.userSelectionActive };
};
function FlowRendererComponent({ children: children2, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, paneClickDistance, deleteKeyCode, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll: _panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, autoPanOnSelection, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y, onViewportChange, isControlledViewport }) {
  const { nodesSelectionActive, userSelectionActive } = useStore(selector$d, shallow$1);
  const selectionKeyPressed = useKeyPress(selectionKeyCode, { target: win });
  const panActivationKeyPressed = useKeyPress(panActivationKeyCode, { target: win });
  const panOnDrag = panActivationKeyPressed || _panOnDrag;
  const panOnScroll = panActivationKeyPressed || _panOnScroll;
  const _selectionOnDrag = selectionOnDrag && panOnDrag !== true;
  const isSelecting = selectionKeyPressed || userSelectionActive || _selectionOnDrag;
  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
  return (0, import_jsx_runtime4.jsx)(ZoomPane, { onPaneContextMenu, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panActivationKeyPressed, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: !selectionKeyPressed && panOnDrag, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling, noWheelClassName, noPanClassName, onViewportChange, isControlledViewport, paneClickDistance, selectionOnDrag: _selectionOnDrag, children: (0, import_jsx_runtime4.jsxs)(Pane, { onSelectionStart, onSelectionEnd, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, panOnDrag, autoPanOnSelection, isSelecting: !!isSelecting, selectionMode, selectionKeyPressed, paneClickDistance, selectionOnDrag: _selectionOnDrag, children: [children2, nodesSelectionActive && (0, import_jsx_runtime4.jsx)(NodesSelection, { onSelectionContextMenu, noPanClassName, disableKeyboardA11y })] }) });
}
FlowRendererComponent.displayName = "FlowRenderer";
var FlowRenderer = (0, import_react3.memo)(FlowRendererComponent);
var selector$c = (onlyRenderVisible) => (s) => {
  return onlyRenderVisible ? getNodesInside(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map((node) => node.id) : Array.from(s.nodeLookup.keys());
};
function useVisibleNodeIds(onlyRenderVisible) {
  const nodeIds = useStore((0, import_react3.useCallback)(selector$c(onlyRenderVisible), [onlyRenderVisible]), shallow$1);
  return nodeIds;
}
var selector$b = (s) => s.updateNodeInternals;
function useResizeObserver() {
  const updateNodeInternals2 = useStore(selector$b);
  const [resizeObserver] = (0, import_react3.useState)(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }
    return new ResizeObserver((entries) => {
      const updates = /* @__PURE__ */ new Map();
      entries.forEach((entry) => {
        const id2 = entry.target.getAttribute("data-id");
        updates.set(id2, {
          id: id2,
          nodeElement: entry.target,
          force: true
        });
      });
      updateNodeInternals2(updates);
    });
  });
  (0, import_react3.useEffect)(() => {
    return () => {
      resizeObserver?.disconnect();
    };
  }, [resizeObserver]);
  return resizeObserver;
}
function useNodeObserver({ node, nodeType, hasDimensions, resizeObserver }) {
  const store = useStoreApi();
  const nodeRef = (0, import_react3.useRef)(null);
  const observedNode = (0, import_react3.useRef)(null);
  const prevSourcePosition = (0, import_react3.useRef)(node.sourcePosition);
  const prevTargetPosition = (0, import_react3.useRef)(node.targetPosition);
  const prevType = (0, import_react3.useRef)(nodeType);
  const isInitialized = hasDimensions && !!node.internals.handleBounds;
  (0, import_react3.useEffect)(() => {
    if (nodeRef.current && !node.hidden && (!isInitialized || observedNode.current !== nodeRef.current)) {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
      }
      resizeObserver?.observe(nodeRef.current);
      observedNode.current = nodeRef.current;
    }
  }, [isInitialized, node.hidden]);
  (0, import_react3.useEffect)(() => {
    return () => {
      if (observedNode.current) {
        resizeObserver?.unobserve(observedNode.current);
        observedNode.current = null;
      }
    };
  }, []);
  (0, import_react3.useEffect)(() => {
    if (nodeRef.current) {
      const typeChanged = prevType.current !== nodeType;
      const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== node.targetPosition;
      if (typeChanged || sourcePosChanged || targetPosChanged) {
        prevType.current = nodeType;
        prevSourcePosition.current = node.sourcePosition;
        prevTargetPosition.current = node.targetPosition;
        store.getState().updateNodeInternals(/* @__PURE__ */ new Map([[node.id, { id: node.id, nodeElement: nodeRef.current, force: true }]]));
      }
    }
  }, [node.id, nodeType, node.sourcePosition, node.targetPosition]);
  return nodeRef;
}
function NodeWrapper({ id: id2, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, nodesDraggable, elementsSelectable, nodesConnectable, nodesFocusable, resizeObserver, noDragClassName, noPanClassName, disableKeyboardA11y, rfId, nodeTypes: nodeTypes2, nodeClickDistance, onError }) {
  const { node, internals, isParent } = useStore((s) => {
    const node2 = s.nodeLookup.get(id2);
    const isParent2 = s.parentLookup.has(id2);
    return {
      node: node2,
      internals: node2.internals,
      isParent: isParent2
    };
  }, shallow$1);
  let nodeType = node.type || "default";
  let NodeComponent = nodeTypes2?.[nodeType] || builtinNodeTypes[nodeType];
  if (NodeComponent === void 0) {
    onError?.("003", errorMessages["error003"](nodeType));
    nodeType = "default";
    NodeComponent = nodeTypes2?.["default"] || builtinNodeTypes.default;
  }
  const isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === "undefined");
  const isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === "undefined");
  const isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === "undefined");
  const isFocusable = !!(node.focusable || nodesFocusable && typeof node.focusable === "undefined");
  const store = useStoreApi();
  const hasDimensions = nodeHasDimensions(node);
  const nodeRef = useNodeObserver({ node, nodeType, hasDimensions, resizeObserver });
  const dragging = useDrag({
    nodeRef,
    disabled: node.hidden || !isDraggable,
    noDragClassName,
    handleSelector: node.dragHandle,
    nodeId: id2,
    isSelectable,
    nodeClickDistance
  });
  const moveSelectedNodes = useMoveSelectedNodes();
  if (node.hidden) {
    return null;
  }
  const nodeDimensions = getNodeDimensions(node);
  const inlineDimensions = getNodeInlineStyleDimensions(node);
  const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
  const onMouseEnterHandler = onMouseEnter ? (event) => onMouseEnter(event, { ...internals.userNode }) : void 0;
  const onMouseMoveHandler = onMouseMove ? (event) => onMouseMove(event, { ...internals.userNode }) : void 0;
  const onMouseLeaveHandler = onMouseLeave ? (event) => onMouseLeave(event, { ...internals.userNode }) : void 0;
  const onContextMenuHandler = onContextMenu ? (event) => onContextMenu(event, { ...internals.userNode }) : void 0;
  const onDoubleClickHandler = onDoubleClick ? (event) => onDoubleClick(event, { ...internals.userNode }) : void 0;
  const onSelectNodeHandler = (event) => {
    const { selectNodesOnDrag, nodeDragThreshold } = store.getState();
    if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
      handleNodeClick({
        id: id2,
        store,
        nodeRef
      });
    }
    if (onClick) {
      onClick(event, { ...internals.userNode });
    }
  };
  const onKeyDown = (event) => {
    if (isInputDOMNode(event.nativeEvent) || disableKeyboardA11y) {
      return;
    }
    if (elementSelectionKeys.includes(event.key) && isSelectable) {
      const unselect = event.key === "Escape";
      handleNodeClick({
        id: id2,
        store,
        unselect,
        nodeRef
      });
    } else if (isDraggable && node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      event.preventDefault();
      const { ariaLabelConfig } = store.getState();
      store.setState({
        ariaLiveMessage: ariaLabelConfig["node.a11yDescription.ariaLiveMessage"]({
          direction: event.key.replace("Arrow", "").toLowerCase(),
          x: ~~internals.positionAbsolute.x,
          y: ~~internals.positionAbsolute.y
        })
      });
      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1
      });
    }
  };
  const onFocus = () => {
    if (disableKeyboardA11y || !nodeRef.current?.matches(":focus-visible")) {
      return;
    }
    const { transform: transform2, width, height, autoPanOnNodeFocus, setCenter } = store.getState();
    if (!autoPanOnNodeFocus) {
      return;
    }
    const withinViewport = getNodesInside(/* @__PURE__ */ new Map([[id2, node]]), { x: 0, y: 0, width, height }, transform2, true).length > 0;
    if (!withinViewport) {
      setCenter(node.position.x + nodeDimensions.width / 2, node.position.y + nodeDimensions.height / 2, {
        zoom: transform2[2]
      });
    }
  };
  return (0, import_jsx_runtime4.jsx)("div", { className: cc([
    "react-flow__node",
    `react-flow__node-${nodeType}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [noPanClassName]: isDraggable
    },
    node.className,
    {
      selected: node.selected,
      selectable: isSelectable,
      parent: isParent,
      draggable: isDraggable,
      dragging
    }
  ]), ref: nodeRef, style: {
    zIndex: internals.z,
    transform: `translate(${internals.positionAbsolute.x}px,${internals.positionAbsolute.y}px)`,
    pointerEvents: hasPointerEvents ? "all" : "none",
    visibility: hasDimensions ? "visible" : "hidden",
    ...node.style,
    ...inlineDimensions
  }, "data-id": id2, "data-testid": `rf__node-${id2}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, onFocus: isFocusable ? onFocus : void 0, role: node.ariaRole ?? (isFocusable ? "group" : void 0), "aria-roledescription": "node", "aria-describedby": disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": node.ariaLabel, ...node.domAttributes, children: (0, import_jsx_runtime4.jsx)(Provider, { value: id2, children: (0, import_jsx_runtime4.jsx)(NodeComponent, { id: id2, data: node.data, type: nodeType, positionAbsoluteX: internals.positionAbsolute.x, positionAbsoluteY: internals.positionAbsolute.y, selected: node.selected ?? false, selectable: isSelectable, draggable: isDraggable, deletable: node.deletable ?? true, isConnectable, sourcePosition: node.sourcePosition, targetPosition: node.targetPosition, dragging, dragHandle: node.dragHandle, zIndex: internals.z, parentId: node.parentId, ...nodeDimensions }) }) });
}
var NodeWrapper$1 = (0, import_react3.memo)(NodeWrapper);
var selector$a = (s) => ({
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  onError: s.onError
});
function NodeRendererComponent(props) {
  const { nodesConnectable, nodesFocusable, elementsSelectable, onError } = useStore(selector$a, shallow$1);
  const nodeIds = useVisibleNodeIds(props.onlyRenderVisibleElements);
  const resizeObserver = useResizeObserver();
  return (0, import_jsx_runtime4.jsx)("div", { className: "react-flow__nodes", style: containerStyle, children: nodeIds.map((nodeId) => {
    return (
      /*
       * The split of responsibilities between NodeRenderer and
       * NodeComponentWrapper may appear weird. However, it’s designed to
       * minimize the cost of updates when individual nodes change.
       *
       * For example, when you’re dragging a single node, that node gets
       * updated multiple times per second. If `NodeRenderer` were to update
       * every time, it would have to re-run the `nodes.map()` loop every
       * time. This gets pricey with hundreds of nodes, especially if every
       * loop cycle does more than just rendering a JSX element!
       *
       * As a result of this choice, we took the following implementation
       * decisions:
       * - NodeRenderer subscribes *only* to node IDs – and therefore
       *   rerender *only* when visible nodes are added or removed.
       * - NodeRenderer performs all operations the result of which can be
       *   shared between nodes (such as creating the `ResizeObserver`
       *   instance, or subscribing to `selector`). This means extra prop
       *   drilling into `NodeComponentWrapper`, but it means we need to run
       *   these operations only once – instead of once per node.
       * - Any operations that you’d normally write inside `nodes.map` are
       *   moved into `NodeComponentWrapper`. This ensures they are
       *   memorized – so if `NodeRenderer` *has* to rerender, it only
       *   needs to regenerate the list of nodes, nothing else.
       */
      (0, import_jsx_runtime4.jsx)(NodeWrapper$1, { id: nodeId, nodeTypes: props.nodeTypes, nodeExtent: props.nodeExtent, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, resizeObserver, nodesDraggable: props.nodesDraggable ?? true, nodesConnectable, nodesFocusable, elementsSelectable, nodeClickDistance: props.nodeClickDistance, onError }, nodeId)
    );
  }) });
}
NodeRendererComponent.displayName = "NodeRenderer";
var NodeRenderer = (0, import_react3.memo)(NodeRendererComponent);
function useVisibleEdgeIds(onlyRenderVisible) {
  const edgeIds = useStore((0, import_react3.useCallback)((s) => {
    if (!onlyRenderVisible) {
      return s.edges.map((edge) => edge.id);
    }
    const visibleEdgeIds = [];
    if (s.width && s.height) {
      for (const edge of s.edges) {
        const sourceNode = s.nodeLookup.get(edge.source);
        const targetNode = s.nodeLookup.get(edge.target);
        if (sourceNode && targetNode && isEdgeVisible({
          sourceNode,
          targetNode,
          width: s.width,
          height: s.height,
          transform: s.transform
        })) {
          visibleEdgeIds.push(edge.id);
        }
      }
    }
    return visibleEdgeIds;
  }, [onlyRenderVisible]), shallow$1);
  return edgeIds;
}
var ArrowSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  const style2 = {
    strokeWidth,
    ...color2 && { stroke: color2 }
  };
  return (0, import_jsx_runtime4.jsx)("polyline", { className: "arrow", style: style2, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
};
var ArrowClosedSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  const style2 = {
    strokeWidth,
    ...color2 && { stroke: color2, fill: color2 }
  };
  return (0, import_jsx_runtime4.jsx)("polyline", { className: "arrowclosed", style: style2, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
};
var MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol
};
function useMarkerSymbol(type) {
  const store = useStoreApi();
  const symbol = (0, import_react3.useMemo)(() => {
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
    if (!symbolExists) {
      store.getState().onError?.("009", errorMessages["error009"](type));
      return null;
    }
    return MarkerSymbols[type];
  }, [type]);
  return symbol;
}
var Marker = ({ id: id2, type, color: color2, width = 12.5, height = 12.5, markerUnits = "strokeWidth", strokeWidth, orient = "auto-start-reverse" }) => {
  const Symbol2 = useMarkerSymbol(type);
  if (!Symbol2) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)("marker", { className: "react-flow__arrowhead", id: id2, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits, orient, refX: "0", refY: "0", children: (0, import_jsx_runtime4.jsx)(Symbol2, { color: color2, strokeWidth }) });
};
var MarkerDefinitions = ({ defaultColor, rfId }) => {
  const edges = useStore((s) => s.edges);
  const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
  const markers = (0, import_react3.useMemo)(() => {
    const markers2 = createMarkerIds(edges, {
      id: rfId,
      defaultColor,
      defaultMarkerStart: defaultEdgeOptions?.markerStart,
      defaultMarkerEnd: defaultEdgeOptions?.markerEnd
    });
    return markers2;
  }, [edges, defaultEdgeOptions, rfId, defaultColor]);
  if (!markers.length) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)("svg", { className: "react-flow__marker", "aria-hidden": "true", children: (0, import_jsx_runtime4.jsx)("defs", { children: markers.map((marker) => (0, import_jsx_runtime4.jsx)(Marker, { id: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient }, marker.id)) }) });
};
MarkerDefinitions.displayName = "MarkerDefinitions";
var MarkerDefinitions$1 = (0, import_react3.memo)(MarkerDefinitions);
function EdgeTextComponent({ x, y, label, labelStyle, labelShowBg = true, labelBgStyle, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children: children2, className, ...rest }) {
  const [edgeTextBbox, setEdgeTextBbox] = (0, import_react3.useState)({ x: 1, y: 0, width: 0, height: 0 });
  const edgeTextClasses = cc(["react-flow__edge-textwrapper", className]);
  const edgeTextRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    if (edgeTextRef.current) {
      const textBbox = edgeTextRef.current.getBBox();
      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height
      });
    }
  }, [label]);
  if (!label) {
    return null;
  }
  return (0, import_jsx_runtime4.jsxs)("g", { transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? "visible" : "hidden", ...rest, children: [labelShowBg && (0, import_jsx_runtime4.jsx)("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius }), (0, import_jsx_runtime4.jsx)("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeTextRef, style: labelStyle, children: label }), children2] });
}
EdgeTextComponent.displayName = "EdgeText";
var EdgeText = (0, import_react3.memo)(EdgeTextComponent);
function BaseEdge({ path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, interactionWidth = 20, ...props }) {
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(0, import_jsx_runtime4.jsx)("path", { ...props, d: path, fill: "none", className: cc(["react-flow__edge-path", props.className]) }), interactionWidth ? (0, import_jsx_runtime4.jsx)("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" }) : null, label && isNumeric(labelX) && isNumeric(labelY) ? (0, import_jsx_runtime4.jsx)(EdgeText, { x: labelX, y: labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius }) : null] });
}
function getControl({ pos, x1, y1, x2, y2 }) {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }
  return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top }) {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
function createSimpleBezierEdge(params) {
  return (0, import_react3.memo)(({ id: id2, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
    const [path, labelX, labelY] = getSimpleBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition
    });
    const _id = params.isInternal ? void 0 : id2;
    return (0, import_jsx_runtime4.jsx)(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
  });
}
var SimpleBezierEdge = createSimpleBezierEdge({ isInternal: false });
var SimpleBezierEdgeInternal = createSimpleBezierEdge({ isInternal: true });
SimpleBezierEdge.displayName = "SimpleBezierEdge";
SimpleBezierEdgeInternal.displayName = "SimpleBezierEdgeInternal";
function createSmoothStepEdge(params) {
  return (0, import_react3.memo)(({ id: id2, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth }) => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: pathOptions?.borderRadius,
      offset: pathOptions?.offset,
      stepPosition: pathOptions?.stepPosition
    });
    const _id = params.isInternal ? void 0 : id2;
    return (0, import_jsx_runtime4.jsx)(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
  });
}
var SmoothStepEdge = createSmoothStepEdge({ isInternal: false });
var SmoothStepEdgeInternal = createSmoothStepEdge({ isInternal: true });
SmoothStepEdge.displayName = "SmoothStepEdge";
SmoothStepEdgeInternal.displayName = "SmoothStepEdgeInternal";
function createStepEdge(params) {
  return (0, import_react3.memo)(({ id: id2, ...props }) => {
    const _id = params.isInternal ? void 0 : id2;
    return (0, import_jsx_runtime4.jsx)(SmoothStepEdge, { ...props, id: _id, pathOptions: (0, import_react3.useMemo)(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset]) });
  });
}
var StepEdge = createStepEdge({ isInternal: false });
var StepEdgeInternal = createStepEdge({ isInternal: true });
StepEdge.displayName = "StepEdge";
StepEdgeInternal.displayName = "StepEdgeInternal";
function createStraightEdge(params) {
  return (0, import_react3.memo)(({ id: id2, sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
    const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    const _id = params.isInternal ? void 0 : id2;
    return (0, import_jsx_runtime4.jsx)(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
  });
}
var StraightEdge = createStraightEdge({ isInternal: false });
var StraightEdgeInternal = createStraightEdge({ isInternal: true });
StraightEdge.displayName = "StraightEdge";
StraightEdgeInternal.displayName = "StraightEdgeInternal";
function createBezierEdge(params) {
  return (0, import_react3.memo)(({ id: id2, sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, pathOptions, interactionWidth }) => {
    const [path, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: pathOptions?.curvature
    });
    const _id = params.isInternal ? void 0 : id2;
    return (0, import_jsx_runtime4.jsx)(BaseEdge, { id: _id, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
  });
}
var BezierEdge = createBezierEdge({ isInternal: false });
var BezierEdgeInternal = createBezierEdge({ isInternal: true });
BezierEdge.displayName = "BezierEdge";
BezierEdgeInternal.displayName = "BezierEdgeInternal";
var builtinEdgeTypes = {
  default: BezierEdgeInternal,
  straight: StraightEdgeInternal,
  step: StepEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  simplebezier: SimpleBezierEdgeInternal
};
var nullPosition = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null,
  zIndex: void 0
};
var shiftX = (x, shift, position) => {
  if (position === Position.Left)
    return x - shift;
  if (position === Position.Right)
    return x + shift;
  return x;
};
var shiftY = (y, shift, position) => {
  if (position === Position.Top)
    return y - shift;
  if (position === Position.Bottom)
    return y + shift;
  return y;
};
var EdgeUpdaterClassName = "react-flow__edgeupdater";
function EdgeAnchor({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type }) {
  return (0, import_jsx_runtime4.jsx)("circle", { onMouseDown, onMouseEnter, onMouseOut, className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" });
}
function EdgeUpdateAnchors({ isReconnectable, reconnectRadius, edge, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, onReconnect, onReconnectStart, onReconnectEnd, setReconnecting, setUpdateHover }) {
  const store = useStoreApi();
  const handleEdgeUpdater = (event, oppositeHandle) => {
    if (event.button !== 0) {
      return;
    }
    const { autoPanOnConnect, domNode, connectionMode, connectionRadius, lib, onConnectStart, cancelConnection, nodeLookup, rfId: flowId, panBy: panBy2, updateConnection } = store.getState();
    const isTarget = oppositeHandle.type === "target";
    const _onReconnectEnd = (evt, connectionState) => {
      setReconnecting(false);
      onReconnectEnd?.(evt, edge, oppositeHandle.type, connectionState);
    };
    const onConnectEdge = (connection) => onReconnect?.(edge, connection);
    const _onConnectStart = (_event, params) => {
      setReconnecting(true);
      onReconnectStart?.(event, edge, oppositeHandle.type);
      onConnectStart?.(_event, params);
    };
    XYHandle.onPointerDown(event.nativeEvent, {
      autoPanOnConnect,
      connectionMode,
      connectionRadius,
      domNode,
      handleId: oppositeHandle.id,
      nodeId: oppositeHandle.nodeId,
      nodeLookup,
      isTarget,
      edgeUpdaterType: oppositeHandle.type,
      lib,
      flowId,
      cancelConnection,
      panBy: panBy2,
      isValidConnection: (...args) => store.getState().isValidConnection?.(...args) ?? true,
      onConnect: onConnectEdge,
      onConnectStart: _onConnectStart,
      onConnectEnd: (...args) => store.getState().onConnectEnd?.(...args),
      onReconnectEnd: _onReconnectEnd,
      updateConnection,
      getTransform: () => store.getState().transform,
      getFromHandle: () => store.getState().connection.fromHandle,
      dragThreshold: store.getState().connectionDragThreshold,
      handleDomNode: event.currentTarget
    });
  };
  const onReconnectSourceMouseDown = (event) => handleEdgeUpdater(event, { nodeId: edge.target, id: edge.targetHandle ?? null, type: "target" });
  const onReconnectTargetMouseDown = (event) => handleEdgeUpdater(event, { nodeId: edge.source, id: edge.sourceHandle ?? null, type: "source" });
  const onReconnectMouseEnter = () => setUpdateHover(true);
  const onReconnectMouseOut = () => setUpdateHover(false);
  return (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(isReconnectable === true || isReconnectable === "source") && (0, import_jsx_runtime4.jsx)(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: reconnectRadius, onMouseDown: onReconnectSourceMouseDown, onMouseEnter: onReconnectMouseEnter, onMouseOut: onReconnectMouseOut, type: "source" }), (isReconnectable === true || isReconnectable === "target") && (0, import_jsx_runtime4.jsx)(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: reconnectRadius, onMouseDown: onReconnectTargetMouseDown, onMouseEnter: onReconnectMouseEnter, onMouseOut: onReconnectMouseOut, type: "target" })] });
}
function EdgeWrapper({ id: id2, edgesFocusable, edgesReconnectable, elementsSelectable, onClick, onDoubleClick, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, rfId, edgeTypes: edgeTypes2, noPanClassName, onError, disableKeyboardA11y }) {
  let edge = useStore((s) => s.edgeLookup.get(id2));
  const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
  edge = defaultEdgeOptions ? { ...defaultEdgeOptions, ...edge } : edge;
  let edgeType = edge.type || "default";
  let EdgeComponent = edgeTypes2?.[edgeType] || builtinEdgeTypes[edgeType];
  if (EdgeComponent === void 0) {
    onError?.("011", errorMessages["error011"](edgeType));
    edgeType = "default";
    EdgeComponent = edgeTypes2?.["default"] || builtinEdgeTypes.default;
  }
  const isFocusable = !!(edge.focusable || edgesFocusable && typeof edge.focusable === "undefined");
  const isReconnectable = typeof onReconnect !== "undefined" && (edge.reconnectable || edgesReconnectable && typeof edge.reconnectable === "undefined");
  const isSelectable = !!(edge.selectable || elementsSelectable && typeof edge.selectable === "undefined");
  const edgeRef = (0, import_react3.useRef)(null);
  const [updateHover, setUpdateHover] = (0, import_react3.useState)(false);
  const [reconnecting, setReconnecting] = (0, import_react3.useState)(false);
  const store = useStoreApi();
  const { zIndex = edge.zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useStore((0, import_react3.useCallback)((store2) => {
    const sourceNode = store2.nodeLookup.get(edge.source);
    const targetNode = store2.nodeLookup.get(edge.target);
    if (!sourceNode || !targetNode) {
      return nullPosition;
    }
    const edgePosition = getEdgePosition({
      id: id2,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode: store2.connectionMode,
      onError
    });
    const zIndex2 = getElevatedEdgeZIndex({
      selected: edge.selected,
      zIndex: edge.zIndex,
      sourceNode,
      targetNode,
      elevateOnSelect: store2.elevateEdgesOnSelect,
      zIndexMode: store2.zIndexMode
    });
    return {
      ...edgePosition || nullPosition,
      zIndex: zIndex2
    };
  }, [edge.source, edge.target, edge.sourceHandle, edge.targetHandle, edge.selected, edge.zIndex, onError]), shallow$1);
  const markerStartUrl = (0, import_react3.useMemo)(() => edge.markerStart ? `url('#${getMarkerId(edge.markerStart, rfId)}')` : void 0, [edge.markerStart, rfId]);
  const markerEndUrl = (0, import_react3.useMemo)(() => edge.markerEnd ? `url('#${getMarkerId(edge.markerEnd, rfId)}')` : void 0, [edge.markerEnd, rfId]);
  if (edge.hidden || sourceX === null || sourceY === null || targetX === null || targetY === null) {
    return null;
  }
  const onEdgeClick = (event) => {
    const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
    if (isSelectable) {
      store.setState({ nodesSelectionActive: false });
      if (edge.selected && multiSelectionActive) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
        edgeRef.current?.blur();
      } else {
        addSelectedEdges([id2]);
      }
    }
    if (onClick) {
      onClick(event, edge);
    }
  };
  const onEdgeDoubleClick = onDoubleClick ? (event) => {
    onDoubleClick(event, { ...edge });
  } : void 0;
  const onEdgeContextMenu = onContextMenu ? (event) => {
    onContextMenu(event, { ...edge });
  } : void 0;
  const onEdgeMouseEnter = onMouseEnter ? (event) => {
    onMouseEnter(event, { ...edge });
  } : void 0;
  const onEdgeMouseMove = onMouseMove ? (event) => {
    onMouseMove(event, { ...edge });
  } : void 0;
  const onEdgeMouseLeave = onMouseLeave ? (event) => {
    onMouseLeave(event, { ...edge });
  } : void 0;
  const onKeyDown = (event) => {
    if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable) {
      const { unselectNodesAndEdges, addSelectedEdges } = store.getState();
      const unselect = event.key === "Escape";
      if (unselect) {
        edgeRef.current?.blur();
        unselectNodesAndEdges({ edges: [edge] });
      } else {
        addSelectedEdges([id2]);
      }
    }
  };
  return (0, import_jsx_runtime4.jsx)("svg", { style: { zIndex }, children: (0, import_jsx_runtime4.jsxs)("g", { className: cc([
    "react-flow__edge",
    `react-flow__edge-${edgeType}`,
    edge.className,
    noPanClassName,
    {
      selected: edge.selected,
      animated: edge.animated,
      inactive: !isSelectable && !onClick,
      updating: updateHover,
      selectable: isSelectable
    }
  ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClick, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: edge.ariaRole ?? (isFocusable ? "group" : "img"), "aria-roledescription": "edge", "data-id": id2, "data-testid": `rf__edge-${id2}`, "aria-label": edge.ariaLabel === null ? void 0 : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : void 0, ref: edgeRef, ...edge.domAttributes, children: [!reconnecting && (0, import_jsx_runtime4.jsx)(EdgeComponent, { id: id2, source: edge.source, target: edge.target, type: edge.type, selected: edge.selected, animated: edge.animated, selectable: isSelectable, deletable: edge.deletable ?? true, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data: edge.data, style: edge.style, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions: "pathOptions" in edge ? edge.pathOptions : void 0, interactionWidth: edge.interactionWidth }), isReconnectable && (0, import_jsx_runtime4.jsx)(EdgeUpdateAnchors, { edge, isReconnectable, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, setUpdateHover, setReconnecting })] }) });
}
var EdgeWrapper$1 = (0, import_react3.memo)(EdgeWrapper);
var selector$9 = (s) => ({
  edgesFocusable: s.edgesFocusable,
  edgesReconnectable: s.edgesReconnectable,
  elementsSelectable: s.elementsSelectable,
  connectionMode: s.connectionMode,
  onError: s.onError
});
function EdgeRendererComponent({ defaultMarkerColor, onlyRenderVisibleElements, rfId, edgeTypes: edgeTypes2, noPanClassName, onReconnect, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, reconnectRadius, onEdgeDoubleClick, onReconnectStart, onReconnectEnd, disableKeyboardA11y }) {
  const { edgesFocusable, edgesReconnectable, elementsSelectable, onError } = useStore(selector$9, shallow$1);
  const edgeIds = useVisibleEdgeIds(onlyRenderVisibleElements);
  return (0, import_jsx_runtime4.jsxs)("div", { className: "react-flow__edges", children: [(0, import_jsx_runtime4.jsx)(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId }), edgeIds.map((id2) => {
    return (0, import_jsx_runtime4.jsx)(EdgeWrapper$1, { id: id2, edgesFocusable, edgesReconnectable, elementsSelectable, noPanClassName, onReconnect, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onClick: onEdgeClick, reconnectRadius, onDoubleClick: onEdgeDoubleClick, onReconnectStart, onReconnectEnd, rfId, onError, edgeTypes: edgeTypes2, disableKeyboardA11y }, id2);
  })] });
}
EdgeRendererComponent.displayName = "EdgeRenderer";
var EdgeRenderer = (0, import_react3.memo)(EdgeRendererComponent);
var toTransformString = (transform2) => `translate(${transform2[0]}px,${transform2[1]}px) scale(${transform2[2]})`;
function Viewport({ children: children2 }) {
  const store = useStoreApi();
  const viewportRef = (0, import_react3.useRef)(null);
  const [initialTransform] = (0, import_react3.useState)(() => store.getState().transform);
  useIsomorphicLayoutEffect(() => {
    let prevTransform = null;
    const applyTransform = () => {
      const transform2 = store.getState().transform;
      if (prevTransform && transform2[0] === prevTransform[0] && transform2[1] === prevTransform[1] && transform2[2] === prevTransform[2]) {
        return;
      }
      prevTransform = transform2;
      if (viewportRef.current) {
        viewportRef.current.style.transform = toTransformString(transform2);
      }
    };
    applyTransform();
    return store.subscribe(applyTransform);
  }, [store]);
  return (0, import_jsx_runtime4.jsx)("div", { ref: viewportRef, className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: toTransformString(initialTransform) }, children: children2 });
}
function useOnInitHandler(onInit) {
  const rfInstance = useReactFlow();
  const isInitialized = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
var selector$8 = (state3) => state3.panZoom?.syncViewport;
function useViewportSync(viewport) {
  const syncViewport = useStore(selector$8);
  const store = useStoreApi();
  (0, import_react3.useEffect)(() => {
    if (viewport) {
      syncViewport?.(viewport);
      store.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
    }
  }, [viewport, syncViewport]);
  return null;
}
function storeSelector$1(s) {
  return s.connection.inProgress ? { ...s.connection, to: pointToRendererPoint(s.connection.to, s.transform) } : { ...s.connection };
}
function getSelector(connectionSelector) {
  if (connectionSelector) {
    const combinedSelector = (s) => {
      const connection = storeSelector$1(s);
      return connectionSelector(connection);
    };
    return combinedSelector;
  }
  return storeSelector$1;
}
function useConnection(connectionSelector) {
  const combinedSelector = getSelector(connectionSelector);
  return useStore(combinedSelector, shallow$1);
}
var selector$7 = (s) => ({
  nodesConnectable: s.nodesConnectable,
  isValid: s.connection.isValid,
  inProgress: s.connection.inProgress,
  width: s.width,
  height: s.height
});
function ConnectionLineWrapper({ containerStyle: containerStyle2, style: style2, type, component }) {
  const { nodesConnectable, width, height, isValid, inProgress } = useStore(selector$7, shallow$1);
  const renderConnection = !!(width && nodesConnectable && inProgress);
  if (!renderConnection) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)("svg", { style: containerStyle2, width, height, className: "react-flow__connectionline react-flow__container", children: (0, import_jsx_runtime4.jsx)("g", { className: cc(["react-flow__connection", getConnectionStatus(isValid)]), children: (0, import_jsx_runtime4.jsx)(ConnectionLine, { style: style2, type, CustomComponent: component, isValid }) }) });
}
var ConnectionLine = ({ style: style2, type = ConnectionLineType.Bezier, CustomComponent, isValid }) => {
  const { inProgress, from, fromNode, fromHandle, fromPosition, to, toNode, toHandle, toPosition, pointer: pointer2 } = useConnection();
  if (!inProgress) {
    return;
  }
  if (CustomComponent) {
    return (0, import_jsx_runtime4.jsx)(CustomComponent, { connectionLineType: type, connectionLineStyle: style2, fromNode, fromHandle, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, fromPosition, toPosition, connectionStatus: getConnectionStatus(isValid), toNode, toHandle, pointer: pointer2 });
  }
  let path = "";
  const pathParams = {
    sourceX: from.x,
    sourceY: from.y,
    sourcePosition: fromPosition,
    targetX: to.x,
    targetY: to.y,
    targetPosition: toPosition
  };
  switch (type) {
    case ConnectionLineType.Bezier:
      [path] = getBezierPath(pathParams);
      break;
    case ConnectionLineType.SimpleBezier:
      [path] = getSimpleBezierPath(pathParams);
      break;
    case ConnectionLineType.Step:
      [path] = getSmoothStepPath({
        ...pathParams,
        borderRadius: 0
      });
      break;
    case ConnectionLineType.SmoothStep:
      [path] = getSmoothStepPath(pathParams);
      break;
    default:
      [path] = getStraightPath(pathParams);
  }
  return (0, import_jsx_runtime4.jsx)("path", { d: path, fill: "none", className: "react-flow__connection-path", style: style2 });
};
ConnectionLine.displayName = "ConnectionLine";
var emptyTypes = {};
function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes = emptyTypes) {
  const typesRef = (0, import_react3.useRef)(nodeOrEdgeTypes);
  const store = useStoreApi();
  (0, import_react3.useEffect)(() => {
    if (false) {
      const usedKeys = /* @__PURE__ */ new Set([...Object.keys(typesRef.current), ...Object.keys(nodeOrEdgeTypes)]);
      for (const key of usedKeys) {
        if (typesRef.current[key] !== nodeOrEdgeTypes[key]) {
          store.getState().onError?.("002", errorMessages["error002"]());
          break;
        }
      }
      typesRef.current = nodeOrEdgeTypes;
    }
  }, [nodeOrEdgeTypes]);
}
function useStylesLoadedWarning() {
  const store = useStoreApi();
  const checked = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    if (false) {
      if (!checked.current) {
        const pane = document.querySelector(".react-flow__pane");
        if (pane && !(window.getComputedStyle(pane).zIndex === "1")) {
          store.getState().onError?.("013", errorMessages["error013"]("react"));
        }
        checked.current = true;
      }
    }
  }, []);
}
function GraphViewComponent({ nodeTypes: nodeTypes2, edgeTypes: edgeTypes2, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, autoPanOnSelection, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance, nodeClickDistance, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y, nodeExtent, rfId, viewport, onViewportChange, nodesDraggable }) {
  useNodeOrEdgeTypesWarning(nodeTypes2);
  useNodeOrEdgeTypesWarning(edgeTypes2);
  useStylesLoadedWarning();
  useOnInitHandler(onInit);
  useViewportSync(viewport);
  return (0, import_jsx_runtime4.jsx)(FlowRenderer, { onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, paneClickDistance, deleteKeyCode, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, autoPanOnSelection, defaultViewport: defaultViewport2, translateExtent, minZoom, maxZoom, onSelectionContextMenu, preventScrolling, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y, onViewportChange, isControlledViewport: !!viewport, children: (0, import_jsx_runtime4.jsxs)(Viewport, { children: [(0, import_jsx_runtime4.jsx)(EdgeRenderer, { edgeTypes: edgeTypes2, onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, onlyRenderVisibleElements, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, defaultMarkerColor, noPanClassName, disableKeyboardA11y, rfId }), (0, import_jsx_runtime4.jsx)(ConnectionLineWrapper, { style: connectionLineStyle, type: connectionLineType, component: connectionLineComponent, containerStyle: connectionLineContainerStyle }), (0, import_jsx_runtime4.jsx)("div", { className: "react-flow__edgelabel-renderer" }), (0, import_jsx_runtime4.jsx)(NodeRenderer, { nodeTypes: nodeTypes2, onNodeClick, onNodeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, nodeClickDistance, onlyRenderVisibleElements, noPanClassName, noDragClassName, disableKeyboardA11y, nodeExtent, rfId, nodesDraggable }), (0, import_jsx_runtime4.jsx)("div", { className: "react-flow__viewport-portal" })] }) });
}
GraphViewComponent.displayName = "GraphView";
var GraphView = (0, import_react3.memo)(GraphViewComponent);
var devWarn = createDevWarn("React Flow", "https://reactflow.dev/");
var getInitialState = ({ nodes, edges, defaultNodes, defaultEdges, width, height, fitView, fitViewOptions, minZoom = 0.5, maxZoom = 2, nodeOrigin, nodeExtent, zIndexMode = "basic" } = {}) => {
  const nodeLookup = /* @__PURE__ */ new Map();
  const parentLookup = /* @__PURE__ */ new Map();
  const connectionLookup = /* @__PURE__ */ new Map();
  const edgeLookup = /* @__PURE__ */ new Map();
  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];
  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;
  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  const { nodesInitialized } = adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
    nodeOrigin: storeNodeOrigin,
    nodeExtent: storeNodeExtent,
    zIndexMode
  });
  let transform2 = [0, 0, 1];
  if (fitView && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
    });
    const { x, y, zoom: zoom3 } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, fitViewOptions?.padding ?? 0.1);
    transform2 = [x, y, zoom3];
  }
  return {
    rfId: "1",
    width: width ?? 0,
    height: height ?? 0,
    transform: transform2,
    nodes: storeNodes,
    nodesInitialized,
    nodeLookup,
    parentLookup,
    edges: storeEdges,
    edgeLookup,
    connectionLookup,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: defaultNodes !== void 0,
    hasDefaultEdges: defaultEdges !== void 0,
    panZoom: null,
    minZoom,
    maxZoom,
    translateExtent: infiniteExtent,
    nodeExtent: storeNodeExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: "nopan",
    nodeOrigin: storeNodeOrigin,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: false,
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: true,
    selectNodesOnDrag: true,
    multiSelectionActive: false,
    fitViewQueued: fitView ?? false,
    fitViewOptions,
    fitViewResolver: null,
    connection: { ...initialConnection },
    connectionClickStartHandle: null,
    connectOnClick: true,
    ariaLiveMessage: "",
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    autoPanOnNodeFocus: true,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: false,
    ariaLabelConfig: defaultAriaLabelConfig,
    zIndexMode,
    defaultEdgeOptions: void 0,
    onNodesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onEdgesChangeMiddlewareMap: /* @__PURE__ */ new Map(),
    onNodesDelete: void 0,
    onEdgesDelete: void 0,
    onDelete: void 0,
    onBeforeDelete: void 0,
    onViewportChangeStart: void 0,
    onViewportChange: void 0,
    onViewportChangeEnd: void 0,
    onNodeDragStart: void 0,
    onNodeDrag: void 0,
    onNodeDragStop: void 0,
    onSelectionDragStart: void 0,
    onSelectionDrag: void 0,
    onSelectionDragStop: void 0,
    onMoveStart: void 0,
    onMove: void 0,
    onMoveEnd: void 0,
    onConnect: void 0,
    onConnectStart: void 0,
    onConnectEnd: void 0,
    onClickConnectStart: void 0,
    onClickConnectEnd: void 0
  };
};
var createStore2 = ({ nodes, edges, defaultNodes, defaultEdges, width, height, fitView, fitViewOptions, minZoom, maxZoom, nodeOrigin, nodeExtent, zIndexMode }) => createWithEqualityFn((set3, get3) => {
  async function resolveFitView() {
    const { nodeLookup, panZoom, fitViewOptions: fitViewOptions2, fitViewResolver, width: width2, height: height2, minZoom: minZoom2, maxZoom: maxZoom2 } = get3();
    if (!panZoom) {
      return;
    }
    await fitViewport({
      nodes: nodeLookup,
      width: width2,
      height: height2,
      panZoom,
      minZoom: minZoom2,
      maxZoom: maxZoom2
    }, fitViewOptions2);
    fitViewResolver?.resolve(true);
    set3({ fitViewResolver: null });
  }
  return {
    ...getInitialState({
      nodes,
      edges,
      width,
      height,
      fitView,
      fitViewOptions,
      minZoom,
      maxZoom,
      nodeOrigin,
      nodeExtent,
      defaultNodes,
      defaultEdges,
      zIndexMode
    }),
    setNodes: (nodes2) => {
      const { nodeLookup, parentLookup, nodeOrigin: nodeOrigin2, nodeExtent: nodeExtent2, elevateNodesOnSelect, fitViewQueued, zIndexMode: zIndexMode2, nodesSelectionActive } = get3();
      const { nodesInitialized, hasSelectedNodes } = adoptUserNodes(nodes2, nodeLookup, parentLookup, {
        nodeOrigin: nodeOrigin2,
        nodeExtent: nodeExtent2,
        elevateNodesOnSelect,
        checkEquality: true,
        zIndexMode: zIndexMode2
      });
      const nextNodesSelectionActive = nodesSelectionActive && hasSelectedNodes;
      if (fitViewQueued && nodesInitialized) {
        resolveFitView();
        set3({
          nodes: nodes2,
          nodesInitialized,
          fitViewQueued: false,
          fitViewOptions: void 0,
          nodesSelectionActive: nextNodesSelectionActive
        });
      } else {
        set3({ nodes: nodes2, nodesInitialized, nodesSelectionActive: nextNodesSelectionActive });
      }
    },
    setEdges: (edges2) => {
      const { connectionLookup, edgeLookup } = get3();
      updateConnectionLookup(connectionLookup, edgeLookup, edges2);
      set3({ edges: edges2 });
    },
    setDefaultNodesAndEdges: (nodes2, edges2) => {
      if (nodes2) {
        const { setNodes } = get3();
        setNodes(nodes2);
        set3({ hasDefaultNodes: true });
      }
      if (edges2) {
        const { setEdges } = get3();
        setEdges(edges2);
        set3({ hasDefaultEdges: true });
      }
    },
    /*
     * Every node gets registered at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (updates) => {
      const { triggerNodeChanges, nodeLookup, parentLookup, domNode, nodeOrigin: nodeOrigin2, nodeExtent: nodeExtent2, debug, fitViewQueued, zIndexMode: zIndexMode2 } = get3();
      const { changes, updatedInternals } = updateNodeInternals(updates, nodeLookup, parentLookup, domNode, nodeOrigin2, nodeExtent2, zIndexMode2);
      if (!updatedInternals) {
        return;
      }
      updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin: nodeOrigin2, nodeExtent: nodeExtent2, zIndexMode: zIndexMode2 });
      if (fitViewQueued) {
        resolveFitView();
        set3({ fitViewQueued: false, fitViewOptions: void 0 });
      } else {
        set3({});
      }
      if (changes?.length > 0) {
        if (debug) {
          console.log("React Flow: trigger node changes", changes);
        }
        triggerNodeChanges?.(changes);
      }
    },
    updateNodePositions: (nodeDragItems, dragging = false) => {
      const parentExpandChildren = [];
      let changes = [];
      const { nodeLookup, triggerNodeChanges, connection, updateConnection, onNodesChangeMiddlewareMap } = get3();
      for (const [id2, dragItem] of nodeDragItems) {
        const node = nodeLookup.get(id2);
        const expandParent = !!(node?.expandParent && node?.parentId && dragItem?.position);
        const change = {
          id: id2,
          type: "position",
          position: expandParent ? {
            x: Math.max(0, dragItem.position.x),
            y: Math.max(0, dragItem.position.y)
          } : dragItem.position,
          dragging
        };
        if (node && connection.inProgress && connection.fromNode.id === node.id) {
          const updatedFrom = getHandlePosition(node, connection.fromHandle, Position.Left, true);
          updateConnection({ ...connection, from: updatedFrom });
        }
        if (expandParent && node.parentId) {
          parentExpandChildren.push({
            id: id2,
            parentId: node.parentId,
            rect: {
              ...dragItem.internals.positionAbsolute,
              width: dragItem.measured.width ?? 0,
              height: dragItem.measured.height ?? 0
            }
          });
        }
        changes.push(change);
      }
      if (parentExpandChildren.length > 0) {
        const { parentLookup, nodeOrigin: nodeOrigin2 } = get3();
        const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin2);
        changes.push(...parentExpandChanges);
      }
      for (const middleware of onNodesChangeMiddlewareMap.values()) {
        changes = middleware(changes);
      }
      triggerNodeChanges(changes);
    },
    triggerNodeChanges: (changes) => {
      const { onNodesChange, setNodes, nodes: nodes2, hasDefaultNodes, debug } = get3();
      if (changes?.length) {
        if (hasDefaultNodes) {
          const updatedNodes = applyNodeChanges(changes, nodes2);
          setNodes(updatedNodes);
        }
        if (debug) {
          console.log("React Flow: trigger node changes", changes);
        }
        onNodesChange?.(changes);
      }
    },
    triggerEdgeChanges: (changes) => {
      const { onEdgesChange, setEdges, edges: edges2, hasDefaultEdges, debug } = get3();
      if (changes?.length) {
        if (hasDefaultEdges) {
          const updatedEdges = applyEdgeChanges(changes, edges2);
          setEdges(updatedEdges);
        }
        if (debug) {
          console.log("React Flow: trigger edge changes", changes);
        }
        onEdgesChange?.(changes);
      }
    },
    addSelectedNodes: (selectedNodeIds) => {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get3();
      if (multiSelectionActive) {
        const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        triggerNodeChanges(nodeChanges);
        return;
      }
      triggerNodeChanges(getSelectionChanges(nodeLookup, /* @__PURE__ */ new Set([...selectedNodeIds])));
      triggerEdgeChanges(getSelectionChanges(edgeLookup));
    },
    addSelectedEdges: (selectedEdgeIds) => {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get3();
      if (multiSelectionActive) {
        const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        triggerEdgeChanges(changedEdges);
        return;
      }
      triggerEdgeChanges(getSelectionChanges(edgeLookup, /* @__PURE__ */ new Set([...selectedEdgeIds])));
      triggerNodeChanges(getSelectionChanges(nodeLookup, /* @__PURE__ */ new Set()));
    },
    unselectNodesAndEdges: ({ nodes: nodes2, edges: edges2 } = {}) => {
      const { edges: storeEdges, nodes: storeNodes, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get3();
      const nodesToUnselect = nodes2 ? nodes2 : storeNodes;
      const edgesToUnselect = edges2 ? edges2 : storeEdges;
      const nodeChanges = [];
      for (const node of nodesToUnselect) {
        if (!node.selected) {
          continue;
        }
        nodeChanges.push(createSelectionChange(node.id, false));
      }
      const edgeChanges = [];
      for (const edge of edgesToUnselect) {
        if (!edge.selected) {
          continue;
        }
        edgeChanges.push(createSelectionChange(edge.id, false));
      }
      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
    setMinZoom: (minZoom2) => {
      const { panZoom, maxZoom: maxZoom2 } = get3();
      panZoom?.setScaleExtent([minZoom2, maxZoom2]);
      set3({ minZoom: minZoom2 });
    },
    setMaxZoom: (maxZoom2) => {
      const { panZoom, minZoom: minZoom2 } = get3();
      panZoom?.setScaleExtent([minZoom2, maxZoom2]);
      set3({ maxZoom: maxZoom2 });
    },
    setTranslateExtent: (translateExtent) => {
      get3().panZoom?.setTranslateExtent(translateExtent);
      set3({ translateExtent });
    },
    resetSelectedElements: () => {
      const { edges: edges2, nodes: nodes2, triggerNodeChanges, triggerEdgeChanges, elementsSelectable } = get3();
      if (!elementsSelectable) {
        return;
      }
      const nodeChanges = nodes2.reduce((res, node) => node.selected ? [...res, createSelectionChange(node.id, false)] : res, []);
      const edgeChanges = edges2.reduce((res, edge) => edge.selected ? [...res, createSelectionChange(edge.id, false)] : res, []);
      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
    setNodeExtent: (nextNodeExtent) => {
      const { nodes: nodes2, nodeLookup, parentLookup, nodeOrigin: nodeOrigin2, elevateNodesOnSelect, nodeExtent: nodeExtent2, zIndexMode: zIndexMode2 } = get3();
      if (nextNodeExtent[0][0] === nodeExtent2[0][0] && nextNodeExtent[0][1] === nodeExtent2[0][1] && nextNodeExtent[1][0] === nodeExtent2[1][0] && nextNodeExtent[1][1] === nodeExtent2[1][1]) {
        return;
      }
      adoptUserNodes(nodes2, nodeLookup, parentLookup, {
        nodeOrigin: nodeOrigin2,
        nodeExtent: nextNodeExtent,
        elevateNodesOnSelect,
        checkEquality: false,
        zIndexMode: zIndexMode2
      });
      set3({ nodeExtent: nextNodeExtent });
    },
    panBy: (delta) => {
      const { transform: transform2, width: width2, height: height2, panZoom, translateExtent } = get3();
      return panBy({ delta, panZoom, transform: transform2, translateExtent, width: width2, height: height2 });
    },
    setCenter: async (x, y, options) => {
      const { width: width2, height: height2, maxZoom: maxZoom2, panZoom } = get3();
      if (!panZoom) {
        return false;
      }
      const nextZoom = typeof options?.zoom !== "undefined" ? options.zoom : maxZoom2;
      await panZoom.setViewport({
        x: width2 / 2 - x * nextZoom,
        y: height2 / 2 - y * nextZoom,
        zoom: nextZoom
      }, { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate });
      return true;
    },
    cancelConnection: () => {
      set3({
        connection: { ...initialConnection }
      });
    },
    updateConnection: (connection) => {
      set3({ connection });
    },
    reset: () => set3({ ...getInitialState() })
  };
}, Object.is);
function ReactFlowProvider({ initialNodes: nodes, initialEdges: edges, defaultNodes, defaultEdges, initialWidth: width, initialHeight: height, initialMinZoom: minZoom, initialMaxZoom: maxZoom, initialFitViewOptions: fitViewOptions, fitView, nodeOrigin, nodeExtent, zIndexMode, children: children2 }) {
  const [store] = (0, import_react3.useState)(() => createStore2({
    nodes,
    edges,
    defaultNodes,
    defaultEdges,
    width,
    height,
    fitView,
    minZoom,
    maxZoom,
    fitViewOptions,
    nodeOrigin,
    nodeExtent,
    zIndexMode
  }));
  return (0, import_jsx_runtime4.jsx)(Provider$1, { value: store, children: (0, import_jsx_runtime4.jsx)(BatchProvider, { children: (0, import_jsx_runtime4.jsx)(HandleConfigProvider, { children: children2 }) }) });
}
function Wrapper({ children: children2, nodes, edges, defaultNodes, defaultEdges, width, height, fitView, fitViewOptions, minZoom, maxZoom, nodeOrigin, nodeExtent, zIndexMode }) {
  const isWrapped = (0, import_react3.useContext)(StoreContext);
  if (isWrapped) {
    return (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: children2 });
  }
  return (0, import_jsx_runtime4.jsx)(ReactFlowProvider, { initialNodes: nodes, initialEdges: edges, defaultNodes, defaultEdges, initialWidth: width, initialHeight: height, fitView, initialFitViewOptions: fitViewOptions, initialMinZoom: minZoom, initialMaxZoom: maxZoom, nodeOrigin, nodeExtent, zIndexMode, children: children2 });
}
var wrapperStyle = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function ReactFlow({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes: nodeTypes2, edgeTypes: edgeTypes2, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, onBeforeDelete, connectionMode, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = "Backspace", selectionKeyCode = "Shift", selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = "Space", multiSelectionKeyCode = isMacOs() ? "Meta" : "Control", zoomActivationKeyCode = isMacOs() ? "Meta" : "Control", snapToGrid, snapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag, nodesDraggable, autoPanOnNodeFocus, nodesConnectable, nodesFocusable, nodeOrigin = defaultNodeOrigin, edgesFocusable, edgesReconnectable, elementsSelectable = true, defaultViewport: defaultViewport$1 = defaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = "#b1b1b7", zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance = 1, nodeClickDistance = 0, children: children2, onReconnect, onReconnectStart, onReconnectEnd, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius = 10, onNodesChange, onEdgesChange, noDragClassName = "nodrag", noWheelClassName = "nowheel", noPanClassName = "nopan", fitView, fitViewOptions, connectOnClick, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, autoPanOnConnect, autoPanOnNodeDrag, autoPanOnSelection = true, autoPanSpeed, connectionRadius, isValidConnection, onError, style: style2, id: id2, nodeDragThreshold, connectionDragThreshold, viewport, onViewportChange, width, height, colorMode = "light", debug, onScroll, ariaLabelConfig, zIndexMode = "basic", ...rest }, ref) {
  const rfId = id2 || "1";
  const colorModeClassName = useColorModeClass(colorMode);
  const wrapperOnScroll = (0, import_react3.useCallback)((e) => {
    e.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" });
    onScroll?.(e);
  }, [onScroll]);
  return (0, import_jsx_runtime4.jsx)("div", { "data-testid": "rf__wrapper", ...rest, onScroll: wrapperOnScroll, style: { ...style2, ...wrapperStyle }, ref, className: cc(["react-flow", className, colorModeClassName]), id: id2, role: "application", children: (0, import_jsx_runtime4.jsxs)(Wrapper, { nodes, edges, width, height, fitView, fitViewOptions, minZoom, maxZoom, nodeOrigin, nodeExtent, zIndexMode, children: [(0, import_jsx_runtime4.jsx)(StoreUpdater, { nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, autoPanOnNodeFocus, nodesConnectable, nodesFocusable, edgesFocusable, edgesReconnectable, elementsSelectable, elevateNodesOnSelect, elevateEdgesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, snapToGrid, snapGrid, connectionMode, translateExtent, connectOnClick, defaultEdgeOptions, fitView, fitViewOptions, onNodesDelete, onEdgesDelete, onDelete, onNodeDragStart, onNodeDrag, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, onMove, onMoveStart, onMoveEnd, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, autoPanSpeed, onError, connectionRadius, isValidConnection, selectNodesOnDrag, nodeDragThreshold, connectionDragThreshold, onBeforeDelete, debug, ariaLabelConfig, zIndexMode }), (0, import_jsx_runtime4.jsx)(GraphView, { onInit, onNodeClick, onEdgeClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, nodeTypes: nodeTypes2, edgeTypes: edgeTypes2, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, deleteKeyCode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, onlyRenderVisibleElements, defaultViewport: defaultViewport$1, translateExtent, minZoom, maxZoom, preventScrolling, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, autoPanOnSelection, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, paneClickDistance, nodeClickDistance, onSelectionContextMenu, onSelectionStart, onSelectionEnd, onReconnect, onReconnectStart, onReconnectEnd, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, reconnectRadius, defaultMarkerColor, noDragClassName, noWheelClassName, noPanClassName, rfId, disableKeyboardA11y, nodeExtent, viewport, onViewportChange, nodesDraggable }), (0, import_jsx_runtime4.jsx)(SelectionListener, { onSelectionChange }), children2, (0, import_jsx_runtime4.jsx)(Attribution, { proOptions, position: attributionPosition }), (0, import_jsx_runtime4.jsx)(A11yDescriptions, { rfId, disableKeyboardA11y })] }) });
}
var index = fixedForwardRef(ReactFlow);
var error014 = errorMessages["error014"]();
function LinePattern({ dimensions, lineWidth, variant, className }) {
  return (0, import_jsx_runtime4.jsx)("path", { strokeWidth: lineWidth, d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`, className: cc(["react-flow__background-pattern", variant, className]) });
}
function DotPattern({ radius, className }) {
  return (0, import_jsx_runtime4.jsx)("circle", { cx: radius, cy: radius, r: radius, className: cc(["react-flow__background-pattern", "dots", className]) });
}
var BackgroundVariant;
(function(BackgroundVariant2) {
  BackgroundVariant2["Lines"] = "lines";
  BackgroundVariant2["Dots"] = "dots";
  BackgroundVariant2["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));
var defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6
};
var selector$3 = (s) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });
function BackgroundComponent({
  id: id2,
  variant = BackgroundVariant.Dots,
  // only used for dots and cross
  gap = 20,
  // only used for lines and cross
  size,
  lineWidth = 1,
  offset = 0,
  color: color2,
  bgColor,
  style: style2,
  className,
  patternClassName
}) {
  const ref = (0, import_react3.useRef)(null);
  const { transform: transform2, patternId } = useStore(selector$3, shallow$1);
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap = [gapXY[0] * transform2[2] || 1, gapXY[1] * transform2[2] || 1];
  const scaledSize = patternSize * transform2[2];
  const offsetXY = Array.isArray(offset) ? offset : [offset, offset];
  const patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
  const scaledOffset = [
    offsetXY[0] * transform2[2] + patternDimensions[0] / 2,
    offsetXY[1] * transform2[2] + patternDimensions[1] / 2
  ];
  const _patternId = `${patternId}${id2 ? id2 : ""}`;
  return (0, import_jsx_runtime4.jsxs)("svg", { className: cc(["react-flow__background", className]), style: {
    ...style2,
    ...containerStyle,
    "--xy-background-color-props": bgColor,
    "--xy-background-pattern-color-props": color2
  }, ref, "data-testid": "rf__background", children: [(0, import_jsx_runtime4.jsx)("pattern", { id: _patternId, x: transform2[0] % scaledGap[0], y: transform2[1] % scaledGap[1], width: scaledGap[0], height: scaledGap[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${scaledOffset[0]},-${scaledOffset[1]})`, children: isDots ? (0, import_jsx_runtime4.jsx)(DotPattern, { radius: scaledSize / 2, className: patternClassName }) : (0, import_jsx_runtime4.jsx)(LinePattern, { dimensions: patternDimensions, lineWidth, variant, className: patternClassName }) }), (0, import_jsx_runtime4.jsx)("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${_patternId})` })] });
}
BackgroundComponent.displayName = "Background";
var Background = (0, import_react3.memo)(BackgroundComponent);
function PlusIcon() {
  return (0, import_jsx_runtime4.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: (0, import_jsx_runtime4.jsx)("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function MinusIcon() {
  return (0, import_jsx_runtime4.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: (0, import_jsx_runtime4.jsx)("path", { d: "M0 0h32v4.2H0z" }) });
}
function FitViewIcon() {
  return (0, import_jsx_runtime4.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: (0, import_jsx_runtime4.jsx)("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function LockIcon() {
  return (0, import_jsx_runtime4.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: (0, import_jsx_runtime4.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function UnlockIcon() {
  return (0, import_jsx_runtime4.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: (0, import_jsx_runtime4.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function ControlButton({ children: children2, className, ...rest }) {
  return (0, import_jsx_runtime4.jsx)("button", { type: "button", className: cc(["react-flow__controls-button", className]), ...rest, children: children2 });
}
var selector$2 = (s) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
  ariaLabelConfig: s.ariaLabelConfig
});
function ControlsComponent({ style: style2, showZoom = true, showFitView = true, showInteractive = true, fitViewOptions, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, children: children2, position = "bottom-left", orientation = "vertical", "aria-label": ariaLabel }) {
  const store = useStoreApi();
  const { isInteractive, minZoomReached, maxZoomReached, ariaLabelConfig } = useStore(selector$2, shallow$1);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn?.();
  };
  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut?.();
  };
  const onFitViewHandler = () => {
    fitView(fitViewOptions);
    onFitView?.();
  };
  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive
    });
    onInteractiveChange?.(!isInteractive);
  };
  const orientationClass = orientation === "horizontal" ? "horizontal" : "vertical";
  return (0, import_jsx_runtime4.jsxs)(Panel, { className: cc(["react-flow__controls", orientationClass, className]), position, style: style2, "data-testid": "rf__controls", "aria-label": ariaLabel ?? ariaLabelConfig["controls.ariaLabel"], children: [showZoom && (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [(0, import_jsx_runtime4.jsx)(ControlButton, { onClick: onZoomInHandler, className: "react-flow__controls-zoomin", title: ariaLabelConfig["controls.zoomIn.ariaLabel"], "aria-label": ariaLabelConfig["controls.zoomIn.ariaLabel"], disabled: maxZoomReached, children: (0, import_jsx_runtime4.jsx)(PlusIcon, {}) }), (0, import_jsx_runtime4.jsx)(ControlButton, { onClick: onZoomOutHandler, className: "react-flow__controls-zoomout", title: ariaLabelConfig["controls.zoomOut.ariaLabel"], "aria-label": ariaLabelConfig["controls.zoomOut.ariaLabel"], disabled: minZoomReached, children: (0, import_jsx_runtime4.jsx)(MinusIcon, {}) })] }), showFitView && (0, import_jsx_runtime4.jsx)(ControlButton, { className: "react-flow__controls-fitview", onClick: onFitViewHandler, title: ariaLabelConfig["controls.fitView.ariaLabel"], "aria-label": ariaLabelConfig["controls.fitView.ariaLabel"], children: (0, import_jsx_runtime4.jsx)(FitViewIcon, {}) }), showInteractive && (0, import_jsx_runtime4.jsx)(ControlButton, { className: "react-flow__controls-interactive", onClick: onToggleInteractivity, title: ariaLabelConfig["controls.interactive.ariaLabel"], "aria-label": ariaLabelConfig["controls.interactive.ariaLabel"], children: isInteractive ? (0, import_jsx_runtime4.jsx)(UnlockIcon, {}) : (0, import_jsx_runtime4.jsx)(LockIcon, {}) }), children2] });
}
ControlsComponent.displayName = "Controls";
var Controls = (0, import_react3.memo)(ControlsComponent);
function MiniMapNodeComponent({ id: id2, x, y, width, height, style: style2, color: color2, strokeColor, strokeWidth, className, borderRadius, shapeRendering, selected: selected2, onClick }) {
  const { background, backgroundColor } = style2 || {};
  const fill = color2 || background || backgroundColor;
  return (0, import_jsx_runtime4.jsx)("rect", { className: cc(["react-flow__minimap-node", { selected: selected2 }, className]), x, y, rx: borderRadius, ry: borderRadius, width, height, style: {
    fill,
    stroke: strokeColor,
    strokeWidth
  }, shapeRendering, onClick: onClick ? (event) => onClick(event, id2) : void 0 });
}
var MiniMapNode = (0, import_react3.memo)(MiniMapNodeComponent);
var selectorNodeIds = (s) => s.nodes.map((node) => node.id);
var getAttrFunction = (func) => func instanceof Function ? func : () => func;
function MiniMapNodes({
  nodeStrokeColor,
  nodeColor,
  nodeClassName = "",
  nodeBorderRadius = 5,
  nodeStrokeWidth,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: NodeComponent = MiniMapNode,
  onClick
}) {
  const nodeIds = useStore(selectorNodeIds, shallow$1);
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const shapeRendering = typeof window === "undefined" || !!window.chrome ? "crispEdges" : "geometricPrecision";
  return (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: nodeIds.map((nodeId) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    (0, import_jsx_runtime4.jsx)(NodeComponentWrapper, { id: nodeId, nodeColorFunc, nodeStrokeColorFunc, nodeClassNameFunc, nodeBorderRadius, nodeStrokeWidth, NodeComponent, onClick, shapeRendering }, nodeId)
  )) });
}
function NodeComponentWrapperInner({ id: id2, nodeColorFunc, nodeStrokeColorFunc, nodeClassNameFunc, nodeBorderRadius, nodeStrokeWidth, shapeRendering, NodeComponent, onClick }) {
  const { node, x, y, width, height } = useStore((s) => {
    const node2 = s.nodeLookup.get(id2);
    if (!node2) {
      return { node: void 0, x: 0, y: 0, width: 0, height: 0 };
    }
    const userNode = node2.internals.userNode;
    const { x: x2, y: y2 } = node2.internals.positionAbsolute;
    const { width: width2, height: height2 } = getNodeDimensions(userNode);
    return {
      node: userNode,
      x: x2,
      y: y2,
      width: width2,
      height: height2
    };
  }, shallow$1);
  if (!node || node.hidden || !nodeHasDimensions(node)) {
    return null;
  }
  return (0, import_jsx_runtime4.jsx)(NodeComponent, { x, y, width, height, style: node.style, selected: !!node.selected, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth, shapeRendering, onClick, id: node.id });
}
var NodeComponentWrapper = (0, import_react3.memo)(NodeComponentWrapperInner);
var MiniMapNodes$1 = (0, import_react3.memo)(MiniMapNodes);
var defaultWidth = 200;
var defaultHeight = 150;
var filterHidden = (node) => !node.hidden;
var selector$1 = (s) => {
  const viewBB = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2]
  };
  let hasVisibleNode = false;
  for (const node of s.nodeLookup.values()) {
    if (!node.hidden) {
      hasVisibleNode = true;
      break;
    }
  }
  return {
    viewBB,
    boundingRect: hasVisibleNode ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { filter: filterHidden }), viewBB) : viewBB,
    rfId: s.rfId,
    panZoom: s.panZoom,
    translateExtent: s.translateExtent,
    flowWidth: s.width,
    flowHeight: s.height,
    ariaLabelConfig: s.ariaLabelConfig
  };
};
var rectEqual = (a, b) => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
var areEqual = (a, b) => rectEqual(a.viewBB, b.viewBB) && rectEqual(a.boundingRect, b.boundingRect) && a.rfId === b.rfId && a.panZoom === b.panZoom && a.translateExtent === b.translateExtent && a.flowWidth === b.flowWidth && a.flowHeight === b.flowHeight && a.ariaLabelConfig === b.ariaLabelConfig;
var ARIA_LABEL_KEY = "react-flow__minimap-desc";
function MiniMapComponent({
  style: style2,
  className,
  nodeStrokeColor,
  nodeColor,
  nodeClassName = "",
  nodeBorderRadius = 5,
  nodeStrokeWidth,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent,
  bgColor,
  maskColor,
  maskStrokeColor,
  maskStrokeWidth,
  position = "bottom-right",
  onClick,
  onNodeClick,
  pannable = false,
  zoomable = false,
  ariaLabel,
  inversePan,
  zoomStep = 1,
  offsetScale = 5
}) {
  const store = useStoreApi();
  const svg = (0, import_react3.useRef)(null);
  const { boundingRect, panZoom, viewBB, rfId, translateExtent, flowWidth, flowHeight, ariaLabelConfig } = useStore(selector$1, areEqual);
  const elementWidth = style2?.width ?? defaultWidth;
  const elementHeight = style2?.height ?? defaultHeight;
  const scaledWidth = boundingRect.width / elementWidth;
  const scaledHeight = boundingRect.height / elementHeight;
  const viewScale = Math.max(scaledWidth, scaledHeight);
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;
  const offset = offsetScale * viewScale;
  const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const height = viewHeight + offset * 2;
  const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
  const viewScaleRef = (0, import_react3.useRef)(0);
  const minimapInstance = (0, import_react3.useRef)();
  viewScaleRef.current = viewScale;
  (0, import_react3.useEffect)(() => {
    const currentPanZoom = store.getState().panZoom;
    if (svg.current && currentPanZoom) {
      minimapInstance.current = XYMinimap({
        domNode: svg.current,
        panZoom: currentPanZoom,
        getTransform: () => store.getState().transform,
        getViewScale: () => viewScaleRef.current
      });
      return () => {
        minimapInstance.current?.destroy();
      };
    }
  }, [panZoom]);
  (0, import_react3.useEffect)(() => {
    minimapInstance.current?.update({
      translateExtent,
      width: flowWidth,
      height: flowHeight,
      inversePan,
      pannable,
      zoomStep,
      zoomable
    });
  }, [pannable, zoomable, inversePan, zoomStep, translateExtent, flowWidth, flowHeight]);
  const onSvgClick = onClick ? (event) => {
    const [x2, y2] = minimapInstance.current?.pointer(event) || [0, 0];
    onClick(event, { x: x2, y: y2 });
  } : void 0;
  const nodeClickHandler = (0, import_react3.useCallback)((event, nodeId) => {
    const node = store.getState().nodeLookup.get(nodeId).internals.userNode;
    onNodeClick?.(event, node);
  }, [onNodeClick]);
  const onSvgNodeClick = onNodeClick ? nodeClickHandler : void 0;
  const _ariaLabel = ariaLabel ?? ariaLabelConfig["minimap.ariaLabel"];
  return (0, import_jsx_runtime4.jsx)(Panel, { position, style: {
    ...style2,
    "--xy-minimap-background-color-props": typeof bgColor === "string" ? bgColor : void 0,
    "--xy-minimap-mask-background-color-props": typeof maskColor === "string" ? maskColor : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof maskStrokeColor === "string" ? maskStrokeColor : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof maskStrokeWidth === "number" ? maskStrokeWidth * viewScale : void 0,
    "--xy-minimap-node-background-color-props": typeof nodeColor === "string" ? nodeColor : void 0,
    "--xy-minimap-node-stroke-color-props": typeof nodeStrokeColor === "string" ? nodeStrokeColor : void 0,
    "--xy-minimap-node-stroke-width-props": typeof nodeStrokeWidth === "number" ? nodeStrokeWidth : void 0
  }, className: cc(["react-flow__minimap", className]), "data-testid": "rf__minimap", children: (0, import_jsx_runtime4.jsxs)("svg", { width: elementWidth, height: elementHeight, viewBox: `${x} ${y} ${width} ${height}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": labelledBy, ref: svg, onClick: onSvgClick, children: [_ariaLabel && (0, import_jsx_runtime4.jsx)("title", { id: labelledBy, children: _ariaLabel }), (0, import_jsx_runtime4.jsx)(MiniMapNodes$1, { onClick: onSvgNodeClick, nodeColor, nodeStrokeColor, nodeBorderRadius, nodeClassName, nodeStrokeWidth, nodeComponent }), (0, import_jsx_runtime4.jsx)("path", { className: "react-flow__minimap-mask", d: `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
MiniMapComponent.displayName = "MiniMap";
var MiniMap = (0, import_react3.memo)(MiniMapComponent);
var scaleSelector = (calculateScale) => (store) => calculateScale ? `${Math.max(1 / store.transform[2], 1)}` : void 0;
var defaultPositions = {
  [ResizeControlVariant.Line]: "right",
  [ResizeControlVariant.Handle]: "bottom-right"
};
function ResizeControl({ nodeId, position, variant = ResizeControlVariant.Handle, className, style: style2 = void 0, children: children2, color: color2, minWidth = 10, minHeight = 10, maxWidth = Number.MAX_VALUE, maxHeight = Number.MAX_VALUE, keepAspectRatio = false, resizeDirection, autoScale = true, shouldResize, onResizeStart, onResize, onResizeEnd }) {
  const contextNodeId = useNodeId();
  const id2 = typeof nodeId === "string" ? nodeId : contextNodeId;
  const store = useStoreApi();
  const resizeControlRef = (0, import_react3.useRef)(null);
  const isHandleControl = variant === ResizeControlVariant.Handle;
  const scale = useStore((0, import_react3.useCallback)(scaleSelector(isHandleControl && autoScale), [isHandleControl, autoScale]), shallow$1);
  const resizer = (0, import_react3.useRef)(null);
  const controlPosition = position ?? defaultPositions[variant];
  (0, import_react3.useEffect)(() => {
    if (!resizeControlRef.current || !id2) {
      return;
    }
    if (!resizer.current) {
      resizer.current = XYResizer({
        domNode: resizeControlRef.current,
        nodeId: id2,
        getStoreItems: () => {
          const { nodeLookup, transform: transform2, snapGrid, snapToGrid, nodeOrigin, domNode } = store.getState();
          return {
            nodeLookup,
            transform: transform2,
            snapGrid,
            snapToGrid,
            nodeOrigin,
            paneDomNode: domNode
          };
        },
        onChange: (change, childChanges) => {
          const { triggerNodeChanges, nodeLookup, parentLookup, nodeOrigin } = store.getState();
          const changes = [];
          const nextPosition = { x: change.x, y: change.y };
          const node = nodeLookup.get(id2);
          if (node && node.expandParent && node.parentId) {
            const origin = node.origin ?? nodeOrigin;
            const width = change.width ?? node.measured.width ?? 0;
            const height = change.height ?? node.measured.height ?? 0;
            const child = {
              id: node.id,
              parentId: node.parentId,
              rect: {
                width,
                height,
                ...evaluateAbsolutePosition({
                  x: change.x ?? node.position.x,
                  y: change.y ?? node.position.y
                }, { width, height }, node.parentId, nodeLookup, origin)
              }
            };
            const parentExpandChanges = handleExpandParent([child], nodeLookup, parentLookup, nodeOrigin);
            changes.push(...parentExpandChanges);
            nextPosition.x = change.x ? Math.max(origin[0] * width, change.x) : void 0;
            nextPosition.y = change.y ? Math.max(origin[1] * height, change.y) : void 0;
          }
          if (nextPosition.x !== void 0 && nextPosition.y !== void 0) {
            const positionChange = {
              id: id2,
              type: "position",
              position: { ...nextPosition }
            };
            changes.push(positionChange);
          }
          if (change.width !== void 0 && change.height !== void 0) {
            const setAttributes = !resizeDirection ? true : resizeDirection === "horizontal" ? "width" : "height";
            const dimensionChange = {
              id: id2,
              type: "dimensions",
              resizing: true,
              setAttributes,
              dimensions: {
                width: change.width,
                height: change.height
              }
            };
            changes.push(dimensionChange);
          }
          for (const childChange of childChanges) {
            const positionChange = {
              ...childChange,
              type: "position"
            };
            changes.push(positionChange);
          }
          triggerNodeChanges(changes);
        },
        onEnd: ({ width, height }) => {
          const dimensionChange = {
            id: id2,
            type: "dimensions",
            resizing: false,
            dimensions: {
              width,
              height
            }
          };
          store.getState().triggerNodeChanges([dimensionChange]);
        }
      });
    }
    resizer.current.update({
      controlPosition,
      boundaries: {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight
      },
      keepAspectRatio,
      resizeDirection,
      onResizeStart,
      onResize,
      onResizeEnd,
      shouldResize
    });
    return () => {
      resizer.current?.destroy();
    };
  }, [
    controlPosition,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    keepAspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
    shouldResize
  ]);
  const positionClassNames = controlPosition.split("-");
  return (0, import_jsx_runtime4.jsx)("div", { className: cc(["react-flow__resize-control", "nodrag", ...positionClassNames, variant, className]), ref: resizeControlRef, style: {
    ...style2,
    scale,
    ...color2 && { [isHandleControl ? "backgroundColor" : "borderColor"]: color2 }
  }, children: children2 });
}
var NodeResizeControl = (0, import_react3.memo)(ResizeControl);

// dsh-css: dsh-css:node_modules/@xyflow/react/dist/style.css
var __tagId2 = "dsh-talk-pages/style.css";
var __css2 = "/* this gets exported as style.css and can be used for the default theming */ /* these are the necessary styles for React/Svelte Flow, they get used by base.css and style.css */ .react-flow { direction: ltr; --xy-edge-stroke-default: #b1b1b7; --xy-edge-stroke-width-default: 1; --xy-edge-stroke-selected-default: #555; --xy-connectionline-stroke-default: #b1b1b7; --xy-connectionline-stroke-width-default: 1; --xy-attribution-background-color-default: rgba(255, 255, 255, 0.5); --xy-minimap-background-color-default: #fff; --xy-minimap-mask-background-color-default: rgba(240, 240, 240, 0.6); --xy-minimap-mask-stroke-color-default: transparent; --xy-minimap-mask-stroke-width-default: 1; --xy-minimap-node-background-color-default: #e2e2e2; --xy-minimap-node-stroke-color-default: transparent; --xy-minimap-node-stroke-width-default: 2; --xy-background-color-default: transparent; --xy-background-pattern-dots-color-default: #91919a; --xy-background-pattern-lines-color-default: #eee; --xy-background-pattern-cross-color-default: #e2e2e2; background-color: var(--xy-background-color, var(--xy-background-color-default)); --xy-node-color-default: inherit; --xy-node-border-default: 1px solid #1a192b; --xy-node-background-color-default: #fff; --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25); --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(0, 0, 0, 0.08); --xy-node-boxshadow-selected-default: 0 0 0 0.5px #1a192b; --xy-node-border-radius-default: 3px; --xy-handle-background-color-default: #1a192b; --xy-handle-border-color-default: #fff; --xy-selection-background-color-default: rgba(0, 89, 220, 0.08); --xy-selection-border-default: 1px dotted rgba(0, 89, 220, 0.8); --xy-controls-button-background-color-default: #fefefe; --xy-controls-button-background-color-hover-default: #f4f4f4; --xy-controls-button-color-default: inherit; --xy-controls-button-color-hover-default: inherit; --xy-controls-button-border-color-default: #eee; --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08); --xy-edge-label-background-color-default: #ffffff; --xy-edge-label-color-default: inherit; --xy-resize-background-color-default: #3367d9; } .react-flow.dark { --xy-edge-stroke-default: #3e3e3e; --xy-edge-stroke-width-default: 1; --xy-edge-stroke-selected-default: #727272; --xy-connectionline-stroke-default: #b1b1b7; --xy-connectionline-stroke-width-default: 1; --xy-attribution-background-color-default: rgba(150, 150, 150, 0.25); --xy-minimap-background-color-default: #141414; --xy-minimap-mask-background-color-default: rgba(60, 60, 60, 0.6); --xy-minimap-mask-stroke-color-default: transparent; --xy-minimap-mask-stroke-width-default: 1; --xy-minimap-node-background-color-default: #2b2b2b; --xy-minimap-node-stroke-color-default: transparent; --xy-minimap-node-stroke-width-default: 2; --xy-background-color-default: #141414; --xy-background-pattern-dots-color-default: #555; --xy-background-pattern-lines-color-default: #333; --xy-background-pattern-cross-color-default: #333; --xy-node-color-default: #f8f8f8; --xy-node-border-default: 1px solid #3c3c3c; --xy-node-background-color-default: #1e1e1e; --xy-node-group-background-color-default: rgba(240, 240, 240, 0.25); --xy-node-boxshadow-hover-default: 0 1px 4px 1px rgba(255, 255, 255, 0.08); --xy-node-boxshadow-selected-default: 0 0 0 0.5px #999; --xy-handle-background-color-default: #bebebe; --xy-handle-border-color-default: #1e1e1e; --xy-selection-background-color-default: rgba(200, 200, 220, 0.08); --xy-selection-border-default: 1px dotted rgba(200, 200, 220, 0.8); --xy-controls-button-background-color-default: #2b2b2b; --xy-controls-button-background-color-hover-default: #3e3e3e; --xy-controls-button-color-default: #f8f8f8; --xy-controls-button-color-hover-default: #fff; --xy-controls-button-border-color-default: #5b5b5b; --xy-controls-box-shadow-default: 0 0 2px 1px rgba(0, 0, 0, 0.08); --xy-edge-label-background-color-default: #141414; --xy-edge-label-color-default: #f8f8f8; } .react-flow__background { background-color: var(--xy-background-color-props, var(--xy-background-color, var(--xy-background-color-default))); pointer-events: none; z-index: -1; } .react-flow__container { position: absolute; width: 100%; height: 100%; top: 0; left: 0; } .react-flow__pane { z-index: 1; touch-action: none; } .react-flow__pane.draggable { cursor: grab; } .react-flow__pane.dragging { cursor: grabbing; } .react-flow__pane.selection { cursor: pointer; } .react-flow__viewport { transform-origin: 0 0; z-index: 2; pointer-events: none; } .react-flow__renderer { z-index: 4; } .react-flow__selection { z-index: 6; } .react-flow__nodesselection-rect:focus, .react-flow__nodesselection-rect:focus-visible { outline: none; } .react-flow__edge-path { stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default)); stroke-width: var(--xy-edge-stroke-width, var(--xy-edge-stroke-width-default)); fill: none; } .react-flow__connection-path { stroke: var(--xy-connectionline-stroke, var(--xy-connectionline-stroke-default)); stroke-width: var(--xy-connectionline-stroke-width, var(--xy-connectionline-stroke-width-default)); fill: none; } .react-flow .react-flow__edges { position: absolute; } .react-flow .react-flow__edges svg { overflow: visible; position: absolute; pointer-events: none; } .react-flow__edge { pointer-events: visibleStroke; } .react-flow__edge.selectable { cursor: pointer; } .react-flow__edge.animated path { stroke-dasharray: 5; animation: dashdraw 0.5s linear infinite; } .react-flow__edge.animated path.react-flow__edge-interaction { stroke-dasharray: none; animation: none; } .react-flow__edge.inactive { pointer-events: none; } .react-flow__edge.selected, .react-flow__edge:focus, .react-flow__edge:focus-visible { outline: none; } .react-flow__edge.selected .react-flow__edge-path, .react-flow__edge.selectable:focus .react-flow__edge-path, .react-flow__edge.selectable:focus-visible .react-flow__edge-path { stroke: var(--xy-edge-stroke-selected, var(--xy-edge-stroke-selected-default)); } .react-flow__edge-textwrapper { pointer-events: all; } .react-flow__edge .react-flow__edge-text { pointer-events: none; -webkit-user-select: none; -moz-user-select: none; user-select: none; } /* Arrowhead marker styles - use CSS custom properties as default */ .react-flow__arrowhead polyline { stroke: var(--xy-edge-stroke, var(--xy-edge-stroke-default)); } .react-flow__arrowhead polyline.arrowclosed { fill: var(--xy-edge-stroke, var(--xy-edge-stroke-default)); } .react-flow__connection { pointer-events: none; } .react-flow__connection .animated { stroke-dasharray: 5; animation: dashdraw 0.5s linear infinite; } svg.react-flow__connectionline { z-index: 1001; overflow: visible; position: absolute; } .react-flow__nodes { pointer-events: none; transform-origin: 0 0; } .react-flow__node { position: absolute; -webkit-user-select: none; -moz-user-select: none; user-select: none; pointer-events: all; transform-origin: 0 0; box-sizing: border-box; cursor: default; } .react-flow__node.selectable { cursor: pointer; } .react-flow__node.draggable { cursor: grab; pointer-events: all; } .react-flow__node.draggable.dragging { cursor: grabbing; } .react-flow__nodesselection { z-index: 3; transform-origin: left top; pointer-events: none; } .react-flow__nodesselection-rect { position: absolute; pointer-events: all; cursor: grab; } .react-flow__handle { position: absolute; pointer-events: none; min-width: 5px; min-height: 5px; width: 6px; height: 6px; background-color: var(--xy-handle-background-color, var(--xy-handle-background-color-default)); border: 1px solid var(--xy-handle-border-color, var(--xy-handle-border-color-default)); border-radius: 100%; } .react-flow__handle.connectingfrom { pointer-events: all; } .react-flow__handle.connectionindicator { pointer-events: all; cursor: crosshair; } .react-flow__handle-bottom { top: auto; left: 50%; bottom: 0; transform: translate(-50%, 50%); } .react-flow__handle-top { top: 0; left: 50%; transform: translate(-50%, -50%); } .react-flow__handle-left { top: 50%; left: 0; transform: translate(-50%, -50%); } .react-flow__handle-right { top: 50%; right: 0; transform: translate(50%, -50%); } .react-flow__edgeupdater { cursor: move; pointer-events: all; } .react-flow__pane.selection .react-flow__panel { pointer-events: none; } .react-flow__panel { position: absolute; z-index: 5; margin: 15px; } .react-flow__panel.top { top: 0; } .react-flow__panel.bottom { bottom: 0; } .react-flow__panel.top.center, .react-flow__panel.bottom.center { left: 50%; transform: translateX(-15px) translateX(-50%); } .react-flow__panel.left { left: 0; } .react-flow__panel.right { right: 0; } .react-flow__panel.left.center, .react-flow__panel.right.center { top: 50%; transform: translateY(-15px) translateY(-50%); } .react-flow__attribution { font-size: 10px; background: var(--xy-attribution-background-color, var(--xy-attribution-background-color-default)); padding: 2px 3px; margin: 0; } .react-flow__attribution a { text-decoration: none; color: #999; } @keyframes dashdraw { from { stroke-dashoffset: 10; } } .react-flow__edgelabel-renderer { position: absolute; width: 100%; height: 100%; pointer-events: none; -webkit-user-select: none; -moz-user-select: none; user-select: none; left: 0; top: 0; } .react-flow__viewport-portal { position: absolute; width: 100%; height: 100%; left: 0; top: 0; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .react-flow__minimap { background: var( --xy-minimap-background-color-props, var(--xy-minimap-background-color, var(--xy-minimap-background-color-default)) ); } .react-flow__minimap-svg { display: block; } .react-flow__minimap-mask { fill: var( --xy-minimap-mask-background-color-props, var(--xy-minimap-mask-background-color, var(--xy-minimap-mask-background-color-default)) ); stroke: var( --xy-minimap-mask-stroke-color-props, var(--xy-minimap-mask-stroke-color, var(--xy-minimap-mask-stroke-color-default)) ); stroke-width: var( --xy-minimap-mask-stroke-width-props, var(--xy-minimap-mask-stroke-width, var(--xy-minimap-mask-stroke-width-default)) ); } .react-flow__minimap-node { fill: var( --xy-minimap-node-background-color-props, var(--xy-minimap-node-background-color, var(--xy-minimap-node-background-color-default)) ); stroke: var( --xy-minimap-node-stroke-color-props, var(--xy-minimap-node-stroke-color, var(--xy-minimap-node-stroke-color-default)) ); stroke-width: var( --xy-minimap-node-stroke-width-props, var(--xy-minimap-node-stroke-width, var(--xy-minimap-node-stroke-width-default)) ); } .react-flow__background-pattern.dots { fill: var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-dots-color-default)) ); } .react-flow__background-pattern.lines { stroke: var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-lines-color-default)) ); } .react-flow__background-pattern.cross { stroke: var( --xy-background-pattern-color-props, var(--xy-background-pattern-color, var(--xy-background-pattern-cross-color-default)) ); } .react-flow__controls { display: flex; flex-direction: column; box-shadow: var(--xy-controls-box-shadow, var(--xy-controls-box-shadow-default)); } .react-flow__controls.horizontal { flex-direction: row; } .react-flow__controls-button { display: flex; justify-content: center; align-items: center; height: 26px; width: 26px; padding: 4px; border: none; background: var(--xy-controls-button-background-color, var(--xy-controls-button-background-color-default)); border-bottom: 1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) ); color: var( --xy-controls-button-color-props, var(--xy-controls-button-color, var(--xy-controls-button-color-default)) ); cursor: pointer; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .react-flow__controls-button svg { width: 100%; max-width: 12px; max-height: 12px; fill: currentColor; } .react-flow__edge.updating .react-flow__edge-path { stroke: #777; } .react-flow__edge-text { font-size: 10px; } .react-flow__node.selectable:focus, .react-flow__node.selectable:focus-visible { outline: none; } .react-flow__node-input, .react-flow__node-default, .react-flow__node-output, .react-flow__node-group { padding: 10px; border-radius: var(--xy-node-border-radius, var(--xy-node-border-radius-default)); width: 150px; font-size: 12px; color: var(--xy-node-color, var(--xy-node-color-default)); text-align: center; border: var(--xy-node-border, var(--xy-node-border-default)); background-color: var(--xy-node-background-color, var(--xy-node-background-color-default)); } .react-flow__node-input.selectable:hover, .react-flow__node-default.selectable:hover, .react-flow__node-output.selectable:hover, .react-flow__node-group.selectable:hover { box-shadow: var(--xy-node-boxshadow-hover, var(--xy-node-boxshadow-hover-default)); } .react-flow__node-input.selectable.selected, .react-flow__node-input.selectable:focus, .react-flow__node-input.selectable:focus-visible, .react-flow__node-default.selectable.selected, .react-flow__node-default.selectable:focus, .react-flow__node-default.selectable:focus-visible, .react-flow__node-output.selectable.selected, .react-flow__node-output.selectable:focus, .react-flow__node-output.selectable:focus-visible, .react-flow__node-group.selectable.selected, .react-flow__node-group.selectable:focus, .react-flow__node-group.selectable:focus-visible { box-shadow: var(--xy-node-boxshadow-selected, var(--xy-node-boxshadow-selected-default)); } .react-flow__node-group { background-color: var(--xy-node-group-background-color, var(--xy-node-group-background-color-default)); } .react-flow__nodesselection-rect, .react-flow__selection { background: var(--xy-selection-background-color, var(--xy-selection-background-color-default)); border: var(--xy-selection-border, var(--xy-selection-border-default)); } .react-flow__nodesselection-rect:focus, .react-flow__nodesselection-rect:focus-visible, .react-flow__selection:focus, .react-flow__selection:focus-visible { outline: none; } .react-flow__controls-button:hover { background: var( --xy-controls-button-background-color-hover-props, var(--xy-controls-button-background-color-hover, var(--xy-controls-button-background-color-hover-default)) ); color: var( --xy-controls-button-color-hover-props, var(--xy-controls-button-color-hover, var(--xy-controls-button-color-hover-default)) ); } .react-flow__controls-button:disabled { pointer-events: none; } .react-flow__controls-button:disabled svg { fill-opacity: 0.4; } .react-flow__controls-button:last-child { border-bottom: none; } .react-flow__controls.horizontal .react-flow__controls-button { border-bottom: none; border-right: 1px solid var( --xy-controls-button-border-color-props, var(--xy-controls-button-border-color, var(--xy-controls-button-border-color-default)) ); } .react-flow__controls.horizontal .react-flow__controls-button:last-child { border-right: none; } .react-flow__resize-control { position: absolute; } .react-flow__resize-control.left, .react-flow__resize-control.right { cursor: ew-resize; } .react-flow__resize-control.top, .react-flow__resize-control.bottom { cursor: ns-resize; } .react-flow__resize-control.top.left, .react-flow__resize-control.bottom.right { cursor: nwse-resize; } .react-flow__resize-control.bottom.left, .react-flow__resize-control.top.right { cursor: nesw-resize; } /* handle styles */ .react-flow__resize-control.handle { width: 5px; height: 5px; border: 1px solid #fff; border-radius: 1px; background-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default)); translate: -50% -50%; } .react-flow__resize-control.handle.left { left: 0; top: 50%; } .react-flow__resize-control.handle.right { left: 100%; top: 50%; } .react-flow__resize-control.handle.top { left: 50%; top: 0; } .react-flow__resize-control.handle.bottom { left: 50%; top: 100%; } .react-flow__resize-control.handle.top.left { left: 0; } .react-flow__resize-control.handle.bottom.left { left: 0; } .react-flow__resize-control.handle.top.right { left: 100%; } .react-flow__resize-control.handle.bottom.right { left: 100%; } /* line styles */ .react-flow__resize-control.line { border-color: var(--xy-resize-background-color, var(--xy-resize-background-color-default)); border-width: 0; border-style: solid; } .react-flow__resize-control.line.left, .react-flow__resize-control.line.right { width: 1px; transform: translate(-50%, 0); top: 0; height: 100%; } .react-flow__resize-control.line.left { left: 0; border-left-width: 1px; } .react-flow__resize-control.line.right { left: 100%; border-right-width: 1px; } .react-flow__resize-control.line.top, .react-flow__resize-control.line.bottom { height: 1px; transform: translate(0, -50%); left: 0; width: 100%; } .react-flow__resize-control.line.top { top: 0; border-top-width: 1px; } .react-flow__resize-control.line.bottom { border-bottom-width: 1px; top: 100%; } .react-flow__edge-textbg { fill: var(--xy-edge-label-background-color, var(--xy-edge-label-background-color-default)); } .react-flow__edge-text { fill: var(--xy-edge-label-color, var(--xy-edge-label-color-default)); }";
if (typeof document !== "undefined") {
  const __selector = "style[data-plugin-css=" + JSON.stringify(__tagId2) + "]";
  if (document.querySelector(__selector) === null) {
    const __tag = document.createElement("style");
    __tag.dataset.plugin = "dsh-talk-pages";
    __tag.dataset.pluginCss = __tagId2;
    __tag.textContent = __css2;
    document.head.appendChild(__tag);
  }
}

// src/client/canvas-actions.ts
var canvasActions = {
  /** Set by MapCanvas on mount, cleared on unmount. */
  setCreateBox(action) {
    createBoxAction = action;
  },
  /** Create a box at the centre of the current viewport (no-op before mount). */
  createBox() {
    createBoxAction?.();
  },
  available() {
    return createBoxAction !== void 0;
  }
};
var createBoxAction;

// src/client/colors.ts
var COLOR_TAGS = [
  { id: "red", swatch: "#e5484d", border: "rgba(229,72,77,0.75)", fill: "rgba(229,72,77,0.18)", faint: "rgba(229,72,77,0.05)" },
  { id: "orange", swatch: "#f76b15", border: "rgba(247,107,21,0.75)", fill: "rgba(247,107,21,0.18)", faint: "rgba(247,107,21,0.05)" },
  { id: "yellow", swatch: "#ffc53d", border: "rgba(255,197,61,0.75)", fill: "rgba(255,197,61,0.18)", faint: "rgba(255,197,61,0.05)" },
  { id: "green", swatch: "#30a46c", border: "rgba(48,164,108,0.8)", fill: "rgba(48,164,108,0.18)", faint: "rgba(48,164,108,0.05)" },
  { id: "teal", swatch: "#12a594", border: "rgba(18,165,148,0.8)", fill: "rgba(18,165,148,0.18)", faint: "rgba(18,165,148,0.05)" },
  { id: "blue", swatch: "#3e63dd", border: "rgba(62,99,221,0.8)", fill: "rgba(62,99,221,0.2)", faint: "rgba(62,99,221,0.06)" },
  { id: "purple", swatch: "#8e4ec6", border: "rgba(142,78,198,0.8)", fill: "rgba(142,78,198,0.18)", faint: "rgba(142,78,198,0.05)" },
  { id: "gray", swatch: "#7d828d", border: "rgba(125,130,141,0.8)", fill: "rgba(125,130,141,0.16)", faint: "rgba(125,130,141,0.05)" }
];
var byId = new Map(COLOR_TAGS.map((tag) => [tag.id, tag]));
function colorOf(tagId) {
  return tagId === void 0 ? void 0 : byId.get(tagId);
}

// src/client/digest-text.ts
function digestBody(digest) {
  const parts = [];
  if (digest.summary !== "") parts.push(`${t("inject.summary")}${digest.summary}`);
  if (digest.keyFindings.length > 0) {
    parts.push(t("inject.findings"));
    for (const finding of digest.keyFindings) parts.push(`- ${finding}`);
  }
  const next = digest.nextStep !== "" ? digest.nextStep : digest.todoNext ?? "";
  if (next !== "") parts.push(`${t("inject.next")}${next}`);
  return parts;
}
function digestIsEmpty(digest) {
  return digest === void 0 || digestBody(digest).length === 0;
}
function buildInjectionText(title, digest) {
  const header = `${t("inject.header")}「${title}」`;
  if (digest === void 0 || digestIsEmpty(digest)) {
    return `${header}
${t("spawn.noDigest")}`;
  }
  return [header, ...digestBody(digest), t("inject.recall", { title })].join("\n");
}
function buildPushText(title, digest) {
  const now2 = /* @__PURE__ */ new Date();
  const time = `${String(now2.getHours()).padStart(2, "0")}:${String(now2.getMinutes()).padStart(2, "0")}`;
  const header = t("push.header", { from: title, time });
  return [header, ...digestBody(digest), t("inject.recall", { title })].join("\n");
}

// src/client/edge-sync.ts
var SAME_MOMENT_MS = 5e3;
var FAR_BEHIND_MS = 12 * 60 * 60 * 1e3;
function edgeSyncState(input) {
  if (input.kind === "link") return "idle";
  if (input.kind === "full") return "idle";
  if (input.lastPushAt === void 0) return "idle";
  if (input.sourceUpdatedAt === void 0) return "idle";
  const lastPushAt = Number(input.lastPushAt);
  const sourceUpdatedAt = Number(input.sourceUpdatedAt);
  if (!Number.isFinite(lastPushAt) || !Number.isFinite(sourceUpdatedAt)) return "idle";
  if (sourceUpdatedAt <= lastPushAt + SAME_MOMENT_MS) return "synced";
  const now2 = Number(input.now ?? Date.now());
  return now2 - lastPushAt >= FAR_BEHIND_MS ? "far" : "stale";
}
function lineageSyncState(input) {
  const parent = Number(input.parentUpdatedAt);
  const child = Number(input.childUpdatedAt);
  if (!Number.isFinite(parent) || !Number.isFinite(child)) return "idle";
  if (child + SAME_MOMENT_MS >= parent) return "synced";
  const now2 = Number(input.now ?? Date.now());
  return now2 - child >= FAR_BEHIND_MS ? "far" : "stale";
}

// src/client/edge-routing.ts
var DEFAULT_MIN_SPAN = 96;
function pickFaces(from, to, obstacles, options) {
  const minSpan = options.minSpan ?? DEFAULT_MIN_SPAN;
  const size = { width: options.cardWidth, height: options.cardHeight };
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const gapX = Math.abs(dx) - options.cardWidth;
  const gapY = Math.abs(dy) - options.cardHeight;
  const horizontalDominant = Math.abs(dx) >= Math.abs(dy);
  const approachClear = (rect, side) => {
    const band = 30;
    return !obstacles.some((other) => {
      if (other.id === rect.id || other.id === from.id || other.id === to.id) return false;
      const ox = Math.abs(other.x - rect.x);
      const oy = Math.abs(other.y - rect.y);
      if (side === "r") return other.x > rect.x && other.x - rect.x < options.cardWidth + band && oy < options.cardHeight * 0.9;
      if (side === "l") return other.x < rect.x && rect.x - other.x < options.cardWidth + band && oy < options.cardHeight * 0.9;
      if (side === "b") return other.y > rect.y && other.y - rect.y < options.cardHeight + band && ox < options.cardWidth * 0.9;
      return other.y < rect.y && rect.y - other.y < options.cardHeight + band && ox < options.cardWidth * 0.9;
    });
  };
  if (horizontalDominant) {
    const fromSide2 = dx >= 0 ? "r" : "l";
    const toSide2 = dx >= 0 ? "l" : "r";
    if (approachClear(from, fromSide2) && approachClear(to, toSide2)) {
      return { fromHandle: fromSide2, toHandle: toSide2 };
    }
    const freeFrom2 = approachClear(from, "b") ? "b" : "t";
    const freeTo2 = approachClear(to, "b") ? "b" : "t";
    return { fromHandle: freeFrom2, toHandle: freeTo2 };
  }
  const fromSide = dy >= 0 ? "b" : "t";
  const toSide = dy >= 0 ? "t" : "b";
  if (approachClear(from, fromSide) && approachClear(to, toSide)) {
    return { fromHandle: fromSide, toHandle: toSide };
  }
  const freeFrom = approachClear(from, "r") ? "r" : "l";
  const freeTo = approachClear(to, "r") ? "r" : "l";
  return { fromHandle: freeFrom, toHandle: freeTo };
}

// src/client/push-log.ts
var KEY = "dsh.talk-pages.push-log.v1";
function pairKey(fromCardId, toCardId) {
  return `${fromCardId}>${toCardId}`;
}
function read2() {
  try {
    if (typeof localStorage === "undefined") return {};
    const raw = localStorage.getItem(KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
function stampPush(fromCardId, toCardId) {
  const at = Date.now();
  try {
    const log = read2();
    log[pairKey(fromCardId, toCardId)] = at;
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(log));
  } catch {
  }
  return at;
}
function lastPushFor(fromCardId, toCardId) {
  const value2 = read2()[pairKey(fromCardId, toCardId)];
  return typeof value2 === "number" ? value2 : void 0;
}

// src/client/DigestDialog.tsx
var import_react4 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
function DigestDialog(props) {
  const textRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    const release = mapUi.claimEscape("digest-dialog");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      props.onClose();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  }, [props]);
  const empty2 = digestIsEmpty(props.digest);
  const pushText = empty2 ? "" : buildPushText(props.title, props.digest);
  const injectText = empty2 ? "" : buildInjectionText(props.title, props.digest);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      className: talk_pages_default["dialogBackdrop"],
      "data-talkmap-digest-dialog": "",
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) props.onClose();
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: talk_pages_default["digestDialog"], onMouseDown: (event) => {
        event.stopPropagation();
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: talk_pages_default["digestDialogHead"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: talk_pages_default["digestDialogTitle"], children: t("digest.title") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: talk_pages_default["digestDialogFrom"], children: props.title })
        ] }),
        empty2 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: talk_pages_default["digestEmpty"], children: t("digest.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: talk_pages_default["digestLabel"], children: t("digest.pushLabel") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "textarea",
            {
              ref: textRef,
              className: talk_pages_default["digestText"],
              readOnly: true,
              value: pushText,
              spellCheck: false,
              onFocus: (event) => {
                event.currentTarget.select();
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: talk_pages_default["digestLabel"], children: t("digest.injectLabel") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "textarea",
            {
              className: talk_pages_default["digestText"],
              readOnly: true,
              value: injectText,
              spellCheck: false,
              onFocus: (event) => {
                event.currentTarget.select();
              }
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: talk_pages_default["digestActions"], children: [
          empty2 ? null : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "button",
            {
              type: "button",
              className: talk_pages_default["spawnBtnPrimary"],
              onClick: () => {
                const value2 = pushText;
                void navigator.clipboard?.writeText(value2).catch(() => {
                });
              },
              children: t("digest.copy")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: talk_pages_default["spawnBtnGhost"], onClick: props.onClose, children: t("digest.close") })
        ] })
      ] })
    }
  );
}

// src/client/rpc.ts
async function callRpc(endpoint, request = {}) {
  const rpc = connectionService()?.rpc;
  if (rpc === void 0) throw new Error(t("spawn.apiUnavailable"));
  const controller = new AbortController();
  const result = await rpc.call("/api", endpoint, { args: { request } }, controller.signal);
  if (result.ok !== true) {
    const failure = result.error;
    throw new Error(`${endpoint}: ${failure?.message ?? failure?.code ?? "failed"}`);
  }
  return result.value;
}
function reportToHost(payload) {
  try {
    void fetch("/talk-pages/client-boot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString(), ...payload })
    }).catch(() => {
    });
  } catch {
  }
}
async function fetchSearchContext(sessionId, seq, query) {
  try {
    const page = await talkMapApi.searchContext(sessionId, seq, query);
    return Array.isArray(page.lines) ? page.lines.filter((line) => typeof line === "string" && line !== "") : [];
  } catch (error) {
    reportToHost({ phase: "search-context-failed", sessionId, seq, message: String(error?.message ?? error) });
    return [];
  }
}
async function fetchSessionHits(sessionId, query) {
  try {
    const page = await talkMapApi.searchSessionHits(sessionId, query);
    const blocks = (page.blocks ?? []).filter((block) => Array.isArray(block) && block.length > 0);
    return { blocks, seqs: blocks.map((_, index2) => typeof page.seqs?.[index2] === "number" ? page.seqs[index2] : null) };
  } catch (error) {
    reportToHost({ phase: "search-session-failed", sessionId, message: String(error?.message ?? error) });
    return { blocks: [], seqs: [] };
  }
}

// src/client/session-actions.ts
var RECYCLE_BIN_ROUTE = "dsh-session-recycle-bin/api";
async function postRecycleBin(body) {
  const path = new URL(RECYCLE_BIN_ROUTE, document.baseURI).pathname;
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    throw new Error(`回收站接口返回 HTTP ${response.status}`);
  }
  if (payload.ok !== true) throw new Error(payload.message ?? `回收站拒绝了请求（HTTP ${response.status}）`);
  return payload;
}
var STOP_RETRIES = 10;
var STOP_RETRY_DELAY_MS = 400;
function isBusyRefusal(error) {
  const message = String(error?.message ?? error);
  return message.includes("still has work") || message.includes("session-open") || message.includes("still active");
}
async function stopWork(sessionIds) {
  const ui = uiWorkspaceService();
  if (ui === void 0 || typeof ui.archiveSession !== "function") return;
  for (const sessionId of sessionIds) {
    await ui.archiveSession(sessionId, { stopActivity: true }).catch(() => {
    });
  }
}
async function trashSessions(sessionIds, onStopping) {
  const ids = [...sessionIds];
  if (ids.length === 0) return 0;
  const attempt = async () => {
    const reply = ids.length === 1 ? await postRecycleBin({ action: "trash", sessionId: ids[0] }) : await postRecycleBin({ action: "trashMany", sessionIds: ids });
    return reply.trashedCount ?? ids.length;
  };
  try {
    return await attempt();
  } catch (error) {
    if (!isBusyRefusal(error)) throw error;
    onStopping?.();
    await stopWork(ids);
    let last = error;
    for (let round2 = 0; round2 < STOP_RETRIES; round2 += 1) {
      await new Promise((resolve) => setTimeout(resolve, STOP_RETRY_DELAY_MS));
      try {
        return await attempt();
      } catch (retryError) {
        last = retryError;
        if (!isBusyRefusal(retryError)) throw retryError;
      }
    }
    throw last;
  }
}
async function archiveSessions(sessionIds) {
  const ui = uiWorkspaceService();
  if (ui === void 0 || typeof ui.archiveSession !== "function") {
    throw new Error("这个构建没有暴露归档接口");
  }
  let done = 0;
  for (const sessionId of sessionIds) {
    await ui.archiveSession(sessionId, { stopActivity: true });
    done += 1;
  }
  return done;
}

// src/client/drawer-state.ts
var GROUP_KEY = "dsh.talk-pages.drawer.v1";
var SCROLL_KEY = "dsh.talk-pages.drawer-scroll.v1";
function safeRead(key) {
  try {
    return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeWrite(key, value2) {
  try {
    if (typeof localStorage === "undefined") return;
    if (value2 === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value2);
  } catch {
  }
}
var drawerState = {
  /** Folder the drawer was last open on, or null. */
  readGroup() {
    const value2 = safeRead(GROUP_KEY);
    return value2 === null || value2 === "" ? null : value2;
  },
  writeGroup(groupId) {
    safeWrite(GROUP_KEY, groupId);
  },
  readScroll() {
    const raw = safeRead(SCROLL_KEY);
    const value2 = raw === null ? 0 : Number(raw);
    return Number.isFinite(value2) && value2 > 0 ? value2 : 0;
  },
  writeScroll(offset) {
    safeWrite(SCROLL_KEY, String(Math.max(0, Math.round(offset))));
  },
  /** Both together: closing the drawer forgets where it was. */
  clear() {
    safeWrite(GROUP_KEY, null);
    safeWrite(SCROLL_KEY, null);
  }
};

// src/client/state-persist.ts
var STORAGE_KEY2 = "dsh.talk-pages.lamp-state.v1";
var MAX_AGE_MS = 14 * 24 * 60 * 60 * 1e3;
var EMPTY = { version: 1, finished: {}, errors: {}, interrupted: {} };
function prune(record, now2) {
  const out = {};
  for (const [sessionId, at] of Object.entries(record)) {
    if (typeof at === "number" && now2 - at < MAX_AGE_MS) out[sessionId] = at;
  }
  return out;
}
var cache = null;
var timer2;
function loadLampState() {
  if (cache !== null) return cache;
  if (typeof localStorage === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY2);
    if (raw === null) {
      cache = EMPTY;
      return cache;
    }
    const parsed = JSON.parse(raw);
    const now2 = Date.now();
    cache = {
      version: 1,
      finished: prune(parsed.finished ?? {}, now2),
      errors: parsed.errors ?? {},
      interrupted: prune(parsed.interrupted ?? {}, now2)
    };
  } catch {
    cache = EMPTY;
  }
  return cache;
}
function saveLampState(patch) {
  const base = loadLampState();
  cache = {
    version: 1,
    finished: patch.finished ?? base.finished,
    errors: patch.errors ?? base.errors,
    interrupted: patch.interrupted ?? base.interrupted
  };
  if (typeof localStorage === "undefined") return;
  if (timer2 !== void 0) clearTimeout(timer2);
  timer2 = setTimeout(() => {
    flushLampState();
  }, 250);
}
function flushLampState() {
  if (timer2 !== void 0) {
    clearTimeout(timer2);
    timer2 = void 0;
  }
  if (cache === null || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY2, JSON.stringify(cache));
  } catch {
  }
}
function recordRunningAtShutdown(sessionIds) {
  const base = loadLampState();
  const interrupted2 = { ...base.interrupted };
  const now2 = Date.now();
  for (const sessionId of sessionIds) interrupted2[sessionId] = now2;
  saveLampState({ interrupted: interrupted2 });
  flushLampState();
}

// src/client/session-alerts.ts
var alerts = /* @__PURE__ */ new Map();
var snapshot2 = /* @__PURE__ */ new Map();
var listeners4 = /* @__PURE__ */ new Set();
for (const [sessionId, detail] of Object.entries(loadLampState().errors)) {
  alerts.set(sessionId, detail);
}
function persist() {
  saveLampState({ errors: Object.fromEntries(alerts) });
}
function publish2() {
  snapshot2 = new Map(alerts);
  persist();
  for (const listener of listeners4) listener();
}
snapshot2 = new Map(alerts);
var sessionAlerts = {
  getSnapshot() {
    return snapshot2;
  },
  subscribe(listener) {
    listeners4.add(listener);
    return () => {
      listeners4.delete(listener);
    };
  }
};
function attachAlertSource(remote, list) {
  const disposers = [];
  const onError = (...args) => {
    const sessionId = args[0];
    if (typeof sessionId !== "string") return;
    const detail = typeof args[1] === "string" ? args[1] : "error";
    alerts.set(sessionId, detail);
    publish2();
  };
  const onStatus = (...args) => {
    const sessionId = args[0];
    if (typeof sessionId === "string" && args[1] === true && alerts.delete(sessionId)) publish2();
  };
  if (remote !== void 0) {
    try {
      disposers.push(remote.$on("api-session/error", onError));
      disposers.push(remote.$on("api-session/status", onStatus));
    } catch (error) {
      console.error("[dsh-talk-pages] session alert source unavailable:", error);
    }
  }
  const reconcile = () => {
    if (alerts.size === 0) return;
    const state3 = list.getSnapshot();
    let changed = false;
    for (const id2 of [...alerts.keys()]) {
      const row = state3.byId[id2];
      if (row === void 0) continue;
      if ((row.retainedBy?.mainView ?? 0) > 0) {
        alerts.delete(id2);
        changed = true;
      }
    }
    if (changed) publish2();
  };
  try {
    disposers.push(list.subscribe(reconcile));
    reconcile();
  } catch (error) {
    console.error("[dsh-talk-pages] session alert list subscription failed:", error);
  }
  return () => {
    for (const dispose of disposers) {
      try {
        dispose();
      } catch {
      }
    }
  };
}

// src/client/session-activity.ts
var lastRunning = /* @__PURE__ */ new Map();
var finished = /* @__PURE__ */ new Set();
var interrupted = /* @__PURE__ */ new Set();
var hydrated = /* @__PURE__ */ new Set();
var needsBaseline = true;
var panelEpoch = 0;
var markedEpoch = /* @__PURE__ */ new Map();
var lastUnread = /* @__PURE__ */ new Map();
var snapshot3 = /* @__PURE__ */ new Set();
var interruptedSnapshot = /* @__PURE__ */ new Set();
var listenerSet = /* @__PURE__ */ new Set();
function publish3() {
  snapshot3 = new Set(finished);
  interruptedSnapshot = new Set(interrupted);
  for (const listener of listenerSet) listener();
}
function persist2() {
  const now2 = Date.now();
  const finishedRecord = {};
  for (const sessionId of finished) finishedRecord[sessionId] = now2;
  const interruptedRecord = {};
  for (const sessionId of interrupted) interruptedRecord[sessionId] = now2;
  saveLampState({ finished: finishedRecord, interrupted: interruptedRecord });
}
function hydrate() {
  const stored = loadLampState();
  for (const sessionId of Object.keys(stored.finished)) {
    finished.add(sessionId);
    hydrated.add(sessionId);
  }
  for (const sessionId of Object.keys(stored.interrupted)) {
    interrupted.add(sessionId);
    hydrated.add(sessionId);
  }
  publish3();
}
hydrate();
var sessionActivity = {
  /** Sessions the map believes "finished, unread" (drives the green lamp). */
  getSnapshot() {
    return snapshot3;
  },
  /** Sessions whose run was cut off by a restart ("已中断"). */
  getInterrupted() {
    return interruptedSnapshot;
  },
  subscribe(listener) {
    listenerSet.add(listener);
    return () => {
      listenerSet.delete(listener);
    };
  },
  isFinished(sessionId) {
    return finished.has(sessionId);
  },
  isInterrupted(sessionId) {
    return interrupted.has(sessionId);
  },
  /**
   * Feed one observation of the live status map. Only a transition observed
   * while the map is mounted counts, so a session that finished while the map
   * was closed keeps whatever the shell decided for it.
   */
  /**
   * The map panel (re)mounts: the next observation is a BASELINE, not a
   * transition. Without this, a run that finished while the panel was closed
   * looked like "was running, now idle" and produced a false 待查看 lamp — the
   * mark must only exist for completions that happen while the map is up.
   */
  beginPanelSession() {
    needsBaseline = true;
    panelEpoch += 1;
  },
  observe(status, summaries) {
    let changed = false;
    const ids = /* @__PURE__ */ new Set([...status.keys(), ...Object.keys(summaries)]);
    if (needsBaseline) {
      needsBaseline = false;
      for (const sessionId of ids) {
        const fact = status.get(sessionId);
        const row = summaries[sessionId];
        lastRunning.set(sessionId, fact?.running === true || row?.running === true);
      }
      return;
    }
    for (const sessionId of ids) {
      const fact = status.get(sessionId);
      const row = summaries[sessionId];
      const running = fact?.running === true || row?.running === true;
      const blocked = fact !== void 0 && fact.pendingInteraction !== void 0 || row?.pendingInteraction !== void 0;
      const wasRunning = lastRunning.get(sessionId);
      lastRunning.set(sessionId, running);
      if (running || blocked) {
        if (finished.delete(sessionId)) changed = true;
        if (interrupted.delete(sessionId)) changed = true;
        hydrated.delete(sessionId);
        continue;
      }
      if (wasRunning === true && !finished.has(sessionId)) {
        finished.add(sessionId);
        markedEpoch.set(sessionId, panelEpoch);
        changed = true;
      }
      if (hydrated.has(sessionId) && (row?.retainedBy?.mainView ?? 0) > 0) {
        hydrated.delete(sessionId);
        if (finished.delete(sessionId)) changed = true;
        if (interrupted.delete(sessionId)) changed = true;
      }
      const unread = fact?.completionUnread;
      const previousUnread = lastUnread.get(sessionId);
      if (typeof unread === "boolean") lastUnread.set(sessionId, unread);
      if (finished.has(sessionId)) {
        const readElsewhere = previousUnread === true && unread === false;
        const cameBackToIt = (row?.retainedBy?.mainView ?? 0) > 0 && (markedEpoch.get(sessionId) ?? panelEpoch) < panelEpoch;
        if (readElsewhere || cameBackToIt) {
          finished.delete(sessionId);
          markedEpoch.delete(sessionId);
          changed = true;
        }
      }
    }
    if (changed) {
      persist2();
      publish3();
    }
  },
  /**
   * "Mark as unread" from the context menu: the exact state the map computes when
   * a run finishes unwatched, and cleared the same way (open the conversation).
   */
  markFinished(sessionId) {
    hydrated.delete(sessionId);
    if (finished.has(sessionId)) return;
    finished.add(sessionId);
    persist2();
    publish3();
  },
  /** The user is looking at it now: stop advertising it as unread/interrupted. */
  acknowledge(sessionId) {
    hydrated.delete(sessionId);
    const removedFinished = finished.delete(sessionId);
    const removedInterrupted = interrupted.delete(sessionId);
    if (removedFinished || removedInterrupted) {
      persist2();
      publish3();
    }
  },
  /** The session is gone (deleted / archived): drop both records. */
  forget(sessionId) {
    lastRunning.delete(sessionId);
    hydrated.delete(sessionId);
    const removed = finished.delete(sessionId) || interrupted.delete(sessionId);
    if (removed) {
      persist2();
      publish3();
    }
  },
  /**
   * Called from `beforeunload`: everything still running is a run that will be
   * cut off, so the next start can say so.
   */
  recordShutdown(status, summaries) {
    const running = [];
    for (const [sessionId, fact] of status) if (fact.running === true) running.push(sessionId);
    for (const [sessionId, row] of Object.entries(summaries)) if (row.running === true) running.push(sessionId);
    if (running.length === 0) return;
    for (const sessionId of running) interrupted.add(sessionId);
    recordRunningAtShutdown(running);
    publish3();
  }
};

// src/client/draft-watch.ts
var STORE_PREFIX = "dsh.conversation.";
function draftTextOf(value2) {
  if (typeof value2 === "string") return value2;
  if (value2 !== null && typeof value2 === "object") {
    const text = value2.text;
    if (typeof text === "string") return text;
  }
  return "";
}
var snapshot4 = /* @__PURE__ */ new Set();
var listeners5 = /* @__PURE__ */ new Set();
function publish4(next) {
  snapshot4 = next;
  for (const listener of listeners5) listener();
}
function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const value2 of a) if (!b.has(value2)) return false;
  return true;
}
function readDraftSessions() {
  const out = /* @__PURE__ */ new Set();
  if (typeof localStorage === "undefined") return out;
  for (let index2 = 0; index2 < localStorage.length; index2 += 1) {
    const key = localStorage.key(index2);
    if (key === null || !key.startsWith(STORE_PREFIX)) continue;
    const sessionId = key.slice(STORE_PREFIX.length);
    if (sessionId === "") continue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      const stored = JSON.parse(raw);
      const draft = stored !== null && typeof stored === "object" ? stored.draft : void 0;
      if (draftTextOf(draft).trim() !== "") out.add(sessionId);
    } catch {
    }
  }
  return out;
}
var draftWatch = {
  getSnapshot() {
    return snapshot4;
  },
  subscribe(listener) {
    listeners5.add(listener);
    return () => {
      listeners5.delete(listener);
    };
  },
  /** Re-read the store; publishes only when the set actually changed. */
  refresh() {
    const next = readDraftSessions();
    if (!sameSet(next, snapshot4)) publish4(next);
  }
};

// src/client/preview-text.ts
function cleanPreviewText(text) {
  if (text === void 0) return "";
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
}

// src/client/preview-cache.ts
var STORAGE_KEY3 = "dsh.talk-pages.previews.v1";
var MAX_RAW = 600;
var MAX_ENTRIES = 300;
var cache2 = null;
var timer3;
function loadPreviewCache() {
  if (cache2 !== null) return cache2;
  if (typeof localStorage === "undefined") {
    cache2 = {};
    return cache2;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY3);
    const parsed = raw === null ? null : JSON.parse(raw);
    cache2 = parsed !== null && typeof parsed === "object" ? parsed : {};
  } catch {
    cache2 = {};
  }
  return cache2;
}
function readPreviewTexts() {
  const out = {};
  for (const [sessionId, entry] of Object.entries(loadPreviewCache())) {
    if (typeof entry?.text !== "string" || entry.text === "") continue;
    const cleaned = cleanPreviewText(entry.text).slice(0, 240);
    if (cleaned !== "") out[sessionId] = cleaned;
  }
  return out;
}
function persist3() {
  if (typeof localStorage === "undefined" || cache2 === null) return;
  try {
    localStorage.setItem(STORAGE_KEY3, JSON.stringify(cache2));
  } catch {
    cache2 = {};
  }
}
function scheduleSave() {
  if (timer3 !== void 0) clearTimeout(timer3);
  timer3 = setTimeout(() => {
    timer3 = void 0;
    persist3();
  }, 400);
}
function putPreview(sessionId, text, stamp) {
  const store = loadPreviewCache();
  store[sessionId] = { text: text.slice(0, MAX_RAW), stamp };
  const keys = Object.keys(store);
  if (keys.length > MAX_ENTRIES) {
    const ordered = keys.map((key) => ({ key, stamp: store[key]?.stamp ?? 0 })).sort((a, b) => a.stamp - b.stamp);
    for (const entry of ordered.slice(0, keys.length - MAX_ENTRIES)) delete store[entry.key];
  }
  scheduleSave();
}

// src/client/ContextMenu.tsx
var import_react5 = require("react");

// src/client/MenuIcons.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var PATHS = {
  digest: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "currentColor", d: "M5 2h10l4 4v16H5V2zm9 1.5V7h3.5L14 3.5zM7 11h10v1.6H7V11zm0 3.4h10v1.6H7v-1.6zm0 3.4h6.5V19H7v-1.2z" }) }),
  pin: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "currentColor", d: "M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z" }),
  unpin: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "currentColor", opacity: "0.4", d: "M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "currentColor", d: "M3.6 2.4 2.4 3.6l18 18 1.2-1.2z" })
  ] }),
  rename: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", d: "M14.9 3.5a2 2 0 0 1 2.9 2.9L7.4 16.8 3.4 18l1.2-4z" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", d: "M13.2 5.2 16.6 8.6" })
  ] }),
  unread: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "12", cy: "12", r: "8.3", fill: "none", stroke: "currentColor", strokeWidth: "1.9" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "12", cy: "12", r: "3.2", fill: "currentColor" })
  ] }),
  archive: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "3.2", y: "4", width: "17.6", height: "4.6", rx: "1.3", fill: "none", stroke: "currentColor", strokeWidth: "1.9" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", d: "M5.2 8.6v9.1c0 .8.6 1.4 1.4 1.4h10.8c.8 0 1.4-.6 1.4-1.4V8.6M10 12.6h4" })
  ] }),
  delete: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", d: "M4 6.3h16M9.5 6.3V4.1h5v2.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", d: "M6.3 6.3 7.5 20h9l1.2-13.7M10.3 9.9v6.4M13.7 9.9v6.4" })
  ] }),
  batch: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "3.6", y: "3.6", width: "8.2", height: "8.2", rx: "1.6", fill: "none", stroke: "currentColor", strokeWidth: "1.9" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "10.6", y: "10.6", width: "9.8", height: "9.8", rx: "1.8", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeDasharray: "3 2" })
  ] }),
  open: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", d: "M13.6 4.6h5.8v5.8M19.4 4.6 11.2 12.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", d: "M18 14.5v4c0 .8-.6 1.4-1.4 1.4H5.4c-.8 0-1.4-.6-1.4-1.4V7.3c0-.8.6-1.4 1.4-1.4h4" })
  ] }),
  group: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "3.4", y: "4", width: "17.2", height: "16", rx: "2.4", fill: "none", stroke: "currentColor", strokeWidth: "1.9" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", d: "M3.4 9.2h17.2" })
  ] })
};
function MenuIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { className: talk_pages_default["menuIcon"], viewBox: "0 0 24 24", width: "14", height: "14", "aria-hidden": "true", children: PATHS[props.name] });
}

// src/client/ContextMenu.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function ContextMenu(props) {
  const { menu } = props;
  const [query, setQuery] = (0, import_react5.useState)("");
  const [busy, setBusy] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)(void 0);
  const inputRef = (0, import_react5.useRef)(null);
  const submitPrompt = async () => {
    const prompt = menu.prompt;
    if (prompt === void 0 || busy || query.trim() === "") return;
    setBusy(true);
    setError(void 0);
    try {
      await prompt.onSubmit(query.trim());
    } catch (submitError) {
      setError(String(submitError));
      setBusy(false);
    }
  };
  (0, import_react5.useEffect)(() => {
    const release = mapUi.claimEscape("context-menu");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        props.onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      release();
    };
  }, []);
  (0, import_react5.useEffect)(() => {
    if (menu.searchable === true || menu.prompt !== void 0) inputRef.current?.focus();
  }, [menu.searchable, menu.prompt]);
  const normalized = query.trim().toLowerCase();
  const visible = normalized === "" ? menu.items : menu.items.filter((item) => item.label.toLowerCase().includes(normalized));
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    "div",
    {
      className: talk_pages_default["menu"],
      style: { left: menu.left, top: menu.top },
      role: "menu",
      onClick: (event) => {
        event.stopPropagation();
      },
      onPointerDown: (event) => {
        event.stopPropagation();
      },
      onContextMenu: (event) => {
        event.preventDefault();
      },
      children: [
        menu.title !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: talk_pages_default["menuTitle"], children: menu.title }) : null,
        menu.prompt !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "input",
            {
              ref: inputRef,
              className: talk_pages_default["menuSearch"],
              placeholder: menu.prompt.placeholder,
              value: query,
              onChange: (event) => {
                setQuery(event.target.value);
              },
              onKeyDown: (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitPrompt();
                }
              }
            }
          ),
          menu.prompt.preview !== void 0 && query.trim() !== "" ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: talk_pages_default["menuPreview"], children: menu.prompt.preview(query.trim()) }) : null,
          error !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: talk_pages_default["menuError"], children: error }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "button",
            {
              type: "button",
              className: talk_pages_default["menuItem"],
              disabled: busy || query.trim() === "",
              onClick: () => {
                void submitPrompt();
              },
              children: busy ? t("menu.working") : menu.prompt.submitLabel
            }
          )
        ] }) : null,
        menu.searchable === true ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "input",
          {
            ref: inputRef,
            className: talk_pages_default["menuSearch"],
            placeholder: t("menu.search"),
            value: query,
            onChange: (event) => {
              setQuery(event.target.value);
            }
          }
        ) : null,
        menu.prompt !== void 0 ? null : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: talk_pages_default["menuEmpty"], children: t("menu.empty") }) : visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: `${talk_pages_default["menuItem"]}${item.danger === true ? ` ${talk_pages_default["menuItemDanger"] ?? ""}` : ""}`,
            disabled: item.disabled === true,
            onClick: () => {
              item.onPick();
            },
            children: [
              item.icon !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(MenuIcon, { name: item.icon }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: talk_pages_default["menuIcon"] }),
              item.label,
              item.hint !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: talk_pages_default["menuHint"], children: [
                " ",
                item.hint
              ] }) : null
            ]
          },
          item.key
        ))
      ]
    }
  );
}

// src/client/edge-route.ts
var __routeDebug = {};
var DEFAULTS = { margin: 4, stub: 22, minCorridor: 10 };
function normalOf(face) {
  switch (face) {
    case "r":
      return { x: 1, y: 0 };
    case "l":
      return { x: -1, y: 0 };
    case "t":
      return { x: 0, y: -1 };
    default:
      return { x: 0, y: 1 };
  }
}
function expand(rect, by) {
  return { x: rect.x - by, y: rect.y - by, w: rect.w + by * 2, h: rect.h + by * 2 };
}
function insideStrict(rect, point) {
  return point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h;
}
function hitsHorizontal(rects, y, x1, x2) {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  let count = 0;
  for (const rect of rects) {
    if (y <= rect.y || y >= rect.y + rect.h) continue;
    if (hi <= rect.x || lo >= rect.x + rect.w) continue;
    count += 1;
  }
  return count;
}
function hitsVertical(rects, x, y1, y2) {
  const lo = Math.min(y1, y2);
  const hi = Math.max(y1, y2);
  let count = 0;
  for (const rect of rects) {
    if (x <= rect.x || x >= rect.x + rect.w) continue;
    if (hi <= rect.y || lo >= rect.y + rect.h) continue;
    count += 1;
  }
  return count;
}
function bands(rects, axis) {
  const spans = rects.map((rect) => axis === "x" ? { start: rect.x, end: rect.x + rect.w } : { start: rect.y, end: rect.y + rect.h }).sort((a, b) => a.start - b.start);
  const out = [];
  for (const span of spans) {
    const last = out[out.length - 1];
    if (last !== void 0 && span.start <= last.end) {
      last.end = Math.max(last.end, span.end);
    } else {
      out.push({ ...span });
    }
  }
  return out;
}
function corridors(rects, axis, minCorridor) {
  const merged = bands(rects, axis);
  const out = [];
  for (let index2 = 1; index2 < merged.length; index2 += 1) {
    const gap = merged[index2].start - merged[index2 - 1].end;
    if (gap >= minCorridor) out.push((merged[index2 - 1].end + merged[index2].start) / 2);
  }
  return out;
}
function outerLines(rects, axis, clearance) {
  const merged = bands(rects, axis);
  const out = [];
  for (const band of merged) {
    out.push(band.start - clearance, band.end + clearance);
  }
  return out;
}
var Heap = class {
  items = [];
  push(cost, key, node) {
    this.items.push({ cost, key, node });
    let index2 = this.items.length - 1;
    while (index2 > 0) {
      const parent = index2 - 1 >> 1;
      if (this.items[parent].cost <= this.items[index2].cost) break;
      const tmp = this.items[parent];
      this.items[parent] = this.items[index2];
      this.items[index2] = tmp;
      index2 = parent;
    }
  }
  pop() {
    if (this.items.length === 0) return void 0;
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      let index2 = 0;
      for (; ; ) {
        const left = index2 * 2 + 1;
        const right = left + 1;
        let smallest = index2;
        if (left < this.items.length && this.items[left].cost < this.items[smallest].cost) smallest = left;
        if (right < this.items.length && this.items[right].cost < this.items[smallest].cost) smallest = right;
        if (smallest === index2) break;
        const tmp = this.items[smallest];
        this.items[smallest] = this.items[index2];
        this.items[index2] = tmp;
        index2 = smallest;
      }
    }
    return { key: top.key, node: top.node };
  }
  get size() {
    return this.items.length;
  }
};
function dedupe(values, epsilon = 0.5) {
  const sorted = [...values].sort((a, b) => a - b);
  const out = [];
  for (const value2 of sorted) {
    if (out.length === 0 || Math.abs(value2 - out[out.length - 1]) > epsilon) out.push(value2);
  }
  return out;
}
function simplify(points) {
  const out = [];
  for (const point of points) {
    const last = out[out.length - 1];
    if (last !== void 0 && Math.abs(last.x - point.x) < 0.5 && Math.abs(last.y - point.y) < 0.5) continue;
    out.push(point);
  }
  for (let index2 = 1; index2 < out.length - 1; ) {
    const a = out[index2 - 1];
    const b = out[index2];
    const c = out[index2 + 1];
    const collinear = Math.abs(a.x - b.x) < 0.5 && Math.abs(b.x - c.x) < 0.5 || Math.abs(a.y - b.y) < 0.5 && Math.abs(b.y - c.y) < 0.5;
    if (collinear) out.splice(index2, 1);
    else index2 += 1;
  }
  return out;
}
function snapToChannels(points, obstacles, margin) {
  if (points.length < 3) return points;
  const rects = obstacles;
  const centreFor = (horizontal, fixed, lo, hi) => {
    let low = -Infinity;
    let high = Infinity;
    for (const rect of rects) {
      if (horizontal) {
        if (rect.x + rect.w <= lo || rect.x >= hi) continue;
        if (rect.y + rect.h <= fixed + 0.5) low = Math.max(low, rect.y + rect.h);
        else if (rect.y >= fixed - 0.5) high = Math.min(high, rect.y);
      } else {
        if (rect.y + rect.h <= lo || rect.y >= hi) continue;
        if (rect.x + rect.w <= fixed + 0.5) low = Math.max(low, rect.x + rect.w);
        else if (rect.x >= fixed - 0.5) high = Math.min(high, rect.x);
      }
    }
    if (!Number.isFinite(low) || !Number.isFinite(high)) return void 0;
    const gap = high - low;
    if (gap < margin * 2 + 6) return void 0;
    return (low + high) / 2;
  };
  const out = points.map((point) => ({ ...point }));
  const last = out.length - 1;
  const horizontalSegment = (index2) => Math.abs(out[index2 - 1].y - out[index2].y) < 0.6;
  const fromStubHorizontal = horizontalSegment(1);
  const toStubHorizontal = horizontalSegment(last);
  for (let index2 = 1; index2 < last; index2 += 1) {
    const a = out[index2 - 1];
    const b = out[index2];
    const horizontalRun = Math.abs(a.y - b.y) < 0.6;
    if (index2 === 1 && horizontalRun === fromStubHorizontal) continue;
    if (index2 === last - 1 && horizontalRun === toStubHorizontal) continue;
    const lo = horizontalRun ? Math.min(a.x, b.x) : Math.min(a.y, b.y);
    const hi = horizontalRun ? Math.max(a.x, b.x) : Math.max(a.y, b.y);
    const centre = centreFor(horizontalRun, horizontalRun ? a.y : a.x, lo, hi);
    if (centre === void 0) continue;
    if (horizontalRun) {
      if (Math.abs(centre - a.y) < 0.6) continue;
      a.y = centre;
      b.y = centre;
    } else {
      if (Math.abs(centre - a.x) < 0.6) continue;
      a.x = centre;
      b.x = centre;
    }
  }
  const candidate = simplify(out);
  const sameRectSet = (point) => rects.some((rect) => point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h);
  for (let index2 = 1; index2 < candidate.length; index2 += 1) {
    const a = candidate[index2 - 1];
    const b = candidate[index2];
    const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 4));
    for (let step2 = 0; step2 <= steps; step2 += 1) {
      const t4 = step2 / steps;
      if (sameRectSet({ x: a.x + (b.x - a.x) * t4, y: a.y + (b.y - a.y) * t4 })) return points;
    }
  }
  return candidate;
}
function routeRaw(ends, from, to, obstacles, options = {}) {
  const margin = options.margin ?? DEFAULTS.margin;
  const stub = options.stub ?? DEFAULTS.stub;
  const minCorridor = options.minCorridor ?? DEFAULTS.minCorridor;
  const start2 = ends.start;
  const end = ends.end;
  const startNormal = normalOf(ends.startFace);
  const endNormal = normalOf(ends.endFace);
  const spaceAhead = (point, normal) => {
    let best2 = 240;
    for (const raw of obstacles) {
      const rect = expand(raw, margin);
      if (normal.x !== 0) {
        if (point.y <= rect.y || point.y >= rect.y + rect.h) continue;
        if (normal.x > 0 && rect.x >= point.x) best2 = Math.min(best2, rect.x - point.x);
        if (normal.x < 0 && rect.x + rect.w <= point.x) best2 = Math.min(best2, point.x - (rect.x + rect.w));
      } else {
        if (point.x <= rect.x || point.x >= rect.x + rect.w) continue;
        if (normal.y > 0 && rect.y >= point.y) best2 = Math.min(best2, rect.y - point.y);
        if (normal.y < 0 && rect.y + rect.h <= point.y) best2 = Math.min(best2, point.y - (rect.y + rect.h));
      }
    }
    return best2;
  };
  const stubFor = (space) => {
    const half = Math.max(0, (space - margin * 2) / 2);
    return Math.max(4, Math.min(stub, half));
  };
  const minStub = margin + 3;
  const startStubLength = Math.max(stubFor(spaceAhead(start2, startNormal)), minStub);
  const endStubLength = Math.max(stubFor(spaceAhead(end, endNormal)), minStub);
  const startStub = {
    x: start2.x + startNormal.x * startStubLength,
    y: start2.y + startNormal.y * startStubLength
  };
  const endStub = {
    x: end.x + endNormal.x * endStubLength,
    y: end.y + endNormal.y * endStubLength
  };
  const sameRect = (a, b) => Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.w - b.w) < 0.5 && Math.abs(a.h - b.h) < 0.5;
  const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const blocked = [...obstacles, ...sameRect(from, to) ? [] : [from, to]].map((rect) => expand(rect, margin));
  __routeDebug.blockedCount = blocked.length;
  __routeDebug.blockedFirst = blocked.slice(0, 2);
  const makeFallback = () => {
    if (blocked.length === 0) return simplify([start2, startStub, { x: endStub.x, y: startStub.y }, endStub, end]);
    const gap = margin + 8;
    const left = Math.min(...blocked.map((rect) => rect.x)) - gap;
    const right = Math.max(...blocked.map((rect) => rect.x + rect.w)) + gap;
    const top = Math.min(...blocked.map((rect) => rect.y)) - gap;
    const bottom = Math.max(...blocked.map((rect) => rect.y + rect.h)) + gap;
    const lanesX = [.../* @__PURE__ */ new Set([left, right, ...xsTrimmed])].sort((a, b) => Math.abs(a - startStub.x) - Math.abs(b - startStub.x));
    const lanesY = [.../* @__PURE__ */ new Set([top, bottom, ...ysTrimmed])].sort((a, b) => Math.abs(a - startStub.y) - Math.abs(b - startStub.y));
    const candidates = [];
    for (const lane of lanesY.slice(0, 8)) {
      candidates.push([start2, startStub, { x: startStub.x, y: lane }, { x: endStub.x, y: lane }, endStub, end]);
    }
    for (const lane of lanesX.slice(0, 8)) {
      candidates.push([start2, startStub, { x: lane, y: startStub.y }, { x: lane, y: endStub.y }, endStub, end]);
    }
    candidates.push([start2, startStub, { x: left, y: startStub.y }, { x: left, y: endStub.y }, endStub, end]);
    candidates.push([start2, startStub, { x: right, y: startStub.y }, { x: right, y: endStub.y }, endStub, end]);
    const pairTop = Math.min(from.y, to.y) - margin - 8;
    const pairBottom = Math.max(from.y + from.h, to.y + to.h) + margin + 8;
    const pairLeft = Math.min(from.x, to.x) - margin - 8;
    const pairRight = Math.max(from.x + from.w, to.x + to.w) + margin + 8;
    candidates.push([start2, startStub, { x: startStub.x, y: pairTop }, { x: endStub.x, y: pairTop }, endStub, end]);
    candidates.push([start2, startStub, { x: startStub.x, y: pairBottom }, { x: endStub.x, y: pairBottom }, endStub, end]);
    candidates.push([start2, startStub, { x: pairLeft, y: startStub.y }, { x: pairLeft, y: endStub.y }, endStub, end]);
    candidates.push([start2, startStub, { x: pairRight, y: startStub.y }, { x: pairRight, y: endStub.y }, endStub, end]);
    let best2;
    let bestHits = Infinity;
    for (const candidate of candidates) {
      const points = simplify(candidate);
      let hits = 0;
      for (let index2 = 2; index2 < points.length - 1; index2 += 1) {
        const a = points[index2 - 1];
        const b = points[index2];
        hits += a.x === b.x ? hitsVertical(blocked, a.x, a.y, b.y) : hitsHorizontal(blocked, a.y, a.x, b.x);
      }
      if (hits < bestHits) {
        bestHits = hits;
        best2 = points;
        if (hits === 0) break;
      }
    }
    return best2 ?? simplify([start2, startStub, { x: endStub.x, y: startStub.y }, endStub, end]);
  };
  __routeDebug.last = { usedFallback: true };
  const pad = 260;
  const window2 = {
    x1: Math.min(start2.x, end.x) - pad,
    x2: Math.max(start2.x, end.x) + pad,
    y1: Math.min(start2.y, end.y) - pad,
    y2: Math.max(start2.y, end.y) + pad
  };
  const near = obstacles.filter((rect) => rect.x + rect.w >= window2.x1 && rect.x <= window2.x2 && rect.y + rect.h >= window2.y1 && rect.y <= window2.y2);
  const withinX = (value2) => value2 >= window2.x1 && value2 <= window2.x2;
  const withinY = (value2) => value2 >= window2.y1 && value2 <= window2.y2;
  const lanes = obstacles;
  const xs = corridors(lanes, "x", minCorridor).filter(withinX);
  const ys = corridors(lanes, "y", minCorridor).filter(withinY);
  const xOuter = outerLines(lanes, "x", margin + 6).filter(withinX);
  const yOuter = outerLines(lanes, "y", margin + 6).filter(withinY);
  const hug = margin + 8;
  const xHug = lanes.flatMap((rect) => [rect.x - hug, rect.x + rect.w + hug]);
  const yHug = lanes.flatMap((rect) => [rect.y - hug, rect.y + rect.h + hug]);
  const xCands = dedupe([start2.x, end.x, startStub.x, endStub.x, ...xs, ...xOuter, ...xHug]);
  const yCands = dedupe([start2.y, end.y, startStub.y, endStub.y, ...ys, ...yOuter, ...yHug]);
  const trim = (values, mustKeep, limit) => {
    if (values.length <= limit) return values;
    const keep = new Set(mustKeep);
    const rest = values.filter((value2) => !keep.has(value2));
    const slots = Math.max(1, limit - keep.size);
    const stride = Math.max(1, Math.floor(rest.length / slots));
    for (let index2 = 0; index2 < rest.length && keep.size < limit; index2 += stride) {
      keep.add(rest[index2]);
    }
    return values.filter((value2) => keep.has(value2));
  };
  const MAX_LINES = 72;
  const xsTrimmed = xCands.length > MAX_LINES ? trim(xCands, [start2.x, end.x, startStub.x, endStub.x], MAX_LINES) : xCands;
  const ysTrimmed = yCands.length > MAX_LINES ? trim(yCands, [start2.y, end.y, startStub.y, endStub.y], MAX_LINES) : yCands;
  __routeDebug.candidates = { x: xsTrimmed.length, y: ysTrimmed.length, near: near.length };
  const corridorX = new Set(xs.map((value2) => Math.round(value2)));
  const corridorY = new Set(ys.map((value2) => Math.round(value2)));
  const nodeId = (ix, iy) => `${ix},${iy}`;
  const pointAt = (id2) => {
    const [ix, iy] = id2.split(",").map(Number);
    return { x: xsTrimmed[ix], y: ysTrimmed[iy] };
  };
  const startIndex = { x: xsTrimmed.findIndex((value2) => Math.abs(value2 - startStub.x) < 0.5), y: ysTrimmed.findIndex((value2) => Math.abs(value2 - startStub.y) < 0.5) };
  const endIndex = { x: xsTrimmed.findIndex((value2) => Math.abs(value2 - endStub.x) < 0.5), y: ysTrimmed.findIndex((value2) => Math.abs(value2 - endStub.y) < 0.5) };
  if (startIndex.x < 0 || startIndex.y < 0 || endIndex.x < 0 || endIndex.y < 0) {
    __routeDebug.reason = "no-index";
    __routeDebug.index = { startIndex, endIndex, xs: xsTrimmed.length, ys: ysTrimmed.length };
    return makeFallback();
  }
  const goal = { x: endStub.x, y: endStub.y };
  const startNode = nodeId(startIndex.x, startIndex.y);
  const goalNode = nodeId(endIndex.x, endIndex.y);
  const best = /* @__PURE__ */ new Map();
  const cameFrom = /* @__PURE__ */ new Map();
  const heap = new Heap();
  const withDir = (node, dir) => `${node}|${dir}`;
  best.set(withDir(startNode, "x"), 0);
  heap.push(0, 0, withDir(startNode, "x"));
  const estimate = (point) => Math.abs(point.x - goal.x) + Math.abs(point.y - goal.y);
  let visited = 0;
  while (heap.size > 0) {
    visited += 1;
    const popped = heap.pop();
    const state3 = popped.node;
    const [node, dir] = state3.split("|");
    const cost = best.get(state3);
    if (cost === void 0) continue;
    if (node === goalNode) {
      const path = [];
      let cursor = state3;
      while (cursor !== void 0) {
        const [cell] = cursor.split("|");
        path.push(pointAt(cell));
        cursor = cameFrom.get(cursor);
      }
      path.reverse();
      __routeDebug.last = { usedFallback: false, steps: path.length };
      __routeDebug.rawPath = path.map((point) => [Math.round(point.x), Math.round(point.y)]);
      return snapToChannels(
        simplify([start2, startStub, ...path.slice(1), endStub, end]),
        obstacles,
        margin
      );
    }
    const [ix, iy] = node.split(",").map(Number);
    const here = pointAt(node);
    const steps = [
      { dx: 1, dy: 0, axis: "x" },
      { dx: -1, dy: 0, axis: "x" },
      { dx: 0, dy: 1, axis: "y" },
      { dx: 0, dy: -1, axis: "y" }
    ];
    for (const step2 of steps) {
      const nx = ix + step2.dx;
      const ny = iy + step2.dy;
      if (nx < 0 || ny < 0 || nx >= xsTrimmed.length || ny >= ysTrimmed.length) continue;
      const next = { x: xsTrimmed[nx], y: ysTrimmed[ny] };
      const nextNode = nodeId(nx, ny);
      if (nextNode !== goalNode && blocked.some((rect) => insideStrict(rect, next))) continue;
      const crossing = step2.axis === "x" ? hitsHorizontal(blocked, here.y, here.x, next.x) : hitsVertical(blocked, here.x, here.y, next.y);
      if (crossing > 0) continue;
      const distance2 = Math.abs(next.x - here.x) + Math.abs(next.y - here.y);
      const onCorridor = step2.axis === "x" ? corridorY.has(Math.round(here.y)) : corridorX.has(Math.round(here.x));
      const turn = dir === step2.axis ? 0 : 18;
      const prefer = onCorridor ? 0 : 40;
      const nextCost = cost + distance2 + turn + prefer;
      const nextState = withDir(nextNode, step2.axis);
      const known = best.get(nextState);
      if (known !== void 0 && known <= nextCost) continue;
      if (nextNode === goalNode) __routeDebug.goalPushed = nextState;
      best.set(nextState, nextCost);
      cameFrom.set(nextState, state3);
      heap.push(nextCost + estimate(next), nextCost, nextState);
    }
  }
  return makeFallback();
}
function roundedPath(points, radius = 10) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${round(points[0].x)} ${round(points[0].y)}`;
  const parts = [`M ${round(points[0].x)} ${round(points[0].y)}`];
  for (let index2 = 1; index2 < points.length - 1; index2 += 1) {
    const prev = points[index2 - 1];
    const here = points[index2];
    const next = points[index2 + 1];
    const inLength = Math.hypot(here.x - prev.x, here.y - prev.y);
    const outLength = Math.hypot(next.x - here.x, next.y - here.y);
    const corner = Math.min(radius, inLength / 2, outLength / 2);
    if (corner < 0.5) {
      parts.push(`L ${round(here.x)} ${round(here.y)}`);
      continue;
    }
    const enter = {
      x: here.x + (prev.x - here.x) / (inLength || 1) * corner,
      y: here.y + (prev.y - here.y) / (inLength || 1) * corner
    };
    const leave = {
      x: here.x + (next.x - here.x) / (outLength || 1) * corner,
      y: here.y + (next.y - here.y) / (outLength || 1) * corner
    };
    parts.push(`L ${round(enter.x)} ${round(enter.y)}`);
    parts.push(`Q ${round(here.x)} ${round(here.y)} ${round(leave.x)} ${round(leave.y)}`);
  }
  const last = points[points.length - 1];
  parts.push(`L ${round(last.x)} ${round(last.y)}`);
  return parts.join(" ");
}
function round(value2) {
  return Math.round(value2 * 100) / 100;
}
function routeBetween(ends, from, to, obstacles, options = {}) {
  const raw = routeRaw(ends, from, to, obstacles, options);
  const margin = options.margin ?? DEFAULTS.margin;
  const near = (point, anchor) => Math.abs(point.x - anchor.x) <= 26 && Math.abs(point.y - anchor.y) <= 26;
  const hits = (points, boxes) => {
    let count = 0;
    for (let index2 = 1; index2 < points.length; index2 += 1) {
      const a = points[index2 - 1];
      const b = points[index2];
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 3));
      for (let step2 = 0; step2 <= steps; step2 += 1) {
        const t4 = step2 / steps;
        const point = { x: a.x + (b.x - a.x) * t4, y: a.y + (b.y - a.y) * t4 };
        if (near(point, ends.start) || near(point, ends.end)) continue;
        for (const box of boxes) {
          const inside = point.x > box.x + 1 && point.x < box.x + box.w - 1 && point.y > box.y + 1 && point.y < box.y + box.h - 1;
          if (inside) {
            count += 1;
            continue;
          }
          const dx = Math.max(box.x - point.x, 0, point.x - (box.x + box.w));
          const dy = Math.max(box.y - point.y, 0, point.y - (box.y + box.h));
          if (Math.hypot(dx, dy) < 8) count += 1;
        }
      }
    }
    return count;
  };
  if (hits(raw, [from, to, ...obstacles]) === 0) return raw;
  const spread = margin + 24;
  const boxTop = Math.min(from.y, to.y) - spread;
  const boxBottom = Math.max(from.y + from.h, to.y + to.h) + spread;
  const boxLeft = Math.min(from.x, to.x) - spread;
  const boxRight = Math.max(from.x + from.w, to.x + to.w) + spread;
  const startNormal = normalOf(ends.startFace);
  const endNormal = normalOf(ends.endFace);
  const stubLength = Math.max(options.stub ?? DEFAULTS.stub, margin + 3);
  const startStub = {
    x: ends.start.x + startNormal.x * stubLength,
    y: ends.start.y + startNormal.y * stubLength
  };
  const endStub = {
    x: ends.end.x + endNormal.x * stubLength,
    y: ends.end.y + endNormal.y * stubLength
  };
  const wraps = [
    [ends.start, startStub, { x: startStub.x, y: boxTop }, { x: endStub.x, y: boxTop }, endStub, ends.end],
    [ends.start, startStub, { x: startStub.x, y: boxBottom }, { x: endStub.x, y: boxBottom }, endStub, ends.end],
    [ends.start, startStub, { x: boxLeft, y: startStub.y }, { x: boxLeft, y: endStub.y }, endStub, ends.end],
    [ends.start, startStub, { x: boxRight, y: startStub.y }, { x: boxRight, y: endStub.y }, endStub, ends.end]
  ];
  let best;
  let bestHits = Infinity;
  let bestLength = Infinity;
  for (const wrap of wraps) {
    const points = simplify(wrap);
    const wrapped = hits(points, [from, to, ...obstacles]);
    let length = 0;
    for (let index2 = 1; index2 < points.length; index2 += 1) {
      length += Math.abs(points[index2].x - points[index2 - 1].x) + Math.abs(points[index2].y - points[index2 - 1].y);
    }
    if (wrapped < bestHits || wrapped === bestHits && length < bestLength) {
      best = points;
      bestHits = wrapped;
      bestLength = length;
    }
    if (wrapped === 0) break;
  }
  return bestHits === 0 && best !== void 0 ? best : raw;
}

// src/client/TalkMapEdge.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var boardCache = { at: 0, boxes: [] };
function boardBoxes() {
  if (typeof document === "undefined") return [];
  const now2 = Date.now();
  if (now2 - boardCache.at < 60) return boardCache.boxes;
  const viewport = document.querySelector(".react-flow__viewport");
  if (viewport === null) return boardCache.boxes;
  const boxes = [];
  for (const element of document.querySelectorAll("[data-talkmap-session]")) {
    const node = element;
    let x = 0;
    let y = 0;
    let cursor = node;
    while (cursor !== null && cursor !== viewport) {
      x += cursor.offsetLeft;
      y += cursor.offsetTop;
      cursor = cursor.offsetParent;
    }
    if (cursor === null) continue;
    if (node.offsetWidth < 8 || node.offsetHeight < 8) continue;
    boxes.push({ x, y, w: node.offsetWidth, h: node.offsetHeight });
  }
  if (boxes.length > 0) {
    boardCache.at = now2;
    boardCache.boxes = boxes;
  }
  return boxes;
}
function TalkMapEdge(props) {
  const data = props.data ?? {};
  const synced = data.sync === "synced";
  const hidden = synced && data.structural !== true || data.ready === false;
  const faceOf = (position) => {
    const name2 = String(position ?? "left");
    if (name2 === "right") return "r";
    if (name2 === "top") return "t";
    if (name2 === "bottom") return "b";
    return "l";
  };
  const obstacles = data.obstacles;
  const measuredBoxes = boardBoxes();
  const sameCorner = (box, other) => other !== void 0 && Math.abs(box.x - other.x) < 6 && Math.abs(box.y - other.y) < 6;
  const merged = (obstacles !== void 0 && obstacles.length > 0 ? obstacles : measuredBoxes).filter((box) => !sameCorner(box, data.fromRect)).filter((box) => !sameCorner(box, data.toRect)).filter((box) => !sameCorner(box, data.fromRect)).filter((box) => !sameCorner(box, data.toRect));
  const laneOffset = (() => {
    let hash = 7;
    for (const character of String(props.id)) hash = (hash * 31 + character.charCodeAt(0)) % 997;
    return (hash % 5 - 2) * 1.2;
  })();
  const route = data.fromRect === void 0 || data.toRect === void 0 ? void 0 : routeBetween(
    {
      // Rounded to whole flow pixels: anchors carry sub-pixel noise after a zoom,
      // which shifted the clipped endpoints by a pixel between renders.
      start: { x: Math.round(props.sourceX), y: Math.round(props.sourceY) },
      startFace: faceOf(props.sourcePosition),
      end: { x: Math.round(props.targetX), y: Math.round(props.targetY) },
      endFace: faceOf(props.targetPosition)
    },
    // The endpoints' real boxes: the router excludes them from the obstacle
    // set by geometry.
    data.fromRect ?? { x: props.sourceX, y: props.sourceY, w: 0, h: 0 },
    data.toRect ?? { x: props.targetX, y: props.targetY, w: 0, h: 0 },
    merged
  );
  let finalRoute = route;
  if (route !== void 0 && route.length > 1 && data.fromRect !== void 0 && data.toRect !== void 0) {
    const boxesForHit = [
      ...data.fromRect === void 0 ? [] : [data.fromRect],
      ...data.toRect === void 0 ? [] : [data.toRect],
      ...merged
    ];
    const nearAnchor = (point) => Math.hypot(point.x - props.sourceX, point.y - props.sourceY) <= 26 || Math.hypot(point.x - props.targetX, point.y - props.targetY) <= 26;
    const hitsCard = (points) => {
      for (let index2 = 1; index2 < points.length; index2 += 1) {
        const a = points[index2 - 1];
        const b = points[index2];
        const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 4));
        for (let step2 = 0; step2 <= steps; step2 += 1) {
          const t4 = step2 / steps;
          const point = { x: a.x + (b.x - a.x) * t4, y: a.y + (b.y - a.y) * t4 };
          if (nearAnchor(point)) continue;
          if (boxesForHit.some((box) => point.x > box.x + 1 && point.x < box.x + box.w - 1 && point.y > box.y + 1 && point.y < box.y + box.h - 1)) return true;
        }
      }
      return false;
    };
    const sameSide = faceOf(props.sourcePosition) === faceOf(props.targetPosition);
    if (hitsCard(route) || route.length <= 2 && sameSide) {
      const faces = pickFaces(
        { id: "from", x: data.fromRect.x, y: data.fromRect.y },
        { id: "to", x: data.toRect.x, y: data.toRect.y },
        merged.map((box, index2) => ({ id: `o${index2}`, x: box.x, y: box.y })),
        { cardWidth: data.fromRect.w, cardHeight: data.fromRect.h }
      );
      const retry = routeBetween(
        {
          start: { x: Math.round(props.sourceX), y: Math.round(props.sourceY) },
          startFace: faces.fromHandle,
          end: { x: Math.round(props.targetX), y: Math.round(props.targetY) },
          endFace: faces.toHandle
        },
        data.fromRect,
        data.toRect,
        merged
      );
      if (retry.length > 1 && !hitsCard(retry)) finalRoute = retry;
    }
  }
  const routed = finalRoute !== void 0 && finalRoute.length > 1;
  const routeHitsCard = (points, rects) => {
    if (points === void 0 || rects === void 0) return false;
    for (let index2 = 1; index2 < points.length; index2 += 1) {
      const a = points[index2 - 1];
      const b = points[index2];
      const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 3));
      for (let step2 = 0; step2 <= steps; step2 += 1) {
        const t4 = step2 / steps;
        const x = a.x + (b.x - a.x) * t4;
        const y = a.y + (b.y - a.y) * t4;
        for (const rect of rects) {
          if (x > rect.x + 1 && x < rect.x + rect.w - 1 && y > rect.y + 1 && y < rect.y + rect.h - 1) return true;
        }
      }
    }
    return false;
  };
  const guardBoxes = merged;
  const blockedRoute = routeHitsCard(route, guardBoxes);
  if (typeof window !== "undefined") {
    const w = window;
    w.__edgeDebug = w.__edgeDebug ?? [];
    w.__edgeDebug.push({
      id: props.id,
      obstacles: obstacles?.length ?? null,
      merged: merged.length,
      measured: boardBoxes().length,
      measuredFirst: boardBoxes().slice(0, 2),
      src: { x: props.sourceX, y: props.sourceY, pos: String(props.sourcePosition) },
      dst: { x: props.targetX, y: props.targetY, pos: String(props.targetPosition) },
      points: route ?? null
    });
  }
  const [smoothPath] = getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition
  });
  const safeRoute = routed ? finalRoute : void 0;
  const path = safeRoute !== void 0 ? roundedPath(safeRoute, 10) : smoothPath;
  const arrowAngle = (() => {
    const position = String(props.targetPosition ?? "left");
    if (position === "right") return 180;
    if (position === "top") return 90;
    if (position === "bottom") return -90;
    return 0;
  })();
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      BaseEdge,
      {
        id: props.id,
        path,
        style: {
          stroke: "rgba(200, 206, 216, 0.45)",
          strokeWidth: 1.4,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "6 5",
          // Synced: the line simply is not there any more.
          opacity: hidden ? 0 : 1
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "path",
      {
        d: "M0 0 L-11 -5 L-11 5 Z",
        transform: `translate(${props.targetX} ${props.targetY}) rotate(${arrowAngle})`,
        fill: "rgba(200, 206, 216, 0.5)",
        opacity: hidden ? 0 : 1,
        pointerEvents: "none"
      }
    )
  ] });
}
var edgeTypes = { talkMap: TalkMapEdge };

// src/client/RenameDialog.tsx
var import_react7 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
function RenameDialog(props) {
  const [value2, setValue] = (0, import_react7.useState)(props.target.title);
  const [busy, setBusy] = (0, import_react7.useState)(false);
  const [error, setError] = (0, import_react7.useState)(null);
  const inputRef = (0, import_react7.useRef)(null);
  (0, import_react7.useEffect)(() => {
    const release = mapUi.claimEscape("rename-dialog");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      props.onDone(null);
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => {
      release();
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [props]);
  const submit = async () => {
    const title = value2.trim();
    if (title === "" || busy) return;
    if (title === props.target.title) {
      props.onDone(null);
      return;
    }
    setBusy(true);
    setError(null);
    if (props.target.kind === "box") {
      props.onDone(title);
      return;
    }
    try {
      const connection = connectionService();
      const rpc = connection?.rpc;
      if (rpc === void 0) {
        setError(t("rename.unavailable"));
        setBusy(false);
        return;
      }
      const endpoint = props.target.kind === "workspace" ? "workspace/rename" : "session/rename";
      const request = props.target.kind === "workspace" ? { workspaceId: props.target.id, title } : { sessionId: props.target.id, title };
      const result = await rpc.call("/api", endpoint, { args: { request } });
      if (result.ok !== true) {
        console.error("[dsh-talk-pages] rename rejected:", result.error);
        setError(result.error?.message ?? t("rename.failed"));
        setBusy(false);
        return;
      }
      props.onDone(title);
    } catch (cause) {
      console.error("[dsh-talk-pages] rename failed:", cause);
      setError(t("rename.failed"));
      setBusy(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: talk_pages_default["renameBackdrop"], onClick: () => {
    props.onDone(null);
  }, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className: talk_pages_default["renameDialog"],
      onClick: (event) => {
        event.stopPropagation();
      },
      role: "dialog",
      "aria-label": t("rename.title"),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: talk_pages_default["renameHeading"], children: t("rename.title") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "input",
          {
            ref: inputRef,
            className: talk_pages_default["renameInput"],
            value: value2,
            maxLength: 120,
            placeholder: t("rename.placeholder"),
            onChange: (event) => {
              setValue(event.target.value);
            },
            onKeyDown: (event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              void submit();
            }
          }
        ),
        error !== null ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: talk_pages_default["renameError"], children: error }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: talk_pages_default["renameActions"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: talk_pages_default["renameButton"], onClick: () => {
            props.onDone(null);
          }, children: t("rename.cancel") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "button",
            {
              type: "button",
              className: `${talk_pages_default["renameButton"]} ${talk_pages_default["renamePrimary"]}`,
              disabled: busy || value2.trim() === "",
              onClick: () => {
                void submit();
              },
              children: busy ? t("rename.saving") : t("rename.confirm")
            }
          )
        ] })
      ]
    }
  ) });
}

// src/client/PriorityRail.tsx
var import_react8 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var OPEN_KEY = "dsh.talk-pages.priority-rail.open.v1";
var PRIORITY_CLASS = {
  1: "priorityHigh",
  2: "priorityMid",
  3: "priorityLow"
};
var PRIORITY_COLOR = { 1: "#f24e4e", 2: "#f5b22e", 3: "#4e9bf2" };
var openState;
var listeners6 = /* @__PURE__ */ new Set();
function readOpen() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return false;
  }
}
function getOpen() {
  if (openState === void 0) openState = readOpen();
  return openState;
}
function setOpen(open) {
  openState = open;
  try {
    window.localStorage.setItem(OPEN_KEY, open ? "1" : "0");
  } catch {
  }
  for (const listener of listeners6) listener();
}
function subscribe(listener) {
  listeners6.add(listener);
  return () => {
    listeners6.delete(listener);
  };
}
function sortByPriority(entries) {
  return [...entries].sort((a, b) => a.priority - b.priority || (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}
function PriorityBadge(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "span",
    {
      className: `${talk_pages_default["cardChip"]} ${talk_pages_default["priorityChip"]}`,
      style: { ["--tm-priority"]: PRIORITY_COLOR[props.priority] },
      "data-talkmap-priority": props.priority,
      children: t(`card.priority${props.priority}`)
    }
  );
}
function PriorityRail(props) {
  const open = (0, import_react8.useSyncExternalStore)(subscribe, getOpen, getOpen);
  const sorted = sortByPriority(props.entries);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      className: talk_pages_default["statusRail"],
      "data-open": open ? "1" : "0",
      style: { ["--rail-card-w"]: `${props.cardWidth}px` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: talk_pages_default["statusRailPanel"], "aria-hidden": !open, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: talk_pages_default["statusRailHead"], children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: talk_pages_default["statusRailTitle"], children: t("priorityRail.title") }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: talk_pages_default["statusRailCount"], children: sorted.length })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: talk_pages_default["statusRailList"], role: "list", children: [
            sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: talk_pages_default["statusRailEmpty"], children: t("priorityRail.empty") }) : null,
            sorted.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { role: "listitem", className: talk_pages_default["statusRailSlot"], children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
              "div",
              {
                className: `${talk_pages_default["card"]} ${talk_pages_default["statusRailCard"]} ${talk_pages_default[PRIORITY_CLASS[entry.priority]] ?? ""}`,
                onClick: () => {
                  props.onFocus(entry.cardId);
                },
                title: entry.title,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: talk_pages_default["cardTop"], children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: talk_pages_default["cardTitle"], children: entry.title }) }),
                  entry.preview !== void 0 && entry.preview !== "" ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: talk_pages_default["cardSummary"], children: entry.preview }) : null,
                  /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: talk_pages_default["cardFooter"], children: [
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: talk_pages_default["cardTime"], children: relativeTime(entry.updatedAt) }),
                    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(PriorityBadge, { priority: entry.priority })
                  ] })
                ]
              }
            ) }, entry.cardId))
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
          "button",
          {
            type: "button",
            className: talk_pages_default["statusRailTab"],
            "aria-expanded": open,
            "aria-label": open ? t("priorityRail.close") : t("priorityRail.open"),
            title: open ? t("priorityRail.close") : t("priorityRail.open"),
            onClick: () => {
              setOpen(!open);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("svg", { viewBox: "0 0 24 24", width: "16", height: "16", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("path", { fill: "currentColor", d: "M6 3h2v18H6zM9 4h10l-2.5 4L19 12H9z" }) }),
              sorted.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: talk_pages_default["statusRailTabCount"], children: sorted.length }) : null
            ]
          }
        )
      ]
    }
  );
}

// src/client/SessionCard.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var LAMP_CLASS = {
  running: "cardLampRunning",
  done: "cardLampDone",
  error: "cardLampError",
  waiting: "cardLampWaiting"
};
var LAMP_CHIP = {
  running: { key: "card.running", className: "cardChipRunning", dot: true },
  waiting: { key: "card.waiting", className: "cardChipWaiting", dot: false },
  done: { key: "card.done", className: "cardChipDone", dot: false },
  error: { key: "card.error", className: "cardChipError", dot: false }
};
function statusChip(glow, running) {
  const spec = glow !== void 0 ? LAMP_CHIP[glow] : running ? LAMP_CHIP.running : void 0;
  if (spec === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "span",
    {
      className: `${talk_pages_default["cardChip"]} ${talk_pages_default[spec.className]}`,
      "data-talkmap-chip": glow ?? "running",
      children: [
        spec.dot ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: talk_pages_default["runningDot"] }) : null,
        t(spec.key)
      ]
    }
  );
}
function relativeTime(timestamp) {
  if (timestamp === void 0) return "";
  const delta = Date.now() - timestamp;
  const minutes = Math.round(delta / 6e4);
  if (minutes < 1) return t("time.now");
  if (minutes < 60) return `${minutes}${t("time.m")}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}${t("time.h")}`;
  const days = Math.round(hours / 24);
  return `${days}${t("time.d")}`;
}
function SessionCardNode(props) {
  const { data, selected: selected2 } = props;
  const classNames = [talk_pages_default["card"]];
  if (data.ghost) classNames.push(talk_pages_default["cardGhost"]);
  if (selected2 === true) classNames.push(talk_pages_default["cardSelected"]);
  if (data.glow !== void 0) classNames.push(talk_pages_default[LAMP_CLASS[data.glow]] ?? "");
  if (data.priority !== void 0) classNames.push(talk_pages_default[PRIORITY_CLASS[data.priority]] ?? "");
  const quiet = data.current !== true && data.pinned !== true && data.priority === void 0 && data.glow === void 0 && data.pendingDraft !== true && data.interrupted !== true;
  if (quiet) classNames.push(talk_pages_default["cardQuiet"] ?? "");
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: classNames.filter(Boolean).join(" "),
      onClick: (event) => {
        if (data.onPick === void 0) return;
        event.stopPropagation();
        data.onPick();
      },
      style: data.onPick !== void 0 ? { cursor: "pointer" } : void 0,
      "data-talkmap-session": data.sessionId,
      children: [
        data.current === true ? /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: talk_pages_default["cardReticle"], "aria-hidden": "true", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", {}),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("i", {})
        ] }) : null,
        "      ",
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Handle, { id: "t", type: "source", position: Position.Top, className: talk_pages_default["cardHandle"] ?? "" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Handle, { id: "l", type: "source", position: Position.Left, className: talk_pages_default["cardHandle"] ?? "" }),
        data.onPick !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "span",
          {
            className: `${talk_pages_default["pickBox"]}${selected2 === true ? ` ${talk_pages_default["pickBoxChecked"]}` : ""}`,
            role: "checkbox",
            "aria-checked": selected2 === true,
            "data-talkmap-pick": "",
            children: selected2 === true ? "✓" : ""
          }
        ) : null,
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: talk_pages_default["cardTop"], children: [
          data.pinned === true ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: talk_pages_default["cardPin"], title: t("card.pinned"), "aria-label": t("card.pinned"), "data-talkmap-pin": "1", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("path", { fill: "currentColor", d: "M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z" }) }) }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: talk_pages_default["cardTitle"], children: data.ghost ? t("card.ghostTitle") : data.title })
        ] }),
        data.ghost ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "button",
          {
            type: "button",
            className: `${talk_pages_default["cardRemove"]} nodrag`,
            onClick: () => {
              canvas.removeCard(data.cardId);
            },
            children: t("card.remove")
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_jsx_runtime11.Fragment, { children: data.preview !== void 0 && data.preview !== "" ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: talk_pages_default["cardSummary"], children: data.preview }) : null }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: talk_pages_default["cardFooter"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: talk_pages_default["cardTime"], children: relativeTime(data.updatedAt) }),
          data.pendingDraft === true ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "span",
            {
              className: `${talk_pages_default["cardChip"]} ${talk_pages_default["cardChipDraft"]}`,
              title: t("card.draftHint"),
              "data-talkmap-draft": "1",
              children: t("card.draft")
            }
          ) : null,
          data.interrupted === true ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "span",
            {
              className: `${talk_pages_default["cardChip"]} ${talk_pages_default["cardChipInterrupted"]}`,
              title: t("card.interruptedHint"),
              "data-talkmap-interrupted": "1",
              children: t("card.interrupted")
            }
          ) : null,
          statusChip(data.glow, data.running === true),
          data.priority !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(PriorityBadge, { priority: data.priority }) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Handle, { id: "r", type: "source", position: Position.Right, className: talk_pages_default["cardHandle"] ?? "" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Handle, { id: "b", type: "source", position: Position.Bottom, className: talk_pages_default["cardHandle"] ?? "" })
      ]
    }
  );
}

// src/client/SpawnPreview.tsx
var import_react10 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
function SpawnPreview(props) {
  const { pending } = props;
  const digest = canvas.get().digests[pending.parent.sessionId];
  const [mode, setMode] = (0, import_react10.useState)("full");
  const [text, setText] = (0, import_react10.useState)(() => buildInjectionText(pending.parent.title, digest));
  const [firstMessage, setFirstMessage] = (0, import_react10.useState)("");
  const [busy, setBusy] = (0, import_react10.useState)(false);
  const [error, setError] = (0, import_react10.useState)(void 0);
  (0, import_react10.useEffect)(() => {
    const release = mapUi.claimEscape("spawn-preview");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        props.onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      release();
    };
  }, []);
  const addCardAndEdge = (sessionId, kind, injectedText) => {
    const cardId = newCardId();
    const card = {
      boardId: INBOX_BOARD_ID,
      sessionId,
      x: pending.x,
      y: pending.y,
      ...pending.parentBoxId !== void 0 ? { boxId: pending.parentBoxId } : {},
      createdAt: Date.now()
    };
    canvas.addCards({ [cardId]: card });
    canvas.addEdges({
      [`edge-${crypto.randomUUID()}`]: {
        boardId: INBOX_BOARD_ID,
        fromCardId: pending.parent.cardId,
        toCardId: cardId,
        injection: { kind, ...injectedText !== void 0 ? { injectedText } : {} },
        createdAt: Date.now()
      }
    });
    return cardId;
  };
  const jumpIn = (sessionId) => {
    props.onClose();
    if (openSessionInUi(sessionId)) closeMapPanel();
  };
  const confirm = async () => {
    if (busy) return;
    const services2 = getServices();
    if (services2 === void 0) return;
    setBusy(true);
    setError(void 0);
    try {
      const createSession = async () => callRpc(
        "session/create",
        pending.parentWorkspaceId !== void 0 ? { workspaceId: pending.parentWorkspaceId } : {}
      );
      if (mode === "digest") {
        if (text.trim() === "") throw new Error(t("spawn.needText"));
        const created2 = await createSession();
        let injected = text;
        try {
          const fresh = await talkMapApi.ensureDigest(pending.parent.sessionId);
          if (fresh.digest !== void 0 && !digestIsEmpty(fresh.digest)) {
            injected = buildInjectionText(pending.parent.title, fresh.digest);
          }
        } catch {
        }
        await talkMapApi.injectContext(created2.sessionId, [
          { sessionId: pending.parent.sessionId, text: injected }
        ]);
        addCardAndEdge(created2.sessionId, "digest", text);
        jumpIn(created2.sessionId);
        return;
      }
      if (mode === "full") {
        const childId = await forkSessionInUi(pending.parent.sessionId);
        addCardAndEdge(childId, "full");
        jumpIn(childId);
        return;
      }
      if (firstMessage.trim() === "") throw new Error(t("spawn.needFirstMessage"));
      const created = await createSession();
      addCardAndEdge(created.sessionId, "none");
      await callRpc("session/prompt", {
        sessionId: created.sessionId,
        mode: "queue",
        content: [{ type: "text", text: firstMessage }],
        clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      jumpIn(created.sessionId);
    } catch (spawnError) {
      setError(String(spawnError));
      setBusy(false);
    }
  };
  const modes = [
    { id: "digest", label: t("spawn.mode.digest") },
    { id: "full", label: t("spawn.mode.full") }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: talk_pages_default["spawnPanel"], role: "dialog", "aria-label": t("spawn.heading"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnHeading"], children: t("spawn.heading") }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: talk_pages_default["spawnFrom"], children: [
      t("spawn.from"),
      "「",
      pending.parent.title,
      "」"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnModes"], children: modes.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "button",
      {
        type: "button",
        className: `${talk_pages_default["spawnModeBtn"]}${mode === entry.id ? ` ${talk_pages_default["spawnModeActive"]}` : ""}`,
        onClick: () => {
          setMode(entry.id);
        },
        children: entry.label
      },
      entry.id
    )) }),
    mode === "digest" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnHint"], children: t("spawn.hint") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "textarea",
        {
          className: `${talk_pages_default["spawnTextarea"]} nodrag nowheel`,
          value: text,
          rows: 9,
          onChange: (event) => {
            setText(event.target.value);
          }
        }
      )
    ] }) : mode === "none" ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnHint"], children: t("spawn.noneHint") }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "textarea",
        {
          className: `${talk_pages_default["spawnTextarea"]} nodrag nowheel`,
          placeholder: t("draft.placeholder"),
          value: firstMessage,
          rows: 5,
          onChange: (event) => {
            setFirstMessage(event.target.value);
          },
          onKeyDown: (event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void confirm();
            }
          }
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnHint"], children: t("spawn.fullHint") }),
    error !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: talk_pages_default["spawnError"], children: error }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: talk_pages_default["spawnActions"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "button",
        {
          type: "button",
          className: talk_pages_default["spawnBtnGhost"],
          onClick: props.onClose,
          disabled: busy,
          children: t("spawn.cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
        "button",
        {
          type: "button",
          className: talk_pages_default["spawnBtnPrimary"],
          onClick: () => {
            void confirm();
          },
          disabled: busy || mode === "digest" && text.trim() === "" || mode === "none" && firstMessage.trim() === "",
          children: busy ? t("spawn.busy") : t("spawn.confirm")
        }
      )
    ] })
  ] });
}

// src/client/WsFrame.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var EDGE = 10;
var CORNER = 26;
var EDGE_HANDLES = [
  { axis: "n", className: "wsFrameResizeN", title: "拖拽改变高度（上边）", style: { top: -3, left: CORNER + 2, right: CORNER + 2, height: 12 } },
  { axis: "s", className: "wsFrameResizeS", title: "拖拽改变高度（下边）", style: { bottom: -3, left: CORNER + 2, right: CORNER + 2, height: 12 } },
  { axis: "w", className: "wsFrameResizeW", title: "拖拽改变宽度（左边）", style: { left: -3, top: CORNER + 2, bottom: CORNER + 2, width: 12 } },
  { axis: "e", className: "wsFrameResizeE", title: "拖拽改变宽度（右边）", style: { right: -3, top: CORNER + 2, bottom: CORNER + 2, width: 12 } }
];
var CORNER_HANDLES = [
  { axis: "nw", className: "wsFrameResizeNw", title: "拖拽同时改变宽高（左上）", style: { left: -3, top: -3 } },
  { axis: "ne", className: "wsFrameResizeNe", title: "拖拽同时改变宽高（右上）", style: { right: -3, top: -3 } },
  { axis: "sw", className: "wsFrameResizeSw", title: "拖拽同时改变宽高（左下）", style: { left: -3, bottom: -3 } },
  { axis: "se", className: "wsFrameResizeSe", title: "拖拽同时改变宽高（右下）", style: { right: -3, bottom: -3 } }
];
function WsFrameNode(props) {
  const { data, selected: selected2 } = props;
  const color2 = colorOf(data.colorTag);
  const start2 = (axis) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    data.onResizeStart?.(axis, event);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "div",
    {
      className: `${talk_pages_default["wsFrame"]}${selected2 === true ? ` ${talk_pages_default["wsFrameSelected"]}` : ""}${data.blocked === true ? ` ${talk_pages_default["wsFrameBlocked"]}` : ""}`,
      style: {
        width: data.width,
        height: data.height,
        // Border (+ label) only: the folder's inside keeps the board background,
        // so the colour never washes over the cards.
        ...color2 !== void 0 ? { borderColor: color2.border } : {}
      },
      "data-talkmap-frame": "",
      "data-talkmap-workspace": data.workspaceId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "div",
          {
            className: talk_pages_default["wsFrameLabel"],
            style: color2 !== void 0 ? { borderColor: color2.border, backgroundImage: `linear-gradient(${color2.fill}, ${color2.fill})` } : {},
            onPointerDown: () => {
              data.onLabelPointerDown?.();
            },
            onDoubleClick: (event) => {
              event.stopPropagation();
              data.onRename?.();
            },
            title: data.title,
            "data-talkmap-box-label": data.workspaceId,
            children: [
              data.title,
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: talk_pages_default["wsFrameCount"], children: data.count })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: talk_pages_default["wsFrameEdge"], style: { top: 0, left: 0, right: 0, height: EDGE } }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: talk_pages_default["wsFrameEdge"], style: { bottom: 0, left: 0, right: 0, height: EDGE } }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: talk_pages_default["wsFrameEdge"], style: { top: 0, bottom: 0, left: 0, width: EDGE } }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: talk_pages_default["wsFrameEdge"], style: { top: 0, bottom: 0, right: 0, width: EDGE } }),
        [...EDGE_HANDLES, ...CORNER_HANDLES].map((handle) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "div",
          {
            className: `${talk_pages_default["wsFrameResize"]} ${talk_pages_default[handle.className] ?? ""}`,
            style: handle.style,
            onPointerDown: start2(handle.axis),
            title: handle.title,
            "data-talkmap-resize": handle.axis
          },
          handle.axis
        ))
      ]
    }
  );
}

// src/client/grid-layout.ts
var CARD_W = 224;
var CARD_H = 120;
var GAP_X = 48;
var GAP_Y = 56;
var FRAME_PAD = 32;
var FRAME_LABEL_H = 30;
var TOP_INSET = FRAME_PAD + FRAME_LABEL_H;
var MIN_FRAME_WIDTH = CARD_W + FRAME_PAD * 2;
var MIN_FRAME_HEIGHT = TOP_INSET + CARD_H + FRAME_PAD;
function colsForWidth(width) {
  const usable = Math.max(CARD_W, width - FRAME_PAD * 2);
  return Math.max(1, Math.floor((usable + GAP_X) / (CARD_W + GAP_X)));
}
function rowsForHeight(height) {
  const usable = Math.max(CARD_H, height - TOP_INSET - FRAME_PAD);
  return Math.max(1, Math.floor((usable + GAP_Y) / (CARD_H + GAP_Y)));
}
function capacityFor(rect) {
  return colsForWidth(rect.width) * rowsForHeight(rect.height);
}
function slotPoint(rect, index2, cols = colsForWidth(rect.width)) {
  const col = index2 % cols;
  const row = Math.floor(index2 / cols);
  return {
    x: rect.x + FRAME_PAD + col * (CARD_W + GAP_X),
    y: rect.y + TOP_INSET + row * (CARD_H + GAP_Y)
  };
}
function frameRect(stored) {
  return {
    x: stored.x,
    y: stored.y,
    width: Math.max(MIN_FRAME_WIDTH, stored.width),
    height: Math.max(MIN_FRAME_HEIGHT, stored.height)
  };
}
function slotIndexAt(rect, point) {
  const cols = colsForWidth(rect.width);
  const col = clamp2(Math.round((point.x - rect.x - FRAME_PAD) / (CARD_W + GAP_X)), 0, cols - 1);
  const row = Math.max(0, Math.round((point.y - rect.y - TOP_INSET) / (CARD_H + GAP_Y)));
  return row * cols + col;
}
function layoutFor(rect, orderedIds) {
  const cols = colsForWidth(rect.width);
  const out = {};
  orderedIds.forEach((cardId, index2) => {
    out[cardId] = slotPoint(rect, index2, cols);
  });
  return out;
}
function visibleCount(capacity, total) {
  if (total <= capacity) return total;
  return Math.max(0, capacity - 1);
}
function readingOrder(cards) {
  return [...cards].sort((a, b) => a.y - b.y || a.x - b.x || a.cardId.localeCompare(b.cardId)).map((card) => card.cardId);
}
function clamp2(value2, min, max) {
  return Math.min(max, Math.max(min, value2));
}

// src/client/pages.ts
var LAYOUT_VERSION = 5;
function pageCameraKey(pageId) {
  return `page:${pageId}`;
}
function sessionPageIndex(workspaces) {
  const index2 = /* @__PURE__ */ new Map();
  for (const workspace of workspaces) {
    for (const sessionId of workspace.sessionIds) index2.set(sessionId, workspace.workspaceId);
  }
  return index2;
}
function pageOfCard(card, boxes, sessionPage) {
  if (card.boxId !== void 0) {
    const box = boxes?.[card.boxId];
    if (box !== void 0) return box.pageId;
  }
  return sessionPage.get(card.sessionId) ?? UNSORTED_PAGE_ID;
}
function pageOfBox(boxId, boxes) {
  return boxes?.[boxId]?.pageId ?? boxId;
}
function buildPages(input) {
  const counts = /* @__PURE__ */ new Map();
  for (const card of Object.values(input.cards)) {
    if (input.isHidden?.(card) === true) continue;
    const pageId = pageOfCard(card, input.boxes, input.sessionPage);
    counts.set(pageId, (counts.get(pageId) ?? 0) + 1);
  }
  const pages = [];
  const seen = /* @__PURE__ */ new Set();
  for (const workspace of input.workspaces) {
    seen.add(workspace.workspaceId);
    pages.push({
      id: workspace.workspaceId,
      title: workspace.title,
      count: counts.get(workspace.workspaceId) ?? 0
    });
  }
  for (const box of Object.values(input.boxes ?? {})) {
    if (seen.has(box.pageId)) continue;
    seen.add(box.pageId);
    pages.push({
      id: box.pageId,
      title: box.pageId === UNSORTED_PAGE_ID ? input.unsortedTitle : box.title,
      count: counts.get(box.pageId) ?? 0
    });
  }
  const unsortedCount = counts.get(UNSORTED_PAGE_ID) ?? 0;
  if (!seen.has(UNSORTED_PAGE_ID) && (unsortedCount > 0 || input.activePage === UNSORTED_PAGE_ID)) {
    pages.push({ id: UNSORTED_PAGE_ID, title: input.unsortedTitle, count: unsortedCount });
  }
  return pages;
}
function resolveActivePage(global, pages) {
  const stored = global?.activePage;
  if (stored !== void 0 && pages.some((page) => page.id === stored)) return stored;
  return pages[0]?.id ?? UNSORTED_PAGE_ID;
}
function migrateToBoxes(input) {
  const boxes = { ...input.boxes };
  let changed = false;
  for (const [frameId] of Object.entries(input.wsFrames)) {
    if (boxes[frameId] !== void 0) continue;
    boxes[frameId] = { pageId: frameId, title: input.titles.get(frameId) ?? frameId };
    changed = true;
  }
  const cards = {};
  for (const [cardId, card] of Object.entries(input.cards)) {
    if (card.boxId !== void 0) continue;
    const groupId = card.wsOverride ?? input.sessionPage.get(card.sessionId);
    if (groupId === void 0) continue;
    if (input.wsFrames[groupId] === void 0) continue;
    cards[cardId] = { ...card, boxId: groupId };
    changed = true;
  }
  return { boxes, cards, changed };
}

// src/client/StackDrawer.tsx
var import_react11 = require("react");
var import_jsx_runtime14 = require("react/jsx-runtime");
var LAMP_CLASS2 = {
  running: "cardLampRunning",
  done: "cardLampDone",
  error: "cardLampError",
  waiting: "cardLampWaiting"
};
function isIndexDisabled(message) {
  return message.includes("search is disabled") || message.includes("SESSION_QUERY_SEARCH_DISABLED");
}
function StackDrawer(props) {
  const scrollerRef = (0, import_react11.useRef)(null);
  const [wires, setWires] = (0, import_react11.useState)([]);
  const [wireSize, setWireSize] = (0, import_react11.useState)({ width: 0, height: 0 });
  const remembered = loadSearch("drawer:" + props.groupId);
  const [query, setQuery] = (0, import_react11.useState)(remembered?.query ?? "");
  const [hits, setHits] = (0, import_react11.useState)(remembered?.hits ?? []);
  const [searching, setSearching] = (0, import_react11.useState)(false);
  const [dragId, setDragId] = (0, import_react11.useState)(null);
  const [dropIndex, setDropIndex] = (0, import_react11.useState)(null);
  const [searchError, setSearchError] = (0, import_react11.useState)(null);
  const runSearch = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || props.onSearchContent === void 0) {
      setHits([]);
      setSearchError(null);
      return;
    }
    setSearching(true);
    try {
      const found = await props.onSearchContent(trimmed);
      setHits(found);
      saveSearch("drawer:" + props.groupId, { query: trimmed, hits: found });
      setSearchError(null);
    } catch (cause) {
      console.warn("[dsh-talk-pages] content search failed:", cause);
      setHits([]);
      setSearchError(String(cause?.message ?? cause));
    } finally {
      setSearching(false);
    }
  };
  const needle = query.trim().toLowerCase();
  const visibleItems = needle === "" ? props.items : props.items.filter((item) => item.title.toLowerCase().includes(needle));
  (0, import_react11.useLayoutEffect)(() => {
    const scroller = scrollerRef.current;
    const links = (props.links ?? []).filter((link2) => link2.visible);
    if (scroller === null || links.length === 0) {
      setWires((current) => current.length === 0 ? current : []);
      return;
    }
    const measure = () => {
      const boxOf = (cardId) => {
        const element = scroller.querySelector(`[data-card-id="${cardId}"]`);
        if (element === null) return null;
        const rect = element.getBoundingClientRect();
        const base = scroller.getBoundingClientRect();
        return new DOMRect(
          rect.left - base.left + scroller.scrollLeft,
          rect.top - base.top + scroller.scrollTop,
          rect.width,
          rect.height
        );
      };
      const cardsInDrawer = [...scroller.querySelectorAll("[data-card-id]")].map((element) => {
        const box = element.getBoundingClientRect();
        const base = scroller.getBoundingClientRect();
        return {
          id: element.getAttribute("data-card-id") ?? "",
          x: box.left - base.left + scroller.scrollLeft,
          y: box.top - base.top + scroller.scrollTop,
          w: box.width,
          h: box.height
        };
      });
      const next = [];
      let wireIndex = 0;
      for (const link2 of links) {
        const from = boxOf(link2.from);
        const to = boxOf(link2.to);
        if (from === null || to === null) continue;
        const rectOf = (box) => ({ x: box.x, y: box.y, w: box.width, h: box.height });
        const fromRect = rectOf(from);
        const toRect = rectOf(to);
        const obstacles = cardsInDrawer.filter((card) => card.id !== link2.from && card.id !== link2.to).map(rectOf);
        const faces = pickFaces(
          { id: link2.from, x: fromRect.x, y: fromRect.y },
          { id: link2.to, x: toRect.x, y: toRect.y },
          cardsInDrawer.map((card) => ({ id: card.id, x: card.x, y: card.y })),
          { cardWidth: fromRect.w, cardHeight: fromRect.h }
        );
        const contentWidth = scroller.scrollWidth;
        const contentHeight = scroller.scrollHeight;
        const boundsWidth = scroller.scrollWidth;
        const boundsHeight = scroller.scrollHeight;
        const dirty = (candidate) => {
          let hits2 = 0;
          for (let index2 = 1; index2 < candidate.length; index2 += 1) {
            const a = candidate[index2 - 1];
            const b = candidate[index2];
            const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2));
            for (let step2 = 0; step2 <= steps; step2 += 1) {
              const ratio = step2 / steps;
              const point = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
              for (const box of obstacles) {
                if (point.x > box.x + 1 && point.x < box.x + box.w - 1 && point.y > box.y + 1 && point.y < box.y + box.h - 1) hits2 += 1;
              }
              for (const endpoint of [fromRect, toRect]) {
                if (point.x <= endpoint.x + 1 || point.x >= endpoint.x + endpoint.w - 1) continue;
                if (point.y <= endpoint.y + 1 || point.y >= endpoint.y + endpoint.h - 1) continue;
                const away = Math.min(
                  Math.hypot(point.x - (endpoint.x + endpoint.w / 2), point.y - endpoint.y),
                  Math.hypot(point.x - (endpoint.x + endpoint.w / 2), point.y - (endpoint.y + endpoint.h)),
                  Math.hypot(point.x - endpoint.x, point.y - (endpoint.y + endpoint.h / 2)),
                  Math.hypot(point.x - (endpoint.x + endpoint.w), point.y - (endpoint.y + endpoint.h / 2))
                );
                if (away > 14) hits2 += 1;
              }
              if (point.x < 2 || point.y < 2 || point.x > boundsWidth - 2 || point.y > boundsHeight - 2) hits2 += 1;
            }
          }
          return hits2;
        };
        const sideOf = (rect, other) => {
          const dx = other.x + other.w / 2 - (rect.x + rect.w / 2);
          const dy = other.y + other.h / 2 - (rect.y + rect.h / 2);
          if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "r" : "l";
          return dy >= 0 ? "b" : "t";
        };
        const anchorOf = (rect, side) => side === "t" ? { x: rect.x + rect.w / 2, y: rect.y } : side === "b" ? { x: rect.x + rect.w / 2, y: rect.y + rect.h } : side === "l" ? { x: rect.x, y: rect.y + rect.h / 2 } : { x: rect.x + rect.w, y: rect.y + rect.h / 2 };
        const normalOf2 = (side) => side === "t" ? { x: 0, y: -1 } : side === "b" ? { x: 0, y: 1 } : side === "l" ? { x: -1, y: 0 } : { x: 1, y: 0 };
        const fromSide = sideOf(fromRect, toRect);
        const toSide = sideOf(toRect, fromRect);
        const startPoint = anchorOf(fromRect, fromSide);
        const endPoint = anchorOf(toRect, toSide);
        const startNormal = normalOf2(fromSide);
        const endNormal = normalOf2(toSide);
        const span = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        const badness = (sample) => {
          let bad = 0;
          for (let step2 = 0; step2 <= 40; step2 += 1) {
            const point = sample(step2 / 40);
            if (point.x < 6 || point.y < 6 || point.x > boundsWidth - 6 || point.y > boundsHeight - 6) bad += 1;
            for (const card of cardsInDrawer) {
              if (point.x <= card.x + 2 || point.x >= card.x + card.w - 2) continue;
              if (point.y <= card.y + 2 || point.y >= card.y + card.h - 2) continue;
              const own = card.id === link2.from || card.id === link2.to;
              const nearStart = Math.hypot(point.x - startPoint.x, point.y - startPoint.y) < 18;
              const nearEnd = Math.hypot(point.x - endPoint.x, point.y - endPoint.y) < 18;
              if (own && (nearStart || nearEnd)) continue;
              bad += 1;
            }
          }
          return bad;
        };
        let bestD;
        let bestCost = Number.POSITIVE_INFINITY;
        let arrival = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y };
        const tryCurve = (control1, control2) => {
          const u1 = (t4) => (1 - t4) * (1 - t4) * (1 - t4);
          const u2 = (t4) => 3 * (1 - t4) * (1 - t4) * t4;
          const u3 = (t4) => 3 * (1 - t4) * t4 * t4;
          const u4 = (t4) => t4 * t4 * t4;
          const sample = (t4) => ({
            x: u1(t4) * startPoint.x + u2(t4) * control1.x + u3(t4) * control2.x + u4(t4) * endPoint.x,
            y: u1(t4) * startPoint.y + u2(t4) * control1.y + u3(t4) * control2.y + u4(t4) * endPoint.y
          });
          const cost = badness(sample);
          if (cost < bestCost) {
            bestCost = cost;
            bestD = "M " + startPoint.x + " " + startPoint.y + " C " + control1.x + " " + control1.y + ", " + control2.x + " " + control2.y + ", " + endPoint.x + " " + endPoint.y;
            arrival = { x: endPoint.x - control2.x, y: endPoint.y - control2.y };
          }
        };
        for (const bow of [0.15, 0.3, 0.5, 0.75, 1.1]) {
          const reach = Math.max(18, span * bow);
          const c1 = { x: startPoint.x + startNormal.x * reach, y: startPoint.y + startNormal.y * reach };
          const c2 = { x: endPoint.x + endNormal.x * reach, y: endPoint.y + endNormal.y * reach };
          tryCurve(c1, c2);
          if (bestCost === 0) break;
        }
        if (bestCost > 0) {
          const pad = 10;
          const pairTop = Math.min(fromRect.y, toRect.y);
          const pairBottom = Math.max(fromRect.y + fromRect.h, toRect.y + toRect.h);
          const pairLeft = Math.min(fromRect.x, toRect.x);
          const pairRight = Math.max(fromRect.x + fromRect.w, toRect.x + toRect.w);
          const midX = (startPoint.x + endPoint.x) / 2;
          const midY = (startPoint.y + endPoint.y) / 2;
          const waypoints = [
            { x: midX, y: Math.max(pad, pairTop - 16) },
            { x: midX, y: Math.min(boundsHeight - pad, pairBottom + 16) },
            { x: Math.max(pad, pairLeft - 16), y: midY },
            { x: Math.min(boundsWidth - pad, pairRight + 16), y: midY }
          ];
          for (const waypoint of waypoints) {
            tryCurve(waypoint, waypoint);
            if (bestCost === 0) break;
          }
        }
        if (bestCost > 0) {
          const bands2 = (edges) => {
            const sorted = [...edges].sort((a, b) => a.start - b.start);
            const lanes = [];
            let reach = Number.NEGATIVE_INFINITY;
            for (const edge of sorted) {
              if (edge.start > reach && Number.isFinite(reach)) lanes.push((reach + edge.start) / 2);
              reach = Math.max(reach, edge.end);
            }
            if (sorted.length > 0) {
              lanes.unshift(Math.max(8, sorted[0].start - 14));
              lanes.push(reach + 14);
            }
            return lanes;
          };
          const samplePolyline = (points) => (t4) => {
            let total = 0;
            for (let index2 = 1; index2 < points.length; index2 += 1) {
              total += Math.abs(points[index2].x - points[index2 - 1].x) + Math.abs(points[index2].y - points[index2 - 1].y);
            }
            let walked = 0;
            const target = t4 * total;
            for (let index2 = 1; index2 < points.length; index2 += 1) {
              const a = points[index2 - 1];
              const b = points[index2];
              const length = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
              if (walked + length >= target || index2 === points.length - 1) {
                const ratio = length === 0 ? 0 : Math.min(1, (target - walked) / length);
                return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
              }
              walked += length;
            }
            return points[points.length - 1];
          };
          const midY = (startPoint.y + endPoint.y) / 2;
          const midX = (startPoint.x + endPoint.x) / 2;
          const lanesY = bands2(cardsInDrawer.map((card) => ({ start: card.y, end: card.y + card.h }))).sort((a, b) => Math.abs(a - midY) - Math.abs(b - midY));
          const lanesX = bands2(cardsInDrawer.map((card) => ({ start: card.x, end: card.x + card.w }))).sort((a, b) => Math.abs(a - midX) - Math.abs(b - midX));
          const startStub = { x: startPoint.x + startNormal.x * 12, y: startPoint.y + startNormal.y * 12 };
          const endStub = { x: endPoint.x + endNormal.x * 12, y: endPoint.y + endNormal.y * 12 };
          const laneOffset = (wireIndex % 7 - 3) * 1.3;
          const shapes = [];
          for (const lane of lanesY) {
            const at = lane + laneOffset;
            shapes.push([
              startPoint,
              startStub,
              { x: startStub.x, y: at },
              { x: endStub.x, y: at },
              endStub,
              endPoint
            ]);
          }
          for (const lane of lanesX) {
            const at = lane + laneOffset;
            shapes.push([
              startPoint,
              startStub,
              { x: at, y: startStub.y },
              { x: at, y: endStub.y },
              endStub,
              endPoint
            ]);
          }
          for (const shape of shapes) {
            const cost = badness(samplePolyline(shape));
            if (cost < bestCost) {
              bestCost = cost;
              bestD = roundedPath(shape, 10);
              arrival = { x: endPoint.x - endStub.x, y: endPoint.y - endStub.y };
              if (cost === 0) break;
            }
          }
        }
        const angle = Math.abs(arrival.x) < 0.5 && Math.abs(arrival.y) < 0.5 ? toSide === "l" ? 180 : toSide === "r" ? 0 : toSide === "t" ? -90 : 90 : Math.abs(arrival.x) >= Math.abs(arrival.y) ? arrival.x >= 0 ? 0 : 180 : arrival.y >= 0 ? 90 : -90;
        const arrowAngle = angle;
        wireIndex += 1;
        next.push({
          d: bestD ?? "M " + startPoint.x + " " + startPoint.y + " L " + endPoint.x + " " + endPoint.y,
          ax: endPoint.x - endNormal.x * 2.5,
          ay: endPoint.y - endNormal.y * 2.5,
          angle: arrowAngle,
          from: link2.from,
          to: link2.to
        });
      }
      setWires((current) => {
        if (current.length === next.length && current.every((wire, index2) => wire.d === next[index2]?.d)) {
          return current;
        }
        return next;
      });
      const width = Math.round(scroller.scrollWidth);
      const height = Math.round(scroller.scrollHeight);
      setWireSize((current) => current.width === width && current.height === height ? current : { width, height });
    };
    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(scroller);
    let signature = "";
    let stableFrames = 0;
    let frame2 = 0;
    const tick = () => {
      measure();
      const next = [...scroller.querySelectorAll("[data-card-id]")].map((element) => {
        const r = element.getBoundingClientRect();
        return `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}`;
      }).join("|");
      stableFrames = next === signature ? stableFrames + 1 : 0;
      signature = next;
      frame2 += 1;
      if (stableFrames < 3 || frame2 < 12) {
        raf = window.requestAnimationFrame(tick);
      }
    };
    let raf = window.requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [props.links, props.items, query, visibleItems.length]);
  (0, import_react11.useEffect)(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) return;
    scroller.scrollTop = drawerState.readScroll();
  }, []);
  (0, import_react11.useEffect)(() => {
    const release = mapUi.claimEscape("stack-drawer");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      requestClose();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  }, []);
  const lastScrollAt = (0, import_react11.useRef)(0);
  const [leaving, setLeaving] = (0, import_react11.useState)(false);
  const leaveTimer = (0, import_react11.useRef)(null);
  const requestClose = () => {
    if (leaving) return;
    setLeaving(true);
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      props.onClose();
    }, 130);
  };
  (0, import_react11.useEffect)(() => () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current);
  }, []);
  const scrollSaveTimer = (0, import_react11.useRef)(null);
  const slotUnder = (clientX, clientY) => {
    const scroller = scrollerRef.current;
    if (scroller === null) return null;
    const cards = [...scroller.querySelectorAll("[data-stack-card]")];
    if (cards.length === 0) return null;
    let best = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index2) => {
      const box = card.getBoundingClientRect();
      const dx = clientX - (box.x + box.width / 2);
      const dy = clientY - (box.y + box.height / 2);
      const distance2 = dx * dx + dy * dy * 3;
      if (distance2 < bestDistance) {
        bestDistance = distance2;
        best = index2;
      }
    });
    return best;
  };
  const endDrag = () => {
    setDragId(null);
    setDropIndex(null);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "div",
    {
      className: `${talk_pages_default["drawerBackdrop"]}${leaving ? ` ${talk_pages_default["drawerBackdropOut"]}` : ""}`,
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) requestClose();
      },
      onClick: (event) => {
        if (event.target === event.currentTarget) requestClose();
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
        "div",
        {
          className: `${talk_pages_default["drawer"]}${leaving ? ` ${talk_pages_default["drawerOut"]}` : ""}`,
          role: "dialog",
          "aria-label": props.workspaceTitle,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: talk_pages_default["drawerHead"], children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerTitle"], children: props.workspaceTitle }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerCount"], children: t("stack.total", { n: String(props.items.length) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerSpace"] }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerHint"], children: t("stack.hint") }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "button",
                {
                  type: "button",
                  className: talk_pages_default["drawerClose"],
                  title: t("stack.close"),
                  "aria-label": t("stack.close"),
                  onClick: requestClose,
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: talk_pages_default["drawerSearchRow"], children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "input",
                {
                  className: talk_pages_default["drawerSearch"],
                  value: query,
                  placeholder: t("stack.searchPlaceholder"),
                  "aria-label": t("stack.searchPlaceholder"),
                  "data-talkmap-drawer-search": "",
                  onChange: (event) => {
                    setQuery(event.target.value);
                    if (event.target.value.trim() === "") {
                      setHits([]);
                      setSearchError(null);
                    }
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Escape") {
                      event.stopPropagation();
                      return;
                    }
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    void runSearch();
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "button",
                {
                  type: "button",
                  className: talk_pages_default["drawerSearchGo"],
                  "data-talkmap-drawer-search-run": "",
                  onClick: () => {
                    void runSearch();
                  },
                  children: t("global.searchRun")
                }
              ),
              searching ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerSearchState"], children: t("stack.searching") }) : null,
              searchError !== null ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["drawerSearchError"], title: searchError, children: isIndexDisabled(searchError) ? t("stack.searchDisabled") : t("stack.searchFailed") + "：" + (searchError.length > 70 ? searchError.slice(0, 70) + "…" : searchError) }) : null
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
              "div",
              {
                className: talk_pages_default["drawerScroll"],
                ref: scrollerRef,
                onScroll: (event) => {
                  lastScrollAt.current = Date.now();
                  const scroller = event.currentTarget;
                  if (scrollSaveTimer.current !== null) window.clearTimeout(scrollSaveTimer.current);
                  scrollSaveTimer.current = window.setTimeout(() => {
                    scrollSaveTimer.current = null;
                    drawerState.writeScroll(scroller.scrollTop);
                  }, 200);
                },
                children: [
                  wires.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                    "svg",
                    {
                      className: talk_pages_default["drawerWires"],
                      width: Math.max(1, wireSize.width),
                      height: Math.max(1, wireSize.height),
                      "aria-hidden": "true",
                      children: wires.map((wire, index2) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("g", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                          "path",
                          {
                            d: wire.d,
                            "data-from": wire.from ?? "",
                            "data-to": wire.to ?? "",
                            fill: "none",
                            stroke: "rgba(200, 206, 216, 0.42)",
                            strokeWidth: 1.4,
                            strokeLinecap: "round",
                            strokeDasharray: "6 5"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                          "path",
                          {
                            d: "M0 0 L-9 -4 L-9 4 Z",
                            transform: `translate(${wire.ax} ${wire.ay}) rotate(${wire.angle})`,
                            fill: "rgba(200, 206, 216, 0.5)"
                          }
                        )
                      ] }, index2))
                    }
                  ) : null,
                  visibleItems.map((item) => {
                    const classNames = [talk_pages_default["card"], talk_pages_default["drawerCard"]];
                    if (item.glow !== void 0) classNames.push(talk_pages_default[LAMP_CLASS2[item.glow]] ?? "");
                    const quiet = item.glow === void 0 && item.pendingDraft !== true && item.interrupted !== true && item.pinned !== true;
                    if (quiet) classNames.push(talk_pages_default["cardQuiet"] ?? "");
                    if (item.selected === true) classNames.push(talk_pages_default["cardSelected"] ?? "");
                    return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                      "button",
                      {
                        type: "button",
                        "data-stack-card": "",
                        "data-card-id": item.cardId,
                        "data-talkmap-session": item.sessionId,
                        className: classNames.filter(Boolean).join(" "),
                        draggable: true,
                        "data-talkmap-drag": dragId === item.cardId ? "1" : void 0,
                        onDragStart: (event) => {
                          setDragId(item.cardId);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", item.cardId);
                        },
                        onDragOver: (event) => {
                          if (dragId === null) return;
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          const index2 = slotUnder(event.clientX, event.clientY);
                          if (index2 !== null && index2 !== dropIndex) setDropIndex(index2);
                        },
                        onDrop: (event) => {
                          event.preventDefault();
                          const index2 = dropIndex;
                          const moving = dragId;
                          endDrag();
                          if (moving === null || index2 === null) return;
                          props.onReorder?.(moving, index2);
                        },
                        onDragEnd: endDrag,
                        onClick: () => {
                          props.onOpenCard(item.cardId);
                        },
                        onContextMenu: (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          props.onCardMenu?.(item.cardId, event);
                        },
                        children: [
                          item.current === true ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("span", { className: talk_pages_default["cardReticle"], children: [
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("i", {}),
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("i", {}),
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("i", {}),
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("i", {})
                          ] }) : null,
                          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: talk_pages_default["cardTop"], children: [
                            item.pinned === true ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["cardPin"], title: t("card.pinned"), "data-talkmap-pin": "1", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("svg", { viewBox: "0 0 24 24", width: "13", height: "13", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { fill: "currentColor", d: "M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z" }) }) }) : null,
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["cardTitle"], children: item.title })
                          ] }),
                          item.preview !== void 0 && item.preview !== "" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: talk_pages_default["cardSummary"], children: item.preview }) : null,
                          item.links !== void 0 && item.links.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: talk_pages_default["cardLinks"], "data-talkmap-card-links": item.links.length, children: item.links.slice(0, 3).map((link2) => /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                            "span",
                            {
                              className: talk_pages_default["cardLinkChip"],
                              "data-talkmap-link": link2.outgoing ? "out" : "in",
                              title: link2.kind,
                              children: [
                                link2.outgoing ? "→ " : "← ",
                                link2.title
                              ]
                            },
                            (link2.outgoing ? "out-" : "in-") + link2.toCardId
                          )) }) : null,
                          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: talk_pages_default["cardFooter"], children: [
                            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["cardTime"], children: relativeTime(item.updatedAt) }),
                            item.pendingDraft === true ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                              "span",
                              {
                                className: `${talk_pages_default["cardChip"]} ${talk_pages_default["cardChipDraft"]}`,
                                title: t("card.draftHint"),
                                "data-talkmap-draft": "1",
                                children: t("card.draft")
                              }
                            ) : null,
                            item.interrupted === true ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                              "span",
                              {
                                className: `${talk_pages_default["cardChip"]} ${talk_pages_default["cardChipInterrupted"]}`,
                                title: t("card.interruptedHint"),
                                "data-talkmap-interrupted": "1",
                                children: t("card.interrupted")
                              }
                            ) : null,
                            item.glow === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                              "span",
                              {
                                className: `${talk_pages_default["cardChip"]} ${talk_pages_default[LAMP_CHIP[item.glow].className]}`,
                                "data-talkmap-chip": item.glow,
                                children: [
                                  item.glow === "running" ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("span", { className: talk_pages_default["runningDot"] }) : null,
                                  t(LAMP_CHIP[item.glow].key)
                                ]
                              }
                            )
                          ] })
                        ]
                      },
                      item.cardId
                    );
                  }),
                  hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                    SearchResults,
                    {
                      query,
                      hits,
                      empty: t("map.noHit"),
                      onOpenSession: (sessionId) => {
                        props.onOpenSession?.(sessionId);
                      }
                    }
                  ) : null,
                  needle !== "" && visibleItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: talk_pages_default["drawerEmpty"], children: t("stack.noTitleMatch") }) : null
                ]
              }
            )
          ]
        }
      )
    }
  );
}

// src/client/StackNode.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function StackNode(props) {
  const { data } = props;
  const open = () => {
    data.onOpen();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "div",
    {
      className: [talk_pages_default["stackCell"], talk_pages_default["cardQuiet"] ?? ""].filter(Boolean).join(" "),
      role: "button",
      tabIndex: 0,
      title: t("stack.open"),
      "aria-label": t("stack.open"),
      onClick: (event) => {
        event.stopPropagation();
        open();
      },
      onKeyDown: (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: talk_pages_default["stackSheetBack"] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: talk_pages_default["stackSheetMid"] }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: talk_pages_default["stackFace"], children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: talk_pages_default["stackFaceTitle"], children: data.topTitle ?? t("frame.unknown") }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: [talk_pages_default["stackBadge"], data.busy === true ? talk_pages_default["stackBadgeBusy"] ?? "" : ""].filter(Boolean).join(" "), children: [
            "+",
            data.count
          ] })
        ] })
      ]
    }
  );
}

// src/client/use-dark.ts
var import_react12 = require("react");
var DARK_ATTRIBUTE = "data-ds-dark-theme";
function subscribe2(listener) {
  if (typeof document === "undefined") return () => {
  };
  const observer = new MutationObserver(listener);
  observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTRIBUTE] });
  return () => {
    observer.disconnect();
  };
}
function getSnapshot() {
  if (typeof document === "undefined") return false;
  return document.body.hasAttribute(DARK_ATTRIBUTE);
}
function useDsDarkTheme() {
  return (0, import_react12.useSyncExternalStore)(subscribe2, getSnapshot);
}

// src/client/MapCanvas.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var TALK_MAP_EDGE_TYPE = "talkMap";
var nodeTypes = {
  sessionCard: SessionCardNode,
  wsFrame: WsFrameNode,
  stackCell: StackNode
};
var GRID = 16;
var COLS = 3;
var AUTO_SYNC_PER_PAGE = 60;
var AUTO_SYNC_TOTAL = 200;
var EMPTY_SESSION_STATUS = /* @__PURE__ */ new Map();
function snap(value2) {
  return Math.round(value2 / GRID) * GRID;
}
function placeableSessionIds(sessions) {
  return sessions.ids.filter((id2) => {
    const summary = sessions.byId[id2];
    return summary !== void 0 && !summary.blank && summary.origin !== "subagent";
  });
}
function gridPosition(origin, index2) {
  const column = index2 % COLS;
  const row = Math.floor(index2 / COLS);
  return {
    x: snap(origin.x + column * (CARD_W + GAP_X)),
    y: snap(origin.y + row * (CARD_H + GAP_Y))
  };
}
function rectsOverlap(rect, other) {
  const overlapX = Math.min(rect.x + rect.width, other.x + other.width) - Math.max(rect.x, other.x);
  const overlapY = Math.min(rect.y + rect.height, other.y + other.height) - Math.max(rect.y, other.y);
  return overlapX > 1 && overlapY > 1;
}
function CanvasInner(props) {
  const dark = useDsDarkTheme();
  const canvasState = (0, import_react13.useSyncExternalStore)(canvas.subscribe, canvas.get);
  const sessions = props.useSessions((state3) => state3);
  const workspaces = props.useWorkspaces((state3) => state3);
  const statusById = typeof props.useSessionStatus === "function" ? props.useSessionStatus((status) => status) : EMPTY_SESSION_STATUS;
  const alertById = (0, import_react13.useSyncExternalStore)(sessionAlerts.subscribe, sessionAlerts.getSnapshot);
  const finishedById = (0, import_react13.useSyncExternalStore)(sessionActivity.subscribe, sessionActivity.getSnapshot);
  const interruptedById = (0, import_react13.useSyncExternalStore)(sessionActivity.subscribe, sessionActivity.getInterrupted);
  (0, import_react13.useEffect)(() => {
    const onUnload = () => {
      sessionActivity.recordShutdown(statusById, sessions.byId);
    };
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [statusById, sessions]);
  (0, import_react13.useEffect)(() => {
    sessionActivity.beginPanelSession();
  }, []);
  (0, import_react13.useEffect)(() => {
    sessionActivity.observe(statusById, sessions.byId);
  }, [statusById, sessions]);
  const draftSessions = (0, import_react13.useSyncExternalStore)(draftWatch.subscribe, draftWatch.getSnapshot);
  (0, import_react13.useEffect)(() => {
    draftWatch.refresh();
    const timer4 = setInterval(() => {
      draftWatch.refresh();
    }, 1500);
    return () => {
      clearInterval(timer4);
    };
  }, []);
  const [previews, setPreviews] = (0, import_react13.useState)(readPreviewTexts);
  const previewStamp = (0, import_react13.useRef)(
    // Only entries that still make a usable body count as cached: a rule fix that
    // empties an old entry must trigger a refetch, not leave a blank card.
    new Map(Object.entries(loadPreviewCache()).filter(([, entry]) => typeof entry?.text === "string" && cleanPreviewText(entry.text) !== "").map(([sessionId, entry]) => [sessionId, entry.stamp]))
  );
  const { screenToFlowPosition, zoomTo, setNodes, setCenter, getZoom, setViewport, fitView } = useReactFlow();
  const [selectedIds, setSelectedIds] = (0, import_react13.useState)(/* @__PURE__ */ new Set());
  const [selectedEdgeIds, setSelectedEdgeIds] = (0, import_react13.useState)(/* @__PURE__ */ new Set());
  const [connecting, setConnecting] = (0, import_react13.useState)(false);
  const connectCancelledRef = (0, import_react13.useRef)(false);
  const [toast, setToast] = (0, import_react13.useState)(null);
  const toastTimer = (0, import_react13.useRef)(void 0);
  const [pendingSpawn, setPendingSpawn] = (0, import_react13.useState)(null);
  const [menu, setMenu] = (0, import_react13.useState)(null);
  const [drawer, setDrawer] = (0, import_react13.useState)(() => {
    const remembered = drawerState.readGroup();
    return remembered === null ? null : { groupId: remembered };
  });
  const closeDrawer = () => {
    setDrawer(null);
    drawerState.clear();
  };
  const [digestTarget, setDigestTarget] = (0, import_react13.useState)(null);
  const [pushEpoch, setPushEpoch] = (0, import_react13.useState)(0);
  const LINEAGE_KEY = "dsh.talk-pages.lineage-hidden.v1";
  const LINEAGE_CUT_KEY = "dsh.talk-pages.lineage-cut.v1";
  const [lineageCut, setLineageCut] = (0, import_react13.useState)(() => {
    try {
      const raw = window.localStorage.getItem(LINEAGE_CUT_KEY);
      const parsed = raw === null ? [] : JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  });
  const cutLineage = (from, to) => {
    const key = from + "->" + to;
    setLineageCut((current) => {
      if (current.includes(key)) return current;
      const next = [...current, key];
      try {
        window.localStorage.setItem(LINEAGE_CUT_KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  };
  const [lineageHidden, setLineageHiddenState] = (0, import_react13.useState)(() => {
    try {
      return localStorage.getItem("dsh.talk-pages.lineage-hidden.v1") === "1";
    } catch {
      return false;
    }
  });
  const setLineageHidden = (next) => {
    setLineageHiddenState(next);
    try {
      localStorage.setItem("dsh.talk-pages.lineage-hidden.v1", next ? "1" : "0");
    } catch {
    }
  };
  const [renameTarget, setRenameTarget] = (0, import_react13.useState)(null);
  const lastLabelPress = (0, import_react13.useRef)(null);
  const [renamedTitles, setRenamedTitles] = (0, import_react13.useState)({});
  const [batchMode, setBatchMode] = (0, import_react13.useState)(false);
  const [batchPicks, setBatchPicks] = (0, import_react13.useState)(/* @__PURE__ */ new Set());
  const [batchBusy, setBatchBusy] = (0, import_react13.useState)(false);
  const wrapperRef = (0, import_react13.useRef)(null);
  const [draggingCardId, setDraggingCardId] = (0, import_react13.useState)(null);
  const [liveFrame, setLiveFrame] = (0, import_react13.useState)(null);
  const [blockedFrame, setBlockedFrame] = (0, import_react13.useState)(null);
  const [dragCenter, setDragCenter] = (0, import_react13.useState)(null);
  const [isSelecting, setIsSelecting] = (0, import_react13.useState)(false);
  const frozenRef = (0, import_react13.useRef)(null);
  const locale = (0, import_react13.useSyncExternalStore)(subscribeLocale, activeLocale, activeLocale);
  const sessionWs = (0, import_react13.useMemo)(() => sessionPageIndex(workspaces.items), [workspaces.items]);
  const wsTitles = (0, import_react13.useMemo)(
    () => new Map(workspaces.items.map((item) => [item.workspaceId, item.title])),
    [workspaces]
  );
  const workspacesReady = workspaces.baselinesReady !== false;
  const boardSessionIds = (0, import_react13.useMemo)(
    () => new Set(Object.values(canvasState.cards).map((card) => card.sessionId)),
    [canvasState.cards]
  );
  const wsFrames = canvasState.global?.wsFrames ?? {};
  const boxes = canvasState.global?.boxes ?? {};
  const layoutVersion = canvasState.global?.layoutVersion ?? 1;
  const snapEnabled = canvasState.global?.snap !== false;
  const pages = (0, import_react13.useMemo)(() => buildPages({
    workspaces: workspaces.items,
    cards: canvasState.cards,
    boxes,
    sessionPage: sessionWs,
    isHidden: (card) => sessions.byId[card.sessionId]?.blank === true,
    unsortedTitle: t("page.unsorted"),
    ...canvasState.global?.activePage !== void 0 ? { activePage: canvasState.global.activePage } : {}
  }), [workspaces.items, canvasState.cards, boxes, sessionWs, sessions, canvasState.global?.activePage]);
  const activePage = resolveActivePage(canvasState.global, pages);
  const pageCameraReady = (0, import_react13.useRef)(false);
  (0, import_react13.useEffect)(() => {
    const camera = canvas.savedCamera(pageCameraKey(activePage));
    if (!pageCameraReady.current) {
      pageCameraReady.current = true;
      if (camera !== void 0 || Object.keys(canvasState.cards).length === 0) return;
      const timer4 = window.setTimeout(() => {
        void fitView({ duration: 0, padding: 0.2 });
      }, 80);
      return () => window.clearTimeout(timer4);
    }
    if (camera !== void 0) void setViewport(camera, { duration: 0 });
    else void fitView({ duration: 0, padding: 0.2 });
  }, [activePage]);
  (0, import_react13.useEffect)(() => {
    if (canvasState.phase !== "ready" || layoutVersion >= LAYOUT_VERSION || !workspacesReady) return;
    const migrated = migrateToBoxes({
      cards: canvasState.cards,
      wsFrames,
      boxes: canvasState.global?.boxes,
      sessionPage: sessionWs,
      titles: wsTitles
    });
    if (!migrated.changed) {
      canvas.patchGlobalNow({ layoutVersion: LAYOUT_VERSION });
      return;
    }
    canvas.migrateToBoxes(migrated.boxes, migrated.cards, LAYOUT_VERSION);
  }, [canvasState.phase, layoutVersion, workspacesReady, canvasState.cards, canvasState.global, wsFrames, boxes, sessionWs, wsTitles]);
  const visibleCards = (0, import_react13.useMemo)(() => {
    const out = {};
    for (const [cardId, card] of Object.entries(canvasState.cards)) {
      if (sessions.byId[card.sessionId]?.blank === true) continue;
      if (pageOfCard(card, boxes, sessionWs) !== activePage) continue;
      out[cardId] = card;
    }
    return out;
  }, [canvasState.cards, sessions, boxes, sessionWs, activePage]);
  const previewInputs = (0, import_react13.useRef)({ cards: visibleCards, sessions });
  previewInputs.current = { cards: visibleCards, sessions };
  const previewTick = (0, import_react13.useRef)(() => {
  });
  (0, import_react13.useEffect)(() => {
    const tick = () => {
      const { cards, sessions: latest } = previewInputs.current;
      const pending = [];
      const stamps = [];
      for (const card of Object.values(cards)) {
        const stamp = latest.byId[card.sessionId]?.updatedAt ?? 0;
        if (previewStamp.current.get(card.sessionId) === stamp) continue;
        pending.push(card.sessionId);
        stamps.push([card.sessionId, stamp]);
      }
      if (pending.length === 0) return;
      for (const [sessionId, stamp] of stamps) previewStamp.current.set(sessionId, stamp);
      void talkMapApi.lastUserMessages(pending).then(({ texts }) => {
        const cleaned = {};
        for (const [sessionId, text] of Object.entries(texts)) {
          const value2 = cleanPreviewText(text).slice(0, 240);
          const stamp = stamps.find(([id2]) => id2 === sessionId)?.[1] ?? 0;
          putPreview(sessionId, text, stamp);
          if (value2 === "") continue;
          cleaned[sessionId] = value2;
        }
        setPreviews((previous) => ({ ...previous, ...cleaned }));
      }).catch(() => void 0);
    };
    previewTick.current = tick;
    tick();
    const timer4 = setInterval(tick, 1500);
    return () => {
      clearInterval(timer4);
    };
  }, []);
  (0, import_react13.useEffect)(() => {
    previewTick.current();
  }, [visibleCards]);
  const membersByGroup = (0, import_react13.useMemo)(() => {
    const index2 = /* @__PURE__ */ new Map();
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (card.boxId === void 0) continue;
      if (boxes[card.boxId] === void 0) continue;
      index2.set(card.boxId, [...index2.get(card.boxId) ?? [], cardId]);
    }
    return index2;
  }, [visibleCards, boxes]);
  const frameRects = (0, import_react13.useMemo)(() => {
    const out = {};
    for (const [boxId, stored] of Object.entries(wsFrames)) {
      if (pageOfBox(boxId, boxes) !== activePage) continue;
      const base = liveFrame !== null && liveFrame.groupId === boxId ? liveFrame.rect : stored;
      out[boxId] = frameRect(base);
    }
    return out;
  }, [wsFrames, boxes, activePage, liveFrame]);
  const folderLayouts = (0, import_react13.useMemo)(() => {
    const out = {};
    for (const [groupId, rect] of Object.entries(frameRects)) {
      const members = (membersByGroup.get(groupId) ?? []).map((cardId) => {
        const card = visibleCards[cardId];
        return card === void 0 ? void 0 : { cardId, x: card.x, y: card.y };
      }).filter((entry) => entry !== void 0);
      const reading = readingOrder(members);
      const ordered = reading;
      if (boxes[groupId]?.free === true) {
        out[groupId] = { rect, ordered, shown: ordered, folded: [], free: true };
        continue;
      }
      const capacity = capacityFor(rect);
      let preview = ordered;
      if (draggingCardId !== null && ordered.includes(draggingCardId)) {
        const others = ordered.filter((cardId) => cardId !== draggingCardId);
        const slots = Math.max(1, visibleCount(capacity, others.length + 1));
        const wanted = dragCenter === null ? others.length : slotIndexAt(rect, dragCenter);
        const insertAt = Math.min(Math.max(0, wanted), Math.max(0, Math.min(slots, others.length) - 1));
        preview = [...others.slice(0, insertAt), draggingCardId, ...others.slice(insertAt)];
      }
      const visibleSlots = visibleCount(capacity, preview.length);
      out[groupId] = {
        rect,
        ordered: preview,
        shown: preview.slice(0, visibleSlots),
        folded: preview.length > capacity ? preview.slice(visibleSlots) : [],
        free: false
      };
    }
    return out;
  }, [frameRects, membersByGroup, visibleCards, draggingCardId, dragCenter, boxes]);
  const cardLayout = (0, import_react13.useMemo)(() => {
    const out = {};
    for (const layout of Object.values(folderLayouts)) {
      if (layout.free) continue;
      Object.assign(out, layoutFor(layout.rect, layout.ordered));
    }
    return out;
  }, [folderLayouts]);
  const memberShift = (0, import_react13.useMemo)(() => {
    const out = {};
    if (liveFrame === null) return out;
    const stored = wsFrames[liveFrame.groupId];
    if (stored === void 0 || boxes[liveFrame.groupId]?.free !== true) return out;
    if (liveFrame.rect.width !== stored.width || liveFrame.rect.height !== stored.height) return out;
    const dx = liveFrame.rect.x - stored.x;
    const dy = liveFrame.rect.y - stored.y;
    if (dx === 0 && dy === 0) return out;
    for (const cardId of membersByGroup.get(liveFrame.groupId) ?? []) out[cardId] = { dx, dy };
    return out;
  }, [liveFrame, wsFrames, boxes, membersByGroup]);
  const foldedCards = (0, import_react13.useMemo)(() => {
    const out = {};
    for (const [groupId, layout] of Object.entries(folderLayouts)) {
      if (layout.folded.length > 0) out[groupId] = layout.folded;
    }
    return out;
  }, [folderLayouts]);
  (0, import_react13.useEffect)(() => {
    if (canvasState.phase !== "ready") return;
    if (draggingCardId !== null || liveFrame !== null) return;
    const timer4 = window.setTimeout(() => {
      const stale = {};
      for (const [cardId, point] of Object.entries(cardLayout)) {
        const card = canvasState.cards[cardId];
        if (card === void 0) continue;
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
        if (Math.abs(card.x - point.x) > 0.5 || Math.abs(card.y - point.y) > 0.5) stale[cardId] = point;
      }
      if (Object.keys(stale).length > 0) canvas.moveCards(stale);
    }, 140);
    return () => window.clearTimeout(timer4);
  }, [cardLayout, canvasState.cards, canvasState.phase, draggingCardId, liveFrame]);
  const foldedSet = (0, import_react13.useMemo)(() => new Set(Object.values(foldedCards).flat()), [foldedCards]);
  const autoSyncedRef = (0, import_react13.useRef)(false);
  (0, import_react13.useEffect)(() => {
    if (canvasState.phase !== "ready" || !workspacesReady || autoSyncedRef.current) return;
    if (canvasState.global?.autoAdd !== true) return;
    if (layoutVersion < LAYOUT_VERSION) return;
    autoSyncedRef.current = true;
    const remembered = canvasState.global?.layoutMemory ?? {};
    const placeable = placeableSessionIds(sessions);
    const byPage = /* @__PURE__ */ new Map();
    for (const card of Object.values(canvasState.cards)) {
      const pageId = pageOfCard(card, boxes, sessionWs);
      byPage.set(pageId, [...byPage.get(pageId) ?? [], card]);
    }
    const added = {};
    let budget = AUTO_SYNC_TOTAL;
    for (const page of pages) {
      if (budget <= 0) break;
      const existing = byPage.get(page.id) ?? [];
      const missing = placeable.filter((sessionId) => (sessionWs.get(sessionId) ?? UNSORTED_PAGE_ID) === page.id).filter((sessionId) => !boardSessionIds.has(sessionId)).sort((a, b) => (sessions.byId[b]?.updatedAt ?? 0) - (sessions.byId[a]?.updatedAt ?? 0)).slice(0, Math.min(AUTO_SYNC_PER_PAGE, budget));
      if (missing.length === 0) continue;
      const origin = existing.length === 0 ? { x: 0, y: 0 } : {
        x: snap(Math.min(...existing.map((card) => card.x))),
        y: snap(Math.max(...existing.map((card) => card.y + CARD_H)) + GAP_Y)
      };
      missing.forEach((sessionId, index2) => {
        const entry = remembered[sessionId];
        const position = entry !== void 0 ? { x: entry.x, y: entry.y } : gridPosition(origin, index2);
        added[newCardId()] = {
          boardId: INBOX_BOARD_ID,
          sessionId,
          x: position.x,
          y: position.y,
          createdAt: Date.now()
        };
      });
      budget -= missing.length;
    }
    if (Object.keys(added).length > 0) canvas.addCards(added);
  }, [canvasState.phase, canvasState.cards, canvasState.global, workspacesReady, layoutVersion, pages, boxes, sessions, sessionWs, boardSessionIds]);
  (0, import_react13.useEffect)(() => {
    if (!connecting) return;
    const release = mapUi.claimEscape("connecting");
    const onKeyDown = (event) => {
      if (event.key === "Escape") connectCancelledRef.current = true;
    };
    const onGestureEnd = () => {
      setConnecting(false);
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerup", onGestureEnd, { capture: true });
    window.addEventListener("pointercancel", onGestureEnd, { capture: true });
    window.addEventListener("blur", onGestureEnd);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerup", onGestureEnd, { capture: true });
      window.removeEventListener("pointercancel", onGestureEnd, { capture: true });
      window.removeEventListener("blur", onGestureEnd);
      release();
    };
  }, [connecting]);
  (0, import_react13.useEffect)(() => {
    const onKeyDown = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.code !== "KeyZ") return;
      const target = event.target;
      if (target?.closest('input, textarea, [contenteditable="true"]') !== null && target !== null) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.shiftKey) canvas.redo();
      else canvas.undo();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);
  const liveSelectedIds = (0, import_react13.useMemo)(() => {
    const next = /* @__PURE__ */ new Set();
    for (const id2 of selectedIds) {
      if (id2.startsWith("frame-")) {
        if (frameRects[id2.slice("frame-".length)] !== void 0) next.add(id2);
      } else if (visibleCards[id2] !== void 0) {
        next.add(id2);
      }
    }
    return next;
  }, [selectedIds, visibleCards, frameRects]);
  const liveSelectedEdgeIds = (0, import_react13.useMemo)(() => {
    const next = /* @__PURE__ */ new Set();
    for (const id2 of selectedEdgeIds) {
      if (canvasState.edges[id2] !== void 0) next.add(id2);
    }
    return next;
  }, [selectedEdgeIds, canvasState.edges]);
  const hasSelection = liveSelectedIds.size > 0 || liveSelectedEdgeIds.size > 0;
  (0, import_react13.useEffect)(() => {
    if (!hasSelection) return;
    const release = mapUi.claimEscape("selection");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setSelectedIds(/* @__PURE__ */ new Set());
        setSelectedEdgeIds(/* @__PURE__ */ new Set());
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        const target = event.target;
        if (target !== null && target.closest('input, textarea, [contenteditable="true"]') !== null) return;
        const frameIds = [...liveSelectedIds].filter((id2) => id2.startsWith("frame-"));
        if (frameIds.length === 0) return;
        for (const frameId of frameIds) deleteBox(frameId.slice("frame-".length));
        setSelectedIds((previous) => {
          const next = new Set(previous);
          for (const frameId of frameIds) next.delete(frameId);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  });
  (0, import_react13.useEffect)(() => {
    if (!batchMode) return;
    const release = mapUi.claimEscape("batch-mode");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setBatchMode(false);
      setBatchPicks(/* @__PURE__ */ new Set());
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  }, [batchMode]);
  const beginResize = (groupId, axis, event) => {
    const start2 = frameRects[groupId] ?? wsFrames[groupId];
    if (start2 === void 0) return;
    const origin = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const count = (membersByGroup.get(groupId) ?? []).length;
    const movesWest = axis === "w" || axis === "nw" || axis === "sw";
    const movesNorth = axis === "n" || axis === "ne" || axis === "nw";
    const movesEast = axis === "e" || axis === "ne" || axis === "se";
    const movesSouth = axis === "s" || axis === "se" || axis === "sw";
    let maxRight = Number.POSITIVE_INFINITY;
    let minLeft = Number.NEGATIVE_INFINITY;
    let maxBottom = Number.POSITIVE_INFINITY;
    let minTop = Number.NEGATIVE_INFINITY;
    for (const [otherId, other] of Object.entries(frameRects)) {
      if (otherId === groupId) continue;
      const spansRows = other.y < start2.y + start2.height && other.y + other.height > start2.y;
      const spansCols = other.x < start2.x + start2.width && other.x + other.width > start2.x;
      if (spansRows) {
        if (other.x >= start2.x + start2.width) maxRight = Math.min(maxRight, other.x);
        if (other.x + other.width <= start2.x) minLeft = Math.max(minLeft, other.x + other.width);
      }
      if (spansCols) {
        if (other.y >= start2.y + start2.height) maxBottom = Math.min(maxBottom, other.y);
        if (other.y + other.height <= start2.y) minTop = Math.max(minTop, other.y + other.height);
      }
    }
    let next = { ...start2 };
    const onMove = (moveEvent) => {
      const now2 = screenToFlowPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
      const dx = now2.x - origin.x;
      const dy = now2.y - origin.y;
      next = {
        x: movesWest ? start2.x + dx : start2.x,
        y: movesNorth ? start2.y + dy : start2.y,
        width: movesWest ? start2.width - dx : movesEast ? start2.width + dx : start2.width,
        height: movesNorth ? start2.height - dy : movesSouth ? start2.height + dy : start2.height
      };
      if (movesEast && next.x + next.width > maxRight) next.width = maxRight - next.x;
      if (movesWest && next.x < minLeft) {
        next.width = start2.x + start2.width - minLeft;
        next.x = minLeft;
      }
      if (movesSouth && next.y + next.height > maxBottom) next.height = maxBottom - next.y;
      if (movesNorth && next.y < minTop) {
        next.height = start2.y + start2.height - minTop;
        next.y = minTop;
      }
      setLiveFrame({ groupId, rect: next });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setLiveFrame(null);
      const clamped = { ...next };
      if (clamped.width < MIN_FRAME_WIDTH) {
        if (movesWest) clamped.x = start2.x + start2.width - MIN_FRAME_WIDTH;
        clamped.width = MIN_FRAME_WIDTH;
      }
      if (clamped.height < MIN_FRAME_HEIGHT) {
        if (movesNorth) clamped.y = start2.y + start2.height - MIN_FRAME_HEIGHT;
        clamped.height = MIN_FRAME_HEIGHT;
      }
      canvas.setWsFrameRect(groupId, frameRect(clamped));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };
  const glowOf = (sessionId) => {
    const status = statusById.get(sessionId);
    const summary = sessions.byId[sessionId];
    if (alertById.has(sessionId)) return "error";
    if (status !== void 0 && status.pendingInteraction !== void 0) return "waiting";
    if (status?.running === true || summary?.running === true) return "running";
    if (status?.completionUnread === true || finishedById.has(sessionId)) return "done";
    return void 0;
  };
  const priorityEntries = (0, import_react13.useMemo)(() => {
    const rows = [];
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (card.boardId !== INBOX_BOARD_ID || card.priority === void 0) continue;
      if (pageOfCard(card, boxes, sessionWs) !== activePage) continue;
      const summary = sessions.byId[card.sessionId];
      rows.push({
        cardId,
        sessionId: card.sessionId,
        title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
        priority: card.priority,
        ...summary?.updatedAt !== void 0 ? { updatedAt: summary.updatedAt } : {},
        ...previews[card.sessionId] !== void 0 ? { preview: previews[card.sessionId] } : {}
      });
    }
    return rows;
  }, [visibleCards, boxes, sessionWs, activePage, sessions, renamedTitles, previews]);
  const focusCard = (0, import_react13.useCallback)((cardId) => {
    const slot = cardLayout[cardId];
    const card = visibleCards[cardId];
    const point = slot ?? (card === void 0 ? void 0 : { x: card.x, y: card.y });
    setSelectedIds([cardId]);
    if (point === void 0) return;
    setCenter(point.x + CARD_W / 2, point.y + CARD_H / 2, { zoom: getZoom(), duration: 320 });
  }, [cardLayout, visibleCards, setCenter, getZoom, setSelectedIds]);
  const liveNodes = (0, import_react13.useMemo)(() => {
    const wsColors = canvasState.global?.wsColors ?? {};
    const frameNodes = Object.entries(frameRects).map(([groupId, rect]) => {
      const members = membersByGroup.get(groupId) ?? [];
      const boxTitle = boxes[groupId]?.title ?? wsTitles.get(groupId) ?? t("frame.unknown");
      return {
        id: `frame-${groupId}`,
        type: "wsFrame",
        position: { x: rect.x, y: rect.y },
        data: {
          workspaceId: groupId,
          title: boxTitle,
          count: members.length,
          width: rect.width,
          height: rect.height,
          // Box colour (global.wsColors[boxId]) drives the border and the chip.
          ...wsColors[groupId] !== void 0 ? { colorTag: wsColors[groupId] } : {},
          // Red outline while this box overlaps another one mid-drag.
          blocked: blockedFrame === groupId,
          onResizeStart: (axis, event) => {
            beginResize(groupId, axis, event);
          },
          // Double-click on the label renames the box (the body keeps "new chat").
          onRename: () => {
            setRenameTarget({ kind: "box", id: groupId, title: boxTitle });
          },
          onLabelPointerDown: () => {
            lastLabelPress.current = { boxId: groupId, at: Date.now() };
          }
        },
        draggable: true,
        // NOT selectable by React Flow: rubber-band selection grows in
        // batches and would sweep the huge frames in. Frame selection is
        // click-only, managed by this component (onNodeClick).
        selectable: false,
        focusable: false,
        selected: liveSelectedIds.has(`frame-${groupId}`),
        zIndex: -1,
        // Folders no longer eat pointer events: the body has to stay
        // transparent so a double-click inside it reaches the pane (that is
        // "new chat in this workspace"). The label and border strips are the
        // frame's own physical surfaces and keep their own pointer events.
        style: { pointerEvents: "none" }
      };
    });
    const cardNodes = Object.entries(visibleCards).filter(([, card]) => card.boardId === INBOX_BOARD_ID).map(([cardId, card]) => {
      const summary = sessions.byId[card.sessionId];
      const digest = canvasState.digests[card.sessionId];
      const status = statusById.get(card.sessionId);
      const slot = cardLayout[cardId];
      const dragging = draggingCardId === cardId;
      const data = {
        cardId,
        sessionId: card.sessionId,
        title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
        running: status?.running ?? summary?.running ?? false,
        ghost: summary === void 0,
        updatedAt: summary?.updatedAt,
        ...previews[card.sessionId] !== void 0 ? { preview: previews[card.sessionId] } : {},
        waiting: status !== void 0 ? status.pendingInteraction !== void 0 : summary?.pendingInteraction !== void 0,
        done: status?.completionUnread === true,
        glow: glowOf(card.sessionId),
        ...draftSessions.has(card.sessionId) ? { pendingDraft: true } : {},
        ...interruptedById.has(card.sessionId) ? { interrupted: true } : {},
        ...currentSessionId() === card.sessionId ? { current: true } : {},
        ...card.priority !== void 0 ? { priority: card.priority } : {}
      };
      return {
        id: cardId,
        type: "sessionCard",
        // The dragged card follows the pointer; every other card sits on its
        // slot (and glides there — the CSS transition owns the animation).
        position: dragging || slot === void 0 ? { x: card.x + (memberShift[cardId]?.dx ?? 0), y: card.y + (memberShift[cardId]?.dy ?? 0) } : { x: slot.x, y: slot.y },
        // Batch mode shows the pick as the card's ring; otherwise it is the
        // canvas selection.
        selected: batchMode ? batchPicks.has(cardId) : liveSelectedIds.has(cardId),
        ...batchMode ? { data: { ...data, onPick: () => {
          toggleBatchPick(cardId);
        } } } : { data },
        // Cards folded into the stack cell stay in the model (their edges and
        // selection survive) but must not paint over the grid.
        hidden: foldedSet.has(cardId),
        className: dragging ? "tmDragging" : ""
      };
    });
    const stackNodes = Object.entries(foldedCards).map(([groupId, folded]) => {
      const layout = folderLayouts[groupId];
      const rect = layout?.rect ?? frameRects[groupId];
      const index2 = layout?.shown.length ?? 0;
      const point = rect === void 0 ? { x: 0, y: 0 } : slotPoint(rect, index2);
      const newest = [...folded].map((cardId) => sessions.byId[visibleCards[cardId]?.sessionId ?? ""]?.updatedAt ?? 0).reduce((best, stamp, position) => stamp > best.stamp ? { stamp, position } : best, { stamp: -1, position: 0 });
      const topCardId = folded[newest.position];
      const topSessionId = topCardId === void 0 ? void 0 : visibleCards[topCardId]?.sessionId;
      const busy = folded.some((cardId) => {
        const sessionId = visibleCards[cardId]?.sessionId;
        if (sessionId === void 0) return false;
        return glowOf(sessionId) !== void 0 || draftSessions.has(sessionId) || interruptedById.has(sessionId);
      });
      return {
        id: `stack-${groupId}`,
        type: "stackCell",
        position: point,
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: 5,
        data: {
          workspaceId: groupId,
          count: folded.length,
          ...busy ? { busy: true } : {},
          ...topSessionId !== void 0 && sessions.byId[topSessionId] !== void 0 ? { topTitle: sessions.byId[topSessionId].displayTitle } : {},
          onOpen: () => {
            setDrawer({ groupId });
            drawerState.writeGroup(groupId);
          }
        }
      };
    });
    return [...frameNodes, ...cardNodes, ...stackNodes];
  }, [frameRects, folderLayouts, foldedCards, foldedSet, cardLayout, draggingCardId, memberShift, membersByGroup, wsTitles, boxes, visibleCards, canvasState.digests, canvasState.global, sessions, statusById, alertById, finishedById, interruptedById, draftSessions, previews, renamedTitles, liveSelectedIds, batchMode, batchPicks, locale]);
  const sessionIdToCardId = (0, import_react13.useMemo)(() => {
    const index2 = /* @__PURE__ */ new Map();
    for (const [cardId, card] of Object.entries(visibleCards)) {
      if (!index2.has(card.sessionId)) index2.set(card.sessionId, cardId);
    }
    return index2;
  }, [visibleCards]);
  const lastPushOf = (fromCardId, toCardId) => {
    for (const edge of Object.values(canvasState.edges)) {
      const same = edge.fromCardId === fromCardId && edge.toCardId === toCardId || edge.fromCardId === toCardId && edge.toCardId === fromCardId;
      if (same && typeof edge.lastPushAt === "number") return edge.lastPushAt;
    }
    return lastPushFor(fromCardId, toCardId);
  };
  const sourceCardUpdatedAt = (cardId) => {
    const card = canvasState.cards[cardId];
    if (card === void 0) return void 0;
    return sessions.byId[card.sessionId]?.updatedAt;
  };
  const renderedBoxes = () => {
    const out = {};
    for (const node of liveNodes) {
      if (node.type !== "sessionCard" || node.hidden === true) continue;
      out[node.id] = {
        x: node.position.x,
        y: node.position.y,
        w: CARD_PAINTED_W,
        h: CARD_PAINTED_H
      };
    }
    return out;
  };
  const CARD_PAINTED_W = 250;
  const CARD_PAINTED_H = 129;
  const [boardTick, setBoardTick] = (0, import_react13.useState)(0);
  (0, import_react13.useEffect)(() => {
    const timer4 = window.setTimeout(() => setBoardTick((value2) => value2 + 1), 150);
    return () => window.clearTimeout(timer4);
  }, []);
  const obstaclesFor = (fromCardId, toCardId) => {
    const rendered = renderedBoxes();
    const painted = { ...rendered };
    for (const [id2, card] of Object.entries(visibleCards)) {
      if (painted[id2] !== void 0) continue;
      painted[id2] = { x: card.x, y: card.y, w: CARD_W, h: CARD_H };
    }
    return Object.entries(painted).map(([, box]) => box);
  };
  const boxOf = (cardId) => renderedBoxes()[cardId];
  const routingObstacles = () => Object.entries(visibleCards).map(([id2, card]) => ({
    id: id2,
    x: card.x,
    y: card.y
  }));
  const sideHandles = (fromCardId, toCardId) => {
    const from = canvasState.cards[fromCardId];
    const to = canvasState.cards[toCardId];
    if (from === void 0 || to === void 0) return { fromHandle: "r", toHandle: "l" };
    const picked = pickFaces(
      { id: fromCardId, x: from.x, y: from.y },
      { id: toCardId, x: to.x, y: to.y },
      routingObstacles(),
      { cardWidth: CARD_W, cardHeight: CARD_H }
    );
    return { fromHandle: picked.fromHandle, toHandle: picked.toHandle };
  };
  const computedHandles = (fromCardId, toCardId) => {
    const from = canvasState.cards[fromCardId];
    const to = canvasState.cards[toCardId];
    if (from === void 0 || to === void 0) return { sourceHandle: "r", targetHandle: "l" };
    const picked = sideHandles(fromCardId, toCardId);
    return { sourceHandle: picked.fromHandle, targetHandle: picked.toHandle };
  };
  const liveEdges = (0, import_react13.useMemo)(() => {
    const out = [];
    const present = new Set(Object.keys(visibleCards).filter((cardId) => !foldedSet.has(cardId)));
    const explicitPairs = /* @__PURE__ */ new Set();
    for (const [edgeId, edge] of Object.entries(canvasState.edges)) {
      explicitPairs.add(`${edge.fromCardId}->${edge.toCardId}`);
      explicitPairs.add(`${edge.toCardId}->${edge.fromCardId}`);
      if (!present.has(edge.fromCardId) || !present.has(edge.toCardId)) continue;
      const kind = edge.injection.kind;
      const sync = edgeSyncState({
        kind,
        ...lastPushOf(edge.fromCardId, edge.toCardId) !== void 0 ? { lastPushAt: lastPushOf(edge.fromCardId, edge.toCardId) } : {},
        ...sourceCardUpdatedAt(edge.fromCardId) !== void 0 ? { sourceUpdatedAt: sourceCardUpdatedAt(edge.fromCardId) } : {}
      });
      out.push({
        id: edgeId,
        source: edge.fromCardId,
        target: edge.toCardId,
        // Faces are recomputed from the live positions — a stored handle would
        // keep a 12px stub forever after the cards were laid out side by side.
        // Honour the handles the user picked. Recomputing them unconditionally meant a
        // connection drawn from the left face of two stacked cards came out of their
        // *bottom* faces instead, and then had to loop back — the loop is what cut
        // through the cards. Only fall back to geometry when nothing was stored.
        ...edge.fromHandle !== void 0 && edge.toHandle !== void 0 ? { sourceHandle: edge.fromHandle, targetHandle: edge.toHandle } : computedHandles(edge.fromCardId, edge.toCardId),
        type: TALK_MAP_EDGE_TYPE,
        selected: liveSelectedEdgeIds.has(edgeId),
        // Endpoints ride along for the edge context menu (id parsing would
        // be ambiguous — card ids contain dashes); `sync` drives the look.
        data: {
          fromCardId: edge.fromCardId,
          toCardId: edge.toCardId,
          sync,
          // Hidden until the first layout pass: the stored positions come first and the
          // measured ones a frame later, and drawing the early route made the line
          // visibly jump across the board when the map opened.
          ready: boardTick > 0,
          obstacles: obstaclesFor(edge.fromCardId, edge.toCardId),
          ...boxOf(edge.fromCardId) !== void 0 ? { fromRect: boxOf(edge.fromCardId) } : {},
          ...boxOf(edge.toCardId) !== void 0 ? { toRect: boxOf(edge.toCardId) } : {}
        },
        // Every line carries its direction now: 「推送摘要」 always travels
        // source → target, so a link edge gets a lighter arrow instead of none.
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: kind === "link" ? 13 : 16,
          height: kind === "link" ? 13 : 16,
          color: sync === "synced" ? "rgba(255, 214, 106, 0.9)" : "rgba(255, 255, 255, 0.45)"
        },
        // Pure association lines: no label, lighter than injection edges.
        ...kind === "link" ? { style: { opacity: 0.45 } } : {
          label: kind === "none" ? t("edge.none") : kind === "full" ? t("edge.full") : t("edge.injected"),
          ...kind === "none" ? { style: { opacity: 0.45 } } : {}
        }
      });
    }
    if (DRAW_LINEAGE_LINKS && !lineageHidden) {
      for (const [cardId, card] of Object.entries(visibleCards)) {
        if (foldedSet.has(cardId)) continue;
        const parentSessionId = sessions.byId[card.sessionId]?.parentId;
        if (parentSessionId === void 0) continue;
        const parentCardId = sessionIdToCardId.get(parentSessionId);
        if (parentCardId === void 0) continue;
        if (explicitPairs.has(parentCardId + "->" + cardId)) continue;
        if (explicitPairs.has(cardId + "->" + parentCardId)) continue;
        const parentSession = sessions.byId[visibleCards[parentCardId]?.sessionId ?? ""];
        const childSession = sessions.byId[card.sessionId];
        const lineagePush = lastPushOf(parentCardId, cardId);
        const lineageSync = lineagePush !== void 0 ? edgeSyncState({
          kind: "digest",
          lastPushAt: lineagePush,
          ...parentSession?.updatedAt !== void 0 ? { sourceUpdatedAt: parentSession.updatedAt } : {}
        }) : lineageSyncState({
          ...parentSession?.updatedAt !== void 0 ? { parentUpdatedAt: parentSession.updatedAt } : {},
          ...childSession?.updatedAt !== void 0 ? { childUpdatedAt: childSession.updatedAt } : {}
        });
        out.push({
          id: `lineage-${parentCardId}-${cardId}`,
          source: parentCardId,
          target: cardId,
          // Derived lines route like any other: faces are recomputed from the
          // cards' current positions, so a 12px neighbour gap becomes a real loop.
          ...computedHandles(parentCardId, cardId),
          type: TALK_MAP_EDGE_TYPE,
          // Selectable on purpose: right-clicking it must answer "what is this",
          // and offer to hide it. It used to be un-clickable mystery wiring.
          // 血缘线就按“一条还没同步的普通连线”渲染：同样的虚线、同样的箭头、
          // 同样的避障规则，没有单独样式，也不参与同步状态。
          data: {
            fromCardId: parentCardId,
            toCardId: cardId,
            sync: "idle",
            ready: boardTick > 0,
            obstacles: obstaclesFor(parentCardId, cardId),
            ...boxOf(parentCardId) !== void 0 ? { fromRect: boxOf(parentCardId) } : {},
            ...boxOf(cardId) !== void 0 ? { toRect: boxOf(cardId) } : {}
          },
          // No inline stroke: inline style beats everything the renderer draws.
          style: { opacity: 0.85 }
        });
      }
    }
    return out;
  }, [visibleCards, canvasState.edges, sessions, sessionIdToCardId, liveSelectedEdgeIds, foldedSet, locale, pushEpoch, lineageHidden, liveNodes, boardTick]);
  const drawerWireLinks = (0, import_react13.useMemo)(() => {
    if (drawer === null) return [];
    const layout = folderLayouts[drawer.groupId];
    const inFolder = new Set(layout === void 0 ? [] : [...layout.shown, ...layout.folded]);
    const painted = new Set(Object.keys(visibleCards).filter((cardId) => !foldedSet.has(cardId)));
    return liveEdges.filter((edge) => painted.has(edge.source) && painted.has(edge.target) && inFolder.has(edge.source) && inFolder.has(edge.target)).map((edge) => {
      const data = edge.data ?? {};
      const visible = !(data.sync === "synced" && data.structural !== true);
      return { from: edge.source, to: edge.target, visible };
    });
  }, [drawer, folderLayouts, liveEdges, visibleCards, foldedSet]);
  const activeDrawer = drawer !== null && frameRects[drawer.groupId] !== void 0 ? drawer : null;
  const nodes = isSelecting && frozenRef.current !== null ? frozenRef.current.nodes : liveNodes;
  const edges = isSelecting && frozenRef.current !== null ? frozenRef.current.edges : liveEdges;
  const onSelectionStart = () => {
    frozenRef.current = { nodes: liveNodes, edges: liveEdges };
    setIsSelecting(true);
  };
  const onSelectionEnd = () => {
    frozenRef.current = null;
    setIsSelecting(false);
  };
  const rejectFrameDrop = (nodeId, base) => {
    setNodes((current) => current.map((node) => node.id === nodeId ? { ...node, position: { x: base.x, y: base.y } } : node));
  };
  const onNodesChange = (changes) => {
    for (const change of changes) {
      if (change.type === "position" && change.position !== void 0) {
        if (change.id.startsWith("frame-")) {
          const groupId = change.id.slice("frame-".length);
          const base = frameRects[groupId] ?? wsFrames[groupId];
          if (base === void 0) continue;
          const rect = {
            x: change.position.x,
            y: change.position.y,
            width: base.width,
            height: base.height
          };
          if (change.dragging === false) {
            setLiveFrame(null);
            setBlockedFrame(null);
            const collides = Object.entries(frameRects).some(([otherId, otherRect]) => otherId !== groupId && rectsOverlap(rect, otherRect));
            if (collides) {
              rejectFrameDrop(change.id, base);
            } else {
              canvas.setWsFrameRect(groupId, rect);
              const stored = wsFrames[groupId] ?? base;
              const dx = rect.x - stored.x;
              const dy = rect.y - stored.y;
              if (boxes[groupId]?.free === true && (dx !== 0 || dy !== 0)) {
                const moved = {};
                for (const cardId of membersByGroup.get(groupId) ?? []) {
                  const member = visibleCards[cardId];
                  if (member !== void 0) moved[cardId] = { x: member.x + dx, y: member.y + dy };
                }
                canvas.moveCards(moved);
              }
            }
          } else if (change.dragging === true) {
            setLiveFrame({ groupId, rect });
            const blocked = Object.entries(frameRects).some(([otherId, otherRect]) => otherId !== groupId && rectsOverlap(rect, otherRect));
            setBlockedFrame(blocked ? groupId : null);
          }
        } else if (change.dragging === false) {
          setDraggingCardId(null);
          setDragCenter(null);
          const centre = { x: change.position.x + CARD_W / 2, y: change.position.y + CARD_H / 2 };
          const target = groupAtPoint(centre.x, centre.y);
          if (target !== void 0) {
            canvas.setCardBox(change.id, target);
            const droppedLayout = folderLayouts[target];
            const droppedRect = frameRects[target];
            if (droppedLayout?.free === true) {
              const x = snapEnabled ? snap(change.position.x) : change.position.x;
              const y = snapEnabled ? snap(change.position.y) : change.position.y;
              canvas.moveCard(change.id, x, y);
            } else if (droppedLayout !== void 0 && droppedRect !== void 0) {
              const cols = colsForWidth(droppedRect.width);
              const order = droppedLayout.ordered.includes(change.id) ? droppedLayout.ordered : (() => {
                const at = Math.min(Math.max(0, slotIndexAt(droppedRect, centre)), droppedLayout.ordered.length);
                return [...droppedLayout.ordered.slice(0, at), change.id, ...droppedLayout.ordered.slice(at)];
              })();
              order.forEach((cardId, index2) => {
                const point = slotPoint(droppedRect, index2, cols);
                canvas.moveCard(cardId, point.x, point.y);
              });
            }
          } else {
            if (visibleCards[change.id]?.boxId !== void 0) canvas.setCardBox(change.id, void 0);
            const x = snapEnabled ? snap(change.position.x) : change.position.x;
            const y = snapEnabled ? snap(change.position.y) : change.position.y;
            canvas.moveCard(change.id, x, y);
          }
        } else if (change.dragging === true) {
          setDraggingCardId(change.id);
          setDragCenter({ x: change.position.x + CARD_W / 2, y: change.position.y + CARD_H / 2 });
          canvas.moveCard(change.id, change.position.x, change.position.y);
        }
      } else if (change.type === "select") {
        setSelectedIds((previous) => {
          const next = new Set(previous);
          if (change.selected) next.add(change.id);
          else next.delete(change.id);
          return next;
        });
      } else if (change.type === "remove") {
        if (change.id.startsWith("frame-")) {
          deleteBox(change.id.slice("frame-".length));
        } else if (!change.id.startsWith("stack-")) {
          canvas.removeCard(change.id);
        }
        setSelectedIds((previous) => {
          const next = new Set(previous);
          next.delete(change.id);
          return next;
        });
      }
    }
  };
  const onEdgesChange = (changes) => {
    const removedIds = [];
    for (const change of changes) {
      if (change.type === "select") {
        setSelectedEdgeIds((previous) => {
          const next = new Set(previous);
          if (change.selected) next.add(change.id);
          else next.delete(change.id);
          return next;
        });
      } else if (change.type === "remove") {
        if (!change.id.startsWith("lineage-")) removedIds.push(change.id);
        setSelectedEdgeIds((previous) => {
          const next = new Set(previous);
          next.delete(change.id);
          return next;
        });
      }
    }
    if (removedIds.length > 0) canvas.removeEdges(removedIds);
  };
  const mountedRef = (0, import_react13.useRef)(true);
  (0, import_react13.useEffect)(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (toastTimer.current !== void 0) clearTimeout(toastTimer.current);
    };
  }, []);
  const showToast = (message) => {
    if (!mountedRef.current) return;
    setToast(message);
    if (toastTimer.current !== void 0) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 4e3);
  };
  const showToastRef = (0, import_react13.useRef)(showToast);
  showToastRef.current = showToast;
  (0, import_react13.useEffect)(() => {
    const onToast = (event) => {
      const detail = event.detail;
      if (typeof detail === "string") showToastRef.current(detail);
    };
    window.addEventListener("talk-pages:toast", onToast);
    return () => {
      window.removeEventListener("talk-pages:toast", onToast);
    };
  }, []);
  const createBoxAt = (flowX, flowY) => {
    const width = CARD_W * 2 + GAP_X + FRAME_PAD * 2;
    const created = canvas.createBox(activePage, {
      x: snap(flowX),
      y: snap(flowY),
      width,
      height: MIN_FRAME_HEIGHT
    }, t("box.defaultTitle"));
    if (created !== void 0) showToast(t("toast.boxCreated"));
  };
  const createBoxHere = () => {
    const wrapper = wrapperRef.current;
    if (wrapper === null) return;
    const bounds = wrapper.getBoundingClientRect();
    const centre = screenToFlowPosition({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2
    });
    const width = CARD_W * 2 + GAP_X + FRAME_PAD * 2;
    createBoxAt(centre.x - width / 2, centre.y - MIN_FRAME_HEIGHT / 2);
  };
  (0, import_react13.useEffect)(() => {
    canvasActions.setCreateBox(createBoxHere);
    return () => {
      canvasActions.setCreateBox(void 0);
    };
  });
  const createLinkEdge = (fromCardId, toCardId, handles) => {
    if (fromCardId === toCardId) return;
    const exists = Object.values(canvasState.edges).some((edge) => edge.fromCardId === fromCardId && edge.toCardId === toCardId || edge.fromCardId === toCardId && edge.toCardId === fromCardId);
    if (exists) return;
    const fromCard = canvasState.cards[fromCardId];
    const toCard = canvasState.cards[toCardId];
    if (fromCard === void 0 || toCard === void 0) return;
    const geometry = sideHandles(fromCardId, toCardId);
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle;
    canvas.addEdges({
      [`edge-${crypto.randomUUID()}`]: {
        boardId: INBOX_BOARD_ID,
        fromCardId,
        toCardId,
        injection: { kind: "link" },
        fromHandle: handles?.fromHandle ?? geometry.fromHandle,
        toHandle: handles?.toHandle ?? geometry.toHandle,
        ...fromTitle !== void 0 ? { fromTitle } : {},
        createdAt: Date.now()
      }
    });
  };
  const onConnect = (connection) => {
    if (connectCancelledRef.current) return;
    createLinkEdge(connection.source, connection.target, {
      fromHandle: connection.sourceHandle,
      toHandle: connection.targetHandle
    });
  };
  const materialiseEdge = (fromCardId, toCardId) => {
    const fromCard = canvasState.cards[fromCardId];
    const toCard = canvasState.cards[toCardId];
    if (fromCard === void 0 || toCard === void 0) return void 0;
    const geometry = sideHandles(fromCard, toCard);
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle;
    const edgeId = `edge-${crypto.randomUUID()}`;
    canvas.addEdges({
      [edgeId]: {
        boardId: INBOX_BOARD_ID,
        fromCardId,
        toCardId,
        injection: { kind: "digest" },
        fromHandle: geometry.fromHandle,
        toHandle: geometry.toHandle,
        ...fromTitle !== void 0 ? { fromTitle } : {},
        createdAt: Date.now()
      }
    });
    return edgeId;
  };
  const pushAlongEdge = async (fromCardId, toCardId) => {
    const fromCard = canvasState.cards[fromCardId];
    const toCard = canvasState.cards[toCardId];
    if (fromCard === void 0 || toCard === void 0) return;
    const fromTitle = sessions.byId[fromCard.sessionId]?.displayTitle ?? fromCard.sessionId;
    const toTitle = sessions.byId[toCard.sessionId]?.displayTitle ?? toCard.sessionId;
    try {
      const fresh = await talkMapApi.ensureDigest(fromCard.sessionId);
      const digest = fresh.digest ?? canvasState.digests[fromCard.sessionId];
      if (digest === void 0 || digestIsEmpty(digest)) {
        showToast(t("digest.empty"));
        return;
      }
      await talkMapApi.injectContext(toCard.sessionId, [
        { sessionId: fromCard.sessionId, text: buildPushText(fromTitle, digest) }
      ]);
      const pushedAt = stampPush(fromCardId, toCardId);
      setPushEpoch((previous) => previous + 1);
      for (const [id2, edge] of Object.entries(canvasState.edges)) {
        const same = edge.fromCardId === fromCardId && edge.toCardId === toCardId || edge.fromCardId === toCardId && edge.toCardId === fromCardId;
        if (!same) continue;
        canvas.addEdges({ [id2]: { ...edge, lastPushAt: pushedAt } });
      }
      showToast(t("toast.pushed", { to: toTitle }));
    } catch (error) {
      const code = error.code;
      showToast(code === "session-not-live" ? t("toast.notLive") : `${t("toast.pushFailed")}${String(error)}`);
    }
  };
  const onConnectEnd = (event, connectionState) => {
    setConnecting(false);
    if (connectCancelledRef.current) {
      connectCancelledRef.current = false;
      return;
    }
    if (connectionState.isValid === true) return;
    const fromNodeId = connectionState.fromNode?.id;
    if (fromNodeId === void 0) return;
    const card = canvasState.cards[fromNodeId];
    if (card === void 0) return;
    const client = "clientX" in event ? { x: event.clientX, y: event.clientY } : event.changedTouches[0] !== void 0 ? { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY } : void 0;
    if (client === void 0) return;
    const position = screenToFlowPosition(client);
    const hitNode = document.elementsFromPoint(client.x, client.y).map((el) => el.closest('.react-flow__node[data-id^="card-"]')).find((el) => el !== null);
    const hitId = hitNode?.getAttribute("data-id") ?? void 0;
    if (hitId !== void 0 && visibleCards[hitId] !== void 0) {
      if (hitId !== fromNodeId) createLinkEdge(fromNodeId, hitId);
      return;
    }
    const summary = sessions.byId[card.sessionId];
    if (summary === void 0) return;
    const parentWorkspaceId = sessionWs.get(card.sessionId);
    setPendingSpawn({
      parent: { cardId: fromNodeId, sessionId: card.sessionId, title: summary.displayTitle },
      ...parentWorkspaceId !== void 0 ? { parentWorkspaceId } : {},
      ...card.boxId !== void 0 ? { parentBoxId: card.boxId } : {},
      x: snap(position.x - CARD_W / 2),
      y: snap(position.y - CARD_H / 2)
    });
  };
  const openSession = (sessionId) => {
    sessionActivity.acknowledge(sessionId);
    if (openSessionInUi(sessionId)) closeMapPanel();
  };
  const openSearchHit = (sessionId) => {
    openSession(sessionId);
  };
  const searchInWorkspace = async (groupId, query) => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return [];
    return drawerItems(groupId).filter((item) => item.title.toLowerCase().includes(needle) || (item.preview ?? "").toLowerCase().includes(needle)).map((item) => {
      const titleHit = item.title.toLowerCase().includes(needle);
      return {
        sessionId: item.sessionId,
        title: item.title,
        // A title hit already shows its title: no second, identical line.
        blocks: titleHit || (item.preview ?? "") === "" ? [] : [[item.preview ?? ""]],
        seqs: [null],
        roles: [null],
        byTitle: titleHit
      };
    });
  };
  const toHitView = (hit) => ({
    sessionId: hit.sessionId,
    title: renamedTitles[hit.sessionId] ?? sessions.byId[hit.sessionId]?.displayTitle ?? hit.sessionId,
    blocks: hit.blocks,
    seqs: hit.seqs,
    roles: hit.roles,
    agent: hit.agent,
    depth: hit.depth
  });
  (0, import_react13.useEffect)(() => {
    setTitleResolver((sessionId) => renamedTitles[sessionId] ?? sessions.byId[sessionId]?.displayTitle);
    setCardTable(Object.entries(canvasState.cards).map(([cardId, card]) => ({
      cardId,
      sessionId: card.sessionId,
      title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId,
      preview: previews[card.sessionId] ?? "",
      workspaceTitle: wsTitles.get(sessionWs.get(card.sessionId) ?? "") ?? ""
    })));
    setTitleTable(Object.entries(sessions.byId).map(([sessionId, row]) => ({
      sessionId,
      title: renamedTitles[sessionId] ?? row.displayTitle ?? ""
    })).filter((entry) => entry.title !== ""));
    return () => {
      setTitleResolver(void 0);
    };
  }, [renamedTitles, sessions]);
  const folderLinks = (groupId, cardId) => {
    const out = [];
    for (const edge of Object.values(canvasState.edges)) {
      const other = edge.fromCardId === cardId ? edge.toCardId : edge.toCardId === cardId ? edge.fromCardId : void 0;
      if (other === void 0) continue;
      const otherSessionId = visibleCards[other]?.sessionId;
      if (otherSessionId === void 0) continue;
      if (visibleCards[other]?.boxId !== groupId) continue;
      out.push({
        toCardId: other,
        title: renamedTitles[otherSessionId] ?? sessions.byId[otherSessionId]?.displayTitle ?? otherSessionId,
        kind: edge.injection?.kind ?? "link",
        outgoing: edge.fromCardId === cardId
      });
    }
    return out;
  };
  const drawerItems = (groupId) => {
    const layout = folderLayouts[groupId];
    const ids = layout === void 0 ? [] : [...layout.shown, ...layout.folded];
    const items = [];
    for (const cardId of ids) {
      const card = visibleCards[cardId];
      if (card === void 0) continue;
      const summary = sessions.byId[card.sessionId];
      const digest = canvasState.digests[card.sessionId];
      const glow = glowOf(card.sessionId);
      items.push({
        cardId,
        sessionId: card.sessionId,
        title: renamedTitles[card.sessionId] ?? summary?.displayTitle ?? card.sessionId,
        ...previews[card.sessionId] !== void 0 ? { preview: previews[card.sessionId] } : {},
        ...summary?.updatedAt !== void 0 ? { updatedAt: summary.updatedAt } : {},
        running: statusById.get(card.sessionId)?.running ?? summary?.running ?? false,
        ...glow !== void 0 ? { glow } : {},
        ...draftSessions.has(card.sessionId) ? { pendingDraft: true } : {},
        ...interruptedById.has(card.sessionId) ? { interrupted: true } : {},
        // The drawer mirrors the canvas selection (single pick or batch tick),
        // and marks the conversation the map was opened from.
        selected: batchMode ? batchPicks.has(cardId) : liveSelectedIds.has(cardId),
        current: currentSessionId() === card.sessionId,
        // The grid draws these as lines; inside the drawer they have to be
        // spelled out, otherwise a pushed digest looks like it came from nowhere.
        links: folderLinks(groupId, cardId)
      });
    }
    return items;
  };
  const runActions = async (kind, cardIds) => {
    if (cardIds.length === 0) return;
    const sessionIds = cardIds.map((cardId) => visibleCards[cardId]?.sessionId).filter((sessionId) => sessionId !== void 0);
    if (sessionIds.length === 0) return;
    setBatchBusy(true);
    try {
      if (kind === "archive") await archiveSessions(sessionIds);
      else await trashSessions(sessionIds, () => {
        showToast(t("toast.stopping"));
      });
      for (const cardId of cardIds) canvas.removeCard(cardId);
      showToast(t(kind === "archive" ? "toast.archived" : "toast.deleted", { n: String(sessionIds.length) }));
    } catch (error) {
      showToast(`${t(kind === "archive" ? "toast.archiveFailed" : "toast.deleteFailed")}${String(error)}`);
    } finally {
      setBatchBusy(false);
    }
  };
  const reorderInDrawer = (groupId, cardId, index2) => {
    const layout = folderLayouts[groupId];
    const rect = frameRects[groupId] ?? wsFrames[groupId];
    if (layout === void 0 || rect === void 0) return;
    const ids = [...layout.ordered];
    const from = ids.indexOf(cardId);
    if (from < 0) return;
    ids.splice(from, 1);
    const at = Math.min(Math.max(0, index2), ids.length);
    ids.splice(at, 0, cardId);
    const cols = colsForWidth(rect.width);
    ids.forEach((id2, position) => {
      const point = slotPoint(rect, position, cols);
      canvas.moveCard(id2, point.x, point.y);
    });
  };
  const selectedCardIds = (0, import_react13.useMemo)(
    () => [...batchPicks].filter((id2) => visibleCards[id2] !== void 0),
    [batchPicks, visibleCards]
  );
  const toggleBatchPick = (cardId) => {
    setBatchPicks((previous) => {
      const next = new Set(previous);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };
  const runBatch = async (kind) => {
    if (batchBusy || !batchMode) return;
    const cardIds = selectedCardIds;
    if (cardIds.length === 0) return;
    setBatchMode(false);
    setBatchPicks(/* @__PURE__ */ new Set());
    await runActions(kind, cardIds);
  };
  const groupAtPoint = (x, y) => {
    let best;
    for (const [groupId, rect] of Object.entries(frameRects)) {
      if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) continue;
      const area = rect.width * rect.height;
      if (best === void 0 || area < best.area) best = { groupId, area };
    }
    return best?.groupId;
  };
  const startSessionIn = (workspaceId) => {
    const ui = uiWorkspaceService();
    if (ui === void 0 || typeof ui.startSession !== "function") {
      showToast(t("toast.needUiWorkspace"));
      return;
    }
    closeMapPanel();
    ui.startSession(workspaceId);
  };
  const workspaceAt = (flowX, flowY) => {
    const boxId = groupAtPoint(flowX, flowY);
    const pageId = boxId === void 0 ? activePage : boxes[boxId]?.pageId ?? activePage;
    return wsTitles.has(pageId) ? pageId : void 0;
  };
  const importSession = (sessionId, atX, atY) => {
    canvas.addCards({
      [newCardId()]: {
        boardId: INBOX_BOARD_ID,
        sessionId,
        x: snapEnabled ? snap(atX) : atX,
        y: snapEnabled ? snap(atY) : atY,
        createdAt: Date.now()
      }
    });
    const pageId = sessionWs.get(sessionId) ?? UNSORTED_PAGE_ID;
    if (pageId !== activePage) {
      canvas.setActivePage(pageId);
      showToast(t("toast.importedOnPage", { page: wsTitles.get(pageId) ?? t("page.unsorted") }));
    }
  };
  const deleteBox = (boxId) => {
    const title = boxes[boxId]?.title ?? wsTitles.get(boxId) ?? t("frame.unknown");
    canvas.deleteBox(boxId);
    showToast(t("toast.boxDeleted", { title }));
  };
  const openMenu = (event, kind, targetId, edgeEnds) => {
    event.preventDefault();
    const wrapper = wrapperRef.current;
    if (wrapper === null) return;
    const bounds = wrapper.getBoundingClientRect();
    const flow = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setMenu({
      left: event.clientX - bounds.left,
      top: event.clientY - bounds.top,
      flowX: flow.x,
      flowY: flow.y,
      kind,
      ...targetId !== void 0 ? { targetId } : {},
      ...edgeEnds !== void 0 ? { edgeFrom: edgeEnds.from, edgeTo: edgeEnds.to } : {},
      view: "root"
    });
  };
  const menuState = (0, import_react13.useMemo)(() => {
    if (menu === null) return null;
    const close = () => {
      setMenu(null);
    };
    const items = [];
    let title;
    if (menu.view === "box-color" && menu.targetId !== void 0) {
      const boxId = menu.targetId;
      const current = (canvasState.global?.wsColors ?? {})[boxId];
      title = t("menu.color");
      items.push({
        key: "__none__",
        label: t("color.clear"),
        ...current === void 0 ? { hint: t("menu.colorCurrent") } : {},
        onPick: () => {
          close();
          canvas.setWorkspaceColor(boxId, void 0);
        }
      });
      for (const tag of COLOR_TAGS) {
        items.push({
          key: tag.id,
          label: t(`color.${tag.id}`),
          ...current === tag.id ? { hint: t("menu.colorCurrent") } : {},
          onPick: () => {
            close();
            canvas.setWorkspaceColor(boxId, tag.id);
          }
        });
      }
      return { left: menu.left, top: menu.top, ...title !== void 0 ? { title } : {}, items };
    }
    if (menu.view === "new-ws") {
      const parentDir = (() => {
        const sample = workspaces.items[0]?.path;
        if (sample === void 0) return "";
        const cut = sample.lastIndexOf("/");
        return cut > 0 ? sample.slice(0, cut) : sample;
      })();
      return {
        left: menu.left,
        top: menu.top,
        title: t("menu.newWs"),
        prompt: {
          placeholder: t("draft.wsNamePlaceholder"),
          submitLabel: t("menu.createAndImport"),
          preview: (value2) => `${parentDir}/${value2}`,
          onSubmit: async (value2) => {
            const services2 = getServices();
            if (services2 === void 0 || parentDir === "") throw new Error("no workspace root available");
            const path = `${parentDir}/${value2}`;
            await talkMapApi.ensureDir(path);
            const created = await callRpc("workspace/create", { path });
            canvas.setActivePage(created.workspace.workspaceId);
            close();
          }
        },
        items: []
      };
    }
    if (menu.view === "import-ws") {
      title = t("menu.pages");
      items.push({
        key: "__new__",
        label: t("menu.newWs"),
        onPick: () => {
          setMenu({ ...menu, view: "new-ws" });
        }
      });
      for (const page of pages) {
        items.push({
          key: page.id,
          label: page.title,
          ...page.id === activePage ? { hint: t("menu.currentPage") } : {},
          onPick: () => {
            canvas.setActivePage(page.id);
            close();
          }
        });
      }
    } else if (menu.view === "toggle-session") {
      title = t("menu.toggleSessions");
      const archivedIds = new Set(workspaces.archivedSessionIds ?? []);
      const candidates = placeableSessionIds(sessions).filter((id2) => (sessionWs.get(id2) ?? UNSORTED_PAGE_ID) === activePage).sort((a, b) => (sessions.byId[b]?.updatedAt ?? 0) - (sessions.byId[a]?.updatedAt ?? 0)).slice(0, 300);
      candidates.forEach((sessionId, index2) => {
        const onMap = boardSessionIds.has(sessionId);
        const archivedTag = archivedIds.has(sessionId) ? t("picker.archivedTag") : "";
        items.push({
          key: sessionId,
          label: `${onMap ? "✓ " : "　"}${sessions.byId[sessionId]?.displayTitle ?? sessionId}`,
          ...archivedTag !== "" ? { hint: archivedTag } : {},
          onPick: () => {
            const existing = canvas.cardIdForSession(sessionId);
            if (existing !== void 0) {
              canvas.removeCard(existing);
              return;
            }
            importSession(sessionId, menu.flowX + index2 % 5 * 40, menu.flowY + index2 % 5 * 40);
          }
        });
      });
    } else if (menu.view === "import-session") {
      title = t("menu.importSession");
      const candidates = placeableSessionIds(sessions).filter((id2) => !boardSessionIds.has(id2)).slice(0, 200);
      for (const sessionId of candidates) {
        items.push({
          key: sessionId,
          label: sessions.byId[sessionId]?.displayTitle ?? sessionId,
          onPick: () => {
            importSession(sessionId, menu.flowX, menu.flowY);
            close();
          }
        });
      }
    } else if (menu.kind === "pane") {
      const under = workspaceAt(menu.flowX, menu.flowY);
      const underTitle = under === void 0 ? void 0 : wsTitles.get(under);
      items.push({
        key: "draft",
        // Say which workspace it will land in: the menu is opened at a point,
        // and that point is what decides the workspace.
        label: underTitle === void 0 ? t("menu.newChat") : t("menu.newChatIn", { ws: underTitle }),
        onPick: () => {
          startSessionIn(under);
          close();
        }
      });
      items.push({
        key: "new-box",
        icon: "group",
        label: t("menu.newBox"),
        onPick: () => {
          createBoxAt(menu.flowX, menu.flowY);
          close();
        }
      });
      items.push({
        key: "import-ws",
        label: `${t("menu.pages")}…`,
        onPick: () => {
          setMenu({ ...menu, view: "import-ws" });
        }
      });
      items.push({
        key: "toggle-session",
        label: `${t("menu.toggleSessions")}…`,
        onPick: () => {
          setMenu({ ...menu, view: "toggle-session" });
        }
      });
    } else if (menu.kind === "card" && menu.targetId !== void 0) {
      const cardId = menu.targetId;
      const card = canvasState.cards[cardId];
      const current = card?.priority;
      for (const level of [1, 2, 3]) {
        items.push({
          key: `priority-${level}`,
          icon: "pin",
          label: t(`menu.priority${level}`),
          ...current === level ? { hint: "✓" } : {},
          onPick: () => {
            close();
            canvas.setCardPriority(cardId, current === level ? void 0 : level);
          }
        });
      }
      if (current !== void 0) {
        items.push({
          key: "priority-clear",
          icon: "unpin",
          label: t("menu.priorityClear"),
          onPick: () => {
            close();
            canvas.setCardPriority(cardId, void 0);
          }
        });
      }
      items.push({
        key: "unread",
        icon: "unread",
        label: t("menu.markUnread"),
        onPick: () => {
          close();
          if (card !== void 0) sessionActivity.markFinished(card.sessionId);
        }
      });
      items.push({
        key: "rename",
        icon: "rename",
        label: t("menu.rename"),
        onPick: () => {
          close();
          if (card !== void 0) {
            setRenameTarget({
              kind: "session",
              id: card.sessionId,
              title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId
            });
          }
        }
      });
      items.push({
        key: "view-digest",
        icon: "digest",
        label: t("menu.viewDigest"),
        ...card === void 0 || digestIsEmpty(canvasState.digests[card.sessionId]) ? { hint: t("digest.empty"), disabled: true } : {},
        onPick: () => {
          close();
          if (card === void 0) return;
          setDigestTarget({
            title: renamedTitles[card.sessionId] ?? sessions.byId[card.sessionId]?.displayTitle ?? card.sessionId,
            digest: canvasState.digests[card.sessionId]
          });
        }
      });
      items.push({
        key: "archive",
        icon: "archive",
        label: t("menu.archive"),
        onPick: () => {
          close();
          void runActions("archive", [cardId]);
        }
      });
      items.push({
        key: "delete-session",
        icon: "delete",
        danger: true,
        label: t("menu.deleteSession"),
        onPick: () => {
          close();
          void runActions("delete", [cardId]);
        }
      });
      items.push({
        key: "batch",
        icon: "batch",
        label: t("menu.batch"),
        onPick: () => {
          close();
          setBatchMode(true);
          setBatchPicks(/* @__PURE__ */ new Set([cardId]));
        }
      });
    } else if (menu.kind === "edge" && menu.targetId !== void 0 && menu.edgeFrom !== void 0 && menu.edgeTo !== void 0) {
      const edgeId = menu.targetId;
      const edgeFrom = menu.edgeFrom;
      const edgeTo = menu.edgeTo;
      const stored = canvasState.edges[edgeId];
      const fromCard = canvasState.cards[edgeFrom];
      const toCard = canvasState.cards[edgeTo];
      const fromTitle = fromCard !== void 0 ? sessions.byId[fromCard.sessionId]?.displayTitle ?? fromCard.sessionId : "?";
      const toTitle = toCard !== void 0 ? sessions.byId[toCard.sessionId]?.displayTitle ?? toCard.sessionId : "?";
      title = `${fromTitle} → ${toTitle}`;
      const digest = fromCard !== void 0 ? canvasState.digests[fromCard.sessionId] : void 0;
      const noDigest = digest === void 0 || digestIsEmpty(digest);
      const lineage = stored === void 0;
      items.push({
        key: "push",
        label: t("edge.push"),
        ...noDigest ? { hint: t("edge.pushNoDigest"), disabled: true } : {},
        onPick: () => {
          close();
          void pushAlongEdge(edgeFrom, edgeTo);
        }
      });
      const auto = stored?.injection.autoPush === true;
      items.push({
        key: "auto-push",
        label: auto ? t("edge.autoPushOff") : t("edge.autoPushOn"),
        ...auto ? {} : { hint: t("edge.autoPushHint") },
        onPick: () => {
          close();
          if (stored !== void 0) {
            canvas.addEdges({
              [edgeId]: {
                ...stored,
                injection: { ...stored.injection, autoPush: !auto }
              }
            });
            return;
          }
          materialiseEdge(edgeFrom, edgeTo);
        }
      });
      items.push({
        key: "delete-edge",
        label: t("edge.delete"),
        onPick: () => {
          close();
          if (stored !== void 0) {
            canvas.removeEdges([edgeId]);
            return;
          }
          cutLineage(edgeFrom, edgeTo);
        }
      });
    } else if (menu.kind === "frame" && menu.targetId !== void 0) {
      const boxId = menu.targetId;
      const box = boxes[boxId];
      const boxTitle = box?.title ?? wsTitles.get(boxId) ?? t("frame.unknown");
      title = boxTitle;
      const pageId = box?.pageId ?? activePage;
      const pageWorkspace = wsTitles.has(pageId) ? pageId : void 0;
      items.push({
        key: "new-chat",
        icon: "open",
        label: t("menu.newChat"),
        onPick: () => {
          startSessionIn(pageWorkspace);
          close();
        }
      });
      items.push({
        key: "rename-box",
        icon: "rename",
        label: t("menu.renameBox"),
        onPick: () => {
          close();
          setRenameTarget({ kind: "box", id: boxId, title: boxTitle });
        }
      });
      items.push({
        key: "box-layout",
        label: box?.free === true ? t("menu.boxGrid") : t("menu.boxFree"),
        onPick: () => {
          close();
          canvas.setBoxFree(boxId, box?.free !== true);
        }
      });
      items.push({
        key: "box-color",
        label: `${t("menu.color")}…`,
        onPick: () => {
          setMenu({ ...menu, view: "box-color" });
        }
      });
      items.push({
        key: "delete-box",
        icon: "delete",
        label: t("menu.deleteBox"),
        danger: true,
        onPick: () => {
          close();
          deleteBox(boxId);
        }
      });
    }
    const searchable = menu.view === "import-ws" || menu.view === "import-session" || menu.view === "toggle-session";
    return {
      left: menu.left,
      top: menu.top,
      ...title !== void 0 ? { title } : {},
      ...searchable ? { searchable } : {},
      items
    };
  }, [menu, workspaces.items, sessions, boardSessionIds, boxes, pages, activePage, wsTitles, canvasState.cards, canvasState.edges, canvasState.digests, workspaces.archivedSessionIds, locale]);
  const savedCamera = canvas.savedCamera(pageCameraKey(activePage));
  const hasContent = Object.keys(visibleCards).length > 0 || Object.keys(frameRects).length > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
    "div",
    {
      ref: wrapperRef,
      className: `${talk_pages_default["canvas"]}${connecting ? ` ${talk_pages_default["canvasConnecting"]}` : ""}`,
      onDoubleClick: (event) => {
        const target = event.target;
        const labelPress = lastLabelPress.current;
        if (labelPress !== null && Date.now() - labelPress.at < 600 && boxes[labelPress.boxId] !== void 0) {
          lastLabelPress.current = null;
          setRenameTarget({ kind: "box", id: labelPress.boxId, title: boxes[labelPress.boxId].title });
          return;
        }
        const nodeElement = target.closest(".react-flow__node");
        if (nodeElement !== null) {
          const nodeId = nodeElement.getAttribute("data-id") ?? "";
          if (nodeId.startsWith("frame-")) {
            const boxId = nodeId.slice("frame-".length);
            const pageId = boxes[boxId]?.pageId ?? activePage;
            startSessionIn(wsTitles.has(pageId) ? pageId : void 0);
          }
          return;
        }
        if (target.closest(".react-flow__pane") === null) return;
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        startSessionIn(workspaceAt(position.x, position.y));
      },
      onContextMenu: (event) => {
        event.preventDefault();
      },
      onClick: () => {
        if (menu !== null) setMenu(null);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
          index,
          {
            nodes,
            edges,
            nodeTypes,
            edgeTypes,
            onNodesChange,
            onEdgesChange,
            onConnect,
            onConnectStart: () => {
              connectCancelledRef.current = false;
              setConnecting(true);
            },
            onConnectEnd,
            connectionMode: ConnectionMode.Loose,
            onSelectionStart,
            onSelectionEnd,
            onNodeClick: (event, node) => {
              if (batchMode) return;
              if (node.type === "sessionCard") {
                const data = node.data;
                if (!data.ghost) openSession(data.sessionId);
                return;
              }
              if (node.type !== "wsFrame") return;
              const frameId = node.id;
              setSelectedIds((previous) => {
                if (event.shiftKey) {
                  const next = new Set(previous);
                  if (next.has(frameId)) next.delete(frameId);
                  else next.add(frameId);
                  return next;
                }
                return /* @__PURE__ */ new Set([frameId]);
              });
            },
            onPaneContextMenu: (event) => {
              openMenu(event, "pane");
            },
            onNodeContextMenu: (event, node) => {
              if (node.type === "sessionCard") openMenu(event, "card", node.id);
              else if (node.type === "wsFrame") openMenu(event, "frame", node.id.slice("frame-".length));
              else event.preventDefault();
            },
            onEdgeContextMenu: (event, edge) => {
              const data = edge.data;
              if (data?.fromCardId !== void 0 && data.toCardId !== void 0) {
                openMenu(event, "edge", edge.id, { from: data.fromCardId, to: data.toCardId });
              } else {
                event.preventDefault();
              }
            },
            onMoveEnd: (_event, viewport) => {
              canvas.setCamera(pageCameraKey(activePage), viewport);
            },
            colorMode: dark ? "dark" : "light",
            snapToGrid: snapEnabled,
            snapGrid: [GRID, GRID],
            zoomOnDoubleClick: false,
            panOnDrag: true,
            selectionOnDrag: false,
            selectionMode: SelectionMode.Partial,
            deleteKeyCode: ["Backspace", "Delete"],
            minZoom: 0.1,
            proOptions: { hideAttribution: true },
            ...savedCamera !== void 0 ? { defaultViewport: savedCamera } : { fitView: hasContent },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Background, { variant: BackgroundVariant.Dots, gap: GRID, size: 1 }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(Controls, { showInteractive: false, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ControlButton, { title: t("map.zoom100"), onClick: () => {
                void zoomTo(1, { duration: 200 });
              }, children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: talk_pages_default["zoomResetLabel"], children: "1:1" }) }) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(PriorityRail, { entries: priorityEntries, cardWidth: CARD_W, onFocus: focusCard }),
        batchMode ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          BatchBar,
          {
            count: selectedCardIds.length,
            busy: batchBusy,
            onArchive: () => {
              void runBatch("archive");
            },
            onDelete: () => {
              void runBatch("delete");
            },
            onCancel: () => {
              setBatchMode(false);
              setBatchPicks(/* @__PURE__ */ new Set());
            }
          }
        ) : null,
        hasContent ? null : /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: talk_pages_default["emptyHint"], children: t("map.empty") }),
        menuState !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ContextMenu, { menu: menuState, onClose: () => {
          setMenu(null);
        } }, menu?.view ?? "root") : null,
        pendingSpawn !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(SpawnPreview, { pending: pendingSpawn, onClose: () => {
          setPendingSpawn(null);
        } }) : null,
        digestTarget !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          DigestDialog,
          {
            title: digestTarget.title,
            digest: digestTarget.digest,
            onClose: () => {
              setDigestTarget(null);
            }
          }
        ) : null,
        renameTarget !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          RenameDialog,
          {
            target: renameTarget,
            onDone: (title) => {
              const target = renameTarget;
              setRenameTarget(null);
              if (title === null) return;
              if (target.kind === "box") {
                canvas.renameBox(target.id, title);
              } else {
                setRenamedTitles((previous) => ({ ...previous, [target.id]: title }));
              }
              showToast(t("toast.renamed"));
            }
          }
        ) : null,
        activeDrawer !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          StackDrawer,
          {
            workspaceTitle: boxes[activeDrawer.groupId]?.title ?? wsTitles.get(activeDrawer.groupId) ?? t("frame.unknown"),
            items: drawerItems(activeDrawer.groupId),
            links: drawerWireLinks,
            onOpenCard: (cardId) => {
              const card = visibleCards[cardId];
              if (card !== void 0) openSession(card.sessionId);
            },
            onCardMenu: (cardId, event) => {
              openMenu(event, "card", cardId);
            },
            onSearchContent: async (query) => searchInWorkspace(activeDrawer.groupId, query),
            onOpenSession: (sessionId) => {
              openSearchHit(sessionId);
            },
            onReorder: (cardId, index2) => {
              reorderInDrawer(activeDrawer.groupId, cardId, index2);
            },
            onFetchContext: (sessionId, seq, query) => fetchSearchContext(sessionId, seq, query),
            onFetchSessionHits: (sessionId, query) => fetchSessionHits(sessionId, query),
            onClose: closeDrawer
          }
        ) : null,
        toast !== null ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: talk_pages_default["toast"], children: toast }) : null
      ]
    }
  );
}
function BatchBar(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: talk_pages_default["batchBar"], role: "toolbar", "aria-label": t("batch.title"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: talk_pages_default["batchCount"], children: t("batch.count", { n: String(props.count) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: talk_pages_default["batchSpace"] }),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "button",
      {
        type: "button",
        className: talk_pages_default["batchAction"],
        disabled: props.busy || props.count === 0,
        onClick: props.onArchive,
        children: t("batch.archive")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "button",
      {
        type: "button",
        className: `${talk_pages_default["batchAction"]} ${talk_pages_default["batchDanger"]}`,
        disabled: props.busy || props.count === 0,
        onClick: props.onDelete,
        children: t("batch.delete")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "button",
      {
        type: "button",
        className: talk_pages_default["batchAction"],
        disabled: props.busy,
        onClick: props.onCancel,
        children: t("batch.cancel")
      }
    )
  ] });
}
var DRAW_LINEAGE_LINKS = true;
function MapCanvas(props) {
  const canvasState = (0, import_react13.useSyncExternalStore)(canvas.subscribe, canvas.get);
  (0, import_react13.useEffect)(() => {
    canvas.ensureLoaded();
    canvas.refresh();
    return canvas.connect();
  }, []);
  if (canvasState.phase === "error") {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: talk_pages_default["canvas"], children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: talk_pages_default["emptyHint"], children: [
      t("map.loadError"),
      " ",
      canvasState.error,
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        "button",
        {
          type: "button",
          className: talk_pages_default["cardRemove"],
          style: { marginLeft: 8 },
          onClick: () => {
            canvas.reload();
          },
          children: t("map.retry")
        }
      )
    ] }) });
  }
  if (canvasState.phase !== "ready") {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: talk_pages_default["canvas"], children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: talk_pages_default["emptyHint"], children: t("map.loading") }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(CanvasInner, { ...props }) });
}

// src/client/PageTabs.tsx
var import_react16 = require("react");

// src/client/ConversationPicker.tsx
var import_react15 = require("react");
var import_jsx_runtime17 = require("react/jsx-runtime");
var ROW_COLS = 4;
function ConversationPicker(props) {
  const canvasState = canvas.get();
  const workspaces = props.useWorkspaces((state3) => state3);
  const sessions = props.useSessions((state3) => state3);
  const sessionPage = (0, import_react15.useMemo)(() => sessionPageIndex(workspaces.items), [workspaces.items]);
  const archived = (0, import_react15.useMemo)(() => new Set(workspaces.archivedSessionIds ?? []), [workspaces.archivedSessionIds]);
  const pageTitle = (0, import_react15.useMemo)(
    () => new Map(workspaces.items.map((item) => [item.workspaceId, item.title])),
    [workspaces.items]
  );
  const onMap = (0, import_react15.useMemo)(() => {
    const out = /* @__PURE__ */ new Map();
    for (const [cardId, card] of Object.entries(canvasState.cards)) out.set(card.sessionId, cardId);
    return out;
  }, [canvasState.cards]);
  const rows = (0, import_react15.useMemo)(() => sessions.ids.map((id2) => ({ id: id2, summary: sessions.byId[id2] })).filter((entry) => entry.summary !== void 0 && !entry.summary.blank && entry.summary.origin !== "subagent").map(({ id: id2, summary }) => ({
    id: id2,
    title: summary.displayTitle,
    pageId: sessionPage.get(id2) ?? UNSORTED_PAGE_ID,
    archived: archived.has(id2),
    updatedAt: summary.updatedAt
  })).sort((a, b) => b.updatedAt - a.updatedAt), [sessions, sessionPage, archived]);
  const [picked, setPicked] = (0, import_react15.useState)(() => new Set(onMap.keys()));
  const [query, setQuery] = (0, import_react15.useState)("");
  const [filter2, setFilter] = (0, import_react15.useState)("all");
  const autoAdd = canvasState.global?.autoAdd === true;
  (0, import_react15.useEffect)(() => {
    const release = mapUi.claimEscape("conversation-picker");
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      props.onClose();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      release();
    };
  }, []);
  const shown = (0, import_react15.useMemo)(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (needle !== "" && !row.title.toLowerCase().includes(needle)) return false;
      if (filter2 === "on") return onMap.has(row.id);
      if (filter2 === "off") return !onMap.has(row.id);
      if (filter2 === "archived") return row.archived;
      return true;
    });
  }, [rows, query, filter2, onMap]);
  const groups = (0, import_react15.useMemo)(() => {
    const order = new Map(workspaces.items.map((item, index2) => [item.workspaceId, index2]));
    const byPage = /* @__PURE__ */ new Map();
    for (const row of shown) byPage.set(row.pageId, [...byPage.get(row.pageId) ?? [], row]);
    return [...byPage.entries()].sort((a, b) => (order.get(a[0]) ?? 1e9) - (order.get(b[0]) ?? 1e9));
  }, [shown, workspaces.items]);
  const toggle = (id2) => {
    setPicked((previous) => {
      const next = new Set(previous);
      if (next.has(id2)) next.delete(id2);
      else next.add(id2);
      return next;
    });
  };
  const setShown = (on) => {
    setPicked((previous) => {
      const next = new Set(previous);
      for (const row of shown) {
        if (on) next.add(row.id);
        else next.delete(row.id);
      }
      return next;
    });
  };
  const apply2 = () => {
    const state3 = canvas.get();
    const boxes = state3.global?.boxes;
    let removed = 0;
    for (const [sessionId, cardId] of onMap) {
      if (picked.has(sessionId)) continue;
      canvas.removeCard(cardId);
      removed += 1;
    }
    const bottomByPage = /* @__PURE__ */ new Map();
    for (const card of Object.values(state3.cards)) {
      const pageId = pageOfCard(card, boxes, sessionPage);
      bottomByPage.set(pageId, Math.max(bottomByPage.get(pageId) ?? 0, card.y + CARD_H));
    }
    const countByPage = /* @__PURE__ */ new Map();
    const added = {};
    for (const row of rows) {
      if (!picked.has(row.id) || onMap.has(row.id)) continue;
      const index2 = countByPage.get(row.pageId) ?? 0;
      countByPage.set(row.pageId, index2 + 1);
      const baseY = (bottomByPage.get(row.pageId) ?? -GAP_Y) + GAP_Y;
      added[newCardId()] = {
        boardId: INBOX_BOARD_ID,
        sessionId: row.id,
        x: index2 % ROW_COLS * (CARD_W + GAP_X),
        y: baseY + Math.floor(index2 / ROW_COLS) * (CARD_H + GAP_Y),
        createdAt: Date.now()
      };
    }
    if (Object.keys(added).length > 0) canvas.addCards(added);
    props.onClose();
    window.dispatchEvent(new CustomEvent("talk-pages:toast", {
      detail: t("picker.added", { a: String(Object.keys(added).length), r: String(removed) })
    }));
  };
  const filters = [
    ["all", "picker.filterAll"],
    ["on", "picker.filterOnMap"],
    ["off", "picker.filterOff"],
    ["archived", "picker.filterArchived"]
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: talk_pages_default["pickerMask"], onMouseDown: (event) => {
    if (event.target === event.currentTarget) props.onClose();
  }, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["picker"], role: "dialog", "aria-label": t("picker.title"), "data-talkmap-picker": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerHead"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: talk_pages_default["pickerTitle"], children: t("picker.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", className: talk_pages_default["pickerClose"], onClick: props.onClose, "aria-label": t("picker.cancel"), children: "✕" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerTools"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        "input",
        {
          className: talk_pages_default["pickerSearch"],
          placeholder: t("picker.search"),
          value: query,
          autoFocus: true,
          onChange: (event) => {
            setQuery(event.target.value);
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: talk_pages_default["pickerFilters"], children: filters.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
        "button",
        {
          type: "button",
          className: `${talk_pages_default["pickerFilter"]}${filter2 === key ? ` ${talk_pages_default["pickerFilterOn"]}` : ""}`,
          onClick: () => {
            setFilter(key);
          },
          children: t(label)
        },
        key
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerBulk"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", className: talk_pages_default["pickerLink"], onClick: () => {
          setShown(true);
        }, children: t("picker.selectShown") }),
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", className: talk_pages_default["pickerLink"], onClick: () => {
          setShown(false);
        }, children: t("picker.clearShown") })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerList"], children: [
      groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: talk_pages_default["pickerEmpty"], children: t("picker.empty") }) : null,
      groups.map(([pageId, items]) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerGroup"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: talk_pages_default["pickerGroupTitle"], children: pageTitle.get(pageId) ?? t("page.unsorted") }),
        items.map((row) => /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("label", { className: talk_pages_default["pickerRow"], "data-talkmap-picker-row": row.id, children: [
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("input", { type: "checkbox", checked: picked.has(row.id), onChange: () => {
            toggle(row.id);
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: talk_pages_default["pickerRowTitle"], children: row.title }),
          row.archived ? /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: talk_pages_default["pickerTag"], children: t("picker.archivedTag") }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: talk_pages_default["pickerTime"], children: relativeTime(row.updatedAt) })
        ] }, row.id))
      ] }, pageId))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: talk_pages_default["pickerFoot"], children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("label", { className: talk_pages_default["pickerAuto"], children: [
        /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          "input",
          {
            type: "checkbox",
            checked: autoAdd,
            onChange: (event) => {
              canvas.patchGlobalNow({ autoAdd: event.target.checked });
            }
          }
        ),
        t("picker.autoAdd")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: talk_pages_default["pickerCount"], children: t("picker.selected", { n: String(picked.size) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", className: talk_pages_default["pickerCancel"], onClick: props.onClose, children: t("picker.cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("button", { type: "button", className: talk_pages_default["pickerApply"], onClick: apply2, "data-talkmap-picker-apply": "", children: t("picker.apply") })
    ] })
  ] }) });
}

// src/client/PageTabs.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
function PageTabs(props) {
  const canvasState = (0, import_react16.useSyncExternalStore)(canvas.subscribe, canvas.get);
  (0, import_react16.useSyncExternalStore)(subscribeLocale, activeLocale, activeLocale);
  const workspaces = props.useWorkspaces((state3) => state3);
  const sessions = props.useSessions((state3) => state3);
  const boxes = canvasState.global?.boxes;
  const activePageStored = canvasState.global?.activePage;
  const sessionPage = (0, import_react16.useMemo)(() => sessionPageIndex(workspaces.items), [workspaces.items]);
  const pages = (0, import_react16.useMemo)(() => buildPages({
    workspaces: workspaces.items,
    cards: canvasState.cards,
    boxes,
    sessionPage,
    // A blank session's card is hidden on the canvas, so it must not be counted.
    isHidden: (card) => sessions.byId[card.sessionId]?.blank === true,
    unsortedTitle: t("page.unsorted"),
    ...activePageStored !== void 0 ? { activePage: activePageStored } : {}
  }), [workspaces.items, canvasState.cards, boxes, sessionPage, sessions, activePageStored]);
  const activePage = resolveActivePage(canvasState.global, pages);
  const snap2 = canvasState.global?.snap !== false;
  const [picking, setPicking] = (0, import_react16.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: talk_pages_default["pageTabs"], role: "tablist", "aria-label": t("page.tabs"), "data-talkmap-pages": "", children: [
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: talk_pages_default["pageTabScroll"], children: pages.map((page) => {
      const active = page.id === activePage;
      return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": active,
          className: `${talk_pages_default["pageTab"]}${active ? ` ${talk_pages_default["pageTabActive"]}` : ""}`,
          title: t("page.tabHint", { title: page.title, n: String(page.count) }),
          "data-talkmap-page-tab": page.id,
          ...active ? { "data-talkmap-page-active": "true" } : {},
          onClick: () => {
            canvas.setActivePage(page.id);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: talk_pages_default["pageTabTitle"], children: page.title }),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: talk_pages_default["pageTabCount"], children: page.count })
          ]
        },
        page.id
      );
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: talk_pages_default["pageTabsSpace"] }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "button",
      {
        type: "button",
        className: talk_pages_default["pageAction"],
        title: t("picker.title"),
        "data-talkmap-open-picker": "",
        onClick: () => {
          setPicking(true);
        },
        children: t("picker.button")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "button",
      {
        type: "button",
        className: `${talk_pages_default["pageAction"]}${snap2 ? ` ${talk_pages_default["pageActionOn"]}` : ""}`,
        "aria-pressed": snap2,
        title: t("page.snapHint"),
        "data-talkmap-snap-toggle": snap2 ? "on" : "off",
        onClick: () => {
          canvas.setSnap(!snap2);
        },
        children: t("page.snap")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "button",
      {
        type: "button",
        className: talk_pages_default["pageAction"],
        title: t("page.newBoxHint"),
        "data-talkmap-new-box": "",
        onClick: () => {
          canvasActions.createBox();
        },
        children: t("page.newBox")
      }
    ),
    picking ? /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(ConversationPicker, { ...props, onClose: () => {
      setPicking(false);
    } }) : null
  ] });
}

// src/client/MapOverlay.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
function FontSizeButtons() {
  const step2 = (0, import_react17.useSyncExternalStore)(fontScale.subscribe, fontScale.getSnapshot);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: talk_pages_default["fontGroup"], role: "group", "aria-label": t("font.group"), children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      "button",
      {
        type: "button",
        className: talk_pages_default["fontButton"],
        title: t("font.decrease"),
        "aria-label": t("font.decrease"),
        disabled: !fontScale.canDecrease(),
        onClick: () => {
          fontScale.decrease();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: talk_pages_default["fontGlyphSmall"], children: "A" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: talk_pages_default["fontSign"], children: "−" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      "button",
      {
        type: "button",
        className: talk_pages_default["fontButton"],
        title: t("font.increase"),
        "aria-label": t("font.increase"),
        disabled: !fontScale.canIncrease(),
        onClick: () => {
          fontScale.increase();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: talk_pages_default["fontGlyphLarge"], children: "A" }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: talk_pages_default["fontSign"], children: "+" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
      "button",
      {
        type: "button",
        className: `${talk_pages_default["fontButton"]} ${talk_pages_default["fontReset"]}`,
        title: t("font.reset"),
        "aria-label": t("font.reset"),
        disabled: step2 === 0,
        onClick: () => {
          fontScale.reset();
        },
        children: t("font.resetShort")
      }
    )
  ] });
}
function BackIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M15 5l-7 7 7 7" }) });
}
function CloseIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("path", { d: "M6 6l12 12M18 6L6 18" }) });
}
function MapOverlay(props) {
  (0, import_react17.useSyncExternalStore)(subscribeLocale, activeLocale, activeLocale);
  const fontStep = (0, import_react17.useSyncExternalStore)(fontScale.subscribe, fontScale.getSnapshot);
  (0, import_react17.useEffect)(() => {
    mapUi.setOpen(true);
    hideSidebarForMap();
    return () => {
      mapUi.setOpen(false);
      restoreSidebarAfterMap();
    };
  }, []);
  (0, import_react17.useEffect)(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (mapUi.escapeClaimed()) return;
      event.stopPropagation();
      closeMapPanel();
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
    "div",
    {
      className: talk_pages_default["panel"],
      lang: activeLocale(),
      role: "dialog",
      "aria-label": t("map.title"),
      style: { "--tm-font-step": `${fontStep}px` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: talk_pages_default["header"], "data-window-drag": "", children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
            "button",
            {
              type: "button",
              className: talk_pages_default["backButton"],
              title: t("map.back"),
              "aria-label": t("map.back"),
              onClick: closeMapPanel,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(BackIcon, {}),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { children: t("map.back") })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: talk_pages_default["headerSpace"] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(GlobalSearch, { onOpenSession: (sessionId) => {
            openSessionInUi(sessionId);
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(FontSizeButtons, {}),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            "button",
            {
              type: "button",
              className: talk_pages_default["closeButton"],
              title: t("map.close"),
              "aria-label": t("map.close"),
              onClick: closeMapPanel,
              children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(CloseIcon, {})
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(PageTabs, { ...props }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(MapCanvas, { ...props })
      ]
    }
  );
}

// src/client/MapToggleButton.tsx
var import_react18 = require("react");
var import_jsx_runtime20 = require("react/jsx-runtime");
function MapIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("svg", { className: talk_pages_default["toggleIcon"], viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M9 4v14" }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("path", { d: "M15 6v14" })
  ] });
}
function MapToggleButton(props) {
  const open = (0, import_react18.useSyncExternalStore)(mapUi.subscribe, () => mapUi.get().open);
  const locale = (0, import_react18.useSyncExternalStore)(subscribeLocale, activeLocale, activeLocale);
  const wide = props.wide;
  (0, import_react18.useEffect)(() => {
    reportSidebarWide(wide);
  }, [wide]);
  const classNames = [wide ? talk_pages_default["toggleRow"] : talk_pages_default["toggleButton"]];
  if (open) classNames.push(talk_pages_default["toggleButtonActive"]);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
    "button",
    {
      type: "button",
      className: classNames.filter(Boolean).join(" "),
      lang: locale,
      title: t("map.toggle"),
      "aria-label": t("map.toggle"),
      "aria-pressed": open,
      onClick: () => {
        mapUi.toggle();
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(MapIcon, {}),
        wide ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: talk_pages_default["toggleLabel"], children: t("map.toggle") }) : null
      ]
    }
  );
}

// src/client/index.ts
function resolveUiWorkspace2(ctx) {
  try {
    const direct = ctx.uiWorkspace;
    if (direct !== void 0) return direct;
  } catch {
  }
  try {
    const value2 = typeof ctx.get === "function" ? ctx.get("uiWorkspace") : void 0;
    return value2 === void 0 || value2 === null ? void 0 : value2;
  } catch {
    return void 0;
  }
}
function resolveLayout2(ctx) {
  try {
    const direct = ctx.layout;
    if (direct !== void 0) return direct;
  } catch {
  }
  try {
    const value2 = typeof ctx.get === "function" ? ctx.get("layout") : void 0;
    return value2 === void 0 || value2 === null ? void 0 : value2;
  } catch {
    return void 0;
  }
}
function resolveRemote(ctx) {
  try {
    const direct = ctx.remote;
    if (direct !== void 0) return direct;
  } catch {
  }
  try {
    const value2 = typeof ctx.get === "function" ? ctx.get("remote") : void 0;
    return value2 === void 0 || value2 === null ? void 0 : value2;
  } catch {
    return void 0;
  }
}
var name = "dsh-talk-pages";
var inject = ["slots", "sessions", "workspaces", "connection"];
function apply(ctx) {
  try {
    const registerSafely = (slot, factory, label) => {
      try {
        ctx.slots.inject(slot, factory);
      } catch (error) {
        console.error(`[dsh-talk-pages] ${label} registration skipped:`, error);
      }
    };
    registerSafely("sidebar.footer.action", () => ctx.slots.register({
      name: "sidebar.footer.action",
      id: "talk-pages",
      order: 10,
      label: () => t("map.toggle")
    }, MapToggleButton), "sidebar.footer.action");
    registerSafely("main", () => ctx.slots.register({
      name: "main",
      key: MAP_PANEL_ID,
      label: () => t("map.title")
    }, MapOverlay), "main panel");
    attachServices({
      sessions: ctx.sessions,
      workspaces: ctx.workspaces,
      connection: ctx.connection,
      uiWorkspace: resolveUiWorkspace2(ctx),
      layout: resolveLayout2(ctx),
      // Also kept live: a cold boot reaches this plugin before ui-workspace
      // registers, so the click resolves the service through ctx instead.
      ctx: { get: typeof ctx.get === "function" ? (name2) => ctx.get?.(name2) : void 0 }
    });
    ctx.effect(() => () => {
      attachServices(void 0);
    }, "dsh-talk-pages: services");
    if (typeof ctx.inject === "function") {
      try {
        ctx.inject(["connection", "uiWorkspace"], (scoped) => {
          attachServices({
            sessions: ctx.sessions,
            workspaces: ctx.workspaces,
            connection: scoped.connection ?? ctx.connection,
            uiWorkspace: scoped.uiWorkspace,
            layout: resolveLayout2(scoped),
            ctx: { get: typeof scoped.get === "function" ? (name2) => scoped.get?.(name2) : void 0 }
          });
        });
      } catch (error) {
        console.error("[dsh-talk-pages] late service binding failed:", error);
      }
    }
    ctx.effect(() => {
      try {
        return attachAlertSource(resolveRemote(ctx), ctx.sessions.list);
      } catch (error) {
        console.error("[dsh-talk-pages] session alerts unavailable:", error);
        return () => {
        };
      }
    }, "dsh-talk-pages: session alerts");
    canvas.ensureLoaded();
    ctx.effect(() => {
      const onKeyDown = (event) => {
        const hotkey = canvas.get().global?.hotkey ?? DEFAULT_HOTKEY;
        if (hotkeyMatches(event, hotkey)) {
          event.preventDefault();
          event.stopPropagation();
          mapUi.toggle();
        }
      };
      window.addEventListener("keydown", onKeyDown, { capture: true });
      return () => {
        window.removeEventListener("keydown", onKeyDown, { capture: true });
      };
    }, "dsh-talk-pages: toggle hotkey");
  } catch (error) {
    console.error("[dsh-talk-pages] client apply failed:", error);
  }
}
	} catch (error) {
		console.error('[dsh-talk-pages] client bundle failed to evaluate (inert this boot):', error);
		return { name: "dsh-talk-pages", apply() {} };
	}
	return module.exports;
}
});

