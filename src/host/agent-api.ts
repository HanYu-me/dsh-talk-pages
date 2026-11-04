/**
 * Agent API: lets ANY conversation (or script) rearrange the map without
 * touching the browser or the dsh auth layer — by files.
 *
 *   <home>/talk-pages/map.json      read-only snapshot of the map (rewritten on every change)
 *   <home>/talk-pages/inbox/*.json  drop a command file here; it is applied within ~1s and moved to
 *                                   inbox/done/ (or inbox/failed/ + <name>.error.txt)
 *
 * <home> is $DSH_HOME or ~/.dsh. A command file is `{ "ops": [ ... ] }`; see
 * docs/AGENT.md for every op. All writes go through the same store the UI uses,
 * so connected maps pick them up live (SSE change + reload events).
 */
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, rename, watch, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { z } from 'zod'
import { emitReload } from './reload-bus.ts'
import type { Card, TalkMapStore } from './store.ts'

const num = z.number().finite()
const priority = z.union([z.literal(1), z.literal(2), z.literal(3)])

const opSchema = z.discriminatedUnion('op', [
  z.object({
    op: z.literal('createBox'),
    id: z.string().min(1).optional(),
    page: z.string().min(1),
    title: z.string(),
    x: num, y: num, width: num.positive(), height: num.positive(),
    color: z.string().optional(),
    free: z.boolean().optional(),
  }),
  z.object({
    op: z.literal('updateBox'),
    id: z.string().min(1),
    title: z.string().optional(),
    color: z.string().nullable().optional(),
    free: z.boolean().optional(),
    x: num.optional(), y: num.optional(), width: num.positive().optional(), height: num.positive().optional(),
  }),
  z.object({ op: z.literal('deleteBox'), id: z.string().min(1) }),
  z.object({
    op: z.literal('placeCards'),
    cards: z.array(z.object({
      session: z.string().min(1),
      x: num.optional(), y: num.optional(),
      box: z.string().nullable().optional(),
      priority: priority.nullable().optional(),
    })).min(1),
  }),
  z.object({ op: z.literal('setPriority'), session: z.string().min(1), priority: priority.nullable() }),
  z.object({ op: z.literal('removeCards'), sessions: z.array(z.string().min(1)).min(1) }),
  z.object({ op: z.literal('setPage'), page: z.string().min(1) }),
  z.object({ op: z.literal('setSnap'), enabled: z.boolean() }),
])
export type AgentOp = z.infer<typeof opSchema>
const commandSchema = z.object({ ops: z.array(opSchema).min(1).max(2000) })

export function agentDir(env: NodeJS.ProcessEnv = process.env): string {
  return join(env['DSH_HOME'] ?? join(homedir(), '.dsh'), 'talk-pages')
}

/** Snapshot an agent can read to know what is on the map. */
export function snapshot(store: TalkMapStore): Record<string, unknown> {
  const global = store.global()
  const cards = [...store.cards.entries()].map(([cardId, card]) => ({
    cardId,
    session: card.sessionId,
    x: card.x,
    y: card.y,
    ...(card.boxId !== undefined ? { box: card.boxId } : {}),
    ...(card.priority !== undefined ? { priority: card.priority } : {}),
  }))
  const boxes = Object.fromEntries(Object.entries(global.boxes ?? {}).map(([id, box]) => [id, {
    page: box.pageId,
    title: box.title,
    free: box.free === true,
    color: global.wsColors?.[id] ?? null,
    ...(global.wsFrames?.[id] ?? {}),
  }]))
  return {
    note: 'Read-only. Edit the map by dropping a command file into ./inbox (see docs/AGENT.md). A page id is a workspace id (see storages/workspace.json); sessions are dsh session ids. Card x/y are canvas units; a card is 224x120.',
    updatedAt: new Date().toISOString(),
    activePage: global.activePage ?? null,
    snap: global.snap !== false,
    boxes,
    cards,
  }
}

