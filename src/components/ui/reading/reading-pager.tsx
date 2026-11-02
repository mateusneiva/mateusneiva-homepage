import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { buttonClassName } from '@/components/ui/buttons/button-styles'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/cn'

export type ReadingPagerLink = { href: string; title: string; meta?: string }

type ReadingPagerProps = {
  label: string
  previousLabel: string
  nextLabel: string
  previousEmpty: string
  nextEmpty: string
  previous?: ReadingPagerLink
  next?: ReadingPagerLink
  className?: string
}

const cardClass = 'w-full flex-col items-start gap-2 p-6 sm:min-h-32'
const nextClass = 'sm:items-end sm:text-right'

function PagerCard({
  direction,
  label,
  link,
  empty,
}: {
  direction: 'left' | 'right'
  label: string
  link?: ReadingPagerLink
  empty: string
}) {
  const heading = (
    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-subtle">
      {direction === 'left' && <AnimatedArrow direction="left" size={14} />}
      {label}
      {direction === 'right' && <AnimatedArrow direction="right" size={14} />}
    </span>
  )
  const alignment = direction === 'right' ? nextClass : undefined
  if (!link) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonClassName({ tone: 'secondary', className: cardClass }),
          'pointer-events-none cursor-default opacity-50',
          alignment,
        )}
      >
        {heading}
        <span className="text-sm text-subtle">{empty}</span>
      </span>
    )
  }
  return (
    <Link
      href={link.href}
      rel={direction === 'left' ? 'prev' : 'next'}
      className={buttonClassName({ tone: 'secondary', className: cn(cardClass, alignment) })}
    >
      {heading}
      <span className="font-serif text-xl font-medium text-ink">{link.title}</span>
      {link.meta && <span className="font-mono text-xs text-subtle">{link.meta}</span>}
    </Link>
  )
}

export function ReadingPager({
  label,
  previousLabel,
  nextLabel,
  previousEmpty,
  nextEmpty,
  previous,
  next,
  className,
}: ReadingPagerProps) {
  return (
    <nav aria-label={label} className={cn('mt-20 grid gap-6 sm:grid-cols-2', className)}>
      <PagerCard direction="left" label={previousLabel} link={previous} empty={previousEmpty} />
      <PagerCard direction="right" label={nextLabel} link={next} empty={nextEmpty} />
    </nav>
  )
}
