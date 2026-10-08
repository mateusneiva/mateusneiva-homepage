import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import { TechnologyTag } from '@/components/ui/tags/technology-tag'
import { ProjectLink } from './project-link'
import { ProjectDetailSection } from './project-detail-section'
import { ProjectNarrative } from './project-narrative'
import { ProjectFeatures } from './project-features'

export function ProjectDetailsContent({ project }: { project: Project }) {
  const t = useTranslations('ProjectDetails')
  const projects = useTranslations('Projects')
  return (
    <div className="space-y-16">
      <ProjectDetailSection id="project-links" title={t('links')} className="bg-surface p-6 sm:p-8">
        <p className="mb-6 leading-8 text-muted">{t(`${project.id}.linksNote`)}</p>
        <div className="flex flex-wrap items-center gap-6">
          <ProjectLink href={project.repository}>GitHub</ProjectLink>
          {project.website && <ProjectLink href={project.website}>{projects('visit')}</ProjectLink>}
        </div>
      </ProjectDetailSection>
      <ProjectDetailSection id="project-stack" title={t('stack')}>
        <p className="mb-6 leading-8 text-muted">{t(`${project.id}.stackNote`)}</p>
        <ul className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.stack.map((name) => (
            <li key={name} className="min-w-0 max-w-full">
              <TechnologyTag name={name} />
            </li>
          ))}
        </ul>
      </ProjectDetailSection>
      <ProjectNarrative project={project} kind="overview" />
      <ProjectFeatures project={project} />
      <ProjectNarrative project={project} kind="architecture" />
    </div>
  )
}
