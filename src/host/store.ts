/**
 * The talk-pages storage domain: canvas-private data only. Session content,
 * titles, and lineage stay with dsh's own services — this domain stores what
 * the map adds on top (positions, user-drawn injection edges, digests, and
 * per-board camera). Persisted by the profile's storage-json backend under
 * $DSH_HOME/storages/.
 *
 * CardId ≠ SessionId on purpose: a later "alias card" feature (the same
 * session appearing on several boards) then needs no migration.
 */
import { z } from 'zod'
import type { Domain, DomainSpec, KvTable } from './dsh-host.ts'

/** Storage unit names must match /^[a-z][a-z0-9_]*$/ — no hyphens. */
export const DOMAIN_NAME = 'talk_pages'
/** The bootstrap board every unfiled card lands on. */
export const INBOX_BOARD_ID = 'inbox'

export const boardSchema = z.object({
  name: z.string(),
  color: z.string(),
  order: z.number(),
  createdAt: z.number(),
  archivedAt: z.number().optional(),
  shelvedAt: z.number().optional(),
})
export type Board = z.infer<typeof boardSchema>

export const cardSchema = z.object({
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
  createdAt: z.number(),
})
export type Card = z.infer<typeof cardSchema>

/** A user-drawn container: geometry in global.wsFrames, colour in wsColors. */
export const boxSchema = z.object({
  pageId: z.string(),
  title: z.string(),
})
export type Box = z.infer<typeof boxSchema>

export const edgeInjectionSchema = z.object({
  /** 'link' = a plain association drawn between two EXISTING cards (no
   * spawn, no text); 'none' = a fork edge whose child inherited nothing. */
  kind: z.enum(['digest', 'full', 'selection', 'none', 'link']),
  /** What was actually injected (post-edit), kept for provenance display. */
  injectedText: z.string().optional(),
  /** Pipe mode (the edge menu's 开启自动推送): every substantive digest change
   * of the source session is pushed along this edge into the target session.
   * Declared here or the request schema strips it and the host can never see
   * the switch the client sets. */
  autoPush: z.boolean().optional(),
})
export const edgeSchema = z.object({
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
  createdAt: z.number(),
})
export type MapEdge = z.infer<typeof edgeSchema>

export const digestSchema = z.object({
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
  inputHash: z.string().optional(),
})
export type Digest = z.infer<typeof digestSchema>

export const cameraSchema = z.object({ x: z.number(), y: z.number(), zoom: z.number() })
export const globalSchema = z.object({
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
    height: z.number(),
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
  locale: z.enum(['auto', 'zh', 'en']).optional(),
  /** Last known placement per session — re-imports restore the arrangement. */
  layoutMemory: z.record(z.string(), z.object({
    x: z.number(),
    y: z.number(),
    colorTag: z.string().optional(),
  })).optional(),
})
export type MapGlobal = z.infer<typeof globalSchema>

export const TALK_MAP_SPEC: DomainSpec = {
  name: DOMAIN_NAME,
  version: 1,
  global: {
    schema: globalSchema,
    initial: { version: 1, activeBoard: INBOX_BOARD_ID, cameraByBoard: {} },
  },
  tables: {
    boards: { valueSchema: boardSchema },
    cards: { valueSchema: cardSchema },
    edges: { valueSchema: edgeSchema },
    digests: { valueSchema: digestSchema },
  },
}

/** Typed table handles over the untyped structural Domain. */
export interface TalkMapStore {
  domain: Domain
  boards: KvTable<Board>
  cards: KvTable<Card>
  edges: KvTable<MapEdge>
  digests: KvTable<Digest>
  global(): MapGlobal
  setGlobal(value: MapGlobal): Promise<void>
}

export async function openTalkMapStore(
  storageDomain: { open(spec: DomainSpec): Promise<Domain> },
): Promise<TalkMapStore> {
  const domain = await storageDomain.open(TALK_MAP_SPEC)
  const store: TalkMapStore = {
    domain,
    boards: domain.table('boards') as KvTable<Board>,
    cards: domain.table('cards') as KvTable<Card>,
    edges: domain.table('edges') as KvTable<MapEdge>,
    digests: domain.table('digests') as KvTable<Digest>,
    global: () => domain.global.get() as MapGlobal,
    setGlobal: value => domain.global.set(value),
  }
  if (store.boards.get(INBOX_BOARD_ID) === undefined) {
    await store.boards.put(INBOX_BOARD_ID, {
      name: 'Inbox',
      color: 'gray',
      order: 0,
      createdAt: Date.now(),
    })
  }
  return store
}
