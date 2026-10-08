'use client'

import { useSyncExternalStore } from 'react'
import type { ThemeMode } from './theme-types'

const mediaQuery = '(prefers-color-scheme: dark)'
const changeEvent = 'portfolio-theme-change'
let fallbackTheme: ThemeMode = 'system'

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getSnapshot() {
  let theme = fallbackTheme
  try {
    const stored = localStorage.getItem('theme')
    theme = isThemeMode(stored) ? stored : 'system'
  } catch {
    // Keep the selected theme in memory when storage is unavailable.
  }
  const resolved = theme === 'system'
    ? (window.matchMedia(mediaQuery).matches ? 'dark' : 'light')
    : theme
  return `${theme}:${resolved}`
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(mediaQuery)
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'theme' || event.key === null) callback()
  }
  media.addEventListener('change', callback)
  window.addEventListener('storage', onStorage)
  window.addEventListener(changeEvent, callback)
  return () => {
    media.removeEventListener('change', callback)
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(changeEvent, callback)
  }
}

function setTheme(value: string) {
  if (!isThemeMode(value)) return
  fallbackTheme = value
  try {
    localStorage.setItem('theme', value)
  } catch {
    // The in-memory selection remains available to the current document.
  }
  window.dispatchEvent(new Event(changeEvent))
}

const getServerSnapshot = () => ''

export function useTheme() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [theme, resolvedTheme] = snapshot.split(':') as [ThemeMode | undefined, 'light' | 'dark' | undefined]
  return { theme: theme || undefined, resolvedTheme, setTheme }
}
