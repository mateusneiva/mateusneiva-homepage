'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BrandMark } from '@/components/ui/brand/brand-mark'
import { cn } from '@/lib/cn'

const exitDuration = 300

// The overlay fades out with CSS so it never depends on the lazily loaded motion features.
export function InitialSiteLoading({ loading, onExitComplete }: { loading: boolean; onExitComplete: () => void }) {
  const reduced = useReducedMotion()
  const t = useTranslations('Loading')
  const [visible, setVisible] = useState(loading)

  useEffect(() => {
    if (loading || !visible) return
    const timer = window.setTimeout(() => {
      setVisible(false)
      onExitComplete()
    }, reduced ? 0 : exitDuration)
    return () => window.clearTimeout(timer)
  }, [loading, visible, reduced, onExitComplete])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      data-initial-loading
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-canvas ease-out',
        loading ? 'opacity-100' : 'opacity-0 transition-opacity duration-300 motion-reduce:transition-none',
      )}
    >
      <BrandMark className="text-6xl sm:text-7xl" />
      <div aria-hidden="true" className="h-px w-20 overflow-hidden bg-raised">
        <span className="block h-full w-1/2 animate-logo-progress bg-accent motion-reduce:w-full motion-reduce:animate-none" />
      </div>
      <span className="sr-only">{t('label')}</span>
    </div>
  )
}
