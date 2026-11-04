/**
 * Page tabs: one page per workspace, sitting between the map header and the
 * canvas (see docs/SPEC.md §1).
 *
 * The bar is deliberately its own component: it re-renders on every canvas
 * change (the counts move), and keeping it out of MapOverlay means a card drag
 * does not re-render the header's search box and font buttons as well.
 *
 * It also carries the two switches the page model introduced:
 *   - 吸附/Snap — whether a dropped FREE card snaps to the 16px grid;
 *   - ＋ 新建框 — create a box at the viewport centre (the canvas owns the
 *     viewport, so the button only calls the action the canvas registered).
 */
import { useMemo, useState, useSyncExternalStore } from 'react'
import type { RootSlotStandardProps } from './dsh.ts'
import { canvas } from './canvas-store.ts'
import { canvasActions } from './canvas-actions.ts'
import { ConversationPicker } from './ConversationPicker.tsx'
import { activeLocale, subscribeLocale, t } from './i18n.ts'
import { buildPages, resolveActivePage, sessionPageIndex } from './pages.ts'
import styles from './talk-pages.module.css'

export function PageTabs(props: RootSlotStandardProps): React.JSX.Element {
  const canvasState = useSyncExternalStore(canvas.subscribe, canvas.get)
  // The tab copy is localized; the store subscription above does not carry that.
  useSyncExternalStore(subscribeLocale, activeLocale, activeLocale)
  const workspaces = props.useWorkspaces(state => state)
  const sessions = props.useSessions(state => state)

  const boxes = canvasState.global?.boxes
  const activePageStored = canvasState.global?.activePage
  const sessionPage = useMemo(() => sessionPageIndex(workspaces.items), [workspaces.items])
  const pages = useMemo(() => buildPages({
    workspaces: workspaces.items,
    cards: canvasState.cards,
    boxes,
    sessionPage,
    // A blank session's card is hidden on the canvas, so it must not be counted.
    isHidden: card => sessions.byId[card.sessionId]?.blank === true,
    unsortedTitle: t('page.unsorted'),
    ...(activePageStored !== undefined ? { activePage: activePageStored } : {}),
  }), [workspaces.items, canvasState.cards, boxes, sessionPage, sessions, activePageStored])
  const activePage = resolveActivePage(canvasState.global, pages)
  const snap = canvasState.global?.snap !== false
  const [picking, setPicking] = useState(false)

  return (
    <div className={styles['pageTabs']} role="tablist" aria-label={t('page.tabs')} data-talkmap-pages="">
      <div className={styles['pageTabScroll']}>
        {pages.map((page) => {
          const active = page.id === activePage
          return (
            <button
              key={page.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles['pageTab']}${active ? ` ${styles['pageTabActive']}` : ''}`}
              title={t('page.tabHint', { title: page.title, n: String(page.count) })}
              data-talkmap-page-tab={page.id}
              {...(active ? { 'data-talkmap-page-active': 'true' } : {})}
              onClick={() => { canvas.setActivePage(page.id) }}
            >
              <span className={styles['pageTabTitle']}>{page.title}</span>
              <span className={styles['pageTabCount']}>{page.count}</span>
            </button>
          )
        })}
      </div>
      <span className={styles['pageTabsSpace']} />
      <button
        type="button"
        className={styles['pageAction']}
        title={t('picker.title')}
        data-talkmap-open-picker=""
        onClick={() => { setPicking(true) }}
      >
        {t('picker.button')}
      </button>
      <button
        type="button"
        className={`${styles['pageAction']}${snap ? ` ${styles['pageActionOn']}` : ''}`}
        aria-pressed={snap}
        title={t('page.snapHint')}
        data-talkmap-snap-toggle={snap ? 'on' : 'off'}
        onClick={() => { canvas.setSnap(!snap) }}
      >
        {t('page.snap')}
      </button>
      <button
        type="button"
        className={styles['pageAction']}
        title={t('page.newBoxHint')}
        data-talkmap-new-box=""
        onClick={() => { canvasActions.createBox() }}
      >
        {t('page.newBox')}
      </button>
      {picking ? <ConversationPicker {...props} onClose={() => { setPicking(false) }} /> : null}
    </div>
  )
}
