/**
 * Inline Markdown for search snippets.
 *
 * Snippets are single lines cut out of a message, so they carry the inline
 * furniture of Markdown (`**bold**`, `` `code` ``, `*em*`, links) but none of the
 * block structure worth a full renderer. This keeps the bundle small and the
 * line height stable, while the searched word stays highlighted inside whatever
 * formatting the text already had.
 */
import { cleanSnippet } from './snippet-text.ts'
import styles from './talk-pages.module.css'

/** Block markers that should not show up as literal text in a snippet. */
function stripBlockMarkers(text: string): string {
  return text
    .replace(/^\s{0,3}#{1,6}\s+/, '')          // headings
    .replace(/^\s{0,3}>\s?/, '')               // quotes
    .replace(/^\s{0,3}(?:[-*+]|\d+[.)])\s+/, '') // list bullets / numbers
    .replace(/^\s{0,3}`{3,}.*$/, '')           // code fence lines
    .replace(/\s{2,}$/, '')
}

/** Split `text` around every occurrence of `query` and mark the matches. */
function highlight(text: string, query: string, keyPrefix: string): React.ReactNode[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [text]
  const haystack = text.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  let index = 0
  while (cursor < text.length) {
    const at = haystack.indexOf(needle, cursor)
    if (at < 0) {
      parts.push(text.slice(cursor))
      break
    }
    if (at > cursor) parts.push(text.slice(cursor, at))
    parts.push(
      <mark key={`${keyPrefix}-m${index++}`} className={styles['hitMark']}>
        {text.slice(at, at + needle.length)}
      </mark>,
    )
    cursor = at + needle.length
  }
  return parts
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)|(~~[^~]+~~)|(\[[^\]]+\]\([^)]+\))/g

export interface RenderedSnippet {
  nodes: React.ReactNode[]
  /** Plain text after Markdown markers are gone (for tests and tooltips). */
  plain: string
}

/** Render one snippet line with its inline Markdown and the search term marked. */
export function renderMarkdownInline(raw: string, query: string): RenderedSnippet {
  const text = stripBlockMarkers(cleanSnippet(raw, query))
  const nodes: React.ReactNode[] = []
  let plain = ''
  let cursor = 0
  let token = 0
  const push = (content: React.ReactNode, plainText: string): void => {
    nodes.push(content)
    plain += plainText
  }
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0
    if (at > cursor) {
      const chunk = text.slice(cursor, at)
      push(highlight(chunk, query, `t${token++}`), chunk)
    }
    const [whole] = match
    if (whole.startsWith('`')) {
      const body = whole.slice(1, -1)
      push(<code key={`c${token++}`} className={styles['snippetCode']}>{highlight(body, query, `c${token}`)}</code>, body)
    } else if (whole.startsWith('**') || whole.startsWith('__')) {
      const body = whole.slice(2, -2)
      push(<strong key={`s${token++}`}>{highlight(body, query, `s${token}`)}</strong>, body)
    } else if (whole.startsWith('~~')) {
      const body = whole.slice(2, -2)
      push(<s key={`d${token++}`}>{highlight(body, query, `d${token}`)}</s>, body)
    } else if (whole.startsWith('[')) {
      const label = whole.replace(/^\[([^\]]+)\].*$/, '$1')
      push(<span key={`l${token++}`} className={styles['snippetLink']}>{highlight(label, query, `l${token}`)}</span>, label)
    } else {
      const body = whole.slice(1, -1)
      push(<em key={`e${token++}`}>{highlight(body, query, `e${token}`)}</em>, body)
    }
    cursor = at + whole.length
  }
  if (cursor < text.length) {
    const tail = text.slice(cursor)
    push(highlight(tail, query, `t${token++}`), tail)
  }
  return { nodes, plain }
}
