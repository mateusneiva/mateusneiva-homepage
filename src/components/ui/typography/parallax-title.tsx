'use client'

import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { useTitlePointerParallax } from './use-title-pointer-parallax'
import { cn } from '@/lib/cn'
import { tv } from 'tailwind-variants'
import { WordReveal } from '@/components/ui/motion/word-reveal'

const titleStyle = tv({
  variants: { variant: { hero: 'heading-hero', section: 'heading-section' } },
  defaultVariants: { variant: 'section' },
})

export function ParallaxTitle({ title, highlight, level = 2, variant = 'section' }: {
  title: string
  highlight?: string
  level?: 1 | 2
  variant?: 'hero' | 'section'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pointer = useTitlePointerParallax(ref)
  const outlineOpacity = useTransform(() => Math.min(0.3, (Math.abs(pointer.x.get()) + Math.abs(pointer.y.get())) / 60))
  const Heading = level === 1 ? 'h1' : 'h2'

  return (
    <div ref={ref} className="relative isolate" data-parallax-title>
      <ConstructionFrame variant="title" />
      <motion.span
        aria-hidden="true"
        data-parallax-title-outline
        className={cn(titleStyle({ variant }), 'pointer-events-none absolute inset-0 -z-[1] select-none text-transparent motion-reduce:hidden [-webkit-text-stroke:1px_rgb(var(--color-ink)/0.3)]')}
        style={{ x: pointer.x, y: pointer.y, opacity: outlineOpacity }}
      >
        {title}
        {highlight && <span className="block [-webkit-text-stroke-color:rgb(var(--color-accent)/0.3)]">{highlight}</span>}
      </motion.span>
      <Heading className={titleStyle({ variant })} aria-label={`${title}${highlight ? ` ${highlight}` : ''}`}>
        <WordReveal text={title} />
        {highlight && <span className="block text-accent"><WordReveal text={highlight} delay={0.12} /></span>}
      </Heading>
    </div>
  )
}
