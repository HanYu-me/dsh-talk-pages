/**
 * Structural contracts for the DSH client-runtime surfaces this plugin
 * touches. Deliberately NOT imported from @deepseek-ai packages: this plugin
 * builds out-of-tree against rc-stage APIs, and a structural subset keeps the
 * compile surface pinned to exactly what we call (the pattern proven by
 * dsh-plugin-market). Source of truth — verify on dsh upgrades:
 *   packages/client/runtime/src/client/contract/sessions.ts
 *   packages/client/runtime/src/client/sessions/service.ts   (SessionSummary)
 *   packages/client/runtime/src/client/workspaces/service.ts
 *   packages/client/ui-slots/src/store.ts                    (SnapshotSelectorHook)
 *   packages/client/ui-layout/src/client/index.ts            ('shell.overlay')
 *   packages/client/ui-sidebar/src/client/contract/slots.ts  ('sidebar.footer.action')
 * all @ deepseek-harness 0.1.0-rc.6.
 */

/** Selector hook a slot's standard props deliver (subscribes the component). */
export type SnapshotSelectorHook<T> = <S>(sel: (state: T) => S, eq?: (a: S, b: S) => boolean) => S

/** One row of the sessions list feed (subset of SessionSummary we render). */
export interface SessionSummary {
  readonly id: string
  readonly title?: string
  readonly displayTitle: string
  readonly cwd?: string
  readonly agentPreset?: string
  /** Fork/subagent lineage — the free provenance edge on the map. */
  readonly parentId?: string
  readonly origin?: 'subagent'
  readonly running: boolean
  /** User interaction currently blocking this session (approval/question). */
  readonly pendingInteraction?: unknown
  /** Finished while not selected and not yet opened — the "done, unread" state. */
  readonly completed?: boolean
  readonly blank: boolean
  readonly updatedAt: number
  /** Reference sources currently holding this Session; mainView = on screen. */
  readonly retainedBy?: { readonly mainView?: number }
}

/**
 * One Session's live UI status. `ui-session` owns this projection: the list
 * rows carry no completion flag of their own, so this — not
 * `SessionSummary.completed` — is the only source of "finished, not read yet".
 */
export interface SessionStatusFact {
  readonly running?: boolean
  readonly pendingInteraction?: unknown
  /** Ran to completion while it was not the main view and has not been opened since. */
  readonly completionUnread?: boolean
}

/** The useSessions standard feed (subset). */
export interface SessionListState {
  readonly ids: readonly string[]
  readonly byId: Readonly<Record<string, SessionSummary>>
  readonly current?: string
}

/** The useWorkspaces standard feed (subset of WorkspaceListState/WorkspaceView). */
export interface WorkspaceView {
  readonly workspaceId: string
  readonly path: string
  readonly title: string
  readonly sessionIds: readonly string[]
}
export interface WorkspaceListState {
  readonly items: readonly WorkspaceView[]
  readonly recentWorkspaceId: string | undefined
  readonly baselinesReady?: boolean
  /** Sessions the sidebar shows as pinned (the same pin the map's menu flips). */
  readonly pinnedSessionIds?: readonly string[]
  /** Sessions currently in the archive. */
  readonly archivedSessionIds?: readonly string[]
}

/** Standard props every root-scope slot component receives. */
export interface RootSlotStandardProps {
  useSessions: SnapshotSelectorHook<SessionListState>
  useWorkspaces: SnapshotSelectorHook<WorkspaceListState>
  /**
   * Keyed by session id: ui-session's running / pending-interaction /
   * completion-reminder facts. Optional so a build without that hook degrades to
   * the list row's own fields instead of failing to render.
   */
  useSessionStatus?: SnapshotSelectorHook<ReadonlyMap<string, SessionStatusFact>>
}

/** Owner share of a 'sidebar.footer.action' entry. */
export interface SidebarFooterActionOwnerProps {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  wide: boolean
}

/** Slot registration options (subset of the register() surface we use). */
export interface SlotEntryOptions {
  name: string
  id?: string
  /** Keyed slots ('main') address their entry by key instead of id. */
  key?: string
  order?: number
  label?: string | (() => string)
  inject?: (...args: unknown[]) => unknown
}

/**
 * ctx.layout — panel navigation. `selectPanel(id)` shows a registered `main`
 * entry in the centre column without changing the current Session, which is the
 * whole point for this plugin: with a panel (and no Session) on screen, a
 * session that finishes is still "unread", so its card can glow.
 */
export interface LayoutService {
  selectPanel(panelId: string | null): void
}

/** ctx.slots — inject defers until the slot is declared; register returns a disposer. */
export interface SlotsService {
  inject(name: string, factory: () => (() => void) | Iterable<() => void>): void
  register(entry: SlotEntryOptions, component: unknown): () => void
}

/** ctx.sessions (ISessions subset). */
export interface SessionsService {
  readonly list: {
    getSnapshot(): SessionListState
    subscribe(listener: () => void): () => void
  }
  /**
   * Legacy navigation/build APIs. The client runtime moved "open this session
   * in the main view" to ctx.uiWorkspace (see UiWorkspaceService) and current
   * builds no longer carry any of these on ctx.sessions — they stay optional so
   * code can probe them instead of throwing a TypeError on the way to nowhere.
   */
  open?(id: string): void
  clear?(): void
  fork?(opts: { sessionId: string; atSeq?: number; increaseTitle?: boolean }): Promise<string>
}

