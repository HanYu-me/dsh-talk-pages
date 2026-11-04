// src/host/digest/extract.ts
var MAX_MESSAGES = 40;
var MAX_CHARS = 24e3;
function textOfBlocks(content) {
  if (!Array.isArray(content)) return "";
  return content.filter((block) => typeof block === "object" && block !== null && block.type === "text" && typeof block.text === "string").map((block) => block.text).join("\n").trim();
}
function isHumanMessage(source) {
  const kind = source?.kind;
  return kind === void 0 || kind === "user";
}
function extractFromSurface(events, capturedThroughSeq) {
  const lines = [];
  let todoNext;
  let lastSeq = capturedThroughSeq ?? 0;
  for (const event of events) {
    if (event.seq > lastSeq) lastSeq = event.seq;
    if (event.type === "user/message") {
      const message = event.data;
      const kind = message?.source?.kind;
      if (kind === "tool") continue;
      const text = textOfBlocks(message?.content);
      if (text !== "") lines.push({ role: "user", text });
    } else if (event.type === "assistant/message") {
      const data = event.data;
      const text = textOfBlocks(data?.message?.content);
      if (text !== "") lines.push({ role: "assistant", text });
    } else if (event.type === "todo/write") {
      const data = event.data;
      const open = data?.todos?.find((item) => item.status !== "completed");
      todoNext = open?.content;
    }
  }
  const recent = lines.slice(-MAX_MESSAGES);
  let transcript = recent.map((line) => `${line.role === "user" ? "USER" : "ASSISTANT"}: ${line.text}`).join("\n\n");
  if (transcript.length > MAX_CHARS) {
    transcript = transcript.slice(transcript.length - MAX_CHARS);
  }
  return {
    transcript,
    ...todoNext !== void 0 && todoNext !== "" ? { todoNext } : {},
    lastSeq,
    messageCount: recent.length
  };
}

// src/host/digest/pipeline.ts
import { createHash } from "node:crypto";

// src/host/digest/prompt.ts
var DIGEST_SYSTEM_PROMPT = [
  "You are a conversation digester for a visual conversation map.",
  "Read the conversation transcript and output STRICT JSON, nothing else:",
  '{"summary": string, "keyFindings": string[], "nextStep": string}',
  "",
  "Rules:",
  "- Use the language the conversation itself is in (Chinese conversation → Chinese output).",
  "- summary: what this conversation is about and where it stands, ≤120 characters.",
  "- keyFindings: at most 5 short bullet strings — decisions made, facts established, artifacts produced.",
  "- nextStep: ONE imperative sentence naming the next concrete action to take, ≤40 characters.",
  "  The reader has ADHD and returns after days away — nextStep must be directly actionable,",
  '  never vague ("continue working" is forbidden; "run the M2 browser test" is right).',
  "- If the conversation is finished with nothing left to do, nextStep is an empty string.",
  "- Output raw JSON only: no markdown fences, no commentary."
].join("\n");
function digestUserPrompt(transcript) {
  return `Conversation transcript (oldest first):

${transcript}

Output the JSON digest now.`;
}
function parseDigestOutput(raw) {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("digest output contains no JSON object");
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (typeof parsed.summary !== "string" || typeof parsed.nextStep !== "string" || !Array.isArray(parsed.keyFindings)) {
    throw new Error("digest output missing required fields");
  }
  return {
    summary: parsed.summary.slice(0, 300),
    keyFindings: parsed.keyFindings.filter((finding) => typeof finding === "string").slice(0, 5).map((finding) => finding.slice(0, 200)),
    nextStep: parsed.nextStep.slice(0, 120)
  };
}

