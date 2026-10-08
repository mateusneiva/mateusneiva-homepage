import type { IconType } from 'react-icons'
import type { ReactNode } from 'react'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { Link } from '@/i18n/navigation'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { cn } from '@/lib/cn'

export function FooterLink({
  href,
  children,
  icon: Icon,
  internal = false,
}: {
  href: string
  children: ReactNode
  icon?: IconType
  internal?: boolean
}) {
  const className = cn(
    'interactive-link group/link',
    'inline-flex items-center justify-start gap-2 py-1 text-left font-sans text-sm text-muted hover:text-accent sm:justify-end sm:text-right',
  )
  const contents = (
    <>
      {Icon && <Icon size={16} aria-hidden="true" className="shrink-0" />}
      <LinkLabel className="min-w-0">{children}</LinkLabel>
      <AnimatedArrow
        size={14}
        className="opacity-40 group-hover/link:opacity-100 group-focus-visible/link:opacity-100"
      />
    </>
  )
  if (internal)
    return (
      <Link href={href} className={className}>
        {contents}
      </Link>
    )
  const newTab = href.startsWith('https://') || href.endsWith('.pdf')
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {contents}
    </a>
  )
}
