/**
 * The card node: one session on the board. Front face is the ADHD resume
 * surface — title, the digest's "next step" once M2 fills it, relative time,
 * running state. A card whose session no longer exists renders as a ghost
 * (grey, removable) — the host never auto-deletes placements.
 */
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import { canvas } from './canvas-store.ts'
import { t } from './i18n.ts'
import { PriorityBadge, PRIORITY_CLASS, type Priority } from './PriorityRail.tsx'
import styles from './talk-pages.module.css'

/** Which lamp the card wears; see the priority order in MapCanvas. */
export type CardGlow = 'running' | 'done' | 'error' | 'waiting'

const LAMP_CLASS: Record<CardGlow, string> = {
  running: 'cardLampRunning',
  done: 'cardLampDone',
  error: 'cardLampError',
  waiting: 'cardLampWaiting',
}

/**
 * The status chip: text AND colour follow the lamp, so "what the card says"
 * never disagrees with "what the card glows". running = white, waiting = amber,
 * done = green, error = red.
 */
const LAMP_CHIP: Record<CardGlow, { key: string; className: string; dot: boolean }> = {
  running: { key: 'card.running', className: 'cardChipRunning', dot: true },
  waiting: { key: 'card.waiting', className: 'cardChipWaiting', dot: false },
  done: { key: 'card.done', className: 'cardChipDone', dot: false },
  error: { key: 'card.error', className: 'cardChipError', dot: false },
}

export { LAMP_CHIP }

function statusChip(glow: CardGlow | undefined, running: boolean): React.JSX.Element | null {
  const spec = glow !== undefined ? LAMP_CHIP[glow] : running ? LAMP_CHIP.running : undefined
  if (spec === undefined) return null
  return (
    <span
      className={`${styles['cardChip']} ${styles[spec.className]}`}
      data-talkmap-chip={glow ?? 'running'}
    >
      {spec.dot ? <span className={styles['runningDot']} /> : null}
      {t(spec.key)}
    </span>
  )
}

export interface SessionCardData extends Record<string, unknown> {
  cardId: string
  sessionId: string
  title: string
  running: boolean
  ghost: boolean
  updatedAt?: number
  nextStep?: string
  stale?: boolean
  /** The user's latest message — the card body (2-line clamp). */
  preview?: string
  /** Session is blocked on the user (approval / question). */
  waiting?: boolean
  /** Finished while unwatched and not yet opened. */
  done?: boolean
  /** The lamp behind the card (running / done / error / waiting). */
  glow?: CardGlow
  /**
   * Batch mode: a click on the card body picks it instead of doing nothing.
   * Absent in normal mode, where React Flow owns what a click means.
   */
  onPick?: () => void
  /** The composer holds unsent text for this conversation ("待发送"). */
  pendingDraft?: boolean
  /** The last run was cut off (the app closed while it was running). */
  interrupted?: boolean
  /** This is the conversation the map was opened from. */
  current?: boolean
  /** Pinned in the sidebar: shown at full strength, with a pin mark. */
  pinned?: boolean
  /** The user's importance mark (1 high, 2 medium, 3 low). */
  priority?: Priority
}

export type SessionCardNodeType = Node<SessionCardData, 'sessionCard'>

