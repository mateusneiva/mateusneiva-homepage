'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BrandMark } from '@/components/ui/brand/brand-mark'

export function InitialSiteLoading({ loading, onExitComplete }: { loading: boolean; onExitComplete: () => void }) {
  const reduced = useReducedMotion()
  const t = useTranslations('Loading')

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {loading && (
        <motion.div
          role="status"
          aria-live="polite"
          data-initial-loading
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-canvas"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
        >
          <BrandMark className="text-6xl sm:text-7xl" />
          <div aria-hidden="true" className="h-px w-20 overflow-hidden bg-raised">
            <span className="block h-full w-1/2 animate-logo-progress bg-accent motion-reduce:w-full motion-reduce:animate-none" />
          </div>
          <span className="sr-only">{t('label')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
