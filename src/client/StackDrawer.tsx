/**
 * The drawer behind a folder's stack cell: every conversation of that
 * workspace, at 1:1 size (224px wide — exactly what the map looks like at
 * 100% zoom), in a multi-column grid. The wheel pages one ROW at a time, like a
 * phone's app drawer.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { mapUi } from './map-state.ts'
import { t } from './i18n.ts'
import { relativeTime, LAMP_CHIP } from './SessionCard.tsx'
import type { CardGlow } from './SessionCard.tsx'
import { drawerState } from './drawer-state.ts'
import { loadSearch, saveSearch } from './search-store.ts'
import { SearchResults } from './SearchResults.tsx'
import { routeEdge, roundedPath } from './edge-route.ts'
import { pickFaces } from './edge-routing.ts'
import styles from './talk-pages.module.css'
const LAMP_CLASS: Record<CardGlow, string> = {
  running: 'cardLampRunning',
  done: 'cardLampDone',
  error: 'cardLampError',
  waiting: 'cardLampWaiting',
}

/**
 * Pitch of one grid row. The cards sit in a multi-column grid, so the step is
 * the distance between the first card of this row and the first card of the
 * next one (falling back to a single card's height when there is only one row).
 */
function rowStep(scroller: HTMLElement): number {
  const cards = [...scroller.querySelectorAll('[data-stack-card]')] as HTMLElement[]
  const first = cards[0]
  if (first === undefined) return 140
  const nextRow = cards.find(card => card.offsetTop > first.offsetTop + 2)
  if (nextRow !== undefined) return nextRow.offsetTop - first.offsetTop
  return first.offsetHeight + 12
}

/** Split `text` around every occurrence of `query` and mark the matches. */
function highlight(text: string, query: string): React.ReactNode[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [text]
  const haystack = text.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  let key = 0
  while (cursor < text.length) {
    const at = haystack.indexOf(needle, cursor)
    if (at < 0) { parts.push(text.slice(cursor)); break }
    if (at > cursor) parts.push(text.slice(cursor, at))
    parts.push(<mark key={key++} className={styles['hitMark']}>{text.slice(at, at + needle.length)}</mark>)
    cursor = at + needle.length
  }
  return parts
}

/** The Host answers this when the deployment turned the session index off. */
function isIndexDisabled(message: string): boolean {
  return message.includes('search is disabled') || message.includes('SESSION_QUERY_SEARCH_DISABLED')
}

/**
 * One conversation that matched. Each match is a small block of context
 * lines (one above / the match / one below), so a session with several hits
 * is ONE section with several blocks.
 */
export interface DrawerSearchHit {
  sessionId: string
  title: string
  blocks: string[][]
  /** Event seq per block, when the Host supplied one. */
  seqs?: (number | null)[]
  /** Per-match author: your message or the agent's answer. */
  roles?: (string | null)[]
  /** This conversation matched by title rather than content. */
  byTitle?: boolean
  /** Main conversation, or one an agent spawned. */
  agent?: 'main' | 'subagent'
  depth?: number
}

export interface StackEntry {
  cardId: string
  sessionId: string
  title: string
  /** The user's latest message (card body). */
  preview?: string
  nextStep?: string
  updatedAt?: number
  running?: boolean
  glow?: CardGlow
  /** Unsent text sits in this conversation's composer. */
  pendingDraft?: boolean
  /** Its last run was cut off by closing the app. */
  interrupted?: boolean
  /** Pinned in the sidebar. */
  pinned?: boolean
  /** Connections to other cards of the same folder (injection direction). */
  links?: { toCardId: string; title: string; kind: string; outgoing: boolean }[]
}

/** One line to draw behind the drawer cards. */
/** One line to draw behind the drawer cards. */
export interface DrawerWire {
  from: string
  to: string
  /** False = the canvas draws nothing for this pair, so neither do we. */
  visible: boolean
}

