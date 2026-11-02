'use client'

import { useReducedMotion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import type { MouseEvent } from 'react'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { cn } from '@/lib/cn'
import { useActiveSection } from './use-active-section'

export type ReadingGuideSection = { id: string; label: string }

export function ReadingGuide({
  title,
  sections,
  className,
}: {
  title: string
  sections: ReadingGuideSection[]
  className?: string
}) {
  const reduced = useReducedMotion()
  const activeId = useActiveSection(sections.map(({ id }) => id))
  const lenis = useLenis()

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const section = document.getElementById(id)
    if (!section) return
    event.preventDefault()
    if (lenis) lenis.scrollTo(section)
    else section.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
    window.history.replaceState(window.history.state, '', `#${id}`)
  }

  return (
    <aside className={className} data-project-guide>
      <nav aria-label={title}>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {title}
        </h2>
        <ol className="flex flex-wrap gap-1 lg:flex-col">
          {sections.map(({ id, label }, index) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={activeId === id ? 'location' : undefined}
                onClick={(event) => navigate(event, id)}
                className={cn(
                  'interactive-link group/link flex items-center gap-3 px-3 py-2.5 font-mono text-xs',
                  activeId === id ? 'bg-surface text-accent' : 'text-subtle hover:text-ink',
                )}
              >
                <span aria-hidden="true" className="text-[10px] opacity-60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <LinkLabel>{label}</LinkLabel>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
