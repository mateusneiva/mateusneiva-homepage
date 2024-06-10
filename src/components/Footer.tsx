import { tv, type VariantProps } from 'tailwind-variants'

const footer = tv({
  base: 'mt-5 flex w-full flex-col items-center gap-4 py-14 text-center text-sm',
})

type BadgeVariants = VariantProps<typeof footer>

interface FooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

export function Footer({ ...props }: FooterProps) {
  return (
    <footer className={footer()} {...props}>
      <p>
        &copy; {new Date(Date.now()).getFullYear()} Mateus Neiva. All rights
        reserved.
      </p>
    </footer>
  )
}