// src/host/digest/pipeline.ts
var DIGEST_DEFAULTS = { enabled: false, idleMs: 3e4 };
var MIN_MESSAGES = 2;
var DigestPipeline = class {
  constructor(services, storeReady, config = DIGEST_DEFAULTS, onFresh) {
    this.services = services;
    this.storeReady = storeReady;
    this.config = config;
    this.onFresh = onFresh;
  }
  services;
  storeReady;
  config;
  onFresh;
  timers = /* @__PURE__ */ new Map();
  queue = [];
  queued = /* @__PURE__ */ new Set();
  draining = false;
  disposed = false;
  /** Wire the turn/end trigger; returns the disposer. */
  start() {
    const off = this.services.on("session/event", (...args) => {
      const session = args[0];
      const event = args[1];
      if (event?.type !== "turn/end" || typeof session?.id !== "string") return;
      if (!this.config.enabled && !(this.config.shouldAuto?.(session.id) ?? false)) return;
      this.schedule(session.id);
    });
    return () => {
      this.disposed = true;
      off();
      for (const timer of this.timers.values()) clearTimeout(timer);
      this.timers.clear();
    };
  }
  /** Debounced trigger: a busy session settles idleMs before digesting. */
  schedule(sessionId) {
    if (this.disposed) return;
    const existing = this.timers.get(sessionId);
    if (existing !== void 0) clearTimeout(existing);
    const timer = setTimeout(() => {
      this.timers.delete(sessionId);
      this.enqueue(sessionId);
    }, this.config.idleMs);
    timer.unref?.();
    this.timers.set(sessionId, timer);
  }
  /** Manual refresh: skips the debounce, forces regeneration (ignores hash). */
  async refresh(sessionId) {
    return await this.run(sessionId, { force: true });
  }
  /**
   * Regenerate only if the conversation actually moved on: identical transcript
   * → the stored digest comes back untouched, no LLM call.
   */
  async ensure(sessionId) {
    return await this.run(sessionId, { force: false });
  }
  /** Queue sessions that have no digest yet (imported/backlog cards). */
  backfill(sessionIds) {
    for (const sessionId of sessionIds) this.enqueue(sessionId);
  }
  enqueue(sessionId) {
    if (this.queued.has(sessionId)) return;
    this.queued.add(sessionId);
    this.queue.push(sessionId);
    void this.drain();
  }
  async drain() {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.queue.length > 0 && !this.disposed) {
        const sessionId = this.queue.shift();
        if (sessionId === void 0) break;
        this.queued.delete(sessionId);
        try {
          await this.run(sessionId, { force: false });
        } catch (error) {
          this.services.logger?.warn(`[dsh-talk-pages] digest for ${sessionId} failed: ${String(error)}`);
        }
      }
    } finally {
      this.draining = false;
    }
  }
  async run(sessionId, options) {
    const store = await this.storeReady;
    const surface = await this.services.sessionQuery.readSurface(sessionId);
    const extracted = extractFromSurface(surface.events, surface.capturedThroughSeq);
    const previous = store.digests.get(sessionId);
    if (extracted.transcript === "" || extracted.messageCount < MIN_MESSAGES) {
      const digest = {
        atSeq: extracted.lastSeq,
        summary: previous?.summary ?? "",
        keyFindings: previous?.keyFindings ?? [],
        nextStep: previous?.nextStep ?? "",
        ...extracted.todoNext !== void 0 ? { todoNext: extracted.todoNext } : {},
        generatedAt: Date.now()
      };
      await store.digests.put(sessionId, digest);
      return digest;
    }
    const inputHash = createHash("sha256").update(extracted.transcript).digest("hex");
    if (!options.force && previous?.inputHash === inputHash && previous.error === void 0) {
      return previous;
    }
    const route = this.services.agentDefaultModel.currentSelection();
    try {
      const raw = await this.generate(route, extracted.transcript, sessionId);
      const parsed = parseDigestOutput(raw);
      const digest = {
        atSeq: extracted.lastSeq,
        summary: parsed.summary,
        keyFindings: parsed.keyFindings,
        nextStep: parsed.nextStep,
        ...extracted.todoNext !== void 0 ? { todoNext: extracted.todoNext } : {},
        generatedAt: Date.now(),
        model: `${route.provider}/${route.model}`,
        inputHash
      };
      await store.digests.put(sessionId, digest);
      if (previous?.inputHash !== inputHash) {
        try {
          this.onFresh?.(sessionId, digest);
        } catch (hookError) {
          this.services.logger?.warn(`[dsh-talk-pages] onFresh hook failed: ${String(hookError)}`);
        }
      }
      return digest;
    } catch (error) {
      const digest = {
        atSeq: extracted.lastSeq,
        summary: previous?.summary ?? "",
        keyFindings: previous?.keyFindings ?? [],
        nextStep: previous?.nextStep ?? "",
        ...extracted.todoNext !== void 0 ? { todoNext: extracted.todoNext } : {},
        generatedAt: Date.now(),
        error: String(error).slice(0, 500)
      };
      await store.digests.put(sessionId, digest);
      return digest;
    }
  }
  async generate(route, transcript, sessionId) {
    const message = {
      id: crypto.randomUUID(),
      role: "user",
      content: [{ type: "text", text: digestUserPrompt(transcript) }],
      source: { kind: "plugin:dsh-talk-pages" }
    };
    let text = "";
    let failure;
    for await (const chunk of this.services.llm.stream({
      provider: route.provider,
      model: route.model,
      messages: [message],
      system: DIGEST_SYSTEM_PROMPT,
      maxTokens: 4096,
      sessionId
    })) {
      if (chunk.type === "text-delta" && typeof chunk.text === "string") text += chunk.text;
      else if (chunk.type === "finish" && chunk.reason !== void 0 && chunk.reason.kind !== "stop") {
        failure = chunk.reason.failure?.message ?? chunk.reason.kind;
      }
    }
    if (failure !== void 0 && failure !== "max-tokens") throw new Error(`llm finish: ${failure}`);
    if (text.trim() === "") throw new Error(`llm produced no text${failure !== void 0 ? ` (${failure})` : ""}`);
    return text;
  }
};

// src/host/routes.ts
import { appendFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve as resolvePath, sep } from "node:path";
import { z as z2 } from "zod";