/** ctx.remote's event channel (only the `$on` slice this plugin uses). */
export interface AlertSource {
  $on(event: string, listener: (...args: unknown[]) => void): () => void
}

/** ctx.uiWorkspace — Workspace navigation policy (the real session opener). */
export interface UiWorkspaceService {
  /** Reveal a Session in the main view (the sidebar's own click path). */
  openSession(sessionId: string): void
  /** dsh-native fork; the child carries the parent's history. */
  forkSession?(sessionId: string): Promise<string>
  /**
   * dsh's own "new session": creates the session through session.create (full
   * composition) and PRE-FILLS the composer with the first message. Returns
   * void — it never reveals the new session id.
   */
  startSession?(workspaceId?: string, options?: { prompt?: string; agentPreset?: string }): void
  /** Create-or-reuse a blank session in a workspace; resolves its id. */
  connectWorkspace?(workspaceId: string, options?: { agentPreset?: string }): Promise<string>
  /**
   * Pin/unpin — the SAME pin the sidebar's session menu flips, so the map and
   * the sidebar agree in both directions (state comes back through
   * `workspaces.list.pinnedSessionIds`).
   */
  pinSession?(sessionId: string): Promise<unknown>
  unpinSession?(sessionId: string): Promise<unknown>
  /** Archive a session (the shipped "归档"), optionally stopping its work. */
  archiveSession?(sessionId: string, options?: { stopActivity?: boolean }): Promise<void>
}

/** ctx.workspaces (subset): connectWorkspace reuses-or-creates the blank session. */
export interface WorkspacesService {
  connectWorkspace(workspaceId: string): Promise<string>
  startSession(workspaceId?: string): void
}

/** RPC envelopes (packages/host/apiproxy/src/api/rpc.ts): the fetch client
 * resolves RpcResponse — the ok/value union sits under `.result`. */
export type RpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: { code?: string; message?: string } }
export interface RpcEnvelope<T> {
  rpcId: string
  result: RpcResult<T>
}

/** One advisory model entry / provider group (session.models / llm.models). */
export interface ModelCatalogModel {
  id: string
  name: string
  reasoning?: { efforts: { id: string; name: string }[]; defaultEffort?: string }
}
export interface ModelProviderGroup {
  id: string
  name: string
  models: ModelCatalogModel[]
}

export interface AgentPresetEntry {
  id: string
  name?: string
  description?: string
}

/**
 * ctx.connection — the shared typed RPC client (ConnectionHandle.api subset;
 * packages/client/connection + packages/host/apiproxy/src/fetch/client.ts).
 */
/** connection.rpc.call(channel, endpoint, payload) — the real unary RPC face. */
export interface ConnectionRpc {
  call(
    channel: string,
    endpoint: string,
    payload: unknown,
    signal?: AbortSignal,
  ): Promise<{ ok: true; value: unknown } | { ok: false; error: { code: string; message: string } }>
}

export interface ConnectionService {
  /** Present on the live handle; the map prefers it over the legacy pi shape. */
  rpc?: ConnectionRpc
  api: {
    sessions: {
      create(payload: { workspaceId?: string; cwd?: string; sessionId?: string; agentPreset?: string }):
      Promise<RpcEnvelope<{ sessionId: string; agentPreset?: string }>>
      models(payload: { sessionId: string }):
      Promise<RpcEnvelope<{ current: unknown; groups?: ModelProviderGroup[] }>>
      selectModel(payload: { sessionId: string; provider: string; model: string; reasoningEffort?: string }):
      Promise<RpcEnvelope<{ selected: unknown }>>
      prompt(payload: {
        sessionId: string
        mode: 'queue' | 'steer'
        content: { type: 'text'; text: string }[]
        clientTimeZone?: string
      }): Promise<RpcEnvelope<{ accepted: true }>>
      /** sessionController.rename — "Rename one Session after explicitly resuming it". */
      rename(payload: { sessionId: string; title: string }):
      Promise<RpcEnvelope<{ title: string; seq: number }>>
    }
    workspace: {
      create(payload: { path: string }):
      Promise<RpcEnvelope<{ workspace: WorkspaceView; created: boolean }>>
    }
    llm: {
      models(payload: Record<string, never>):
      Promise<RpcEnvelope<{ groups: ModelProviderGroup[] }>>
    }
    agentPresets: {
      list(payload: Record<string, never>):
      Promise<RpcEnvelope<{ presets: readonly AgentPresetEntry[]; authorable: boolean; hasDocument: boolean }>>
    }
  }
}

/** The client cordis context surface this plugin relies on (structural). */
export interface TalkMapClientContext {
  slots: SlotsService
  sessions: SessionsService
  workspaces: WorkspacesService
  connection: ConnectionService
  /** Optional: absent on a runtime that has not loaded the workspace UI. */
  uiWorkspace?: UiWorkspaceService
  /** Optional: the forwarded Host event stream (api-session/error et al). */
  remote?: AlertSource
  /** Optional cordis service lookup, used to reach uiWorkspace without inject gating. */
  get?(name: string): unknown
  /**
   * cordis inject: runs the callback once every named service exists (and again
   * after a replacement). This is how a plugin that boots before `connection`
   * and `uiWorkspace` are ready gets their live handles.
   */
  inject?(deps: string[], run: (scoped: TalkMapClientContext) => void): unknown
  effect(callback: () => unknown, label?: string): void
}
