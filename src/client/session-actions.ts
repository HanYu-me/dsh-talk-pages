/**
 * Session lifecycle actions behind the map's context menu and batch bar.
 *
 * Delete goes THROUGH dsh-recycle-bin's own Host route (`dsh-session-recycle-bin/api`,
 * the exact path its own delete dialog posts to), so a card deleted here lands in
 * the same recycle bin, with the same "running work refuses" policy and the same
 * restorability. Archive and pin use the shipped client services, which keeps the
 * map and the sidebar in sync in both directions.
 */
import { uiWorkspaceService } from './map-state.ts'

const RECYCLE_BIN_ROUTE = 'dsh-session-recycle-bin/api'

interface RecycleBinReply {
  ok?: boolean
  message?: string
  code?: string
  trashedCount?: number
  archivedCount?: number
  failedCount?: number
  childCount?: number
}

async function postRecycleBin(body: Record<string, unknown>): Promise<RecycleBinReply> {
  const path = new URL(RECYCLE_BIN_ROUTE, document.baseURI).pathname
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  let payload: RecycleBinReply = {}
  try {
    payload = await response.json() as RecycleBinReply
  } catch {
    throw new Error(`回收站接口返回 HTTP ${response.status}`)
  }
  if (payload.ok !== true) throw new Error(payload.message ?? `回收站拒绝了请求（HTTP ${response.status}）`)
  return payload
}

/**
 * Is a recycle bin installed and answering? Its route is registered by the plugin, so a
 * missing plugin shows up as 404/405 on this path — that is the only signal there is.
 */
export async function recycleBinReady(): Promise<boolean> {
  try {
    const path = new URL(RECYCLE_BIN_ROUTE, document.baseURI).pathname
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'list' }),
      cache: 'no-store',
    })
    return response.status !== 404 && response.status !== 405
  } catch {
    return false
  }
}

/** How many attempts (and how long apart) to let the stops settle. */
const STOP_RETRIES = 10
const STOP_RETRY_DELAY_MS = 400

/** True when the bin refused because the session still holds work. */
function isBusyRefusal(error: unknown): boolean {
  const message = String((error as Error | undefined)?.message ?? error)
  return message.includes('still has work')
    || message.includes('session-open')
    || message.includes('still active')
}

/** Ask the shell to stop a session's work (turn, jobs, subagents, schedules). */
async function stopWork(sessionIds: readonly string[]): Promise<void> {
  const ui = uiWorkspaceService()
  if (ui === undefined || typeof ui.archiveSession !== 'function') return
  for (const sessionId of sessionIds) {
    // stopActivity asks the host to cancel the running work instead of refusing;
    // the archive write lands immediately and the stops settle in the background.
    await ui.archiveSession(sessionId, { stopActivity: true }).catch(() => {})
  }
}

/**
 * Move sessions into the recycle bin (via dsh-recycle-bin). Returns how many.
 *
 * A session that is still running is stopped first and then moved — the card's
 * 删除 means "get rid of this", not "tell me it is busy".
 */
export async function trashSessions(
  sessionIds: readonly string[],
  /** Called once when the move was refused and work is being stopped first. */
  onStopping?: () => void,
): Promise<number> {
  const ids = [...sessionIds]
  if (ids.length === 0) return 0
  const attempt = async (): Promise<number> => {
    const reply = ids.length === 1
      ? await postRecycleBin({ action: 'trash', sessionId: ids[0] })
      : await postRecycleBin({ action: 'trashMany', sessionIds: ids })
    return reply.trashedCount ?? ids.length
  }
  try {
    return await attempt()
  } catch (error) {
    if (!isBusyRefusal(error)) throw error
    onStopping?.()
    await stopWork(ids)
    let last = error
    for (let round = 0; round < STOP_RETRIES; round += 1) {
      await new Promise(resolve => setTimeout(resolve, STOP_RETRY_DELAY_MS))
      try {
        return await attempt()
      } catch (retryError) {
        last = retryError
        if (!isBusyRefusal(retryError)) throw retryError
      }
    }
    throw last
  }
}

/** Archive sessions through the shipped workspace service. Returns how many. */
export async function archiveSessions(sessionIds: readonly string[]): Promise<number> {
  const ui = uiWorkspaceService()
  if (ui === undefined || typeof ui.archiveSession !== 'function') {
    throw new Error('这个构建没有暴露归档接口')
  }
  let done = 0
  for (const sessionId of sessionIds) {
    await ui.archiveSession(sessionId, { stopActivity: true })
    done += 1
  }
  return done
}

/** Flip the shipped pin (the sidebar's own 置顶). */
export async function setPinned(sessionId: string, pinned: boolean): Promise<void> {
  const ui = uiWorkspaceService()
  const call = pinned ? ui?.pinSession : ui?.unpinSession
  if (ui === undefined || typeof call !== 'function') {
    throw new Error('这个构建没有暴露置顶接口')
  }
  await call.call(ui, sessionId)
}


/**
 * The Host's own delete, not the recycle-bin plugin's: \`session/delete\` is the endpoint
 * the app itself uses (AGENT_METHODS.session_delete). It removes the conversation for good
 * — nothing lands in a bin, so the caller must confirm first.
 */
export async function deleteSessionsDirect(sessionIds: readonly string[]): Promise<void> {
  let firstFailure: string | undefined
  for (const sessionId of sessionIds) {
    try {
      await callRpc('session/delete', { sessionId })
    } catch (error) {
      firstFailure ??= (error as Error).message
    }
  }
  if (firstFailure !== undefined) throw new Error(firstFailure)
}

/** \`workspaceController.deleteWorkspace\` — drops the registration, keeps files/sessions. */
export async function deleteWorkspaceRegistration(workspaceId: string): Promise<void> {
  try {
    await callRpc('workspace/delete', { workspaceId })
  } catch {
    // The registration may already be gone (or the id was never registered); the board
    // cleanup below still has to happen, so a missing registration is not an error here.
  }
}
