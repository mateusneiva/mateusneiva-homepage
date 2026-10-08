'use client'

import { Fragment, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'

export function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true, amount: 0.15 })
  const ready = usePageReady()
  const reduced = useReducedMotion()
  const words = text.trim().split(/\s+/)

  return (
    <span ref={ref} data-word-reveal aria-hidden="true">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
            <motion.span
              className="inline-block motion-reduce:!transform-none"
              initial={{ opacity: 0, y: '105%' }}
              animate={ready && visible ? { opacity: 1, y: '0%' } : { opacity: 0, y: '105%' }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay + Math.min(index, 10) * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
