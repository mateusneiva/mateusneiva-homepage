import { cn } from '@/lib/cn'
import { tv } from 'tailwind-variants'
import {
  FiArrowUpRight,
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'
const arrowMotion =
  'shrink-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:!transform-none motion-reduce:transition-none'
const arrowDirections = {
  'up-right':
    'group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-focus-visible/link:-translate-y-0.5 group-focus-visible/link:translate-x-0.5',
  up: 'group-hover/link:-translate-y-1 group-focus-visible/link:-translate-y-1',
  down: 'group-hover/link:translate-y-0.5 group-focus-visible/link:translate-y-0.5',
  left: 'group-hover/link:-translate-x-0.5 group-focus-visible/link:-translate-x-0.5',
  right: 'group-hover/link:translate-x-0.5 group-focus-visible/link:translate-x-0.5',
}

const icons = {
  'up-right': FiArrowUpRight,
  up: FiArrowUp,
  down: FiArrowDown,
  left: FiArrowLeft,
  right: FiArrowRight,
}

const arrowStyle = tv({
  base: arrowMotion,
  variants: { direction: arrowDirections },
})

export function AnimatedArrow({
  direction = 'up-right',
  size = 16,
  className,
  animated = true,
}: {
  direction?: keyof typeof icons
  size?: number
  className?: string
  animated?: boolean
}) {
  const Icon = icons[direction]
  return (
    <Icon
      size={size}
      aria-hidden="true"
      focusable="false"
      data-arrow-direction={direction}
      className={cn(
        'shrink-0',
        animated && arrowStyle({ direction }),
        className
      )}
    />
  )
}
