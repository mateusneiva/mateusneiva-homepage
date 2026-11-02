import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import type { ReactNode } from 'react'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { buttonClassName, type ButtonVariants } from '@/components/ui/buttons/button-styles'

export function ProjectLink({
  href,
  children,
  ariaLabel,
  tone,
}: {
  href: string
  children: ReactNode
  ariaLabel?: string
  tone?: ButtonVariants['tone']
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={tone ? buttonClassName({ tone }) : 'group/link interactive-link inline-flex items-center gap-2 text-accent'}
    >
      {tone ? children : <LinkLabel>{children}</LinkLabel>}
      <AnimatedArrow animated={false} />
    </a>
  )
}
