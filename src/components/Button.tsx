import { tv, type VariantProps } from 'tailwind-variants'

const button = tv({
  base: 'flex w-full justify-center items-center h-12 px-7 border text-sm tracking-tight sm:justify-between hover:bg-gray-800 hover:shadow-[4px_4px_0px_#FACC15] hover:-translate-y-1 hover:-translate-x-1 transition cursor-pointer',
  variants: {
    color: {
      primary: 'text-yellow-300 border-yellow-400',
      secondary: 'text-white border-gray-700 hover:border-yellow-400',
    },
  },
  defaultVariants: {
    color: 'secondary',
  },
})

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends ButtonVariants {
  children?: React.ReactNode
}

export function Button({ children, color, ...props }: ButtonProps) {
  return (
    <button className={button({ color })} {...props}>
      {children}
    </button>
  )
}
