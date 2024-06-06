import { tv, type VariantProps } from 'tailwind-variants'

const badge = tv({
  base: 'bg-yellow-400 px-2 text-sm text-gray-900',
})

type BadgeVariants = VariantProps<typeof badge>

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

export function Badge({ children, ...props }: BadgeProps) {
  return (
    <p className={badge()} {...props}>
      {children}
    </p>
  )
}
