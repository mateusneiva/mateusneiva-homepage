'use client'

import { useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { useReadingProgress } from './use-reading-progress'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ReadingArticle({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const progress = useReadingProgress(ref)
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  return (
    <article ref={ref} className={className}>
      {mounted && createPortal(<motion.div
        aria-hidden="true"
        data-reading-progress
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-1 origin-left bg-emerald-700 [[data-theme=dark]_&]:bg-accent"
        style={{ scaleX: progress }}
      />, document.body)}
      {children}
    </article>
  )
}