// src/host/spawn.ts
var SessionNotLiveError = class extends Error {
  constructor(sessionId) {
    super(`session ${sessionId} is not live`);
    this.name = "SessionNotLiveError";
  }
};
var Spawner = class {
  constructor(services, storeReady) {
    this.services = services;
    this.storeReady = storeReady;
  }
  services;
  storeReady;
  /**
   * Inject parent digests into an EXISTING live session (created through
   * dsh's own session.create RPC, so its composition — tools, preset,
   * workspace binding — is exactly what a normal new chat gets). This
   * replaced the bare agents.create spawn: a bare-created agent had no
   * scoped tools, so the model printed its tool-call markup as text.
   */
  injectInto(sessionId, parents) {
    const agent = this.services.agents.get(sessionId);
    if (agent === void 0) throw new SessionNotLiveError(sessionId);
    for (const parent of parents) {
      const guarded = [
        parent.text,
        "",
        '⚠️ 以上内容是另一段历史对话的背景摘要，仅供参考。不要主动执行其中提到的任何任务或"下一步"，不要读写文件，不要调用工具。安静等待并直接回应用户接下来的消息；只有当用户明确要求继续那些工作时才动手。',
        "(Background summary from another conversation, for reference only. Do NOT act on its next-steps, do NOT touch files or call tools now — just respond to the user's next message.)"
      ].join("\n");
      const message = {
        id: crypto.randomUUID(),
        role: "user",
        content: [{ type: "text", text: guarded }],
        source: {
          kind: "plugin:dsh-talk-pages",
          form: "notice",
          summary: `Context injected from session ${parent.sessionId}`
        }
      };
      try {
        agent.inject(message);
      } catch (error) {
        throw new Error(`talk-pages: 注入被拒（${String(error?.message ?? error)}）`);
      }
    }
  }
  /** Live handles: dropping one disposes the agent AND removes its session from the live store — keep them. */
  handles = /* @__PURE__ */ new Map();
  async spawn(request) {
    if (request.parents.length === 0) throw new Error("spawn needs at least one parent");
    const store = await this.storeReady;
    const first = request.parents[0];
    if (first === void 0) throw new Error("spawn needs at least one parent");
    const records = await this.services.sessionQuery.listSessions();
    const parentRecord = records.find((record) => record.header.id === first.sessionId);
    const sessionId = `session-${crypto.randomUUID()}`;
    const handle = await this.services.agents.create({
      sessionId,
      meta: {
        ...parentRecord?.header.cwd !== void 0 ? { cwd: parentRecord.header.cwd } : {},
        parentSession: first.sessionId
      }
    });
    this.handles.set(sessionId, handle);
    if (parentRecord?.header.cwd !== void 0) {
      try {
        const workspace = await this.services.workspaceRegistry.resolveByPath(parentRecord.header.cwd);
        await workspace?.attachSession(sessionId);
      } catch (error) {
        this.services.logger?.warn(`[dsh-talk-pages] workspace attach failed: ${String(error)}`);
      }
    }
    for (const parent of request.parents) {
      const message = {
        id: crypto.randomUUID(),
        role: "user",
        content: [{ type: "text", text: parent.text }],
        source: {
          kind: "plugin:dsh-talk-pages",
          form: "notice",
          summary: `Context injected from session ${parent.sessionId}`
        }
      };
      try {
        handle.agent.inject(message);
      } catch (error) {
        throw new Error(`talk-pages: 注入被拒（${String(error?.message ?? error)}）`);
      }
    }
    const cardId = `card-${crypto.randomUUID()}`;
    const card = {
      boardId: request.boardId,
      sessionId,
      x: request.x,
      y: request.y,
      ...request.wsOverride !== void 0 ? { wsOverride: request.wsOverride } : {},
      ...request.boxId !== void 0 ? { boxId: request.boxId } : {},
      createdAt: Date.now()
    };
    await store.cards.put(cardId, card);
    const edges = {};
    for (const parent of request.parents) {
      const edgeId = `edge-${crypto.randomUUID()}`;
      const edge = {
        boardId: request.boardId,
        fromCardId: parent.cardId,
        toCardId: cardId,
        injection: { kind: "digest", injectedText: parent.text },
        // The line just delivered: the map's sync animation keys off this.
        lastPushAt: Date.now(),
        createdAt: Date.now()
      };
      await store.edges.put(edgeId, edge);
      edges[edgeId] = edge;
    }
    this.services.logger?.info?.(`[dsh-talk-pages] spawned ${sessionId} from ${request.parents.length} parent(s)`);
    return { sessionId, cardId, card, edges };
  }
};

