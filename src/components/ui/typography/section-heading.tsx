import { ParallaxTitle } from './parallax-title'
import type { ReactNode } from 'react'
import { FadeIn } from '@/components/ui/motion/fade-in'

export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <FadeIn className="mb-9 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-xl">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <ParallaxTitle title={title} />
        {description && (
          <p className="mt-4 leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {children}
    </FadeIn>
  )
}
