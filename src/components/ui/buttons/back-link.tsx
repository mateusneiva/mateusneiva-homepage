import { AnimatedArrow } from '../icons/animated-arrow'
import { LinkLabel } from '../typography/link-label'
import { ActionLink } from './action-link'

export function BackLink({ label, href = '/' }: { label: string; href?: string }) {
  return (
    <ActionLink href={href} tone="link" size="inline" className="mb-12">
      <AnimatedArrow direction="left" />
      <LinkLabel>{label}</LinkLabel>
    </ActionLink>
  )
}
