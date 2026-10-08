import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function FooterGroup({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <nav aria-label={title} className={cn('text-left sm:text-right', className)}>
      <h3 className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
        {title}
      </h3>
      <ul className="flex flex-col items-start gap-2 sm:items-end">{children}</ul>
    </nav>
  )
}
