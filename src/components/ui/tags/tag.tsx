'use client'

import { useRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tv, type VariantProps } from 'tailwind-variants'
import { useProximityGlow } from '@/components/ui/motion/use-proximity-glow'
import { ProximityEdge } from '@/components/ui/motion/proximity-edge'

const tagStyle = tv({
  base: 'relative isolate inline-flex bg-tag font-mono',
  variants: {
    size: {
      xs: 'px-2 py-1 text-[10px]',
      sm: 'px-2.5 py-1.5 text-[11px]',
      md: 'px-2.5 py-1.5 text-xs leading-4',
    },
    tone: {
      muted: 'text-muted',
      subtle: 'text-subtle',
      ink: 'text-ink',
    },
  },
  defaultVariants: { size: 'sm', tone: 'muted' },
})

type TagProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof tagStyle>

export function Tag({
  className,
  children,
  size,
  tone,
  ...props
}: TagProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { style, opacity } = useProximityGlow(ref, 70)
  return (
    <span
      ref={ref}
      data-proximity-tag
      className={cn(tagStyle({ size, tone }), className)}
      {...props}
    >
      <ProximityEdge kind="tag" radius={90} style={{ ...style, opacity }} />
      {children}
    </span>
  )
}
