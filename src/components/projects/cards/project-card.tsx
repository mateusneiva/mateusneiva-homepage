'use client'

import { m, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import type { RepositoryStats } from '@/lib/github/repository'
import { ProjectVisual } from './project-visual'
import { ProjectStats } from '../stats/project-stats'
import { TechnologyTag } from '@/components/ui/tags/technology-tag'
import { Link } from '@/i18n/navigation'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { MouseCardSurface } from '@/components/ui/motion/mouse-card-surface'

type ProjectCardProps = { project: Project; index: number; stats?: RepositoryStats | null }

export function ProjectCard({ project, index, stats }: ProjectCardProps) {
  const t = useTranslations('Projects')
  const reduced = useReducedMotion()
  return (
    <m.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
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
            <p className="mt-3 text-sm leading-6 text-muted">{t(project.id)}</p>
            <ProjectStats stats={stats} className="mt-4" />
            <ul className="mt-auto flex flex-wrap gap-2 pt-6">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <TechnologyTag name={tech} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </MouseCardSurface>
    </m.article>
  )
}
