/** Global search panel for the map header (search runs on submit only). */
import { useEffect, useState } from 'react'
import { SearchResults, type SearchHitView } from './SearchResults.tsx'

import { t } from './i18n.ts'
import { allCards, mapUi, sessionTitle } from './map-state.ts'
import { clearSearch, loadSearch, saveSearch } from './search-store.ts'
import styles from './talk-pages.module.css'

/** Storage scope of the header search. */
const GLOBAL_SCOPE = 'global'

export function GlobalSearch(props: { onOpenSession: (sessionId: string, q?: string) => void }): React.JSX.Element {
  // Restored from the last session: jumping into a conversation closes this
  // panel, and coming back should show the same search again.
  const remembered = loadSearch<SearchHitView>(GLOBAL_SCOPE)
  const [query, setQuery] = useState(remembered?.query ?? '')
  /** The query the visible results belong to (empty = panel closed). */
  const [submitted, setSubmitted] = useState('')
  const [hits, setHits] = useState<SearchHitView[]>(remembered?.hits ?? [])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (submitted === '') return
    const release = mapUi.claimEscape('global-search')
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      dismiss()
      release()
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true })
      release()
    }
  }, [submitted])

  /** Manual close: forget the search, otherwise the panel could never be shut. */
  const dismiss = (): void => {
    setSubmitted('')
    setHits([])
    setQuery('')
    clearSearch(GLOBAL_SCOPE)
  }

  /** Local filter over the cards the map has rendered — no corpus query. */
  const run = (value: string): void => {
    const needle = value.trim().toLowerCase()
    if (needle === '') {
      setSubmitted('')
      setHits([])
      return
    }
    setSubmitted(value.trim())
    setSearching(false)
    setError(null)
    const views = allCards()
      .filter(card => card.title.toLowerCase().includes(needle)
        || card.preview.toLowerCase().includes(needle))
      .map(card => {
        const titleHit = card.title.toLowerCase().includes(needle)
        return {
          sessionId: card.sessionId,
          title: card.workspaceTitle === '' ? card.title : card.title + ' · ' + card.workspaceTitle,
          // A title hit already shows its title: no second, identical line.
          blocks: titleHit || card.preview === '' ? [] : [[card.preview]],
          seqs: [null],
          roles: [null],
          byTitle: titleHit,
        }
      })
    setHits(views)
    saveSearch(GLOBAL_SCOPE, { query: value.trim(), hits: views })
  }

  return (
    <div className={styles['globalSearch']}>
      <input
        className={styles['globalSearchInput']}
        value={query}
        placeholder={t('global.searchPlaceholder')}
        aria-label={t('global.searchPlaceholder')}
        data-talkmap-global-search=""
        onChange={(event) => { setQuery(event.target.value) }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return
          event.preventDefault()
          run(query)
        }}
      />
      <button
        type="button"
        className={styles['globalSearchButton']}
        title={t('global.searchRun')}
        aria-label={t('global.searchRun')}
        data-talkmap-global-search-run=""
        onClick={() => { run(query) }}
      >
        {t('global.searchRun')}
      </button>
      {(submitted !== '' || hits.length > 0)
        ? (
            <div
              className={styles['globalSearchBackdrop']}
              onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss() }}
            >
              <div className={styles['globalSearchPanel']} role="dialog" aria-label={t('global.searchTitle')}>
                <div className={styles['globalSearchHead']}>
                  <span className={styles['globalSearchTitle']}>
                    {t('global.searchTitle')}「{submitted}」
                  </span>
                  <span className={styles['drawerSpace']} />
                  <button
                    type="button"
                    className={styles['drawerClose']}
                    title={t('stack.close')}
                    aria-label={t('stack.close')}
                    onClick={dismiss}
                  >
                    ×
                  </button>
                </div>
                <div className={styles['globalSearchBody']}>
                  <SearchResults
                    query={submitted === '' ? query : submitted}
                    hits={hits}
                    empty={t('map.noHit')}
                    onOpenSession={(sessionId) => { props.onOpenSession(sessionId) }}
                  />
                </div>
              </div>
            </div>
          )
        : null}
    </div>
  )
}