/** Apply one validated op list; returns a one-line summary. */
export async function applyOps(store: TalkMapStore, ops: readonly AgentOp[]): Promise<string> {
  let global = { ...store.global() }
  let cardsTouched = 0
  const cardOfSession = (session: string): [string, Card] | undefined =>
    [...store.cards.entries()].find(([, card]) => card.sessionId === session)
  const touchGlobal = (patch: Partial<typeof global>): void => { global = { ...global, ...patch } }

  for (const op of ops) {
    switch (op.op) {
      case 'createBox': {
        const id = op.id ?? `box-${randomUUID()}`
        touchGlobal({
          boxes: { ...global.boxes, [id]: { pageId: op.page, title: op.title, free: op.free ?? true } },
          wsFrames: { ...global.wsFrames, [id]: { x: op.x, y: op.y, width: op.width, height: op.height } },
          ...(op.color !== undefined ? { wsColors: { ...global.wsColors, [id]: op.color } } : {}),
        })
        break
      }
      case 'updateBox': {
        const box = global.boxes?.[op.id]
        if (box === undefined) throw new Error(`updateBox: unknown box ${op.id}`)
        const nextBox = { ...box, ...(op.title !== undefined ? { title: op.title } : {}), ...(op.free !== undefined ? { free: op.free } : {}) }
        const frame = global.wsFrames?.[op.id] ?? { x: 0, y: 0, width: 400, height: 300 }
        const wsColors = { ...global.wsColors }
        if (op.color === null) delete wsColors[op.id]
        else if (op.color !== undefined) wsColors[op.id] = op.color
        touchGlobal({
          boxes: { ...global.boxes, [op.id]: nextBox },
          wsFrames: { ...global.wsFrames, [op.id]: {
            x: op.x ?? frame.x, y: op.y ?? frame.y, width: op.width ?? frame.width, height: op.height ?? frame.height,
          } },
          wsColors,
        })
        break
      }
      case 'deleteBox': {
        for (const [cardId, card] of [...store.cards.entries()]) {
          if (card.boxId !== op.id) continue
          const { boxId: _removed, ...rest } = card
          await store.cards.put(cardId, rest)
          cardsTouched += 1
        }
        const boxes = { ...global.boxes }
        delete boxes[op.id]
        const wsFrames = { ...global.wsFrames }
        delete wsFrames[op.id]
        touchGlobal({ boxes, wsFrames })
        break
      }
      case 'placeCards': {
        for (const spec of op.cards) {
          const found = cardOfSession(spec.session)
          const [cardId, base]: [string, Card] = found ?? [`card-${randomUUID()}`, {
            boardId: 'inbox', sessionId: spec.session, x: 0, y: 0, createdAt: Date.now(),
          }]
          const next: Card = { ...base }
          if (spec.x !== undefined) next.x = spec.x
          if (spec.y !== undefined) next.y = spec.y
          if (spec.box === null) delete next.boxId
          else if (spec.box !== undefined) next.boxId = spec.box
          if (spec.priority === null) delete next.priority
          else if (spec.priority !== undefined) next.priority = spec.priority
          await store.cards.put(cardId, next)
          cardsTouched += 1
        }
        break
      }
      case 'setPriority': {
        const found = cardOfSession(op.session)
        if (found === undefined) throw new Error(`setPriority: session ${op.session} is not on the map`)
        const next: Card = { ...found[1] }
        if (op.priority === null) delete next.priority
        else next.priority = op.priority
        await store.cards.put(found[0], next)
        cardsTouched += 1
        break
      }
      case 'removeCards': {
        const ids = new Set<string>()
        for (const session of op.sessions) {
          const found = cardOfSession(session)
          if (found !== undefined) ids.add(found[0])
        }
        for (const id of ids) await store.cards.delete(id)
        for (const [edgeId, edge] of [...store.edges.entries()]) {
          if (ids.has(edge.fromCardId) || ids.has(edge.toCardId)) await store.edges.delete(edgeId)
        }
        cardsTouched += ids.size
        break
      }
      case 'setPage':
        touchGlobal({ activePage: op.page })
        break
      case 'setSnap':
        touchGlobal({ snap: op.enabled })
        break
    }
  }
  await store.setGlobal(global)
  return `${ops.length} op(s), ${cardsTouched} card(s) written`
}