// src/host/store.ts
import { z } from "zod";
var DOMAIN_NAME = "talk_pages";
var INBOX_BOARD_ID = "inbox";
var boardSchema = z.object({
  name: z.string(),
  color: z.string(),
  order: z.number(),
  createdAt: z.number(),
  archivedAt: z.number().optional(),
  shelvedAt: z.number().optional()
});
var cardSchema = z.object({
  boardId: z.string(),
  sessionId: z.string(),
  x: z.number(),
  y: z.number(),
  colorTag: z.string().optional(),
  /** Legacy (pre-v5) group override; the layout migration folds it into boxId.
   * Kept in the schema so an old store still parses. */
  wsOverride: z.string().optional(),
  /** User box this card belongs to; absent = a free card at its own x/y. */
  boxId: z.string().optional(),
  createdAt: z.number()
});
var boxSchema = z.object({
  pageId: z.string(),
  title: z.string()
});
var edgeInjectionSchema = z.object({
  /** 'link' = a plain association drawn between two EXISTING cards (no
   * spawn, no text); 'none' = a fork edge whose child inherited nothing. */
  kind: z.enum(["digest", "full", "selection", "none", "link"]),
  /** What was actually injected (post-edit), kept for provenance display. */
  injectedText: z.string().optional(),
  /** Pipe mode (the edge menu's 开启自动推送): every substantive digest change
   * of the source session is pushed along this edge into the target session.
   * Declared here or the request schema strips it and the host can never see
   * the switch the client sets. */
  autoPush: z.boolean().optional()
});
var edgeSchema = z.object({
  boardId: z.string(),
  fromCardId: z.string(),
  toCardId: z.string(),
  injection: edgeInjectionSchema,
  /** Handle sides ('t'|'r'|'b'|'l') the edge attaches to; absent = legacy r→l. */
  fromHandle: z.string().optional(),
  toHandle: z.string().optional(),
  /** Pipe mode: every substantive digest change of the source session is
   * pushed along this edge into the target session automatically. */
  autoSync: z.boolean().optional(),
  /** Source-session title snapshot (the host cannot resolve titles; the
   * client stamps it so auto-sync pushes can name their origin). */
  fromTitle: z.string().optional(),
  /** When this edge last delivered context (manual push or auto push); the
   * map's sync animation keys off it. */
  lastPushAt: z.number().optional(),
  createdAt: z.number()
});
var digestSchema = z.object({
  /** Last session event seq folded into this digest (staleness anchor). */
  atSeq: z.number(),
  summary: z.string(),
  keyFindings: z.array(z.string()),
  /** The ADHD field: one imperative sentence — the next concrete action. */
  nextStep: z.string(),
  /** Zero-cost fallback lifted from the session's todo/write events. */
  todoNext: z.string().optional(),
  generatedAt: z.number(),
  model: z.string().optional(),
  error: z.string().optional(),
  /** sha256 of the transcript input — unchanged input skips regeneration. */
  inputHash: z.string().optional()
});
var cameraSchema = z.object({ x: z.number(), y: z.number(), zoom: z.number() });
var globalSchema = z.object({
  version: z.number(),
  activeBoard: z.string(),
  cameraByBoard: z.record(z.string(), cameraSchema),
  /** Auto-placement generation; absent = v1 (pre-workspace-grouping). */
  layoutVersion: z.number().optional(),
  /** Per-box color tags (boxes replaced the auto workspace folders). */
  wsColors: z.record(z.string(), z.string()).optional(),
  /** Box geometry, keyed by box id (a migrated folder keeps its workspace id). */
  wsFrames: z.record(z.string(), z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  })).optional(),
  /** User boxes — the board's only grouping layer. zod strips unknown keys,
   * so every new field MUST be declared here or it never reaches storage. */
  boxes: z.record(z.string(), boxSchema).optional(),
  /** Page (workspace) currently shown; absent = the first page. */
  activePage: z.string().optional(),
  /** Free cards snap to the 16px grid on drop; absent = true. */
  snap: z.boolean().optional(),
  /** Map-toggle hotkey, e.g. "alt+KeyF" (modifiers + KeyboardEvent.code). */
  hotkey: z.string().optional(),
  /** Interface language of the map's own copy; absent = follow <html lang>. */
  locale: z.enum(["auto", "zh", "en"]).optional(),
  /** Last known placement per session — re-imports restore the arrangement. */
  layoutMemory: z.record(z.string(), z.object({
    x: z.number(),
    y: z.number(),
    colorTag: z.string().optional()
  })).optional()
});
var TALK_MAP_SPEC = {
  name: DOMAIN_NAME,
  version: 1,
  global: {
    schema: globalSchema,
    initial: { version: 1, activeBoard: INBOX_BOARD_ID, cameraByBoard: {} }
  },
  tables: {
    boards: { valueSchema: boardSchema },
    cards: { valueSchema: cardSchema },
    edges: { valueSchema: edgeSchema },
    digests: { valueSchema: digestSchema }
  }
};
async function openTalkMapStore(storageDomain) {
  const domain = await storageDomain.open(TALK_MAP_SPEC);
  const store = {
    domain,
    boards: domain.table("boards"),
    cards: domain.table("cards"),
    edges: domain.table("edges"),
    digests: domain.table("digests"),
    global: () => domain.global.get(),
    setGlobal: (value) => domain.global.set(value)
  };
  if (store.boards.get(INBOX_BOARD_ID) === void 0) {
    await store.boards.put(INBOX_BOARD_ID, {
      name: "Inbox",
      color: "gray",
      order: 0,
      createdAt: Date.now()
    });
  }
  return store;
}