export interface StackDrawerProps {
  /** Storage scope of this folder's search. */
  groupId: string
  workspaceTitle: string
  items: readonly StackEntry[]
  onOpenCard: (cardId: string) => void
  /** Right-click on a card: the same card menu the grid uses. */
  onCardMenu?: (cardId: string, event: React.MouseEvent) => void
  /**
   * Full-text search across EVERY conversation (the Host session/search).
   * Absent = the drawer only filters its own titles.
   */
  onSearchContent?: (query: string) => Promise<DrawerSearchHit[]>
  /** Open a session found by the content search, ideally at that event. */
  onOpenSession?: (sessionId: string, q?: string) => void
  /** Every extra hit inside one conversation, loaded on demand. */
  onFetchSessionHits?: (sessionId: string, query: string) => Promise<{
    blocks: string[][]
    seqs: (number | null)[]
  }>
  /** The passage around one hit — fetched on hover, not with the search. */
  onFetchContext?: (sessionId: string, seq: number, query: string) => Promise<string[]>
  /**
   * Card-to-card links among these items, drawn behind the cards as glowing
   * lines — the drawer used to show nothing but text chips between rows.
   */
  links?: readonly DrawerWire[]
  /** A drag inside the drawer landed: `cardId` now sits at `index`. */
  onReorder?: (cardId: string, index: number) => void
  onClose: () => void
}

