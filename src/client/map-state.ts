/**
 * Map UI state shared between the sidebar toggle button and the overlay —
 * two components registered into unrelated slots, so they meet through this
 * module-level external store (useSyncExternalStore on the React side).
 */
import type { ConnectionService, LayoutService, SessionsService, UiWorkspaceService, WorkspacesService } from './dsh.ts'

export interface MapUiState {
  readonly open: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()
let state: MapUiState = { open: false }

function emit(): void {
  for (const listener of listeners) listener()
}

/**
 * Escape routing: inner surfaces (draft card, spawn preview) claim Esc so
 * the overlay's own Esc-to-close stands down while one of them is open.
 */
const escGuards = new Set<string>()

export const mapUi = {
  get(): MapUiState {
    return state
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  /**
   * Mirror of "the map panel is the selected main panel". The panel component
   * drives it from its own mount/unmount — the shell owns the real selection.
   */
  setOpen(open: boolean): void {
    if (state.open === open) return
    state = { open }
    emit()
  },
  toggle(): void {
    if (state.open) closeMapPanel()
    else openMapPanel()
  },
  claimEscape(id: string): () => void {
    escGuards.add(id)
    return () => { escGuards.delete(id) }
  },
  escapeClaimed(): boolean {
    return escGuards.size > 0
  },
}

/**
 * Service handles captured at apply() time so components can navigate
 * (open/create sessions) without threading ctx through props.
 */
export interface MapServices {
  sessions: SessionsService
  workspaces: WorkspacesService
  connection: ConnectionService
  uiWorkspace?: UiWorkspaceService
  /** ctx.layout — panel navigation (selectPanel). */
  layout?: LayoutService
  /**
   * The client context itself, kept so services that were not registered when
   * apply() ran can still be resolved at click time (a cold boot activates this
   * plugin before ui-workspace has provided uiWorkspace).
   */
  ctx?: { get?: (name: string) => unknown }
}

/** Key of this plugin's `main` entry — the id `selectPanel` selects. */
export const MAP_PANEL_ID = 'talk-pages'

let services: MapServices | undefined

export function attachServices(next: MapServices | undefined): void {
  services = next
}

export function getServices(): MapServices | undefined {
  return services
}

/**
 * uiWorkspace, resolved as late as possible: the handle cached at apply() time
 * is undefined on a cold boot, because this plugin activates before
 * ui-workspace provides the service. Resolving per call costs one lookup and
 * makes the click correct in both cases.
 */
function resolveUiWorkspace(current: MapServices): UiWorkspaceService | undefined {
  if (current.uiWorkspace !== undefined) return current.uiWorkspace
  const get = current.ctx?.get
  if (typeof get !== 'function') return undefined
  try {
    const value = get.call(current.ctx, 'uiWorkspace')
    return value === undefined || value === null ? undefined : value as UiWorkspaceService
  } catch {
    return undefined
  }
}

/**
 * One-line structural report appended to the "services still starting up"
 * failure, so a screenshot of the error is enough to see what the runtime
 * actually exposes. Temporary: remove once the cold-boot path is settled.
 */
export function servicesDiag(): string {
  const s = getServices()
  const out: string[] = [`svc=${s === undefined ? 'none' : 'ok'}`]
  try { out.push(`conn=${typeof s?.connection}`) } catch { out.push('conn=?') }
  try { out.push(`connApi=${typeof s?.connection?.api}`) } catch { out.push('connApi=?') }
  try { out.push(`ctxGet=${typeof s?.ctx?.get}`) } catch { out.push('ctxGet=?') }
  try {
    const live = s?.ctx?.get?.('connection') as { api?: unknown } | undefined
    out.push(`liveConn=${typeof live}`, `liveConnApi=${typeof live?.api}`)
  } catch { out.push('liveConn=?') }
  try {
    const ui = s?.ctx?.get?.('uiWorkspace') as { startSession?: unknown } | undefined
    out.push(`liveUi=${typeof ui}`, `uiStart=${typeof ui?.startSession}`)
  } catch { out.push('liveUi=?') }
  return out.join(' ')
}

/** uiWorkspace resolved through the live context (see resolveUiWorkspace). */
export function uiWorkspaceService(): UiWorkspaceService | undefined {
  const current = getServices()
  return current === undefined ? undefined : resolveUiWorkspace(current)
}

/** ctx.layout, resolved as late as the click (same cold-boot trap as uiWorkspace). */
function resolveLayout(current: MapServices): LayoutService | undefined {
  if (current.layout !== undefined) return current.layout
  const get = current.ctx?.get
  if (typeof get !== 'function') return undefined
  try {
    const value = get.call(current.ctx, 'layout')
    return value === undefined || value === null ? undefined : value as LayoutService
  } catch {
    return undefined
  }
}

/**
 * Show the map in the centre column (`main` panel), the way the recycle bin or
 * the Plugins page do — a window over the conversation, not a frame-wide cover.
 * The shell keeps the current Session as the *previous* view, so a session that
 * finishes while the map is up still counts as unread and can glow.
 */
/**
 * The session the user was looking at, captured the moment the map takes over the
 * centre column. The shell persists it under `dsh.sessions.current`, but it may
 * be rewritten once a panel is selected, so read it BEFORE selecting the panel.
 */
let lastCurrentSessionId: string | undefined

function readCurrentSessionId(): string | undefined {
  if (typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem('dsh.sessions.current')
    if (raw === null || raw === '') return undefined
    const trimmed = raw.trim()
    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed) as { sessionId?: unknown; id?: unknown }
      const value = parsed.sessionId ?? parsed.id
      return typeof value === 'string' && value !== '' ? value : undefined
    }
    const bare = trimmed.replace(/^"|"$/g, '')
    return bare === '' || bare === 'null' ? undefined : bare
  } catch {
    return undefined
  }
}

