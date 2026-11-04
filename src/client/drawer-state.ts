/**
 * The stack drawer's own little persistence: which folder is open and how far it
 * was scrolled. Leaving the map (to read a conversation) unmounts the whole
 * panel, so the drawer has to remember itself — opening the map again should
 * come back to the same folder, same scroll.
 *
 * Explicitly closing the drawer (Esc / X / backdrop) clears it.
 */
const GROUP_KEY = 'dsh.talk-pages.drawer.v1'
const SCROLL_KEY = 'dsh.talk-pages.drawer-scroll.v1'

function safeRead(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeWrite(key: string, value: string | null): void {
  try {
    if (typeof localStorage === 'undefined') return
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    /* private mode / quota: the drawer just will not be restored */
  }
}

export const drawerState = {
  /** Folder the drawer was last open on, or null. */
  readGroup(): string | null {
    const value = safeRead(GROUP_KEY)
    return value === null || value === '' ? null : value
  },
  writeGroup(groupId: string | null): void {
    safeWrite(GROUP_KEY, groupId)
  },
  readScroll(): number {
    const raw = safeRead(SCROLL_KEY)
    const value = raw === null ? 0 : Number(raw)
    return Number.isFinite(value) && value > 0 ? value : 0
  },
  writeScroll(offset: number): void {
    safeWrite(SCROLL_KEY, String(Math.max(0, Math.round(offset))))
  },
  /** Both together: closing the drawer forgets where it was. */
  clear(): void {
    safeWrite(GROUP_KEY, null)
    safeWrite(SCROLL_KEY, null)
  },
}
