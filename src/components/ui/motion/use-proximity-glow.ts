'use client'

import { useEffect, type RefObject } from 'react'
import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion'
import { subscribePointer } from './pointer-tracker'

export type GlowStyle = MotionStyle & {
  '--glow-x': MotionValue<string>
  '--glow-y': MotionValue<string>
}

export function useProximityGlow(ref: RefObject<HTMLElement | null>, reach = 150) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const nearby = useMotionValue(0)
  const inside = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 400, damping: 40 })
  const smoothY = useSpring(y, { stiffness: 400, damping: 40 })
  const opacity = useSpring(nearby, { stiffness: 250, damping: 30 })
  const interiorOpacity = useSpring(inside, { stiffness: 250, damping: 30 })
  const glowX = useMotionTemplate`${smoothX}px`
  const glowY = useMotionTemplate`${smoothY}px`
  const style: GlowStyle = { '--glow-x': glowX, '--glow-y': glowY }

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const element = ref.current
    if (!element) return
    let unsubscribe: (() => void) | undefined
    const subscribe = () =>
      subscribePointer((position) => {
        if (!position) {
          nearby.set(0)
          inside.set(0)
          return
        }
        const bounds = element.getBoundingClientRect()
        const dx = Math.max(bounds.left - position.x, 0, position.x - bounds.right)
        const dy = Math.max(bounds.top - position.y, 0, position.y - bounds.bottom)
        const distance = Math.hypot(dx, dy)
        const visible = bounds.bottom > 0 && bounds.top < window.innerHeight
        nearby.set(visible ? Math.max(0, 1 - distance / reach) : 0)
        inside.set(visible && distance === 0 ? 1 : 0)
        if (!visible || distance > reach) return
        x.set(position.x - bounds.left)
        y.set(position.y - bounds.top)
      })
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        unsubscribe ??= subscribe()
      } else {
        unsubscribe?.()
        unsubscribe = undefined
        nearby.set(0)
        inside.set(0)
      }
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      unsubscribe?.()
      nearby.set(0)
      inside.set(0)
    }
  }, [inside, nearby, reach, reduced, ref, x, y])

  return { style, opacity, interiorOpacity }
}
