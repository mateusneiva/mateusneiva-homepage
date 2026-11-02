'use client'

import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { cn } from '@/lib/cn'
import {
  projectSections,
  projectLeadSections,
} from './project-sections'
import { useActiveSection } from '@/components/ui/reading/use-active-section'
import { useLenis } from 'lenis/react'

export function ProjectSectionGuide({ headings }: { headings?: { id: string; title: string }[] }) {
  const t = useTranslations('ProjectDetails')
  const reduced = useReducedMotion()
  const sections = (headings ? projectLeadSections : projectSections).map(({ id, label }) => ({ id: id as string, label: t(label) }))
  if (headings) sections.push(...headings.map(({ id, title }) => ({ id, label: title })))
  const activeId = useActiveSection(sections.map(({ id }) => id))
  const lenis = useLenis()

  function navigate(
    event: MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
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
    <aside className="hidden self-start lg:sticky lg:top-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block" data-project-guide>
      <nav aria-label={t('guide')}>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {t('guide')}
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
