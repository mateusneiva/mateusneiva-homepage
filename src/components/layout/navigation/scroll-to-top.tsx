'use client'

import { useSyncExternalStore } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { useLenis } from 'lenis/react'

function subscribeScroll(listener: () => void) {
  window.addEventListener('scroll', listener, { passive: true })
  return () => window.removeEventListener('scroll', listener)
}

function getScrollSnapshot() {
  return window.scrollY > 400
}

export function ScrollToTop() {
  const t = useTranslations('Footer')
  const reduced = useReducedMotion()
  const lenis = useLenis()
  const visible = useSyncExternalStore(subscribeScroll, getScrollSnapshot, () => false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 sm:right-8"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : 12 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          <ActionButton
            tone="primary"
            size="icon-lg"
            aria-label={t('top')}
            title={t('top')}
            onClick={() => lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
            className="pointer-events-auto shadow-[0_6px_20px_rgb(0_0_0/0.15)]"
          >
            <AnimatedArrow direction="up" size={20} />
          </ActionButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
