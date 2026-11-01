'use client'

import type { ReactNode } from 'react'
import { motion, type MotionStyle } from 'framer-motion'
import { ConstructionGrid } from './construction-grid'
import { ConstructionRails } from './construction-rails'

export function ConstructionLines({ style, children }: { style: MotionStyle; children?: ReactNode }) {
  // One masked layer: the mask repaints on every cursor move, so layers must share it.
  const spotlight =
    'absolute inset-0 [mask-image:radial-gradient(220px_circle_at_var(--cursor-x)_var(--cursor-y),black,transparent)] motion-reduce:hidden [@media(hover:none)]:hidden [@media(pointer:coarse)]:hidden'
  return (
    <div data-construction-lines className="pointer-events-none absolute inset-0">
      <ConstructionGrid />
      <ConstructionRails />
      <motion.div className={spotlight} style={style}>
        <ConstructionGrid highlighted />
        <ConstructionRails highlighted />
        {children}
      </motion.div>
    </div>
  )
}
