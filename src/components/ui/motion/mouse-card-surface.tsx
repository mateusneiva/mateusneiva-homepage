'use client'

import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useProximityGlow } from './use-proximity-glow'
import { ProximityEdge } from './proximity-edge'

export function MouseCardSurface({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { style, opacity, interiorOpacity } = useProximityGlow(ref)
  return (
    <div
      ref={ref}
      data-mouse-card-surface
      className={cn('relative isolate overflow-hidden bg-surface', className)}
    >
      <motion.div
        aria-hidden="true"
        data-card-mouse-glow
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(180px_circle_at_var(--glow-x)_var(--glow-y),rgb(var(--color-accent)/0.035),transparent_75%)] motion-reduce:hidden [@media(hover:none)]:hidden [@media(pointer:coarse)]:hidden"
        style={{ ...style, opacity: interiorOpacity }}
      />
      <ProximityEdge kind="card" style={{ ...style, opacity }} />
      {children}
    </div>
  )
}
