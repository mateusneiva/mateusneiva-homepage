'use client'

import { useRef, type ReactNode } from 'react'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()
  const ready = usePageReady()
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.15 })
  return (
    <motion.div
      ref={ref}
      className={cn('motion-reduce:!transform-none', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={ready && visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{
        duration: reduced ? 0 : 0.45,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
