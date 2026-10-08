import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import type { ReactNode } from 'react'
import { LinkLabel } from '@/components/ui/typography/link-label'

export function ProjectLink({
  href,
  children,
  ariaLabel,
}: {
  href: string
  children: ReactNode
  ariaLabel?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group/link interactive-link inline-flex items-center gap-2 text-accent"
    >
      <LinkLabel>{children}</LinkLabel>
      <AnimatedArrow animated={false} />
    </a>
  )
}
