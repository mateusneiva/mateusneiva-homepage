import { cn } from '@/lib/cn'

export function ConstructionHatch({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute bg-[repeating-linear-gradient(135deg,rgb(var(--color-ink)/0.055)_0_1px,transparent_1px_6px)] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
    />
  )
}
