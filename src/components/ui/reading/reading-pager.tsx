import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { buttonClassName } from '@/components/ui/buttons/button-styles'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export type ReadingPagerLink = { href: string; title: string; meta?: string }

type ReadingPagerProps = {
  label: string
  previousLabel: string
  nextLabel: string
  previous?: ReadingPagerLink
  next?: ReadingPagerLink
  className?: string
}

const cardClass = 'w-full flex-col items-start gap-2 p-6 sm:min-h-32'

function PagerCard({
  direction,
  label,
  link,
}: {
  direction: 'left' | 'right'
  label: string
  link: ReadingPagerLink
}) {
  const next = direction === 'right'
  return (
    <Link
      href={link.href}
      rel={next ? 'next' : 'prev'}
      className={buttonClassName({
        tone: 'secondary',
        className: cn(cardClass, next && 'sm:col-start-2 sm:items-end sm:text-right'),
      })}
    >
      <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
        {!next && <AnimatedArrow direction="left" size={14} />}
        {label}
        {next && <AnimatedArrow direction="right" size={14} />}
      </span>
      <span className="font-serif text-xl font-medium text-ink">{link.title}</span>
      {link.meta && <span className="font-mono text-xs text-subtle">{link.meta}</span>}
    </Link>
  )
}

export function ReadingPager({
  label,
  previousLabel,
  nextLabel,
  previous,
  next,
  className,
}: ReadingPagerProps) {
  if (!previous && !next) return null
  return (
    <nav aria-label={label} className={cn('mt-20 grid gap-6 sm:grid-cols-2', className)}>
      {previous && <PagerCard direction="left" label={previousLabel} link={previous} />}
      {next && <PagerCard direction="right" label={nextLabel} link={next} />}
    </nav>
  )
}
