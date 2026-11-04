/**
 * Snippet clean-up.
 *
 * A snippet is cut out of a stored event, and events carry JSON-ish scaffolding
 * (`"key":`, escaped quotes, injected markers like `[tool/result; checkpoint
 * event 12901]`). None of that belongs on screen, so it is stripped before the
 * inline-Markdown pass — and if a line is still mostly punctuation it falls back
 * to a window around the match.
 */

const NOISE_MARKER = /\[(?:tool\/result|assistant\/message|user\/message|system\/message|developer\/message|dsh-[a-z-]+)[^\]]*\]/gi
const JSON_KEY = /"[A-Za-z0-9_$]+"\s*:\s*/g

function unescape(value: string): string {
  return value
    .replace(/\\r\\n|\\n|\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

/** Fraction of characters that are JSON punctuation rather than prose. */
function punctuationRatio(value: string): number {
  if (value === '') return 0
  const noisy = value.replace(/[^\s"{}[\],:]/g, '').length
  return noisy / value.length
}

/** True when the text carries serialized JSON rather than prose. */
function looksSerialized(value: string): boolean {
  if (/\{\s*"|"\s*:\s*("|\[|\{|\d|true|false|null)/.test(value)) return true
  return (value.match(/"/g) ?? []).length >= 4
}

/** Keep the human strings of a serialized payload, drop the keys. */
function keepProse(value: string): string {
  const quoted = [...value.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"/g)].map(match => match[1])
  const prose = quoted
    .map(part => part.replace(/\\n|\\r|\\t/g, ' ').trim())
    .filter(part => part.length >= 6 && /[\u4e00-\u9fff]|[A-Za-z]/.test(part))
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)
  return prose.length > 0 ? prose.join(' … ') : ''
}

export function cleanSnippet(raw: string, query: string): string {
  let text = unescape(String(raw ?? ''))
  if (looksSerialized(text)) {
    const prose = keepProse(text)
    if (prose !== '') text = prose
  }
  text = text.replace(NOISE_MARKER, ' ')
  text = text.replace(JSON_KEY, ' ')
  text = text.replace(/[{}\[\]]/g, ' ')
  text = text.replace(/"{2,}/g, ' ')
  text = text.replace(/^[\s"',;:]+|[\s"',;:]+$/g, '')
  text = text.replace(/\s{2,}/g, ' ').trim()

  // Still mostly scaffolding? Keep just the window around the match.
  if (punctuationRatio(text) > 0.28) {
    const needle = query.trim().toLowerCase()
    const at = needle === '' ? 0 : text.toLowerCase().indexOf(needle)
    const start = Math.max(0, at - 60)
    const end = Math.min(text.length, at + 90)
    const window = text.slice(start, end)
      .replace(/[{}[\]]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    text = (start > 0 ? '…' : '') + window + (end < text.length ? '…' : '')
  }

  // Lines that are pure scaffolding: an identifier, a key: value pair, a hash.
  text = text
    .split(/\s{2,}|…/)
    .filter((part) => {
      const value = part.trim()
      if (value === '') return false
      if (/^[A-Za-z0-9_$.-]{1,40}$/.test(value)) return false
      if (/^[A-Za-z0-9_$]{6,}\s*:/.test(value) && value.length < 60) return false
      if (/^[0-9a-f]{16,}$/i.test(value)) return false
      return true
    })
    .join(' ')
    .trim()

  return text === '' ? String(raw ?? '').trim() : text
}
