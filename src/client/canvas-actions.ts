/**
 * Imperative hooks the canvas publishes for the chrome that lives OUTSIDE it.
 *
 * The tab bar (a sibling of the canvas, under the header) owns the "＋ 新建框"
 * button, but only the canvas can turn a screen point into flow coordinates and
 * place the box at the viewport centre. Rather than lifting the whole React-Flow
 * instance up, the canvas registers one action here while it is mounted.
 */
export const canvasActions = {
  /** Set by MapCanvas on mount, cleared on unmount. */
  setCreateBox(action: (() => void) | undefined): void {
    createBoxAction = action
  },
  /** Create a box at the centre of the current viewport (no-op before mount). */
  createBox(): void {
    createBoxAction?.()
  },
  available(): boolean {
    return createBoxAction !== undefined
  },
}

let createBoxAction: (() => void) | undefined
