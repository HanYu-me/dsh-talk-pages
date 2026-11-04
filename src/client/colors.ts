/**
 * Workspace frame colours. Cards are deliberately NOT colourable any more — the
 * only thing that carries a colour is a workspace frame (its border and label),
 * picked from the toolbar that appears when a frame is selected.
 */
export interface ColorTag {
  id: string
  /** Swatch in the toolbar. */
  swatch: string
  /** Frame border. */
  border: string
  /** Label chip fill (a low-alpha wash of the same hue). */
  fill: string
  /** Frame background wash (very low alpha). */
  faint: string
}

export const COLOR_TAGS: readonly ColorTag[] = [
  { id: 'red', swatch: '#e5484d', border: 'rgba(229,72,77,0.75)', fill: 'rgba(229,72,77,0.18)', faint: 'rgba(229,72,77,0.05)' },
  { id: 'orange', swatch: '#f76b15', border: 'rgba(247,107,21,0.75)', fill: 'rgba(247,107,21,0.18)', faint: 'rgba(247,107,21,0.05)' },
  { id: 'yellow', swatch: '#ffc53d', border: 'rgba(255,197,61,0.75)', fill: 'rgba(255,197,61,0.18)', faint: 'rgba(255,197,61,0.05)' },
  { id: 'green', swatch: '#30a46c', border: 'rgba(48,164,108,0.8)', fill: 'rgba(48,164,108,0.18)', faint: 'rgba(48,164,108,0.05)' },
  { id: 'teal', swatch: '#12a594', border: 'rgba(18,165,148,0.8)', fill: 'rgba(18,165,148,0.18)', faint: 'rgba(18,165,148,0.05)' },
  { id: 'blue', swatch: '#3e63dd', border: 'rgba(62,99,221,0.8)', fill: 'rgba(62,99,221,0.2)', faint: 'rgba(62,99,221,0.06)' },
  { id: 'purple', swatch: '#8e4ec6', border: 'rgba(142,78,198,0.8)', fill: 'rgba(142,78,198,0.18)', faint: 'rgba(142,78,198,0.05)' },
  { id: 'gray', swatch: '#7d828d', border: 'rgba(125,130,141,0.8)', fill: 'rgba(125,130,141,0.16)', faint: 'rgba(125,130,141,0.05)' },
]

const byId = new Map(COLOR_TAGS.map(tag => [tag.id, tag]))

export function colorOf(tagId: string | undefined): ColorTag | undefined {
  return tagId === undefined ? undefined : byId.get(tagId)
}
