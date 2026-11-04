/**
 * Tiny in-process bus: the agent API (host/agent-api.ts) changes the canvas
 * without going through the browser, so it tells connected maps to re-sync
 * (routes.ts forwards this as the SSE `reload` event).
 */
const listeners = new Set<() => void>()

export function onReload(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function emitReload(): void {
  for (const listener of listeners) listener()
}
