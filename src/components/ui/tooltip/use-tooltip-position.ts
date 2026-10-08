'use client'

import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { useReducedMotion, useSpring } from 'framer-motion'

export function useTooltipPosition(ref: RefObject<HTMLDivElement | null>, open: boolean) {
  const point = useRef({ x: 0, y: 0, keyboard: false })
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 600, damping: 40, mass: 0.45 })
  const y = useSpring(0, { stiffness: 600, damping: 40, mass: 0.45 })

  const place = useCallback((immediate: boolean) => {
    const element = ref.current
    if (!element) return
    const margin = 16
    const width = element.offsetWidth
    const height = element.offsetHeight
    const cursor = point.current
    const nextX = cursor.keyboard ? cursor.x - width / 2 : cursor.x + 16
    let nextY = cursor.keyboard ? cursor.y - height - 12 : cursor.y + 16
    if (nextY + height > window.innerHeight - margin) nextY = cursor.y - height - 16
    const left = Math.max(margin, Math.min(nextX, window.innerWidth - width - margin))
    const top = Math.max(margin, Math.min(nextY, window.innerHeight - height - margin))
    if (immediate || reduced) {
      x.jump(left)
      y.jump(top)
    } else {
      x.set(left)
      y.set(top)
    }
  }, [ref, reduced, x, y])

  useLayoutEffect(() => {
    if (open) place(true)
  }, [open, place])

  const move = useCallback((clientX: number, clientY: number, keyboard = false) => {
    point.current = { x: clientX, y: clientY, keyboard }
    if (open) place(false)
  }, [open, place])

  return { x, y, move }
}
