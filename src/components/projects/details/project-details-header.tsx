import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import { HistoryBackButton } from '@/components/ui/buttons/history-back-button'
import { ProjectVisual } from '../cards/project-visual'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export function ProjectDetailsHeader({ project }: { project: Project }) {
  const t = useTranslations('Projects')
  const details = useTranslations('ProjectDetails')
  return (
    <header id="project-intro" className="scroll-mt-8">
      <HistoryBackButton label={details('back')} fallback="/#projects" />
      <p className="mb-5 font-mono text-xs uppercase tracking-widest text-accent">{t(project.category)}</p>
      <div className="relative isolate">
        <ConstructionFrame variant="title" />
        <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-6xl">
          {project.name}
        </h1>
      </div>
      <p className="mb-10 mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t(project.id)}</p>
      <div className="[&>div]:h-64 sm:[&>div]:h-80">
        <ProjectVisual
          id={project.id}
          image={project.image}
          sizes="(min-width: 1280px) 864px, (min-width: 1024px) calc(100vw - 336px), calc(100vw - 48px)"
        />
      </div>
    </header>
  )
}
