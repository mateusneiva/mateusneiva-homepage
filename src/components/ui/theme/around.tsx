'use client'

import { useId, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { buttonClassName } from '@/components/ui/buttons/button-styles'
import { cn } from '@/lib/cn'

export interface AroundProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  duration?: number
  toggled?: boolean
  [key: `data-${string}`]: string | number | boolean | null | undefined
}

const rays = [
  { cx: 16, cy: 3.3, delay: 0.253 },
  { cx: 27, cy: 9.7, delay: 0.348 },
  { cx: 27, cy: 22.3, delay: 0.443 },
  { cx: 16, cy: 28.7, delay: 0.538 },
  { cx: 5, cy: 22.3, delay: 0.633 },
  { cx: 5, cy: 9.7, delay: 0.728 },
]

// Adapted from the Around sun/moon toggle supplied by the user (toggles.dev).
export function Around({
  duration = 500,
  toggled,
  className,
  type = 'button',
  'aria-label': ariaLabel = 'Toggle theme',
  'aria-pressed': ariaPressed,
  ...props
}: AroundProps) {
  const clipId = `theme-around-${useId().replace(/:/g, '')}`
  const reduced = useReducedMotion()

  return (
    <button
      {...props}
      type={type}
      aria-label={ariaLabel}
      aria-pressed={toggled ?? ariaPressed}
      data-toggled={toggled}
      className={buttonClassName({ tone: 'ghost', size: 'icon', className: cn('group/theme text-muted hover:bg-transparent hover:text-ink', className) })}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        fill="currentColor"
        className="h-5 w-5"
        style={{ '--toggles-around--duration': `${duration}ms` } as CSSProperties}
      >
        <defs>
          <clipPath
            id={clipId}
            className="[transform-origin:center] motion-safe:transition-transform motion-safe:duration-[var(--toggles-around--duration)] group-data-[toggled=true]/theme:-rotate-90"
          >
            <motion.path
              initial={false}
              animate={{ d: toggled ? 'M-12 -14 h42 v30 a1 1 0 0 0 -16 13 H0 Z' : 'M0 0 h42 v30 a1 1 0 0 0 -16 13 H0 Z' }}
              transition={{ duration: reduced ? 0 : duration / 1000 * 0.6, ease: 'easeInOut' }}
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <circle
            cx={16}
            cy={16}
            r={8.4}
            className="[transform-origin:center] motion-safe:transition-transform motion-safe:duration-[var(--toggles-around--duration)] group-data-[toggled=true]/theme:scale-[1.4]"
          />
          {rays.map(({ cx, cy, delay }) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r={2.3}
              style={{ '--ray-delay': `calc(var(--toggles-around--duration) * ${delay})` } as CSSProperties}
              className="[transform-origin:center] motion-safe:transition-transform motion-safe:[transition-duration:calc(var(--toggles-around--duration)*0.2)] motion-safe:[transition-delay:var(--ray-delay)] group-data-[toggled=true]/theme:scale-0 motion-safe:group-data-[toggled=true]/theme:[transition-duration:calc(var(--toggles-around--duration)*0.4)] motion-safe:group-data-[toggled=true]/theme:delay-0"
            />
          ))}
        </g>
      </svg>
    </button>
  )
}