// src/host/routes.ts
var MAX_BODY_BYTES = 1024 * 1024;
function sendJson(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(payload);
}
function sameOrigin(request) {
  const origin = request.headers.origin;
  if (origin === void 0) return true;
  const host = request.headers.host;
  if (host === void 0) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = chunk;
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("body too large");
    chunks.push(buffer);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return text === "" ? void 0 : JSON.parse(text);
}
function tableToRecord(table) {
  const out = {};
  for (const [key, value] of table.entries()) out[key] = value;
  return out;
}
var upsertCardsBody = z2.object({
  cards: z2.record(z2.string(), cardSchema)
});
var upsertEdgesBody = z2.object({
  edges: z2.record(z2.string(), edgeSchema)
});
var deleteCardsBody = z2.object({
  ids: z2.array(z2.string())
});
var setGlobalBody = z2.object({
  global: globalSchema
});
var spawnBody = z2.object({
  parents: z2.array(z2.object({
    cardId: z2.string(),
    sessionId: z2.string(),
    text: z2.string().min(1)
  })).min(1),
  boardId: z2.string(),
  x: z2.number(),
  y: z2.number(),
  wsOverride: z2.string().optional(),
  /** Box the forked card joins (undefined = free card on its page). */
  boxId: z2.string().optional()
});
var refreshDigestBody = z2.object({
  sessionId: z2.string()
});
var injectBody = z2.object({
  sessionId: z2.string(),
  parents: z2.array(z2.object({
    sessionId: z2.string(),
    text: z2.string().min(1)
  })).min(1)
});
var ensureDirBody = z2.object({
  path: z2.string().min(1)
});
function mountTalkMapRoutes(services, storeReady, runtime) {
  const sseClients = /* @__PURE__ */ new Set();
  const offChanged = services.on("domain/changed", (...args) => {
    const change = args[0];
    if (change.domain !== DOMAIN_NAME) return;
    const frame = `event: change
data: ${JSON.stringify(change)}

`;
    for (const client of sseClients) client.write(frame);
  });
  const ping = setInterval(() => {
    for (const client of sseClients) client.write(": ping\n\n");
  }, 25e3);
  ping.unref?.();
  const unregister = services.webServer.register({
    kind: "prefix",
    // NOTE: webserver prefix p matches `p` and `p/<anything>` — no trailing slash.
    path: "/talk-pages",
    handler: async (request, response) => {
      const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
      const route = `${request.method ?? "GET"} ${url.pathname}`;
      try {
        if (route === "GET /talk-pages/state") {
          const store = await storeReady;
          sendJson(response, 200, {
            boards: tableToRecord(store.boards),
            cards: tableToRecord(store.cards),
            edges: tableToRecord(store.edges),
            digests: tableToRecord(store.digests),
            global: store.global()
          });
          return;
        }
        if (route === "GET /talk-pages/defaults") {
          let model = null;
          let preset = null;
          try {
            model = runtime.modelDefault?.() ?? null;
          } catch {
          }
          try {
            preset = runtime.presetDefault?.() ?? null;
          } catch {
          }
          sendJson(response, 200, { model, preset });
          return;
        }
        if (route === "GET /talk-pages/events") {
          response.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-store",
            "connection": "keep-alive"
          });
          response.write(": connected\n\n");
          sseClients.add(response);
          request.on("close", () => {
            sseClients.delete(response);
          });
          return;
        }
        if (request.method === "POST" && !sameOrigin(request)) {
          sendJson(response, 403, { error: "cross-origin request refused" });
          return;
        }
        if (route === "POST /talk-pages/client-boot") {
          const body = await readJsonBody(request);
          const line = JSON.stringify({ at: (/* @__PURE__ */ new Date()).toISOString(), pid: process.pid, ...body });
          try {
            await mkdir(join(homedir(), ".dsh"), { recursive: true });
            await appendFile(join(homedir(), ".dsh", "talk-pages-client-boot.log"), line + "\n");
          } catch {
          }
          sendJson(response, 200, { ok: true });
          return;
        }
        if (route === "POST /talk-pages/cards/upsert") {
          const store = await storeReady;
          const body = upsertCardsBody.parse(await readJsonBody(request));
          for (const [id, card] of Object.entries(body.cards)) {
            await store.cards.put(id, card);
            const digest = store.digests.get(card.sessionId);
            if (digest === void 0 || digest.summary === "") {
              runtime.digest?.schedule(card.sessionId);
            }
          }
          sendJson(response, 200, { ok: true, count: Object.keys(body.cards).length });
          return;
        }
        if (route === "POST /talk-pages/edges/upsert") {
          const store = await storeReady;
          const body = upsertEdgesBody.parse(await readJsonBody(request));
          for (const [id, edge] of Object.entries(body.edges)) {
            await store.edges.put(id, edge);
          }
          sendJson(response, 200, { ok: true, count: Object.keys(body.edges).length });
          return;
        }
        if (route === "POST /talk-pages/cards/delete") {
          const store = await storeReady;
          const body = deleteCardsBody.parse(await readJsonBody(request));
          let removed = 0;
          for (const id of body.ids) {
            if (await store.cards.delete(id)) removed += 1;
          }
          for (const [edgeId, edge] of [...store.edges.entries()]) {
            if (body.ids.includes(edge.fromCardId) || body.ids.includes(edge.toCardId)) {
              await store.edges.delete(edgeId);
            }
          }
          sendJson(response, 200, { ok: true, removed });
          return;
        }
        if (route === "POST /talk-pages/edges/delete") {
          const store = await storeReady;
          const body = deleteCardsBody.parse(await readJsonBody(request));
          let removed = 0;
          for (const id of body.ids) {
            if (await store.edges.delete(id)) removed += 1;
          }
          sendJson(response, 200, { ok: true, removed });
          return;
        }
        if (route === "POST /talk-pages/global") {
          const store = await storeReady;
          const body = setGlobalBody.parse(await readJsonBody(request));
          await store.setGlobal(body.global);
          sendJson(response, 200, { ok: true });
          return;
        }
        if (route === "POST /talk-pages/inject") {
          if (runtime.spawner === void 0) {
            sendJson(response, 503, { error: "spawn layer unavailable (agents service missing)" });
            return;
          }
          const body = injectBody.parse(await readJsonBody(request));
          try {
            runtime.spawner.injectInto(body.sessionId, body.parents);
          } catch (error) {
            if (error instanceof SessionNotLiveError) {
              sendJson(response, 409, { error: String(error), code: "session-not-live" });
              return;
            }
            throw error;
          }
          sendJson(response, 200, { ok: true });
          return;
        }
        if (route === "POST /talk-pages/spawn") {
          if (runtime.spawner === void 0) {
            sendJson(response, 503, { error: "spawn layer unavailable (agents service missing)" });
            return;
          }
          const body = spawnBody.parse(await readJsonBody(request));
          const result = await runtime.spawner.spawn(body);
          sendJson(response, 200, result);
          return;
        }
        if (route === "POST /talk-pages/fs/ensure-dir") {
          const body = ensureDirBody.parse(await readJsonBody(request));
          const target = resolvePath(body.path);
          const home = homedir();
          if (target !== home && !target.startsWith(home + sep)) {
            sendJson(response, 400, { error: "path must be inside the home directory" });
            return;
          }
          await mkdir(target, { recursive: true });
          sendJson(response, 200, { ok: true, path: target });
          return;
        }
        if (route === "POST /talk-pages/search") {
          const body = await readJsonBody(request);
          const query = typeof body?.query === "string" ? body.query.trim() : "";
          const cwd = typeof body?.cwd === "string" ? body.cwd : "";
          const search = runtime.search;
          if (query === "" || search === void 0) {
            sendJson(response, 200, { items: [], hasMore: false });
            return;
          }
          try {
            const page = await search(query, cwd);
            sendJson(response, 200, { items: page?.items ?? [], hasMore: page?.hasMore === true });
          } catch (error) {
            sendJson(response, 500, { error: String(error?.message ?? error) });
          }
          return;
        }
        if (route === "POST /talk-pages/search-session") {
          const body = await readJsonBody(request);
          const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
          const query = typeof body?.query === "string" ? body.query : "";
          const sessionSearch = runtime.searchSession;
          if (sessionId === "" || sessionSearch === void 0) {
            sendJson(response, 200, { blocks: [], seqs: [] });
            return;
          }
          try {
            sendJson(response, 200, await sessionSearch(sessionId, query));
          } catch (error) {
            sendJson(response, 200, { blocks: [], seqs: [], error: String(error?.message ?? error) });
          }
          return;
        }
        if (route === "POST /talk-pages/search-context") {
          const body = await readJsonBody(request);
          const sessionId = typeof body?.sessionId === "string" ? body.sessionId : "";
          const seq = typeof body?.seq === "number" ? body.seq : null;
          const query = typeof body?.query === "string" ? body.query : "";
          const read = runtime.searchContext;
          if (sessionId === "" || seq === null || read === void 0) {
            sendJson(response, 200, { lines: [] });
            return;
          }
          try {
            sendJson(response, 200, await read(sessionId, seq, query));
          } catch (error) {
            sendJson(response, 200, { lines: [], error: String(error?.message ?? error) });
          }
          return;
        }
        if (route === "POST /talk-pages/last-user") {
          const body = await readJsonBody(request);
          const ids = Array.isArray(body.sessionIds) ? body.sessionIds.filter((id) => typeof id === "string").slice(0, 200) : [];
          const texts = {};
          const query = runtime.sessionQuery;
          if (query !== void 0) {
            await Promise.all(ids.map(async (sessionId) => {
              try {
                const surface = await query.readSurface(sessionId);
                let text = "";
                for (const raw of surface.events) {
                  const event = raw;
                  if (event.type !== "user/message") continue;
                  if (!isHumanMessage(event.data?.source)) continue;
                  const body2 = textOfBlocks(event.data?.content);
                  if (body2 !== "") text = body2;
                }
                if (text !== "") texts[sessionId] = text.length > 240 ? text.slice(0, 240) : text;
              } catch {
              }
            }));
          }
          sendJson(response, 200, { texts });
          return;
        }
        if (route === "POST /talk-pages/digest/ensure") {
          if (runtime.digest === void 0) {
            sendJson(response, 503, { error: "digest layer unavailable (llm service missing)" });
            return;
          }
          const body = refreshDigestBody.parse(await readJsonBody(request));
          const digest = await runtime.digest.ensure(body.sessionId);
          sendJson(response, 200, { sessionId: body.sessionId, digest });
          return;
        }
        if (route === "POST /talk-pages/digest/refresh") {
          if (runtime.digest === void 0) {
            sendJson(response, 503, { error: "digest layer unavailable (llm service missing)" });
            return;
          }
          const body = refreshDigestBody.parse(await readJsonBody(request));
          const digest = await runtime.digest.refresh(body.sessionId);
          sendJson(response, 200, { sessionId: body.sessionId, digest });
          return;
        }
        sendJson(response, 404, { error: `no such route: ${route}` });
      } catch (error) {
        services.logger?.warn(`[dsh-talk-pages] ${route} failed: ${String(error)}`);
        if (!response.headersSent) {
          sendJson(response, 400, { error: String(error) });
        } else {
          response.end();
        }
      }
    }
  });
  return () => {
    clearInterval(ping);
    offChanged();
    for (const client of sseClients) client.end();
    sseClients.clear();
    unregister();
  };
}

