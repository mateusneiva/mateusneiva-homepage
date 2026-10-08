import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const guideStyle = tv({
  base: 'relative isolate',
  variants: {
    leading: {
      '7': '[--text-rhythm:1.75rem]',
      '8': '[--text-rhythm:2rem]',
      relaxed: '[--text-rhythm:1.625em]',
    },
  },
  defaultVariants: { leading: '7' },
})

type TextGuidesProps = {
  children: ReactNode
  className?: string
  leading?: '7' | '8' | 'relaxed'
}

export function TextGuides({ children, className, leading }: TextGuidesProps) {
  return (
    <div className={cn(guideStyle({ leading }), className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_calc(100%_-_1px),rgb(var(--color-ink)/0.03)_0)] bg-[length:100%_var(--text-rhythm)] [mask-image:linear-gradient(to_right,black,transparent_90%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-3 -z-10 w-3 border-l border-ink/[0.06] bg-[repeating-linear-gradient(to_bottom,rgb(var(--color-ink)/0.065)_0_1px,transparent_1px_var(--text-rhythm))]"
      />
      {children}
    </div>
  )
}