/** The card that should render as "the tab you came from" (may be undefined). */
export function currentSessionId(): string | undefined {
  // Live read first: the shell keeps this current. The captured value is only a
  // fallback for the moment when selecting a panel clears it.
  const live = readCurrentSessionId()
  if (live !== undefined) {
    lastCurrentSessionId = live
    return live
  }
  return lastCurrentSessionId
}

export function openMapPanel(): void {
  lastCurrentSessionId = readCurrentSessionId()
  const current = getServices()
  const layout = current === undefined ? undefined : resolveLayout(current)
  if (layout === undefined) {
    mapUi.setOpen(true)
    return
  }
  try {
    layout.selectPanel(MAP_PANEL_ID)
  } catch (error) {
    console.error('[dsh-talk-pages] selectPanel failed:', error)
    mapUi.setOpen(true)
  }
}

/** Back to the conversation (the shell's own "show the Session" selection). */
export function closeMapPanel(): void {
  const current = getServices()
  const layout = current === undefined ? undefined : resolveLayout(current)
  if (layout === undefined) {
    mapUi.setOpen(false)
    return
  }
  try {
    layout.selectPanel(null)
  } catch (error) {
    console.error('[dsh-talk-pages] selectPanel(null) failed:', error)
    mapUi.setOpen(false)
  }
}

/**
 * Sidebar coordination. `ctx.layout` only exposes `toggleSidebar()`, with no way
 * to read the current state — so the sidebar's own footer action (this plugin's
 * button) reports whether it renders wide content, and the map only toggles when
 * it actually has to. The restore is remembered, so opening a session from the
 * map puts the sidebar back exactly the way the user had it.
 */
let sidebarWide: boolean | undefined
let sidebarHiddenByMap = false

/** The sidebar footer action reports its own owner prop (wide = expanded). */
export function reportSidebarWide(wide: boolean): void {
  sidebarWide = wide
}

/** Collapse the sidebar while the map owns the centre column. */
export function hideSidebarForMap(): void {
  if (sidebarHiddenByMap) return
  // Unknown state (button not mounted yet) or already a rail: leave it alone.
  if (sidebarWide !== true) return
  const current = getServices()
  const layout = current === undefined ? undefined : resolveLayout(current)
  if (layout === undefined) return
  try {
    layout.toggleSidebar()
    sidebarHiddenByMap = true
  } catch (error) {
    console.error('[dsh-talk-pages] collapsing the sidebar failed:', error)
  }
}

/** Put the sidebar back when the map goes away (closed, or a session opened). */
export function restoreSidebarAfterMap(): void {
  if (!sidebarHiddenByMap) return
  sidebarHiddenByMap = false
  const current = getServices()
  const layout = current === undefined ? undefined : resolveLayout(current)
  if (layout === undefined) return
  try {
    layout.toggleSidebar()
  } catch (error) {
    console.error('[dsh-talk-pages] restoring the sidebar failed:', error)
  }
}

