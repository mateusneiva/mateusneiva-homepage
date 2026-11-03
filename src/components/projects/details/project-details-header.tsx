import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import { BackLink } from '@/components/ui/buttons/back-link'
import { TechnologyTag } from '@/components/ui/tags/technology-tag'
import { ProjectVisual } from '../cards/project-visual'
import type { RepositoryStats } from '@/lib/github/repository'
import { ProjectStats } from '../stats/project-stats'
import { ProjectLink } from './project-link'
import { useProjectLinkLabels } from './use-project-link-labels'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { cn } from '@/lib/cn'

// Licht's screenshot is much taller than the others, so it is cropped to a fixed-height banner.
const croppedCover: Project['id'][] = ['licht']

export function ProjectDetailsHeader({
  project,
  stats,
}: {
  project: Project
  stats?: RepositoryStats | null
}) {
  const t = useTranslations('Projects')
  const details = useTranslations('ProjectDetails')
  const labels = useProjectLinkLabels(project)
  const cropped = croppedCover.includes(project.id)
  return (
    <header id="project-intro" className="scroll-mt-8">
      <BackLink label={details('back')} />
      <div
        className={cn(
          'mb-10 [&>div]:max-h-[50vh]',
          (!project.image || cropped) && '[&>div]:h-64 sm:[&>div]:h-80',
        )}
      >
        <ProjectVisual
          id={project.id}
          image={project.image}
          uncropped={!cropped}
          sizes="(min-width: 1280px) 864px, (min-width: 1024px) calc(100vw - 336px), calc(100vw - 48px)"
        />
      </div>
      <p className="mb-5 font-mono text-xs tracking-widest text-accent uppercase">{t(project.category)}</p>
      <div className="relative isolate">
        <ConstructionFrame variant="title" />
        <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-6xl">
          {project.name}
        </h1>
      </div>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t(project.id)}</p>
      <div className="mt-3 space-y-5">
        <ProjectStats stats={stats} labeled />

        <ul className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.stack.map((name) => (
            <li key={name} className="max-w-full min-w-0">
              <TechnologyTag name={name} />
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-4">
          {project.website && (
            <ProjectLink href={project.website} tone="primary">
              {labels.website}
            </ProjectLink>
          )}
          <ProjectLink href={project.repository} tone="secondary">
            {labels.repository}
          </ProjectLink>
        </div>
      </div>
    </header>
  )
}
