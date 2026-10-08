'use client'

import { useId } from 'react'

export function ConstructionGrid({ highlighted = false }: { highlighted?: boolean }) {
  const id = `construction-${useId().replace(/:/g, '')}`
  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full fill-none [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_90%)] ${highlighted ? 'text-accent' : 'text-ink'}`}
    >
      <defs>
        <pattern id={id} width="144" height="144" patternUnits="userSpaceOnUse">
          <path
            d="M0 144V0H144"
            stroke="currentColor"
            strokeWidth="1"
            className={highlighted ? 'opacity-30' : 'opacity-[0.035]'}
          />
          <path
            d="M0 72H144M72 0V144"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 9"
            className={highlighted ? 'opacity-20' : 'opacity-[0.022]'}
          />
          <path
            d="M68 72H76M72 68V76"
            stroke="currentColor"
            strokeWidth="1"
            className={highlighted ? 'opacity-40' : 'opacity-[0.075]'}
          />
          <path
            d="M0 36H144M0 108H144M36 0V144M108 0V144"
            stroke="currentColor"
            strokeWidth="1"
            className={highlighted ? 'opacity-10' : 'opacity-[0.012]'}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