export function StackDrawer(props: StackDrawerProps): React.JSX.Element {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  /** Measured connector lines: curved paths in scroller coordinates. */
  const [wires, setWires] = useState<{ d: string; ax: number; ay: number; angle: number; from?: string; to?: string }[]>([])
  const [wireSize, setWireSize] = useState({ width: 0, height: 0 })
  const remembered = loadSearch<DrawerSearchHit>('drawer:' + props.groupId)
  const [query, setQuery] = useState(remembered?.query ?? '')
  const [hits, setHits] = useState<DrawerSearchHit[]>(remembered?.hits ?? [])
  const [searching, setSearching] = useState(false)
  /** The card being dragged inside the drawer, and where it would land. */
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  /** The passage under the pointer, in a floating box (null = nothing). */

  // The title filter is instant and local. The content search costs a corpus
  // query, so it runs only when the user submits (Enter or the 搜索 button) —
  // not on every keystroke.
  const runSearch = async (): Promise<void> => {
    const trimmed = query.trim()
    if (trimmed.length < 2 || props.onSearchContent === undefined) {
      setHits([])
      setSearchError(null)
      return
    }
    setSearching(true)
    try {
      const found = await props.onSearchContent(trimmed)
      setHits(found)
      saveSearch('drawer:' + props.groupId, { query: trimmed, hits: found })
      setSearchError(null)
    } catch (cause) {
      console.warn('[dsh-talk-pages] content search failed:', cause)
      setHits([])
      setSearchError(String((cause as Error)?.message ?? cause))
    } finally {
      setSearching(false)
    }
  }

  const needle = query.trim().toLowerCase()
  const visibleItems = needle === ''
    ? props.items
    : props.items.filter(item => item.title.toLowerCase().includes(needle))

  /**
   * Rebuild the connector paths whenever the layout can have changed: the item
   * list, the filter, a resize, or the font scale. Positions come from the real
   * DOM, so the lines always match what the user sees.
   */
  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    // Synced pairs show no line at all, same as on the map.
    const links = (props.links ?? []).filter(link => link.visible)
    if (scroller === null || links.length === 0) {
      setWires(current => (current.length === 0 ? current : []))
      return
    }
    const measure = (): void => {
      const boxOf = (cardId: string): DOMRect | null => {
        const element = scroller.querySelector(`[data-card-id="${cardId}"]`)
        if (element === null) return null
        const rect = element.getBoundingClientRect()
        const base = scroller.getBoundingClientRect()
        return new DOMRect(
          rect.left - base.left + scroller.scrollLeft,
          rect.top - base.top + scroller.scrollTop,
          rect.width,
          rect.height,
        )
      }
      // Every drawn card, as a routing obstacle and as geometry for pickFaces.
      const cardsInDrawer = [...scroller.querySelectorAll('[data-card-id]')]
        .map(element => {
          const box = element.getBoundingClientRect()
          const base = scroller.getBoundingClientRect()
          return {
            id: element.getAttribute('data-card-id') ?? '',
            x: box.left - base.left + scroller.scrollLeft,
            y: box.top - base.top + scroller.scrollTop,
            w: box.width,
            h: box.height,
          }
        })
      const next: { d: string; ax: number; ay: number; angle: number; from?: string; to?: string }[] = []
      let wireIndex = 0
      for (const link of links) {
        const from = boxOf(link.from)
        const to = boxOf(link.to)
        if (from === null || to === null) continue
        // Same rule and the same geometry as the map: faces from the shared
        // rule, path from the obstacle-avoiding router (gap centres, not card
        // bodies).
        const rectOf = (box: DOMRect) => ({ x: box.x, y: box.y, w: box.width, h: box.height })
        const fromRect = rectOf(from)
        const toRect = rectOf(to)
        const obstacles = cardsInDrawer
          .filter(card => card.id !== link.from && card.id !== link.to)
          .map(rectOf)
        const faces = pickFaces(
          { id: link.from, x: fromRect.x, y: fromRect.y },
          { id: link.to, x: toRect.x, y: toRect.y },
          cardsInDrawer.map(card => ({ id: card.id, x: card.x, y: card.y })),
          { cardWidth: fromRect.w, cardHeight: fromRect.h },
        )
        // Verify the drawn line; if it would touch a card, sweep every face pair. The
        // drawer's grid is dense and the geometry-only face rule is not always the pair
        // that can actually get there without crossing.
        const contentWidth = scroller.scrollWidth
        const contentHeight = scroller.scrollHeight
        const boundsWidth = scroller.scrollWidth
        const boundsHeight = scroller.scrollHeight
        const dirty = (candidate: { x: number; y: number }[]): number => {
          let hits = 0
          for (let index = 1; index < candidate.length; index += 1) {
            const a = candidate[index - 1]!
            const b = candidate[index]!
            const steps = Math.max(2, Math.ceil((Math.abs(b.x - a.x) + Math.abs(b.y - a.y)) / 2))
            for (let step = 0; step <= steps; step += 1) {
              const ratio = step / steps
              const point = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio }
              for (const box of obstacles) {
                if (point.x > box.x + 1 && point.x < box.x + box.w - 1
                  && point.y > box.y + 1 && point.y < box.y + box.h - 1) hits += 1
              }
              // The two endpoint cards count too, except right at their anchors: a route
              // that dives through its own card (over the top and back down inside it)
              // looks as broken as one through a neighbour.
              for (const endpoint of [fromRect, toRect]) {
                if (point.x <= endpoint.x + 1 || point.x >= endpoint.x + endpoint.w - 1) continue
                if (point.y <= endpoint.y + 1 || point.y >= endpoint.y + endpoint.h - 1) continue
                const away = Math.min(
                  Math.hypot(point.x - (endpoint.x + endpoint.w / 2), point.y - endpoint.y),
                  Math.hypot(point.x - (endpoint.x + endpoint.w / 2), point.y - (endpoint.y + endpoint.h)),
                  Math.hypot(point.x - endpoint.x, point.y - (endpoint.y + endpoint.h / 2)),
                  Math.hypot(point.x - (endpoint.x + endpoint.w), point.y - (endpoint.y + endpoint.h / 2)),
                )
                if (away > 14) hits += 1
              }
              // A route may not leave the drawer's content box: for a card on the top row
              // "out of the top face" puts the line above the first row, i.e. outside the
              // panel, where it just looks broken.
              if (point.x < 2 || point.y < 2 || point.x > boundsWidth - 2 || point.y > boundsHeight - 2) hits += 1
            }
          }
          return hits
        }
        // A curve, not an orthogonal route. The drawer's grid is dense, and forcing the line
        // to run in the gutters produced long detours and the odd wrap. What is wanted is
        // the simplest visible connection: a smooth curve between the two facing edges that
        // does not overlap a card and stays inside the panel.
        const sideOf = (
          rect: { x: number; y: number; w: number; h: number },
          other: { x: number; y: number; w: number; h: number },
        ): 't' | 'r' | 'b' | 'l' => {
          const dx = (other.x + other.w / 2) - (rect.x + rect.w / 2)
          const dy = (other.y + other.h / 2) - (rect.y + rect.h / 2)
          if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'r' : 'l'
          return dy >= 0 ? 'b' : 't'
        }
        const anchorOf = (rect: { x: number; y: number; w: number; h: number }, side: 't' | 'r' | 'b' | 'l') =>
          side === 't' ? { x: rect.x + rect.w / 2, y: rect.y }
            : side === 'b' ? { x: rect.x + rect.w / 2, y: rect.y + rect.h }
              : side === 'l' ? { x: rect.x, y: rect.y + rect.h / 2 }
                : { x: rect.x + rect.w, y: rect.y + rect.h / 2 }
        const normalOf = (side: 't' | 'r' | 'b' | 'l') =>
          side === 't' ? { x: 0, y: -1 } : side === 'b' ? { x: 0, y: 1 }
            : side === 'l' ? { x: -1, y: 0 } : { x: 1, y: 0 }

        const fromSide = sideOf(fromRect, toRect)
        const toSide = sideOf(toRect, fromRect)
        const startPoint = anchorOf(fromRect, fromSide)
        const endPoint = anchorOf(toRect, toSide)
        const startNormal = normalOf(fromSide)
        const endNormal = normalOf(toSide)
        const span = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y)

        /** Sampled points that sit inside a card or outside the panel. */
        const badness = (sample: (t: number) => { x: number; y: number }): number => {
          let bad = 0
          for (let step = 0; step <= 40; step += 1) {
            const point = sample(step / 40)
            if (point.x < 6 || point.y < 6 || point.x > boundsWidth - 6 || point.y > boundsHeight - 6) bad += 1
            for (const card of cardsInDrawer) {
              if (point.x <= card.x + 2 || point.x >= card.x + card.w - 2) continue
              if (point.y <= card.y + 2 || point.y >= card.y + card.h - 2) continue
              const own = card.id === link.from || card.id === link.to
              const nearStart = Math.hypot(point.x - startPoint.x, point.y - startPoint.y) < 18
              const nearEnd = Math.hypot(point.x - endPoint.x, point.y - endPoint.y) < 18
              if (own && (nearStart || nearEnd)) continue
              bad += 1
            }
          }
          return bad
        }

        // Candidates, in order of how "direct" they look:
        //   1. a curve that bows out along the face normals (works for neighbours),
        //   2. a curve that goes round the pair through a waypoint above / below /
        //      left / right (needed when another card sits between the two).
        let bestD: string | undefined
        let bestCost = Number.POSITIVE_INFINITY
        // Direction of travel at the very end of the chosen shape (pointing into the card).
        let arrival = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y }
        const tryCurve = (
          control1: { x: number; y: number },
          control2: { x: number; y: number },
        ): void => {
          const u1 = (t: number) => (1 - t) * (1 - t) * (1 - t)
          const u2 = (t: number) => 3 * (1 - t) * (1 - t) * t
          const u3 = (t: number) => 3 * (1 - t) * t * t
          const u4 = (t: number) => t * t * t
          const sample = (t: number) => ({
            x: u1(t) * startPoint.x + u2(t) * control1.x + u3(t) * control2.x + u4(t) * endPoint.x,
            y: u1(t) * startPoint.y + u2(t) * control1.y + u3(t) * control2.y + u4(t) * endPoint.y,
          })
          const cost = badness(sample)
          if (cost < bestCost) {
            bestCost = cost
            bestD = 'M ' + startPoint.x + ' ' + startPoint.y
              + ' C ' + control1.x + ' ' + control1.y + ', ' + control2.x + ' ' + control2.y
              + ', ' + endPoint.x + ' ' + endPoint.y
            arrival = { x: endPoint.x - control2.x, y: endPoint.y - control2.y }
          }
        }

        for (const bow of [0.15, 0.3, 0.5, 0.75, 1.1]) {
          const reach = Math.max(18, span * bow)
          const c1 = { x: startPoint.x + startNormal.x * reach, y: startPoint.y + startNormal.y * reach }
          const c2 = { x: endPoint.x + endNormal.x * reach, y: endPoint.y + endNormal.y * reach }
          tryCurve(c1, c2)
          if (bestCost === 0) break
        }

        // Detours: a waypoint clear of both cards, clamped inside the panel.
        if (bestCost > 0) {
          const pad = 10
          const pairTop = Math.min(fromRect.y, toRect.y)
          const pairBottom = Math.max(fromRect.y + fromRect.h, toRect.y + toRect.h)
          const pairLeft = Math.min(fromRect.x, toRect.x)
          const pairRight = Math.max(fromRect.x + fromRect.w, toRect.x + toRect.w)
          const midX = (startPoint.x + endPoint.x) / 2
          const midY = (startPoint.y + endPoint.y) / 2
          const waypoints = [
            { x: midX, y: Math.max(pad, pairTop - 16) },
            { x: midX, y: Math.min(boundsHeight - pad, pairBottom + 16) },
            { x: Math.max(pad, pairLeft - 16), y: midY },
            { x: Math.min(boundsWidth - pad, pairRight + 16), y: midY },
          ]
          for (const waypoint of waypoints) {
            // Both control points at the waypoint: the curve leaves along the normal,
            // sweeps through the waypoint area and comes into the target face.
            tryCurve(waypoint, waypoint)
            if (bestCost === 0) break
          }
        }
        // A curve cannot always avoid the cards: between two neighbouring columns a card
        // fills the whole span, so the line has to run in a gutter first. Keep the curve
        // for the pretty cases, fall back to a gutter polyline when it is not clean.
        if (bestCost > 0) {
          // Lanes from the real boxes: rows are as tall as their tallest card, so the gap
          // has to be measured between a row's bottom edge and the next row's top edge.
          const bands = (edges: { start: number; end: number }[]): number[] => {
            const sorted = [...edges].sort((a, b) => a.start - b.start)
            const lanes: number[] = []
            let reach = Number.NEGATIVE_INFINITY
            for (const edge of sorted) {
              if (edge.start > reach && Number.isFinite(reach)) lanes.push((reach + edge.start) / 2)
              reach = Math.max(reach, edge.end)
            }
            if (sorted.length > 0) {
              lanes.unshift(Math.max(8, sorted[0]!.start - 14))
              lanes.push(reach + 14)
            }
            return lanes
          }
          const samplePolyline = (points: { x: number; y: number }[]) => (t: number) => {
            let total = 0
            for (let index = 1; index < points.length; index += 1) {
              total += Math.abs(points[index]!.x - points[index - 1]!.x) + Math.abs(points[index]!.y - points[index - 1]!.y)
            }
            let walked = 0
            const target = t * total
            for (let index = 1; index < points.length; index += 1) {
              const a = points[index - 1]!
              const b = points[index]!
              const length = Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
              if (walked + length >= target || index === points.length - 1) {
                const ratio = length === 0 ? 0 : Math.min(1, (target - walked) / length)
                return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio }
              }
              walked += length
            }
            return points[points.length - 1]!
          }
          const midY = (startPoint.y + endPoint.y) / 2
          const midX = (startPoint.x + endPoint.x) / 2
          const lanesY = bands(cardsInDrawer.map(card => ({ start: card.y, end: card.y + card.h })))
            .sort((a, b) => Math.abs(a - midY) - Math.abs(b - midY))
          const lanesX = bands(cardsInDrawer.map(card => ({ start: card.x, end: card.x + card.w })))
            .sort((a, b) => Math.abs(a - midX) - Math.abs(b - midX))
          // Stubs along the face normals: without them the first/last leg can run along a
          // card's own edge and the arrow ends up pointing out of the card.
          const startStub = { x: startPoint.x + startNormal.x * 12, y: startPoint.y + startNormal.y * 12 }
          const endStub = { x: endPoint.x + endNormal.x * 12, y: endPoint.y + endNormal.y * 12 }
          // Wires that pick the same gutter would be drawn on top of each other, which reads
          // as one thick line. Give each one a stable small offset inside the gap.
          // Spread by position in the list: neighbouring links then never share a lane,
          // which is what made several wires look like one thick line.
          const laneOffset = ((wireIndex % 7) - 3) * 1.3
          const shapes: { x: number; y: number }[][] = []
          for (const lane of lanesY) {
            const at = lane + laneOffset
            shapes.push([
              startPoint, startStub, { x: startStub.x, y: at }, { x: endStub.x, y: at }, endStub, endPoint,
            ])
          }
          for (const lane of lanesX) {
            const at = lane + laneOffset
            shapes.push([
              startPoint, startStub, { x: at, y: startStub.y }, { x: at, y: endStub.y }, endStub, endPoint,
            ])
          }
          for (const shape of shapes) {
            const cost = badness(samplePolyline(shape))
            if (cost < bestCost) {
              bestCost = cost
              bestD = roundedPath(shape as never, 10)
              arrival = { x: endPoint.x - endStub.x, y: endPoint.y - endStub.y }
              if (cost === 0) break
            }
          }
        }

        // Arrow direction straight from the chosen geometry: a curve arrives along
        // end - control2, a polyline along its last leg. Parsing the path string got this
        // wrong for rounded corners, which is why arrows pointed sideways.
        const angle = Math.abs(arrival.x) < 0.5 && Math.abs(arrival.y) < 0.5
          ? (toSide === 'l' ? 180 : toSide === 'r' ? 0 : toSide === 't' ? -90 : 90)
          : Math.abs(arrival.x) >= Math.abs(arrival.y)
            ? (arrival.x >= 0 ? 0 : 180)
            : (arrival.y >= 0 ? 90 : -90)
        // The glyph's tip sits at the origin with its body behind, so rotating by the
        // travel direction points it into the card.
        const arrowAngle = angle

        wireIndex += 1
        next.push({
          d: bestD ?? ('M ' + startPoint.x + ' ' + startPoint.y + ' L ' + endPoint.x + ' ' + endPoint.y),
          ax: endPoint.x - endNormal.x * 2.5,
          ay: endPoint.y - endNormal.y * 2.5,
          angle: arrowAngle,
          from: link.from,
          to: link.to,
        })
      }
      // Only touch state when something actually moved: the parent may
      // re-render for unrelated reasons, and a blind setState here loops.
      setWires((current) => {
        if (current.length === next.length && current.every((wire, index) => wire.d === next[index]?.d)) {
          return current
        }
        return next
      })
      const width = Math.round(scroller.scrollWidth)
      const height = Math.round(scroller.scrollHeight)
      setWireSize((current) => (
        current.width === width && current.height === height ? current : { width, height }
      ))
    }
    measure()
    const observer = new ResizeObserver(() => { measure() })
    observer.observe(scroller)
    // Measure every frame until the geometry stops moving: the drawer animates open,
    // and a wire computed from mid-animation rects keeps its wrong shape for ever
    // (that is the "错位" — the arrow ends tens of pixels away from its card).
    let signature = ''
    let stableFrames = 0
    let frame = 0
    const tick = (): void => {
      measure()
      const next = [...scroller.querySelectorAll('[data-card-id]')]
        .map(element => { const r = element.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}` })
        .join('|')
      stableFrames = next === signature ? stableFrames + 1 : 0
      signature = next
      frame += 1
      if (stableFrames < 3 || frame < 12) { raf = window.requestAnimationFrame(tick) }
    }
    let raf = window.requestAnimationFrame(tick)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(raf)
    }
  }, [props.links, props.items, query, visibleItems.length])
  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller === null) return
    scroller.scrollTop = drawerState.readScroll()
  }, [])

  useEffect(() => {
    const release = mapUi.claimEscape('stack-drawer')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      requestClose()
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      release()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Wheel scrolling is the browser’s own: the old handler called
  // preventDefault + scrollBy({behavior: smooth}) per notch, which queued one
  // animation per event (that is what felt sticky and slow).
  // Peeking is suppressed while the list is moving, otherwise every row that
  // slides under the pointer would schedule a popover.
  const lastScrollAt = useRef(0)
  /** Play the leave animation before the panel is unmounted. */
  const [leaving, setLeaving] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const requestClose = (): void => {
    if (leaving) return
    setLeaving(true)
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null
      props.onClose()
    }, 130)
  }
  useEffect(() => () => {
    if (leaveTimer.current !== null) window.clearTimeout(leaveTimer.current)
  }, [])
  const scrollSaveTimer = useRef<number | null>(null)

  /** Which slot the pointer is over, among the cards currently rendered. */
  const slotUnder = (clientX: number, clientY: number): number | null => {
    const scroller = scrollerRef.current
    if (scroller === null) return null
    const cards = [...scroller.querySelectorAll('[data-stack-card]')] as HTMLElement[]
    if (cards.length === 0) return null
    let best = 0
    let bestDistance = Number.POSITIVE_INFINITY
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect()
      const dx = clientX - (box.x + box.width / 2)
      const dy = clientY - (box.y + box.height / 2)
      // Rows matter more than columns: weight the vertical distance.
      const distance = dx * dx + dy * dy * 3
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    return best
  }

  const endDrag = (): void => {
    setDragId(null)
    setDropIndex(null)
  }

  return (
    <div
      className={`${styles['drawerBackdrop']}${leaving ? ` ${styles['drawerBackdropOut']}` : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
      // Also on click: a programmatic click (tests, keyboard-triggered close)
      // never sends mousedown, and a drawer that stays open eats every later
      // click on the board.
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div
        className={`${styles['drawer']}${leaving ? ` ${styles['drawerOut']}` : ''}`}
        role="dialog"
        aria-label={props.workspaceTitle}
      >
        <div className={styles['drawerHead']}>
          <span className={styles['drawerTitle']}>{props.workspaceTitle}</span>
          <span className={styles['drawerCount']}>{t('stack.total', { n: String(props.items.length) })}</span>
          <span className={styles['drawerSpace']} />
          <span className={styles['drawerHint']}>{t('stack.hint')}</span>
          <button
            type="button"
            className={styles['drawerClose']}
            title={t('stack.close')}
            aria-label={t('stack.close')}
            onClick={requestClose}
          >
            ×
          </button>
        </div>
        <div className={styles['drawerSearchRow']}>
          <input
            className={styles['drawerSearch']}
            value={query}
            placeholder={t('stack.searchPlaceholder')}
            aria-label={t('stack.searchPlaceholder')}
            data-talkmap-drawer-search=""
            onChange={(event) => {
              setQuery(event.target.value)
              // Clearing the box forgets the previous search, so the list goes
              // back to the whole folder without another request.
              if (event.target.value.trim() === '') { setHits([]); setSearchError(null) }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') { event.stopPropagation(); return }
              if (event.key !== 'Enter') return
              event.preventDefault()
              void runSearch()
            }}
          />
          <button
            type="button"
            className={styles['drawerSearchGo']}
            data-talkmap-drawer-search-run=""
            onClick={() => { void runSearch() }}
          >
            {t('global.searchRun')}
          </button>
          {searching ? <span className={styles['drawerSearchState']}>{t('stack.searching')}</span> : null}
          {searchError !== null
            ? (
                <span className={styles['drawerSearchError']} title={searchError}>
                  {isIndexDisabled(searchError)
                    ? t('stack.searchDisabled')
                    : t('stack.searchFailed') + '：' + (searchError.length > 70 ? searchError.slice(0, 70) + '…' : searchError)}
                </span>
              )
            : null}
        </div>

        <div
          className={styles['drawerScroll']}
          ref={scrollerRef}
          onScroll={(event) => {
            lastScrollAt.current = Date.now()
            // Writing to localStorage on every scroll event is a big part of
            // the jank: remember the offset after the list settles instead.
            const scroller = event.currentTarget
            if (scrollSaveTimer.current !== null) window.clearTimeout(scrollSaveTimer.current)
            scrollSaveTimer.current = window.setTimeout(() => {
              scrollSaveTimer.current = null
              drawerState.writeScroll(scroller.scrollTop)
            }, 200)
          }}
        >
          {wires.length > 0
            ? (
                <svg
                  className={styles['drawerWires']}
                  width={Math.max(1, wireSize.width)}
                  height={Math.max(1, wireSize.height)}
                  aria-hidden="true"
                >
                  {wires.map((wire, index) => (
                    <g key={index}>
                      <path
                  d={wire.d}
                  data-from={wire.from ?? ''}
                  data-to={wire.to ?? ''}
                        fill="none"
                        stroke="rgba(200, 206, 216, 0.42)"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        strokeDasharray="6 5"
                      />
                      <path
                        d="M0 0 L-9 -4 L-9 4 Z"
                        transform={`translate(${wire.ax} ${wire.ay}) rotate(${wire.angle})`}
                        fill="rgba(200, 206, 216, 0.5)"
                      />
                    </g>
                  ))}
                </svg>
              )
            : null}
          {visibleItems.map(item => {
            const classNames = [styles['card'], styles['drawerCard']]
            if (item.glow !== undefined) classNames.push(styles[LAMP_CLASS[item.glow]] ?? '')
            // Same rule as the grid: a card with nothing to report recedes, one
            // that carries a status (lamp / unsent text / interrupted / pinned)
            // stays at full strength.
            const quiet = item.glow === undefined && item.pendingDraft !== true
              && item.interrupted !== true && item.pinned !== true
            if (quiet) classNames.push(styles['cardQuiet'] ?? '')
            if (item.selected === true) classNames.push(styles['cardSelected'] ?? '')
            return (
              <button
                key={item.cardId}
                type="button"
                data-stack-card=""
                data-card-id={item.cardId}
                data-talkmap-session={item.sessionId}
                className={classNames.filter(Boolean).join(' ')}
                draggable
                data-talkmap-drag={dragId === item.cardId ? "1" : undefined}
                onDragStart={(event) => {
                  setDragId(item.cardId)
                  event.dataTransfer.effectAllowed = 'move'
                  // Firefox refuses to start a drag without payload.
                  event.dataTransfer.setData('text/plain', item.cardId)
                }}
                onDragOver={(event) => {
                  if (dragId === null) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                  const index = slotUnder(event.clientX, event.clientY)
                  if (index !== null && index !== dropIndex) setDropIndex(index)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  const index = dropIndex
                  const moving = dragId
                  endDrag()
                  if (moving === null || index === null) return
                  props.onReorder?.(moving, index)
                }}
                onDragEnd={endDrag}
                onClick={() => { props.onOpenCard(item.cardId) }}
                onContextMenu={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  props.onCardMenu?.(item.cardId, event)
                }}
              >
                {item.current === true ? <span className={styles['cardReticle']}><i /><i /><i /><i /></span> : null}
                <div className={styles['cardTop']}>
                  {item.pinned === true
                    ? <span className={styles['cardPin']} title={t('card.pinned')} data-talkmap-pin="1"><svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z"/></svg></span>
                    : null}
                  <span className={styles['cardTitle']}>{item.title}</span>
                </div>
                {item.preview !== undefined && item.preview !== ''
                  ? <div className={styles['cardSummary']}>{item.preview}</div>
                  : null}
                {item.links !== undefined && item.links.length > 0
                  ? (
                      <div className={styles['cardLinks']} data-talkmap-card-links={item.links.length}>
                        {item.links.slice(0, 3).map(link => (
                          <span
                            key={(link.outgoing ? 'out-' : 'in-') + link.toCardId}
                            className={styles['cardLinkChip']}
                            data-talkmap-link={link.outgoing ? 'out' : 'in'}
                            title={link.kind}
                          >
                            {link.outgoing ? '→ ' : '← '}{link.title}
                          </span>
                        ))}
                      </div>
                    )
                  : null}
                <div className={styles['cardFooter']}>
                  <span className={styles['cardTime']}>{relativeTime(item.updatedAt)}</span>
                  {item.pendingDraft === true
                    ? (
                        <span
                          className={`${styles['cardChip']} ${styles['cardChipDraft']}`}
                          title={t('card.draftHint')}
                          data-talkmap-draft="1"
                        >
                          {t('card.draft')}
                        </span>
                      )
                    : null}
                  {item.interrupted === true
                    ? (
                        <span
                          className={`${styles['cardChip']} ${styles['cardChipInterrupted']}`}
                          title={t('card.interruptedHint')}
                          data-talkmap-interrupted="1"
                        >
                          {t('card.interrupted')}
                        </span>
                      )
                    : null}
                  {item.glow === undefined
                    ? null
                    : (
                        <span
                          className={`${styles['cardChip']} ${styles[LAMP_CHIP[item.glow].className]}`}
                          data-talkmap-chip={item.glow}
                        >
                          {item.glow === 'running' ? <span className={styles['runningDot']} /> : null}
                          {t(LAMP_CHIP[item.glow].key)}
                        </span>
                      )}
                </div>
              </button>
            )
          })}
          {hits.length > 0
            ? (
                <SearchResults
                  query={query}
                  hits={hits}
                  empty={t('map.noHit')}
                  onOpenSession={(sessionId) => { props.onOpenSession?.(sessionId) }}
                />
              )
            : null}
          {needle !== '' && visibleItems.length === 0
            ? <div className={styles['drawerEmpty']}>{t('stack.noTitleMatch')}</div>
            : null}
        </div>
      </div>
    </div>
  )
}
