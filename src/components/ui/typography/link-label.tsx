import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

const underlineBase =
  'box-decoration-clone bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size,color] duration-300 ease-out motion-reduce:transition-none'
const labelStyle = tv({
  base: underlineBase,
  variants: {
    scope: {
      link: 'group-hover/link:bg-[length:100%_1px] group-focus-visible/link:bg-[length:100%_1px]',
      card: 'group-hover/card:bg-[length:100%_1px] group-hover/card:text-accent group-focus-within/card:bg-[length:100%_1px] group-focus-within/card:text-accent',
    },
  },
  defaultVariants: { scope: 'link' },
})

export function LinkLabel({
  children,
  className,
  scope = 'link',
}: {
  children: ReactNode
  className?: string
  scope?: 'link' | 'card'
}) {
  return (
    <span
      className={cn(labelStyle({ scope }), className)}
    >
      {children}
    </span>
  )
}
