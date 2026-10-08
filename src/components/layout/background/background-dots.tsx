'use client'

import { useId } from 'react'
import { motion, type MotionStyle, type MotionValue } from 'framer-motion'

export function BackgroundDots({
  radius = 1,
  highlighted = false,
  style,
}: {
  radius?: number | MotionValue<number>
  highlighted?: boolean
  style?: MotionStyle
}) {
  const id = `dots-${useId().replace(/:/g, '')}`

  return (
    <motion.svg
      aria-hidden="true"
      data-cursor-dots={highlighted ? true : undefined}
      className={`absolute inset-0 h-full w-full ${highlighted ? 'text-accent [mask-image:radial-gradient(220px_circle_at_var(--cursor-x)_var(--cursor-y),black,transparent)] motion-reduce:hidden [@media(hover:none)]:hidden [@media(pointer:coarse)]:hidden' : 'text-ink opacity-[0.035] motion-reduce:!opacity-[0.035]'}`}
      style={style}
    >
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <motion.circle cx="12.5" cy="12.5" r={radius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </motion.svg>
  )
}
