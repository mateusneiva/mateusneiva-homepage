'use client'

import { useEffect, type ReactNode } from 'react'
import { useTheme } from './use-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    if (resolvedTheme) document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])
  return children
}
