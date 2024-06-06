'use client'

import { tv, type VariantProps } from 'tailwind-variants'
import { motion, type HTMLMotionProps } from 'framer-motion'

const section = tv({
  base: 'flex flex-col pt-20',
})

type sectionVariants = VariantProps<typeof section>

interface SectionProps extends HTMLMotionProps<'section'>, sectionVariants {
  delay?: number
}

export function Section({ children, delay = 0, ...props }: SectionProps) {
  return (
    <motion.section
      className={section()}
      initial={{ y: 10, opacity: 0, display: 'none' }}
      animate={{ y: 0, opacity: 1, display: 'block' }}
      transition={{ duration: 1, delay }}
      {...props}
    >
      {children}
    </motion.section>
  )
}
