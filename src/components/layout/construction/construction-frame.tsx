'use client'

import { useId } from 'react'
import { ConstructionCorners } from './construction-corners'
import { ConstructionColumns, type ConstructionColumnLayout } from './construction-columns'
import { ConstructionHatch } from './construction-hatch'
import { cn } from '@/lib/cn'

export function ConstructionFrame({
  variant = 'title',
  columns,
  caption,
}: {
  variant?: 'title' | 'controls' | 'cards' | 'tooltip'
  columns?: ConstructionColumnLayout
  caption?: string
}) {
  const id = `frame-${useId().replace(/:/g, '')}`
  return (
    <div
      aria-hidden="true"
      data-construction-frame={variant}
      className={cn(
        'pointer-events-none absolute -z-10 !m-0',
        variant === 'tooltip' ? 'inset-0' : '-inset-x-4 -inset-y-2 sm:-inset-x-6',
      )}
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible fill-none text-ink">
        <defs>
          <pattern id={id} width="48" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 0V3" stroke="currentColor" strokeWidth="1" className="opacity-[0.09]" />
          </pattern>
        </defs>
        <g stroke="currentColor" strokeWidth="1" className="opacity-[0.07]">
          <line x1="0" y1="0" x2="100%" y2="0" />
          <line x1="0" y1="100%" x2="100%" y2="100%" />
        </g>
        <g stroke="currentColor" strokeWidth="1" className="opacity-[0.045]">
          <line x1="0" y1="-12" x2="0" y2="100%" strokeDasharray="3 7" />
          <line x1="100%" y1="-12" x2="100%" y2="100%" strokeDasharray="3 7" />
        </g>
        {variant !== 'title' && <rect width="100%" height="8" fill={`url(#${id})`} />}
        <ConstructionCorners />
      </svg>
      {variant === 'tooltip' && (
        <>
          <ConstructionHatch className="inset-y-0 left-0 w-1.5" />
          <ConstructionHatch className="inset-y-0 right-0 w-1.5" />
        </>
      )}
      {variant === 'controls' && (
        <ConstructionHatch className="inset-x-0 -top-2 h-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" />
      )}
      {columns && <ConstructionColumns layout={columns} />}
      {caption && (
        <span className="absolute -top-4 right-4 bg-canvas px-2 font-mono text-[8px] uppercase tracking-[0.16em] text-subtle/60 sm:right-6">
          {caption}
        </span>
      )}
    </div>
  )
}
