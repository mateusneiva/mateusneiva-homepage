'use client'

import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/motion/animated-section'
import { SectionHeading } from '@/components/ui/typography/section-heading'
import { projects, type ProjectCategory } from '@/data/projects'
import { ProjectCard } from '@/components/projects/cards/project-card'
import { SelectionButton } from '@/components/ui/buttons/selection-button'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export function Projects() {
  const t = useTranslations('Projects')
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')
  const selected = projects.filter((project) => filter === 'all' || project.category === filter)
  return (
    <Section id="projects">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <LayoutGroup id="projects">
        <div
          className="relative isolate mb-7 flex w-fit max-w-full flex-wrap gap-2"
          role="group"
          aria-label={t('filterLabel')}
        >
          <ConstructionFrame variant="controls" />

          {(['all', 'web', 'ui', 'automation'] as const).map((category) => (
            <SelectionButton
              key={category}
              onClick={() => setFilter(category)}
              selected={filter === category}
              layoutId="project-filter"
            >
              {t(category)}
            </SelectionButton>
          ))}
        </div>
        <motion.div layout className="relative isolate grid gap-5 md:grid-cols-3">
          <ConstructionFrame
            variant="cards"
            columns={selected.length > 1 ? 'projects' : undefined}
            caption={`${String(selected.length).padStart(2, '0')} / projects`}
          />
          <AnimatePresence mode="popLayout">
            {selected.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </Section>
  )
}