/** Compact relative stamp, shared with the folder drawer's card list. */
export function relativeTime(timestamp: number | undefined): string {
  if (timestamp === undefined) return ''
  const delta = Date.now() - timestamp
  const minutes = Math.round(delta / 60_000)
  if (minutes < 1) return t('time.now')
  if (minutes < 60) return `${minutes}${t('time.m')}`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}${t('time.h')}`
  const days = Math.round(hours / 24)
  return `${days}${t('time.d')}`
}

export function SessionCardNode(props: NodeProps<SessionCardNodeType>): React.JSX.Element {
  const { data, selected } = props
  const classNames = [styles['card']]
  if (data.ghost) classNames.push(styles['cardGhost'])
  if (selected === true) classNames.push(styles['cardSelected'])
  if (data.glow !== undefined) classNames.push(styles[LAMP_CLASS[data.glow]] ?? '')
  if (data.priority !== undefined) classNames.push(styles[PRIORITY_CLASS[data.priority]] ?? '')
  // A card with nothing to report recedes; hovering brings it back. Any status
  // (lamp, unsent text, interrupted run) keeps it at full strength.
  const quiet = data.current !== true && data.pinned !== true && data.priority === undefined
    && data.glow === undefined && data.pendingDraft !== true && data.interrupted !== true
  if (quiet) classNames.push(styles['cardQuiet'] ?? '')

  return (
    <div
      className={classNames.filter(Boolean).join(' ')}
      onClick={(event) => {
        if (data.onPick === undefined) return
        // Batch picking must not double as a canvas/React-Flow selection.
        event.stopPropagation()
        data.onPick()
      }}
      style={data.onPick !== undefined ? { cursor: 'pointer' } : undefined}
      data-talkmap-session={data.sessionId}
    >
      {/* The conversation the map was opened from, marked like a reticle: four
        * corner brackets instead of a full frame. */}
      {data.current === true
        ? (
            <span className={styles['cardReticle']} aria-hidden="true">
              <i /><i /><i /><i />
            </span>
          )
        : null}      {/* Four connection points, one per side. All type "source" — the
        * canvas runs ConnectionMode.Loose, so each also accepts incoming
        * edges. Hidden until the card is hovered or a drag is in flight
        * (CSS); legacy edges without stored handles anchor r→l. */}
      <Handle id="t" type="source" position={Position.Top} className={styles['cardHandle'] ?? ''} />
      <Handle id="l" type="source" position={Position.Left} className={styles['cardHandle'] ?? ''} />
      {/* Batch mode: a tick box in the corner, so "which cards are selected" is
        * readable without squinting at the card outline. */}
      {data.onPick !== undefined
        ? (
            <span
              className={`${styles['pickBox']}${selected === true ? ` ${styles['pickBoxChecked']}` : ''}`}
              role="checkbox"
              aria-checked={selected === true}
              data-talkmap-pick=""
            >
              {selected === true ? '✓' : ''}
            </span>
          )
        : null}
      <div className={styles['cardTop']}>
        {data.pinned === true
          ? (
              <span className={styles['cardPin']} title={t('card.pinned')} aria-label={t('card.pinned')} data-talkmap-pin="1">
                {/* Icon-library pushpin (Material push_pin, wider head and a
                  * longer needle so it still reads at 13px). */}
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M16 8.6V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v4.6c0 1.66-1.34 3-3 3v2h5.1v7.9l.9 1 .9-1V13.6H19v-2c-1.66 0-3-1.34-3-3z"/></svg>
              </span>
            )
          : null}
        <span className={styles['cardTitle']}>{data.ghost ? t('card.ghostTitle') : data.title}</span>
      </div>
      {data.ghost
        ? (
            <button
              type="button"
              className={`${styles['cardRemove']} nodrag`}
              onClick={() => { canvas.removeCard(data.cardId) }}
            >
              {t('card.remove')}
            </button>
          )
        : (
            <>
              {/* The body is what YOU last said — not an LLM digest, and no
                * "next step" line either: the card is a conversation, not a
                * progress report. */}
              {data.preview !== undefined && data.preview !== ''
                ? <div className={styles['cardSummary']}>{data.preview}</div>
                : null}
            </>
          )}
      <div className={styles['cardFooter']}>
        <span className={styles['cardTime']}>{relativeTime(data.updatedAt)}</span>
        {data.pendingDraft === true
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
        {data.interrupted === true
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
        {statusChip(data.glow, data.running === true)}
        {data.priority !== undefined ? <PriorityBadge priority={data.priority} /> : null}
      </div>
      <Handle id="r" type="source" position={Position.Right} className={styles['cardHandle'] ?? ''} />
      <Handle id="b" type="source" position={Position.Bottom} className={styles['cardHandle'] ?? ''} />
    </div>
  )
}
