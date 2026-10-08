'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import { ProjectVisual } from './project-visual'
import { TechnologyTag } from '@/components/ui/tags/technology-tag'
import { Link } from '@/i18n/navigation'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { MouseCardSurface } from '@/components/ui/motion/mouse-card-surface'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const t = useTranslations('Projects')
  const reduced = useReducedMotion()
  return (
    <motion.article
      layout
      layoutId={`project-${project.id}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
      transition={{
        duration: reduced ? 0 : 0.45,
        delay: reduced ? 0 : index * 0.06,
        y: { duration: reduced ? 0 : 0.25 },
      }}
      className="flex flex-col overflow-hidden motion-reduce:!transform-none"
    >
      <MouseCardSurface className="flex h-full flex-col">
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.name} — ${t('details')}`}
          className="group/card flex h-full flex-col"
        >
          <ProjectVisual id={project.id} image={project.image} />
          <div className="flex min-w-0 flex-1 flex-col p-6">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-subtle">
              0{index + 1} / {t(project.category)}
            </p>
            <h3 className="heading-card">
              <LinkLabel scope="card">{project.name}</LinkLabel>
            </h3>
            <p className="mb-6 mt-3 text-sm leading-6 text-muted">{t(project.id)}</p>
            <ul className="mt-auto flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <TechnologyTag name={tech} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </MouseCardSurface>
    </motion.article>
  )
}
