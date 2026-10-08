import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/cn'

const surfaceEffect = [
  'bg-transparent transition-[transform,color] duration-[180ms] ease-[ease]',
  "before:pointer-events-none before:absolute before:inset-0 before:-z-[1] before:content-['']",
  'before:transition-[background-color,box-shadow] before:duration-[180ms] before:ease-[ease]',
  "after:pointer-events-none after:absolute after:inset-0 after:-z-[2] after:content-['']",
  'after:bg-canvas after:bg-[repeating-linear-gradient(135deg,rgb(var(--color-accent))_0_1px,transparent_1px_4px)]',
  'after:opacity-0 after:[transform:translate(0,0)] after:transition-[transform,opacity] after:duration-[180ms] after:ease-[ease]',
  '[@media(hover:hover)_and_(pointer:fine)]:hover:[transform:translate(-4px,-4px)]',
  '[@media(hover:hover)_and_(pointer:fine)]:hover:after:opacity-100',
  // Keep the texture anchored while the button face moves.
  '[@media(hover:hover)_and_(pointer:fine)]:hover:after:[transform:translate(4px,4px)]',
  'focus-visible:[transform:translate(-4px,-4px)] focus-visible:after:opacity-100 focus-visible:after:[transform:translate(4px,4px)]',
  'active:![transform:translate(0,0)] active:after:![transform:translate(0,0)] active:before:shadow-[0_2px_4px_rgb(0_0_0/0.12)]',
  'motion-reduce:!transform-none motion-reduce:after:!transform-none motion-reduce:after:transition-none motion-reduce:before:transition-none',
]

const buttonStyle = tv({
  base: [
    'group/link relative isolate inline-flex cursor-pointer items-center font-medium',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    tone: {
      primary: 'before:bg-accent text-accent-ink',
      secondary: 'before:bg-surface text-ink hover:before:bg-raised',
      ghost: 'bg-transparent text-ink transition-colors hover:bg-surface',
      link: 'bg-transparent text-accent transition-colors hover:text-ink',
    },
    size: {
      md: 'gap-3 px-5 py-3.5 text-sm',
      sm: 'gap-2 px-4 py-2 text-sm',
      icon: 'h-10 w-10 justify-center p-0',
      'icon-lg': 'h-12 w-12 justify-center p-0',
      inline: 'gap-2 p-0 text-sm font-normal',
    },
    selected: { true: 'text-accent-ink' },
  },
  compoundVariants: [{ tone: ['primary', 'secondary'], class: surfaceEffect }],
  defaultVariants: { tone: 'secondary', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonStyle>

export function buttonClassName({ className, ...variants }: ButtonVariants & { className?: string } = {}) {
  return cn(buttonStyle(variants), className)
}
