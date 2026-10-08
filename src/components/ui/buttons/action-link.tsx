import type { ComponentProps } from 'react'
import { Link } from '@/i18n/navigation'
import { buttonClassName, type ButtonVariants } from './button-styles'

type ActionLinkProps = ComponentProps<typeof Link> & ButtonVariants

export function ActionLink({ tone, size, selected, className, ...props }: ActionLinkProps) {
  return <Link {...props} className={buttonClassName({ tone, size, selected, className })} />
}
