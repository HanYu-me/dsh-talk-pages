/**
 * The collapse cell: when a folder is too small for its cards, the last visible
 * slot becomes a stack of the leftovers (like the pages iOS folds away in a
 * folder). The cell shows the face of the newest folded card plus a count;
 * clicking it opens the drawer with every conversation in that workspace.
 */
import type { NodeProps, Node } from '@xyflow/react'
import { t } from './i18n.ts'
import styles from './talk-pages.module.css'

export interface StackNodeData extends Record<string, unknown> {
  workspaceId: string
  /** How many cards are folded into this cell. */
  count: number
  /** Face of the stack: the newest folded card's title. */
  topTitle?: string
  /** Something inside the stack has a status of its own (keeps the cell lit). */
  busy?: boolean
  onOpen: () => void
}

export type StackNodeType = Node<StackNodeData, 'stackCell'>

export function StackNode(props: NodeProps<StackNodeType>): React.JSX.Element {
  const { data } = props
  const open = (): void => { data.onOpen() }
  return (
    <div
      className={[styles['stackCell'], styles['cardQuiet'] ?? ''].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      title={t('stack.open')}
      aria-label={t('stack.open')}
      onClick={(event) => {
        event.stopPropagation()
        open()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        open()
      }}
    >
      <span className={styles['stackSheetBack']} />
      <span className={styles['stackSheetMid']} />
      <div className={styles['stackFace']}>
        <span className={styles['stackFaceTitle']}>{data.topTitle ?? t('frame.unknown')}</span>
        <span className={[styles['stackBadge'], data.busy === true ? (styles['stackBadgeBusy'] ?? '') : ''].filter(Boolean).join(' ')}>+{data.count}</span>
      </div>
    </div>
  )
}
