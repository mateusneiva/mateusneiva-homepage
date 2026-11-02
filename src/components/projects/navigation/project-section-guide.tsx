'use client'

import { useTranslations } from 'next-intl'
import { ReadingGuide } from '@/components/ui/reading/reading-guide'
import {
  projectSections,
  projectLeadSections,
  projectClosingSection,
} from './project-sections'

export function ProjectSectionGuide({ headings }: { headings?: { id: string; title: string }[] }) {
  const t = useTranslations('ProjectDetails')
  const sections = (headings ? projectLeadSections : projectSections).map(({ id, label }) => ({ id: id as string, label: t(label) }))
  if (headings) {
    sections.push(...headings.map(({ id, title }) => ({ id, label: title })))
    sections.push({ id: projectClosingSection.id, label: t(projectClosingSection.label) })
  }

  return (
    <ReadingGuide
      title={t('guide')}
      sections={sections}
      className="hidden self-start lg:sticky lg:top-8 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block"
    />
  )
}
