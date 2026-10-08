'use client'

import { useId } from 'react'
import { ConstructionHatch } from './construction-hatch'
import { motion, useReducedMotion } from 'framer-motion'

export function ConstructionDivider({ delay = 0 }: { delay?: number }) {
  const id = `divider-${useId().replace(/:/g, '')}`
  const reduced = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      data-construction-divider
      className="pointer-events-none absolute inset-x-0 -top-4 h-8 origin-left motion-reduce:!transform-none"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <ConstructionHatch className="inset-x-0 top-[calc(50%_+_1px)] h-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible fill-none text-ink">
        <defs>
          <pattern id={id} width="96" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 12V20" stroke="currentColor" strokeWidth="1" className="opacity-[0.08]" />
          </pattern>
        </defs>
        <line
          x1="0"
          y1="16"
          x2="100%"
          y2="16"
          stroke="currentColor"
          strokeWidth="1"
          className="opacity-[0.07]"
        />
        <rect width="100%" height="32" fill={`url(#${id})`} />
        <path d="M-5 16H5M0 11V21" stroke="currentColor" strokeWidth="1" className="opacity-[0.12]" />
        <svg x="100%" width="1" height="32" className="overflow-visible">
          <path d="M-5 16H5M0 11V21" stroke="currentColor" strokeWidth="1" className="opacity-[0.12]" />
        </svg>
      </svg>
    </motion.div>
  )
}
