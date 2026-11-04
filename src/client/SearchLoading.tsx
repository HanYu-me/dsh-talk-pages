/**
 * The waiting state for a search: a thin indeterminate bar plus a couple of
 * placeholder rows. Minimal on purpose — the search takes ~1s, so this is a
 * hint that something is happening, not a show.
 */
import styles from './talk-pages.module.css'

export function SearchLoading(props: { rows?: number }): React.JSX.Element {
  const rows = props.rows ?? 2
  return (
    <div className={styles['searchLoading']} data-talkmap-search-loading="">
      <div className={styles['searchLoadingBar']}><i /></div>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={styles['searchSkeletonRow']}>
          <span className={styles['searchSkeletonTitle']} />
          <span className={styles['searchSkeletonLine']} />
        </div>
      ))}
    </div>
  )
}
