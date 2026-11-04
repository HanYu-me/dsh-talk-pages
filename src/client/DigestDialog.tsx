/**
 * Read-only view of the digest a card would push.
 *
 * Same text the receiving conversation gets (`buildPushText`), so what you read
 * here is literally what lands in the other session — no separate preview format
 * to drift out of sync.
 */
import { useEffect, useRef } from 'react'
import type { Digest } from '../shared/model.ts'
import { buildInjectionText, buildPushText, digestIsEmpty } from './digest-text.ts'
import { mapUi } from './map-state.ts'
import { t } from './i18n.ts'
import styles from './talk-pages.module.css'

export interface DigestDialogProps {
  title: string
  digest: Digest | undefined
  onClose: () => void
}

export function DigestDialog(props: DigestDialogProps): React.JSX.Element {
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const release = mapUi.claimEscape('digest-dialog')
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
  }, [props])

  const empty = digestIsEmpty(props.digest)
  const pushText = empty ? '' : buildPushText(props.title, props.digest as Digest)
  const injectText = empty ? '' : buildInjectionText(props.title, props.digest)

  return (
    <div
      className={styles['dialogBackdrop']}
      data-talkmap-digest-dialog=""
      onMouseDown={(event) => { if (event.target === event.currentTarget) props.onClose() }}
    >
      <div className={styles['digestDialog']} onMouseDown={(event) => { event.stopPropagation() }}>
        <div className={styles['digestDialogHead']}>
          <span className={styles['digestDialogTitle']}>{t('digest.title')}</span>
          <span className={styles['digestDialogFrom']}>{props.title}</span>
        </div>
        {empty
          ? <div className={styles['digestEmpty']}>{t('digest.empty')}</div>
          : (
              <>
                <div className={styles['digestLabel']}>{t('digest.pushLabel')}</div>
                <textarea
                  ref={textRef}
                  className={styles['digestText']}
                  readOnly
                  value={pushText}
                  spellCheck={false}
                  onFocus={(event) => { event.currentTarget.select() }}
                />
                <div className={styles['digestLabel']}>{t('digest.injectLabel')}</div>
                <textarea
                  className={styles['digestText']}
                  readOnly
                  value={injectText}
                  spellCheck={false}
                  onFocus={(event) => { event.currentTarget.select() }}
                />
              </>
            )}
        <div className={styles['digestActions']}>
          {empty
            ? null
            : (
                <button
                  type="button"
                  className={styles['spawnBtnPrimary']}
                  onClick={() => {
                    const value = pushText
                    void navigator.clipboard?.writeText(value).catch(() => {})
                  }}
                >
                  {t('digest.copy')}
                </button>
              )}
          <button type="button" className={styles['spawnBtnGhost']} onClick={props.onClose}>
            {t('digest.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
