'use client'

import { tv, type VariantProps } from 'tailwind-variants'
import { motion, type HTMLMotionProps } from 'framer-motion'

const footer = tv({
  base: 'mt-5 flex w-full flex-col items-center gap-4 py-14 text-center text-sm',
})

type BadgeVariants = VariantProps<typeof footer>

interface FooterProps extends HTMLMotionProps<'footer'>, BadgeVariants {
  delay?: number
}

export function Footer({ delay = 0, ...props }: FooterProps) {
  return (
    <motion.footer
      className={footer()}
      initial={{ y: 10, opacity: 0, display: 'none' }}
      animate={{ y: 0, opacity: 1, display: 'block' }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      <p>
        &copy; {new Date(Date.now()).getFullYear()} Mateus Neiva. All rights
        reserved.
      </p>
    </motion.footer>
  )
}
