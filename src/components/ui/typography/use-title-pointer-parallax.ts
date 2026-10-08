'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion, useSpring } from 'framer-motion'
import { subscribePointer } from '@/components/ui/motion/pointer-tracker'

export function useTitlePointerParallax(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 180, damping: 28 })
  const y = useSpring(0, { stiffness: 180, damping: 28 })
  const previous = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (reduced) {
      x.jump(0)
      y.jump(0)
      return
    }
    const media = window.matchMedia('(min-width: 640px) and (hover: hover) and (pointer: fine)')
    return subscribePointer((position) => {
      if (!media.matches) {
        x.jump(0)
        y.jump(0)
        return
      }
      if (position === previous.current || (position && previous.current
        && position.x === previous.current.x && position.y === previous.current.y)) return
      previous.current = position
      const bounds = ref.current?.getBoundingClientRect()
      if (!position || !bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) {
        x.set(0)
        y.set(0)
        return
      }
      const horizontal = Math.max(-1, Math.min(1, (position.x / document.documentElement.clientWidth - 0.5) * 2))
      const vertical = Math.max(-1, Math.min(1, (position.y / window.innerHeight - 0.5) * 2))
      x.set(horizontal * 35)
      y.set(vertical * 18)
    })
  }, [ref, reduced, x, y])

  return { x, y }
}
