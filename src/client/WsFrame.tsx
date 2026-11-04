/**
 * Workspace frame: the folder a group of cards lives in.
 *
 * Geometry is the user's: drag the label chip (or any border strip) to move the
 * whole folder, drag any of the eight handles (four edges + four corners) to
 * resize it. The cards inside are laid out by grid-layout.ts, so a resize
 * reflows them live — the frame reports every candidate rect through
 * `data.onResizeStart` and the canvas decides what to persist.
 *
 * The body centre stays pointer-transparent (pan and double-click pass through
 * to the pane, which is how "double-click inside a folder = new chat here"
 * works without the frame swallowing the gesture).
 */
import type { NodeProps, Node } from '@xyflow/react'
import type { FrameGeometry } from '../shared/model.ts'
import { colorOf } from './colors.ts'
import styles from './talk-pages.module.css'

/** Which sides a drag moves: `n` grows upward, `w` grows leftward, … */
export type ResizeAxis = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

export interface WsFrameData extends Record<string, unknown> {
  /** The box id (a migrated workspace folder keeps its workspace id). */
  workspaceId: string
  title: string
  count: number
  width: number
  height: number
  /** Box colour: drives the frame border and the label chip. */
  colorTag?: string
  /** The box is being dragged over another one: a red outline warns that the drop will bounce. */
  blocked?: boolean
  /** Pointer-down on a resize handle; the canvas owns the pointer capture. */
  onResizeStart?: (axis: ResizeAxis, event: React.PointerEvent<HTMLDivElement>) => void
  /** Double-click on the label chip: rename the box (the body stays "new chat"). */
  onRename?: () => void
  /** Pointer-down on the label: the canvas uses it to recognise a double-click
   * on the drag handle (React Flow swallows the second press into a drag, so
   * the browser reports the pane as the dblclick target). */
  onLabelPointerDown?: () => void
}

export type WsFrameNodeType = Node<WsFrameData, 'wsFrame'>

const EDGE = 10
/** Size of the corner handles; the edge strips stop short of them. */
const CORNER = 26

interface HandleSpec {
  axis: ResizeAxis
  style: React.CSSProperties
  className: string
  title: string
}

const EDGE_HANDLES: HandleSpec[] = [
  { axis: 'n', className: 'wsFrameResizeN', title: '拖拽改变高度（上边）', style: { top: -3, left: CORNER + 2, right: CORNER + 2, height: 12 } },
  { axis: 's', className: 'wsFrameResizeS', title: '拖拽改变高度（下边）', style: { bottom: -3, left: CORNER + 2, right: CORNER + 2, height: 12 } },
  { axis: 'w', className: 'wsFrameResizeW', title: '拖拽改变宽度（左边）', style: { left: -3, top: CORNER + 2, bottom: CORNER + 2, width: 12 } },
  { axis: 'e', className: 'wsFrameResizeE', title: '拖拽改变宽度（右边）', style: { right: -3, top: CORNER + 2, bottom: CORNER + 2, width: 12 } },
]

const CORNER_HANDLES: HandleSpec[] = [
  { axis: 'nw', className: 'wsFrameResizeNw', title: '拖拽同时改变宽高（左上）', style: { left: -3, top: -3 } },
  { axis: 'ne', className: 'wsFrameResizeNe', title: '拖拽同时改变宽高（右上）', style: { right: -3, top: -3 } },
  { axis: 'sw', className: 'wsFrameResizeSw', title: '拖拽同时改变宽高（左下）', style: { left: -3, bottom: -3 } },
  { axis: 'se', className: 'wsFrameResizeSe', title: '拖拽同时改变宽高（右下）', style: { right: -3, bottom: -3 } },
]

export function WsFrameNode(props: NodeProps<WsFrameNodeType>): React.JSX.Element {
  const { data, selected } = props
  // The colour rides on the border and the label chip — the two surfaces the
  // user actually reads as "this workspace".
  const color = colorOf(data.colorTag)
  const start = (axis: ResizeAxis) => (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    data.onResizeStart?.(axis, event)
  }
  return (
    <div
      className={`${styles['wsFrame']}${selected === true ? ` ${styles['wsFrameSelected']}` : ''}${data.blocked === true ? ` ${styles['wsFrameBlocked']}` : ''}`}
      style={{
        width: data.width,
        height: data.height,
        // Border (+ label) only: the folder's inside keeps the board background,
        // so the colour never washes over the cards.
        ...(color !== undefined ? { borderColor: color.border } : {}),
      }}
      data-talkmap-frame=""
      data-talkmap-workspace={data.workspaceId}
    >
      <div
        className={styles['wsFrameLabel']}
        style={color !== undefined
          ? { borderColor: color.border, backgroundImage: `linear-gradient(${color.fill}, ${color.fill})` }
          : {}}
        onPointerDown={() => { data.onLabelPointerDown?.() }}
        onDoubleClick={(event) => {
          // Claim the gesture: the canvas's own double-click handler would
          // otherwise read it as "start a new chat in this workspace".
          event.stopPropagation()
          data.onRename?.()
        }}
        title={data.title}
        data-talkmap-box-label={data.workspaceId}
      >
        {data.title}
        <span className={styles['wsFrameCount']}>{data.count}</span>
      </div>
      {/* border strips: clickable/draggable surfaces along the dashed edge */}
      <div className={styles['wsFrameEdge']} style={{ top: 0, left: 0, right: 0, height: EDGE }} />
      <div className={styles['wsFrameEdge']} style={{ bottom: 0, left: 0, right: 0, height: EDGE }} />
      <div className={styles['wsFrameEdge']} style={{ top: 0, bottom: 0, left: 0, width: EDGE }} />
      <div className={styles['wsFrameEdge']} style={{ top: 0, bottom: 0, right: 0, width: EDGE }} />
      {/* resize handles: four edges + four corners, like a desktop folder */}
      {[...EDGE_HANDLES, ...CORNER_HANDLES].map(handle => (
        <div
          key={handle.axis}
          className={`${styles['wsFrameResize']} ${styles[handle.className] ?? ''}`}
          style={handle.style}
          onPointerDown={start(handle.axis)}
          title={handle.title}
          data-talkmap-resize={handle.axis}
        />
      ))}
    </div>
  )
}

export type { FrameGeometry }
