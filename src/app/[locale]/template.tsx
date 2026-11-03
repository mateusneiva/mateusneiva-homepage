'use client'

import type { ReactNode } from 'react'

import { m, useReducedMotion } from 'framer-motion'

export default function PageTransition({
  children,
}: {
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  return (
    <m.div
      className="motion-reduce:!transform-none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      {children}
    </m.div>
  )
}
