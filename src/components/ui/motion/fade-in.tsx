'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'
import type { HTMLMotionProps } from 'framer-motion'

export function FadeIn({ children, className, delay = 0, ...props }: Omit<HTMLMotionProps<'div'>, 'children'> & { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.15 })
  const ready = usePageReady()
  const reduced = useReducedMotion()

  return (
    <motion.div {...props} ref={ref} className={className} initial={{ opacity: 0 }} animate={{ opacity: ready && visible ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : delay, ease: 'easeOut' }} data-content-fade>
      {children}
    </motion.div>
  )
}
