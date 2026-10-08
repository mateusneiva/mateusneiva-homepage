'use client'

import { flushSync } from 'react-dom'

let active: ViewTransition | undefined
let fallbackTimer: number | undefined

export function revealTheme(theme: 'light' | 'dark', update: () => void) {
  const root = document.documentElement
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  active?.skipTransition()
  if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer)
  delete root.dataset.themeFade

  const apply = () => {
    flushSync(update)
    root.dataset.theme = theme
  }

  if (reduced || typeof document.startViewTransition !== 'function') {
    delete root.dataset.themeReveal
    active = undefined
    if (!reduced) root.dataset.themeFade = 'true'
    apply()
    if (!reduced) fallbackTimer = window.setTimeout(() => {
      delete root.dataset.themeFade
      fallbackTimer = undefined
    }, 350)
    return
  }

  root.dataset.themeReveal = theme
  const transition = document.startViewTransition(apply)
  active = transition
  const finish = () => {
    if (active === transition) {
      delete root.dataset.themeReveal
      active = undefined
    }
  }
  void transition.ready.then(undefined, finish)
  void transition.finished.then(finish, finish)
}
