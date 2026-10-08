'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

export function FooterMarquee({ lines }: { lines: readonly [string, string] }) {
  const container = useRef<HTMLDivElement>(null)
  const visible = useInView(container, { amount: 0.2 })
  const reduced = useReducedMotion()
  return (
    <div
      ref={container}
      aria-hidden="true"
      className="space-y-3 overflow-hidden py-12 sm:space-y-5 sm:py-16"
      data-footer-marquee
    >
      {lines.map((text, row) => (
        <div key={text} data-footer-marquee-row={row}>
          <p className="footer-signature page-container hidden motion-reduce:block">{text}</p>
          <motion.div
            className={`footer-signature flex w-max motion-reduce:hidden ${row === 1 ? 'text-transparent [-webkit-text-stroke:1px_rgb(var(--color-ink)/0.2)]' : ''}`}
            initial={false}
            animate={visible && !reduced
              ? { x: row === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }
              : { x: row === 0 ? '0%' : '-50%' }}
            transition={{ x: { duration: row === 0 ? 60 : 70, repeat: Infinity, ease: 'linear' } }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
                {[0, 1].map((item) => (
                  <span key={item} className="whitespace-nowrap">
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
