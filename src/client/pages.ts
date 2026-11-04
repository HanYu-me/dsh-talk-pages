/**
 * Pages = workspaces, plus the boxes that live on them.
 *
 * Everything here is pure so the rules are unit-testable without a browser:
 *
 *   - a card's page is the page of its BOX; a free card belongs to the page of
 *     its session's workspace (UNSORTED_PAGE_ID when it has none);
 *   - a box's page is stored in `global.boxes[boxId].pageId`;
 *   - the tab bar lists every workspace (title + card count) in sidebar order,
 *     then any page that only a box references, then "unsorted" when it holds
 *     cards;
 *   - the v5 layout migration turns every old folder (`wsFrames[wsId]`) into a
 *     box with the SAME id (so geometry and colour carry over) and stamps
 *     `Card.boxId` from the old group (`wsOverride ?? session workspace`).
 */
import type { Box, Card, FrameGeometry, MapGlobal } from '../shared/model.ts'
import { UNSORTED_PAGE_ID } from '../shared/model.ts'

/** v5: frames became user boxes; cards got `boxId`; pages arrived. */
export const LAYOUT_VERSION = 5

/** Camera keys are namespaced per page: `global.cameraByBoard["page:<id>"]`. */
export function pageCameraKey(pageId: string): string {
  return `page:${pageId}`
}

export interface PageInfo {
  id: string
  title: string
  /** Cards rendered on that page right now. */
  count: number
}

/** Session id → the workspace id (= page id) that owns it. */
export function sessionPageIndex(
  workspaces: readonly { workspaceId: string; sessionIds: readonly string[] }[],
): Map<string, string> {
  const index = new Map<string, string>()
  for (const workspace of workspaces) {
    for (const sessionId of workspace.sessionIds) index.set(sessionId, workspace.workspaceId)
  }
  return index
}

/**
 * The page a card renders on. A boxed card follows its box — that is what makes
 * "drag it into a box" also mean "it lives on that box's page".
 */
export function pageOfCard(
  card: Card,
  boxes: Readonly<Record<string, Box>> | undefined,
  sessionPage: ReadonlyMap<string, string>,
): string {
  if (card.boxId !== undefined) {
    const box = boxes?.[card.boxId]
    if (box !== undefined) return box.pageId
  }
  return sessionPage.get(card.sessionId) ?? UNSORTED_PAGE_ID
}

/** The page a box renders on (a frame without a box row stands in for itself). */
export function pageOfBox(
  boxId: string,
  boxes: Readonly<Record<string, Box>> | undefined,
): string {
  return boxes?.[boxId]?.pageId ?? boxId
}

/**
 * The tab bar. Order: the sidebar's workspace order, then pages only a box
 * knows about, then the unsorted bucket when it has cards (or is active).
 */
export function buildPages(input: {
  workspaces: readonly { workspaceId: string; title: string }[]
  cards: Readonly<Record<string, Card>>
  boxes: Readonly<Record<string, Box>> | undefined
  sessionPage: ReadonlyMap<string, string>
  /** Hidden cards (blank sessions) do not count — the canvas does not paint them. */
  isHidden?: (card: Card) => boolean
  /** Title for the unsorted bucket; the caller owns i18n. */
  unsortedTitle: string
  activePage?: string
}): PageInfo[] {
  const counts = new Map<string, number>()
  for (const card of Object.values(input.cards)) {
    if (input.isHidden?.(card) === true) continue
    const pageId = pageOfCard(card, input.boxes, input.sessionPage)
    counts.set(pageId, (counts.get(pageId) ?? 0) + 1)
  }
  const pages: PageInfo[] = []
  const seen = new Set<string>()
  for (const workspace of input.workspaces) {
    seen.add(workspace.workspaceId)
    pages.push({
      id: workspace.workspaceId,
      title: workspace.title,
      count: counts.get(workspace.workspaceId) ?? 0,
    })
  }
  for (const box of Object.values(input.boxes ?? {})) {
    if (seen.has(box.pageId)) continue
    seen.add(box.pageId)
    pages.push({
      id: box.pageId,
      title: box.pageId === UNSORTED_PAGE_ID ? input.unsortedTitle : box.title,
      count: counts.get(box.pageId) ?? 0,
    })
  }
  const unsortedCount = counts.get(UNSORTED_PAGE_ID) ?? 0
  if (!seen.has(UNSORTED_PAGE_ID) && (unsortedCount > 0 || input.activePage === UNSORTED_PAGE_ID)) {
    pages.push({ id: UNSORTED_PAGE_ID, title: input.unsortedTitle, count: unsortedCount })
  }
  return pages
}

/** The page to render: the stored one when it still exists, else the first. */
export function resolveActivePage(
  global: MapGlobal | null | undefined,
  pages: readonly PageInfo[],
): string {
  const stored = global?.activePage
  if (stored !== undefined && pages.some(page => page.id === stored)) return stored
  return pages[0]?.id ?? UNSORTED_PAGE_ID
}

export interface MigrationResult {
  boxes: Record<string, Box>
  /** Only the cards that actually changed (their new value). */
  cards: Record<string, Card>
  changed: boolean
}

/**
 * LAYOUT_VERSION 5 migration (see docs/SPEC.md §5).
 *
 * Runs on the first load of an older store: every old folder becomes a box with
 * its own id and page, and every card that was grouped (`wsOverride ?? session
 * workspace`, and only when that group really had a frame) joins it. Cards that
 * were never in a folder stay free — and NOTHING is repositioned: a card that
 * leaves the slot layout keeps its stored x/y.
 */
export function migrateToBoxes(input: {
  cards: Readonly<Record<string, Card>>
  wsFrames: Readonly<Record<string, FrameGeometry>>
  boxes: Readonly<Record<string, Box>> | undefined
  sessionPage: ReadonlyMap<string, string>
  titles: ReadonlyMap<string, string>
}): MigrationResult {
  const boxes: Record<string, Box> = { ...input.boxes }
  let changed = false
  for (const [frameId] of Object.entries(input.wsFrames)) {
    if (boxes[frameId] !== undefined) continue
    boxes[frameId] = { pageId: frameId, title: input.titles.get(frameId) ?? frameId }
    changed = true
  }
  const cards: Record<string, Card> = {}
  for (const [cardId, card] of Object.entries(input.cards)) {
    if (card.boxId !== undefined) continue
    const groupId = card.wsOverride ?? input.sessionPage.get(card.sessionId)
    if (groupId === undefined) continue
    // A group without a frame was never a container: the card stays free.
    if (input.wsFrames[groupId] === undefined) continue
    cards[cardId] = { ...card, boxId: groupId }
    changed = true
  }
  return { boxes, cards, changed }
}
