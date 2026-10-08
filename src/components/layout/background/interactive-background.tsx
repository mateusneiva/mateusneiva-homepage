'use client'

import { useEffect } from 'react'
import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useScroll,
  motion,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion'
import { subscribePointer } from '@/components/ui/motion/pointer-tracker'
import { ConstructionLines } from '../construction/construction-lines'
import { BackgroundDots } from './background-dots'
import { usePageReady } from '@/components/layout/loading/initial-loading-provider'

type CursorStyle = MotionStyle & {
  '--cursor-x': MotionValue<string>
  '--cursor-y': MotionValue<string>
}

export function InteractiveBackground() {
  const reduced = useReducedMotion()
  const ready = usePageReady()
  const { scrollYProgress } = useScroll()
  const scroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const baseOpacity = useTransform(scroll, [0, 0.5, 1], [0.035, 0.05, 0.035])
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const active = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 180, damping: 30 })
  const smoothY = useSpring(y, { stiffness: 180, damping: 30 })
  const opacity = useSpring(active, { stiffness: 180, damping: 30 })
  const cursorX = useMotionTemplate`${smoothX}px`
  const cursorY = useMotionTemplate`${smoothY}px`
  const dotRadius = useTransform(opacity, [0, 1], [1, 1.65])
  const detailOpacity = useTransform(opacity, [0, 1], [0, 0.08])
  const cursorStyle: CursorStyle = {
    '--cursor-x': cursorX,
    '--cursor-y': cursorY,
    opacity: detailOpacity,
  }

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    return subscribePointer((position) => {
      if (!position) {
        active.set(0)
        return
      }
      x.set(position.x)
      y.set(position.y)
      active.set(1)
    })
  }, [active, reduced, x, y])

  return (
    <motion.div
      aria-hidden="true"
      data-background-pattern
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: 'easeOut' }}
    >
      <BackgroundDots style={{ opacity: baseOpacity }} />
      <ConstructionLines style={cursorStyle} />
      <BackgroundDots highlighted radius={dotRadius} style={cursorStyle} />
    </motion.div>
  )
}