/**
 * The RPC client behind `connection`, resolved as late as the click.
 *
 * `connection` is injected, but the object cached at apply() time can be a
 * pre-connection instance whose `.api` never appears — the same cold-boot trap
 * as uiWorkspace, which showed up as "界面服务还在初始化" on the map's draft card.
 */
/** The whole connection handle (the map needs pc, not just pi). */
export function connectionService(): ConnectionService | undefined {
  return services?.connection
}

export function connectionApi(): ConnectionService['api'] | undefined {
  const current = getServices()
  if (current === undefined) return undefined
  const direct = current.connection?.api
  if (direct !== undefined) return direct
  const get = current.ctx?.get
  if (typeof get !== 'function') return undefined
  try {
    const live = get.call(current.ctx, 'connection') as ConnectionService | undefined
    return live?.api
  } catch {
    return undefined
  }
}

/**
 * Session navigation. DSH's client runtime moved "open this session in the main
 * view" onto `ctx.uiWorkspace.openSession`; older builds carried
 * `ctx.sessions.open`. Probe both, and never swallow the failure silently: a
 * missing or throwing call used to close the map and leave the previous
 * conversation on screen with nothing to explain it.
 *
 * @returns whether a navigation call was issued.
 */
export function openSessionInUi(sessionId: string): boolean {
  const current = getServices()
  if (current === undefined) return false
  try {
    const ui = resolveUiWorkspace(current)
    if (ui !== undefined && typeof ui.openSession === 'function') {
      ui.openSession(sessionId)
      return true
    }
    if (typeof current.sessions.open === 'function') {
      current.sessions.open(sessionId)
      return true
    }
  } catch (error) {
    console.error('[dsh-talk-pages] opening session failed:', sessionId, error)
    return false
  }
  console.error('[dsh-talk-pages] this DSH build exposes no session navigation service; cannot open', sessionId)
  return false
}

/** Fork a Session through the Workspace service when the runtime has it. */
export function forkSessionInUi(sessionId: string): Promise<string> {
  const current = getServices()
  if (current === undefined) return Promise.reject(new Error('dsh-talk-pages: services are not attached'))
  const ui = resolveUiWorkspace(current)
  if (ui !== undefined && typeof ui.forkSession === 'function') return ui.forkSession(sessionId)
  if (typeof current.sessions.fork === 'function') return current.sessions.fork({ sessionId, increaseTitle: true })
  return Promise.reject(new Error('dsh-talk-pages: this DSH build exposes no fork API'))
}

/**
 * The board knows the live titles (renamed or not); surfaces outside it — the
 * header's global search panel — ask through this.
 */
let titleResolver: ((sessionId: string) => string | undefined) | undefined

export function setTitleResolver(resolver: ((sessionId: string) => string | undefined) | undefined): void {
  titleResolver = resolver
}

/** One-shot title for a session id (search results outside the board use it). */
export function sessionTitle(sessionId: string): string | undefined {
  const resolved = titleResolver?.(sessionId)
  if (resolved !== undefined && resolved !== '') return resolved
  const services = getServices()
  if (services === undefined) return undefined
  try {
    const snapshot = services.sessions.list().getSnapshot()
    return snapshot.byId[sessionId]?.displayTitle
  } catch {
    return undefined
  }
}
/**
 * The board publishes the full title table on every change; the searches read it
 * from here (the service read below is only a fallback for a cold start).
 */
let titleTable: { sessionId: string; title: string }[] = []

export function setTitleTable(next: { sessionId: string; title: string }[]): void {
  titleTable = next
}

/** Every known conversation title (search matches these too). */
export function allSessionTitles(): { sessionId: string; title: string }[] {
  if (titleTable.length > 0) return titleTable
  const services = getServices()
  if (services === undefined) return []
  try {
    const snapshot = services.sessions.list().getSnapshot()
    return Object.entries(snapshot.byId)
      .map(([sessionId, row]) => ({ sessionId, title: (row as { displayTitle?: string }).displayTitle ?? '' }))
      .filter(entry => entry.title !== '')
  } catch {
    return []
  }
}

/** Cards currently on the board (title + body) — the header search reads this. */
export interface CardTableEntry {
  cardId: string
  sessionId: string
  title: string
  preview: string
  workspaceTitle: string
}

let cardTable: CardTableEntry[] = []

export function setCardTable(next: CardTableEntry[]): void {
  cardTable = next
}

export function allCards(): CardTableEntry[] {
  return cardTable
}
