import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/cn'

const highlightStyle = tv({
  base: 'font-medium',
  variants: {
    tone: {
      accent: 'text-accent',
      ink: 'text-ink',
    },
  },
  defaultVariants: { tone: 'accent' },
})

type TextHighlightProps = ComponentProps<'strong'> & VariantProps<typeof highlightStyle>

export function TextHighlight({ tone, className, ...props }: TextHighlightProps) {
  return <strong className={cn(highlightStyle({ tone }), className)} {...props} />
}
