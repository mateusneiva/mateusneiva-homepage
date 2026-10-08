'use client'

import { motion } from 'framer-motion'
import type { GlowStyle } from './use-proximity-glow'

export function ProximityEdge({
  style,
  kind,
  radius = 200,
}: {
  style: GlowStyle
  kind: 'card' | 'tag'
  radius?: number
}) {
  const edgeStyle: GlowStyle & { '--glow-radius': string } = {
    ...style,
    '--glow-radius': `${radius}px`,
  }
  return (
    <motion.span
      aria-hidden="true"
      data-card-edge-glow={kind === 'card' ? true : undefined}
      data-tag-edge-glow={kind === 'tag' ? true : undefined}
      className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(var(--glow-radius)_circle_at_var(--glow-x)_var(--glow-y),rgb(var(--color-accent)/0.3),transparent_75%)] p-px [mask-clip:content-box,border-box] [mask-composite:exclude] [mask-image:linear-gradient(black,black),linear-gradient(black,black)] motion-reduce:hidden [@media(hover:none)]:hidden [@media(pointer:coarse)]:hidden"
      style={edgeStyle}
    />
  )
}
