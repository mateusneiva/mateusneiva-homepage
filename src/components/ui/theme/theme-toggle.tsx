'use client'

import { useTranslations } from 'next-intl'
import { Around } from './around'
import { useTheme } from './use-theme'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { revealTheme } from './reveal-theme'

export function ThemeToggle() {
  const t = useTranslations('Theme')
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <>
      {resolvedTheme ? (
        <Around className="h-8 w-8" toggled={dark} aria-label={t('label')} onClick={() => {
          const next = dark ? 'light' : 'dark'
          revealTheme(next, () => setTheme(next))
        }} />
      ) : (
        <ActionButton tone="ghost" size="icon" className="h-8 w-8" disabled aria-label={t('label')} aria-pressed={false}>
          <span aria-hidden="true" className="h-5 w-5" />
        </ActionButton>
      )}
    </>
  )
}
