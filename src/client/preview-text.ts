/**
 * What counts as "the user's message".
 *
 * The runtime marks every injected message with `source.kind`; a scan of every
 * stored session shows the full set in use:
 *
 *   user · 继续 / 重启了 / 各种提问                ← the human
 *   time-context · Time sampled while preparing…
 *   runtime-context · Current runtime context.…
 *   dsh-mnemon · MNEMON RUNTIME MEMORY SNAPSHOT / [MNEMON] Search Documents…
 *   skill-catalog · <system-reminder> …
 *   model-selection · [model changed: …]
 *   dsh-rewind · (empty message)
 *   compact-checkpoint · This is an automatically generated checkpoint…
 *   user-approval · The approval policy changed…
 *   tool-jobs · background job …
 *   tool · tool results
 *
 * So there is nothing to pattern-match: keep `kind === 'user'` and drop the rest.
 * A new envelope type added by a future runtime version is excluded on its own.
 */
export interface MessageSource {
  readonly kind?: string
}

/** True only for a message the human actually sent. */
export function isHumanMessage(source: MessageSource | undefined): boolean {
  const kind = source?.kind
  // Older records carry no source at all; those are the human's.
  return kind === undefined || kind === 'user'
}

/** Trim and collapse hard line breaks — nothing else to clean now. */
export function cleanPreviewText(text: string | undefined): string {
  if (text === undefined) return ''
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}
