/**
 * The map as a `main` panel: an ordinary centre-column page, the same seat the
 * Plugins page or the recycle bin occupies. Being a panel (instead of a
 * frame-wide overlay) is what makes the "finished while you were elsewhere"
 * signal work — the shell is no longer holding a conversation on screen, so a
 * session that finishes is still unread and its card can glow.
 *
 * The shell owns the selection: this component exists only while the panel is
 * selected, so mount/unmount is the real open/closed state and the sidebar
 * button mirrors it.
 */
import { useEffect, useSyncExternalStore } from 'react'
import type { RootSlotStandardProps } from './dsh.ts'
import { activeLocale, subscribeLocale, t } from './i18n.ts'
import { fontScale } from './font-scale.ts'
import { GlobalSearch } from './GlobalSearch.tsx'
import { closeMapPanel, hideSidebarForMap, mapUi, openSessionInUi, restoreSidebarAfterMap } from './map-state.ts'
import { MapCanvas } from './MapCanvas.tsx'
import { PageTabs } from './PageTabs.tsx'
import styles from './talk-pages.module.css'

/**
 * Text size for the whole map: one step = +1px on every style, each keeping its
 * own base size (the request was "every font +1 step", not "all fonts equal").
 * The third button returns to the default.
 */
function FontSizeButtons(): React.JSX.Element {
  const step = useSyncExternalStore(fontScale.subscribe, fontScale.getSnapshot)
  return (
    <div className={styles['fontGroup']} role="group" aria-label={t('font.group')}>
      <button
        type="button"
        className={styles['fontButton']}
        title={t('font.decrease')}
        aria-label={t('font.decrease')}
        disabled={!fontScale.canDecrease()}
        onClick={() => { fontScale.decrease() }}
      >
        <span className={styles['fontGlyphSmall']}>A</span>
        <span className={styles['fontSign']}>−</span>
      </button>
      <button
        type="button"
        className={styles['fontButton']}
        title={t('font.increase')}
        aria-label={t('font.increase')}
        disabled={!fontScale.canIncrease()}
        onClick={() => { fontScale.increase() }}
      >
        <span className={styles['fontGlyphLarge']}>A</span>
        <span className={styles['fontSign']}>+</span>
      </button>
      <button
        type="button"
        className={`${styles['fontButton']} ${styles['fontReset']}`}
        title={t('font.reset')}
        aria-label={t('font.reset')}
        disabled={step === 0}
        onClick={() => { fontScale.reset() }}
      >
        {t('font.resetShort')}
      </button>
    </div>
  )
}

function BackIcon(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function MapOverlay(props: RootSlotStandardProps): React.JSX.Element {
  // Subscribing here re-renders the whole panel on a language switch;
  // MapCanvas re-keys its own memos so the React-Flow nodes follow.
  useSyncExternalStore(subscribeLocale, activeLocale, activeLocale)
  const fontStep = useSyncExternalStore(fontScale.subscribe, fontScale.getSnapshot)

  // The shell selected this panel: publish that so the sidebar button, the
  // hotkey and the context menu all agree on the state — and give the map the
  // width it needs by folding the sidebar away for as long as the panel is up
  // (unmount puts it back, which also covers "opened a session from a card").
  useEffect(() => {
    mapUi.setOpen(true)
    hideSidebarForMap()
    return () => {
      mapUi.setOpen(false)
      restoreSidebarAfterMap()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      // An inner surface (spawn preview, drawer, batch bar, hotkey capture)
      // claims Esc for itself.
      if (mapUi.escapeClaimed()) return
      event.stopPropagation()
      closeMapPanel()
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => { window.removeEventListener('keydown', onKeyDown, { capture: true }) }
  }, [])

  return (
    <div
      className={styles['panel']}
      lang={activeLocale()}
      role="dialog"
      aria-label={t('map.title')}
      // One variable drives every font size in the panel (see talk-pages.module.css).
      style={{ '--tm-font-step': `${fontStep}px` } as React.CSSProperties}
    >
      <div className={styles['header']} data-window-drag="">
        <button
          type="button"
          className={styles['backButton']}
          title={t('map.back')}
          aria-label={t('map.back')}
          onClick={closeMapPanel}
        >
          <BackIcon />
          <span>{t('map.back')}</span>
        </button>
        <span className={styles['headerSpace']} />
        <GlobalSearch onOpenSession={(sessionId) => { openSessionInUi(sessionId) }} />
        <FontSizeButtons />
        <button
          type="button"
          className={styles['closeButton']}
          title={t('map.close')}
          aria-label={t('map.close')}
          onClick={closeMapPanel}
        >
          <CloseIcon />
        </button>
      </div>
      <PageTabs {...props} />
      <MapCanvas {...props} />
    </div>
  )
}
