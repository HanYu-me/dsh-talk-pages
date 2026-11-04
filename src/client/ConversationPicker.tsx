/**
 * "Choose conversations": the user decides which conversations live on the map.
 * Lists every conversation (archived ones included), ticked = has a card.
 * Applying adds cards for newly ticked ones (free cards, in a tidy row below the
 * page's existing content) and takes the cards of unticked ones off the map —
 * the conversations themselves are never touched.
 */
import { useEffect, useMemo, useState } from 'react'
import type { RootSlotStandardProps } from './dsh.ts'
import type { Card } from '../shared/model.ts'
import { canvas, newCardId } from './canvas-store.ts'
import { CARD_H, CARD_W, GAP_X, GAP_Y } from './grid-layout.ts'
import { t } from './i18n.ts'
import { mapUi } from './map-state.ts'
import { INBOX_BOARD_ID, UNSORTED_PAGE_ID } from '../shared/model.ts'
import { pageOfCard, sessionPageIndex } from './pages.ts'
import { relativeTime } from './SessionCard.tsx'
import styles from './talk-pages.module.css'

type Filter = 'all' | 'on' | 'off' | 'archived'

const ROW_COLS = 4

export function ConversationPicker(props: RootSlotStandardProps & { onClose: () => void }): React.JSX.Element {
  const canvasState = canvas.get()
  const workspaces = props.useWorkspaces(state => state)
  const sessions = props.useSessions(state => state)
  const sessionPage = useMemo(() => sessionPageIndex(workspaces.items), [workspaces.items])
  const archived = useMemo(() => new Set(workspaces.archivedSessionIds ?? []), [workspaces.archivedSessionIds])
  const pageTitle = useMemo(
    () => new Map(workspaces.items.map(item => [item.workspaceId, item.title])),
    [workspaces.items],
  )

  /** session id → card id, for the sessions that are on the map now. */
  const onMap = useMemo(() => {
    const out = new Map<string, string>()
    for (const [cardId, card] of Object.entries(canvasState.cards)) out.set(card.sessionId, cardId)
    return out
  }, [canvasState.cards])

  const rows = useMemo(() => sessions.ids
    .map((id) => ({ id, summary: sessions.byId[id] }))
    .filter((entry): entry is { id: string; summary: NonNullable<typeof entry.summary> } => (
      entry.summary !== undefined && !entry.summary.blank && entry.summary.origin !== 'subagent'
    ))
    .map(({ id, summary }) => ({
      id,
      title: summary.displayTitle,
      pageId: sessionPage.get(id) ?? UNSORTED_PAGE_ID,
      archived: archived.has(id),
      updatedAt: summary.updatedAt,
    }))
    .sort((a, b) => b.updatedAt - a.updatedAt), [sessions, sessionPage, archived])

  const [picked, setPicked] = useState<ReadonlySet<string>>(() => new Set(onMap.keys()))
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const autoAdd = canvasState.global?.autoAdd === true

  useEffect(() => {
    const release = mapUi.claimEscape('conversation-picker')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      props.onClose()
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      release()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (needle !== '' && !row.title.toLowerCase().includes(needle)) return false
      if (filter === 'on') return onMap.has(row.id)
      if (filter === 'off') return !onMap.has(row.id)
      if (filter === 'archived') return row.archived
      return true
    })
  }, [rows, query, filter, onMap])

  /** Group the listed rows by workspace, in the sidebar's order. */
  const groups = useMemo(() => {
    const order = new Map(workspaces.items.map((item, index) => [item.workspaceId, index]))
    const byPage = new Map<string, typeof shown>()
    for (const row of shown) byPage.set(row.pageId, [...(byPage.get(row.pageId) ?? []), row])
    return [...byPage.entries()].sort((a, b) => (order.get(a[0]) ?? 1e9) - (order.get(b[0]) ?? 1e9))
  }, [shown, workspaces.items])

  const toggle = (id: string): void => {
    setPicked((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const setShown = (on: boolean): void => {
    setPicked((previous) => {
      const next = new Set(previous)
      for (const row of shown) {
        if (on) next.add(row.id)
        else next.delete(row.id)
      }
      return next
    })
  }

  const apply = (): void => {
    const state = canvas.get()
    const boxes = state.global?.boxes
    // Cards of unticked sessions leave the map.
    let removed = 0
    for (const [sessionId, cardId] of onMap) {
      if (picked.has(sessionId)) continue
      canvas.removeCard(cardId)
      removed += 1
    }
    // Newly ticked sessions arrive as free cards, row by row under each page's content.
    const bottomByPage = new Map<string, number>()
    for (const card of Object.values(state.cards)) {
      const pageId = pageOfCard(card, boxes, sessionPage)
      bottomByPage.set(pageId, Math.max(bottomByPage.get(pageId) ?? 0, card.y + CARD_H))
    }
    const countByPage = new Map<string, number>()
    const added: Record<string, Card> = {}
    for (const row of rows) {
      if (!picked.has(row.id) || onMap.has(row.id)) continue
      const index = countByPage.get(row.pageId) ?? 0
      countByPage.set(row.pageId, index + 1)
      const baseY = (bottomByPage.get(row.pageId) ?? -GAP_Y) + GAP_Y
      added[newCardId()] = {
        boardId: INBOX_BOARD_ID,
        sessionId: row.id,
        x: (index % ROW_COLS) * (CARD_W + GAP_X),
        y: baseY + Math.floor(index / ROW_COLS) * (CARD_H + GAP_Y),
        createdAt: Date.now(),
      }
    }
    if (Object.keys(added).length > 0) canvas.addCards(added)
    props.onClose()
    window.dispatchEvent(new CustomEvent('talk-pages:toast', {
      detail: t('picker.added', { a: String(Object.keys(added).length), r: String(removed) }),
    }))
  }

  const filters: [Filter, string][] = [
    ['all', 'picker.filterAll'],
    ['on', 'picker.filterOnMap'],
    ['off', 'picker.filterOff'],
    ['archived', 'picker.filterArchived'],
  ]

  return (
    <div className={styles['pickerMask']} onMouseDown={(event) => { if (event.target === event.currentTarget) props.onClose() }}>
      <div className={styles['picker']} role="dialog" aria-label={t('picker.title')} data-talkmap-picker="">
        <div className={styles['pickerHead']}>
          <span className={styles['pickerTitle']}>{t('picker.title')}</span>
          <button type="button" className={styles['pickerClose']} onClick={props.onClose} aria-label={t('picker.cancel')}>✕</button>
        </div>
        <div className={styles['pickerTools']}>
          <input
            className={styles['pickerSearch']}
            placeholder={t('picker.search')}
            value={query}
            autoFocus
            onChange={(event) => { setQuery(event.target.value) }}
          />
          <div className={styles['pickerFilters']}>
            {filters.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`${styles['pickerFilter']}${filter === key ? ` ${styles['pickerFilterOn']}` : ''}`}
                onClick={() => { setFilter(key) }}
              >
                {t(label)}
              </button>
            ))}
          </div>
          <div className={styles['pickerBulk']}>
            <button type="button" className={styles['pickerLink']} onClick={() => { setShown(true) }}>{t('picker.selectShown')}</button>
            <button type="button" className={styles['pickerLink']} onClick={() => { setShown(false) }}>{t('picker.clearShown')}</button>
          </div>
        </div>
        <div className={styles['pickerList']}>
          {groups.length === 0 ? <div className={styles['pickerEmpty']}>{t('picker.empty')}</div> : null}
          {groups.map(([pageId, items]) => (
            <div key={pageId} className={styles['pickerGroup']}>
              <div className={styles['pickerGroupTitle']}>{pageTitle.get(pageId) ?? t('page.unsorted')}</div>
              {items.map(row => (
                <label key={row.id} className={styles['pickerRow']} data-talkmap-picker-row={row.id}>
                  <input type="checkbox" checked={picked.has(row.id)} onChange={() => { toggle(row.id) }} />
                  <span className={styles['pickerRowTitle']}>{row.title}</span>
                  {row.archived ? <span className={styles['pickerTag']}>{t('picker.archivedTag')}</span> : null}
                  <span className={styles['pickerTime']}>{relativeTime(row.updatedAt)}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
        <div className={styles['pickerFoot']}>
          <label className={styles['pickerAuto']}>
            <input
              type="checkbox"
              checked={autoAdd}
              onChange={(event) => { canvas.patchGlobalNow({ autoAdd: event.target.checked }) }}
            />
            {t('picker.autoAdd')}
          </label>
          <span className={styles['pickerCount']}>{t('picker.selected', { n: String(picked.size) })}</span>
          <button type="button" className={styles['pickerCancel']} onClick={props.onClose}>{t('picker.cancel')}</button>
          <button type="button" className={styles['pickerApply']} onClick={apply} data-talkmap-picker-apply="">{t('picker.apply')}</button>
        </div>
      </div>
    </div>
  )
}
