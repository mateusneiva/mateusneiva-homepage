'use client'

import type { ReactNode } from 'react'

import { LazyMotion, MotionConfig } from 'framer-motion'

const loadFeatures = () => import('./motion-features').then((module) => module.default)

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
