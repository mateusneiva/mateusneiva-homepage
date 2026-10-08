import { cn } from '@/lib/cn'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex h-[1em] items-center leading-none text-ink', className)}
    >
      <svg viewBox="0 0 1404 518" className="h-[0.52em] w-auto overflow-visible">
        <use href="/logo.svg#logo-mark" />
        <use href="/logo.svg#logo-dot" className="text-accent" />
      </svg>
    </span>
  )
}