// src/index.ts
var name = "dsh-talk-pages";
function apply(ctx) {
  const runtime = {};
  let resolveStore;
  let rejectStore;
  const storeReady = new Promise((resolve, reject) => {
    resolveStore = resolve;
    rejectStore = reject;
  });
  storeReady.catch(() => {
  });
  ctx.inject(["storageDomain", "webServer"], (injected) => {
    const services = injected;
    services.effect(() => {
      let disposed = false;
      let store;
      openTalkMapStore(services.storageDomain).then((opened) => {
        if (disposed) {
          void opened.domain.close();
          return;
        }
        store = opened;
        resolveStore(opened);
        services.logger?.info?.("[dsh-talk-pages] storage domain open, routes live at /talk-pages/");
      }).catch((error) => {
        services.logger?.warn(`[dsh-talk-pages] storage domain failed to open: ${String(error)}`);
        rejectStore(error);
      });
      const unmountRoutes = mountTalkMapRoutes(services, storeReady, runtime);
      return () => {
        disposed = true;
        unmountRoutes();
        void store?.domain.close();
      };
    }, "dsh-talk-pages: domain + routes");
  });
  ctx.inject(["sessions", "sessionQuery", "sessionController", "llm", "agentDefaultModel"], (injected) => {
    const services = injected;
    services.effect(() => {
      const buildPushTextHost = (title, digest) => {
        const now = /* @__PURE__ */ new Date();
        const stamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const body = [];
        if (digest !== void 0 && digest.summary !== "") body.push(`摘要：${digest.summary}`);
        if (Array.isArray(digest?.keyFindings) && digest.keyFindings.length > 0) {
          body.push("关键结论：");
          for (const finding of digest.keyFindings) body.push(`- ${finding}`);
        }
        const next = digest !== void 0 && digest.nextStep !== "" ? digest.nextStep : digest?.todoNext ?? "";
        if (next !== "") body.push(`下一步：${next}`);
        body.push(`【提醒】以上是摘要提纲，不是完整对话。需要细节（具体命令、参数、结论出处）时，请随时回到原会话「${title}」查看完整对话记录。`);
        return [`【来自「${title}」的更新 · ${stamp}】`, ...body].join("\n");
      };
      const refreshAutoSources = async () => {
        const store = await storeReady;
        const set = /* @__PURE__ */ new Set();
        for (const [, edge] of store.edges.entries()) {
          if (edge?.injection?.autoPush !== true) continue;
          const card = store.cards.get(edge.fromCardId);
          if (card !== void 0) set.add(card.sessionId);
        }
        runtime.autoPushSessions = set;
        return set;
      };
      runtime.autoPushSessions = /* @__PURE__ */ new Set();
      void refreshAutoSources();
      const offEdgeChanges = services.on("domain/changed", (...args) => {
        const change = args[0];
        if (change?.domain !== DOMAIN_NAME || change.table !== "edges") return;
        void refreshAutoSources();
      });
      const pipeline = new DigestPipeline(
        services,
        storeReady,
        {
          ...DIGEST_DEFAULTS,
          shouldAuto: (sessionId) => runtime.autoPushSessions?.has(sessionId) === true
        },
        /** Runs only when a digest really changed (hash differs). */
        async (sessionId, digest) => {
          const store = await storeReady;
          const targets = [];
          for (const [edgeId, edge] of store.edges.entries()) {
            if (edge?.injection?.autoPush !== true) continue;
            const from = store.cards.get(edge.fromCardId);
            const to = store.cards.get(edge.toCardId);
            if (from?.sessionId !== sessionId || to === void 0) continue;
            targets.push({ sessionId: to.sessionId, edgeId });
          }
          if (targets.length === 0) return;
          const records = await services.sessionQuery.listSessions().catch(() => []);
          const title = records.find((record) => record.header.id === sessionId)?.header.title ?? sessionId;
          const text = buildPushTextHost(title, digest);
          const pushedAt = Date.now();
          for (const target of targets) {
            try {
              if (runtime.spawner === void 0) throw new Error("spawn layer unavailable");
              await runtime.spawner.injectInto(target.sessionId, [{ sessionId, text }]);
              const edge = await store.edges.get(target.edgeId);
              if (edge !== void 0) await store.edges.put(target.edgeId, { ...edge, lastPushAt: pushedAt });
              services.logger?.info?.(`[dsh-talk-pages] auto-pushed digest → ${target.sessionId}`);
            } catch (error) {
              services.logger?.warn(`[dsh-talk-pages] auto push failed: ${String(error)}`);
            }
          }
        }
      );
      const stop = pipeline.start();
      runtime.digest = pipeline;
      const excerptAround = (text, at, length) => {
        const start = Math.max(0, at - 80);
        const end = Math.min(text.length, at + length + 120);
        return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
      };
      const visibleMatch = async (searchCorpus, sessionId, query) => {
        const docs = await searchCorpus.filterEvents(sessionId, [
          { kind: "type", values: ["user/message", "assistant/message"] },
          { kind: "text", text: query }
        ]);
        const needle = query.toLowerCase();
        for (const doc of docs ?? []) {
          const text = typeof doc?.text === "string" ? doc.text : "";
          const at = text.toLowerCase().indexOf(needle);
          if (at < 0) continue;
          return {
            line: excerptAround(text, at, query.length),
            seq: typeof doc.seq === "number" ? doc.seq : null
          };
        }
        return null;
      };
      runtime.search = async (query, cwd) => {
        const corpus = runtime.sessionQuery;
        if (corpus === void 0) throw new Error("sessionQuery unavailable");
        const signal = new AbortController().signal;
        const scoped = typeof cwd === "string" && cwd !== "";
        const page = await corpus.searchSessions(
          scoped ? { query, limit: 10, filters: [{ kind: "cwd", values: [cwd] }] } : { query, limit: 10 },
          { signal }
        );
        const searchable = /* @__PURE__ */ new Set(["user/message", "assistant/message"]);
        const candidates = (page?.items ?? []).map((hit) => {
          const best = hit.bestMatch;
          const snippet = (best?.snippet ?? "").trim();
          const line = snippet.split(/\r?\n/).map((part) => part.trim()).find((part) => part !== "") ?? "";
          return {
            sessionId: hit.header?.id ?? hit.sessionId ?? "",
            type: typeof best?.type === "string" ? best.type : "",
            line,
            seq: typeof best?.seq === "number" ? best.seq : null
          };
        }).filter((entry) => entry.sessionId !== "");
        const verified = await Promise.all(candidates.slice(0, 6).map(async (entry) => {
          if (entry.type !== "" && !searchable.has(entry.type)) return null;
          try {
            const match = await visibleMatch(corpus, entry.sessionId, query);
            if (match === null) return null;
            return { sessionId: entry.sessionId, blocks: [[match.line]], seqs: [match.seq] };
          } catch {
            return entry.line === "" ? null : { sessionId: entry.sessionId, blocks: [[entry.line]], seqs: [entry.seq] };
          }
        }));
        const items = verified.filter((item) => item !== null);
        return { items, hasMore: page?.nextCursor !== void 0 };
      };
      runtime.searchSession = async (sessionId, query) => {
        const corpus = runtime.sessionQuery;
        if (corpus === void 0) throw new Error("sessionQuery unavailable");
        const signal = new AbortController().signal;
        const events = await corpus.searchEvents(
          {
            sessionId,
            query,
            limit: 6,
            filters: [{ kind: "type", values: ["user/message", "assistant/message"] }]
          },
          { signal }
        );
        const blocks = [];
        const seqs = [];
        for (const hit of events?.items ?? []) {
          const snippet = typeof hit?.snippet === "string" ? hit.snippet.trim() : "";
          if (snippet === "") continue;
          blocks.push([snippet.split(/\r?\n/).map((part) => part.trim()).find((part) => part !== "") ?? ""]);
          seqs.push(typeof hit?.seq === "number" ? hit.seq : null);
        }
        return { blocks, seqs };
      };
      runtime.searchContext = async (sessionId, seq, query) => {
        const corpus = runtime.sessionQuery;
        if (corpus === void 0) throw new Error("sessionQuery unavailable");
        const signal = new AbortController().signal;
        const eventWindow = await corpus.readEvent({ sessionId, seq, before: 6, after: 6 }, signal);
        const wanted = String(query ?? "").toLowerCase();
        const textOfEvent = (event) => {
          const data = event?.data ?? {};
          const content = Array.isArray(data.content) ? data.content : Array.isArray(data.message?.content) ? data.message.content : [];
          return textOfBlocks(content);
        };
        const conversationEvents = /* @__PURE__ */ new Set(["user/message", "assistant/message"]);
        const events = [eventWindow?.target, ...eventWindow?.events ?? []].filter((event) => event !== void 0 && conversationEvents.has(String(event.type ?? "")));
        const pick = events.map((event) => ({ event, text: String(textOfEvent(event) ?? "").trim() })).filter((entry) => entry.text !== "" && entry.text.toLowerCase().includes(wanted)).sort((a, b) => (b.event.seq ?? 0) - (a.event.seq ?? 0))[0];
        if (pick === void 0) return { lines: [] };
        const all = pick.text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== "");
        const at = all.findIndex((line) => line.toLowerCase().includes(wanted));
        if (all.length <= 1) {
          const flat = pick.text.replace(/\s+/g, " ");
          const index2 = Math.max(0, flat.toLowerCase().indexOf(wanted));
          const start = Math.max(0, index2 - 420);
          const end = Math.min(flat.length, index2 + 520);
          return { lines: [(start > 0 ? "…" : "") + flat.slice(start, end) + (end < flat.length ? "…" : "")] };
        }
        const index = at < 0 ? 0 : at;
        const from = Math.max(0, index - 6);
        const to = Math.min(all.length - 1, index + 6);
        const lines = all.slice(from, to + 1).map((line) => {
          if (line.length <= 400) return line;
          const hitAt = Math.max(0, line.toLowerCase().indexOf(wanted));
          return (hitAt > 140 ? "…" : "") + line.slice(Math.max(0, hitAt - 140), hitAt + 260) + "…";
        });
        return { lines };
      };
      void storeReady.then((store) => {
        if (runtime.digest !== pipeline) return;
        const missing = [...new Set([...store.cards.entries()].map(([, card]) => card.sessionId))].filter((sessionId) => {
          const digest = store.digests.get(sessionId);
          return digest === void 0 || digest.summary === "";
        });
        pipeline.backfill(missing);
      }).catch(() => void 0);
      return () => {
        offEdgeChanges();
        stop();
        if (runtime.digest === pipeline) delete runtime.digest;
      };
    }, "dsh-talk-pages: digest pipeline");
  });
  ctx.inject(["agentDefaultModel"], (injected) => {
    const services = injected;
    services.effect(() => {
      runtime.modelDefault = () => services.agentDefaultModel.currentSelection();
      return () => {
        delete runtime.modelDefault;
      };
    }, "dsh-talk-pages: model default");
  });
  ctx.inject(["sessionQuery"], (injected) => {
    const services = injected;
    services.effect(() => {
      runtime.sessionQuery = services.sessionQuery;
      return () => {
        if (runtime.sessionQuery === services.sessionQuery) delete runtime.sessionQuery;
      };
    }, "dsh-talk-pages: session query");
  });
  ctx.inject(["agentPresets"], (injected) => {
    const services = injected;
    services.effect(() => {
      runtime.presetDefault = () => services.agentPresets.defaultId;
      return () => {
        delete runtime.presetDefault;
      };
    }, "dsh-talk-pages: preset default");
  });
  ctx.inject(["agents", "sessionQuery", "workspaceRegistry"], (injected) => {
    const services = injected;
    services.effect(() => {
      const spawner = new Spawner(services, storeReady);
      runtime.spawner = spawner;
      return () => {
        if (runtime.spawner === spawner) delete runtime.spawner;
      };
    }, "dsh-talk-pages: spawner");
  });
}
export {
  apply,
  name
};