/**
 * Start the agent API: keep map.json fresh and apply inbox files.
 * @returns disposer.
 */
export function startAgentApi(
  storeReady: Promise<TalkMapStore>,
  log: (message: string) => void,
  /** Subscribe to "the talk_pages domain changed"; returns the unsubscribe. */
  subscribeChanged: (listener: () => void) => () => void,
  dir: string = agentDir(),
): () => void {
  const inbox = join(dir, 'inbox')
  let disposed = false
  let writeTimer: ReturnType<typeof setTimeout> | undefined
  const abort = new AbortController()

  const writeSnapshot = async (): Promise<void> => {
    const store = await storeReady
    await mkdir(dir, { recursive: true })
    const tmp = join(dir, `.map.${process.pid}.tmp`)
    await writeFile(tmp, JSON.stringify(snapshot(store), null, 2))
    await rename(tmp, join(dir, 'map.json'))
  }
  const scheduleSnapshot = (): void => {
    if (disposed || writeTimer !== undefined) return
    writeTimer = setTimeout(() => {
      writeTimer = undefined
      writeSnapshot().catch((error) => { log(`[dsh-talk-pages] map.json write failed: ${String(error)}`) })
    }, 500)
    writeTimer.unref?.()
  }

  let unsubscribeChanged: (() => void) | undefined
  let draining = false
  const drain = async (): Promise<void> => {
    if (draining || disposed) return
    draining = true
    try {
      const store = await storeReady
      await mkdir(join(inbox, 'done'), { recursive: true })
      await mkdir(join(inbox, 'failed'), { recursive: true })
      const files = (await readdir(inbox)).filter(name => name.endsWith('.json')).sort()
      for (const name of files) {
        const path = join(inbox, name)
        try {
          const command = commandSchema.parse(JSON.parse(await readFile(path, 'utf8')))
          const summary = await applyOps(store, command.ops)
          await rename(path, join(inbox, 'done', `${Date.now()}-${name}`))
          log(`[dsh-talk-pages] agent command ${name}: ${summary}`)
        } catch (error) {
          await writeFile(join(inbox, 'failed', `${name}.error.txt`), String(error instanceof Error ? error.message : error))
          await rename(path, join(inbox, 'failed', name)).catch(() => undefined)
          log(`[dsh-talk-pages] agent command ${name} failed: ${String(error)}`)
        }
        emitReload()
      }
      if (files.length > 0) scheduleSnapshot()
    } catch (error) {
      log(`[dsh-talk-pages] agent inbox error: ${String(error)}`)
    } finally {
      draining = false
    }
  }

  void (async () => {
    try {
      await mkdir(join(inbox, 'done'), { recursive: true })
      const store = await storeReady
      void store
      await writeSnapshot()
      void drain()
      unsubscribeChanged = subscribeChanged(scheduleSnapshot)
      if (!existsSync(inbox)) return
      for await (const _event of watch(inbox, { signal: abort.signal, persistent: false })) {
        // A short pause lets a writer finish the file it is still writing.
        setTimeout(() => { void drain() }, 250).unref?.()
      }
    } catch (error) {
      if (!abort.signal.aborted) log(`[dsh-talk-pages] agent api stopped: ${String(error)}`)
    }
  })()
  // The watcher can miss events on some filesystems; a slow poll is the safety net.
  const poll = setInterval(() => { void drain() }, 5000)
  poll.unref?.()
  const snapshotPoll = setInterval(scheduleSnapshot, 15000)
  snapshotPoll.unref?.()

  return () => {
    disposed = true
    unsubscribeChanged?.()
    abort.abort()
    clearInterval(poll)
    clearInterval(snapshotPoll)
    if (writeTimer !== undefined) clearTimeout(writeTimer)
  }
}
