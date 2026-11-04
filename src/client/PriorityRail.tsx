/**
 * The priority rail: a panel on the left edge of the map listing the cards the
 * user marked with an importance level (1 high, 2 medium, 3 low), highest first,
 * most recently active first within a level. It replaces the old read/unread
 * status list: what matters is what YOU flagged, not what happens to be unread.
 *
 * Same chrome as before (frosted handle + sliding panel); open/closed survives a
 * restart. Clicking a row brings its card into view.
 */
import { useSyncExternalStore } from 'react'
import { relativeTime } from './SessionCard.tsx'
import { t } from './i18n.ts'
import styles from './talk-pages.module.css'

export type Priority = 1 | 2 | 3

export interface PriorityRailEntry {
  cardId: string
  sessionId: string
  title: string
  priority: Priority
  updatedAt?: number
  preview?: string
}

export interface PriorityRailProps {
  entries: readonly PriorityRailEntry[]
  /** The board's card width, so a rail card is exactly as wide as a map card. */
  cardWidth: number
  onFocus: (cardId: string) => void
}

const OPEN_KEY = 'dsh.talk-pages.priority-rail.open.v1'

export const PRIORITY_CLASS: Record<Priority, string> = {
  1: 'priorityHigh',
  2: 'priorityMid',
  3: 'priorityLow',
}

const PRIORITY_COLOR: Record<Priority, string> = { 1: '#f24e4e', 2: '#f5b22e', 3: '#4e9bf2' }

let openState: boolean | undefined
const listeners = new Set<() => void>()

function readOpen(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(OPEN_KEY) === '1'
  } catch {
    return false
  }
}

function getOpen(): boolean {
  if (openState === undefined) openState = readOpen()
  return openState
}

function setOpen(open: boolean): void {
  openState = open
  try { window.localStorage.setItem(OPEN_KEY, open ? '1' : '0') } catch { /* private mode */ }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** Sorted copy: priority first, then the most recent activity. */
export function sortByPriority(entries: readonly PriorityRailEntry[]): PriorityRailEntry[] {
  return [...entries].sort((a, b) => a.priority - b.priority || (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
}

export function PriorityBadge(props: { priority: Priority }): React.JSX.Element {
  return (
    <span
      className={`${styles['cardChip']} ${styles['priorityChip']}`}
      style={{ ['--tm-priority' as string]: PRIORITY_COLOR[props.priority] }}
      data-talkmap-priority={props.priority}
    >
      {t(`card.priority${props.priority}`)}
    </span>
  )
}

export function PriorityRail(props: PriorityRailProps): React.JSX.Element {
  const open = useSyncExternalStore(subscribe, getOpen, getOpen)
  const sorted = sortByPriority(props.entries)
  return (
    <div
      className={styles['statusRail']}
      data-open={open ? '1' : '0'}
      style={{ ['--rail-card-w' as string]: `${props.cardWidth}px` }}
    >
      <div className={styles['statusRailPanel']} aria-hidden={!open}>
        <div className={styles['statusRailHead']}>
          <span className={styles['statusRailTitle']}>{t('priorityRail.title')}</span>
          <span className={styles['statusRailCount']}>{sorted.length}</span>
        </div>
        <div className={styles['statusRailList']} role="list">
          {sorted.length === 0 ? <div className={styles['statusRailEmpty']}>{t('priorityRail.empty')}</div> : null}
          {sorted.map(entry => (
            <div key={entry.cardId} role="listitem" className={styles['statusRailSlot']}>
              <div
                className={`${styles['card']} ${styles['statusRailCard']} ${styles[PRIORITY_CLASS[entry.priority]] ?? ''}`}
                onClick={() => { props.onFocus(entry.cardId) }}
                title={entry.title}
              >
                <div className={styles['cardTop']}>
                  <span className={styles['cardTitle']}>{entry.title}</span>
                </div>
                {entry.preview !== undefined && entry.preview !== ''
                  ? <div className={styles['cardSummary']}>{entry.preview}</div>
                  : null}
                <div className={styles['cardFooter']}>
                  <span className={styles['cardTime']}>{relativeTime(entry.updatedAt)}</span>
                  <PriorityBadge priority={entry.priority} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={styles['statusRailTab']}
        aria-expanded={open}
        aria-label={open ? t('priorityRail.close') : t('priorityRail.open')}
        title={open ? t('priorityRail.close') : t('priorityRail.open')}
        onClick={() => { setOpen(!open) }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="currentColor" d="M6 3h2v18H6zM9 4h10l-2.5 4L19 12H9z" />
        </svg>
        {sorted.length > 0 ? <span className={styles['statusRailTabCount']}>{sorted.length}</span> : null}
      </button>
    </div>
  )
}
