'use client'

import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import { m, type HTMLMotionProps } from 'framer-motion'
import { ConstructionDivider } from '@/components/layout/construction/construction-divider'

interface SectionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children?: ReactNode
  delay?: number
}

export function Section({ children, delay = 0, className, ...props }: SectionProps) {
  return (
    <m.section
      className={cn('relative scroll-mt-6 py-16 sm:py-24', className)}
      initial={false}
      {...props}
    >
      <ConstructionDivider delay={delay} />
      {children}
    </m.section>
  )
}
