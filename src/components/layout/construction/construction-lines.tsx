'use client'

import { m, type MotionStyle } from 'framer-motion'
import { ConstructionGrid } from './construction-grid'
import { ConstructionRails } from './construction-rails'

export function ConstructionLines({ style }: { style: MotionStyle }) {
  const spotlight =
    'absolute inset-0 [mask-image:radial-gradient(200px_circle_at_var(--cursor-x)_var(--cursor-y),black,transparent)] motion-reduce:hidden [@media(hover:none)]:hidden [@media(pointer:coarse)]:hidden'
  return (
    <div data-construction-lines className="pointer-events-none absolute inset-0">
      <ConstructionGrid />
      <ConstructionRails />
      <m.div className={spotlight} style={style}>
        <ConstructionGrid highlighted />
      </m.div>
      <m.div className={spotlight} style={style}>
        <ConstructionRails highlighted />
      </m.div>
    </div>
  )
}
