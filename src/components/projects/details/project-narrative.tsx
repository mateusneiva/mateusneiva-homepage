import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'
import { ProjectDetailSection } from './project-detail-section'
import { TextGuides } from '@/components/layout/construction/text-guides'

export function ProjectNarrative({ project, kind }: { project: Project; kind: 'overview' | 'architecture' }) {
  const t = useTranslations('ProjectDetails')
  const paragraphs =
    kind === 'overview'
      ? [t(`${project.id}.overview`), t(`${project.id}.overviewMore`)]
      : [t(`${project.id}.architecture.one`), t(`${project.id}.architecture.two`)]
  return (
    <ProjectDetailSection id={`project-${kind}`} title={t(kind)}>
      <div className="space-y-5 text-base leading-8 text-muted sm:text-lg">
        {paragraphs.map((text) => (
          <TextGuides key={text} leading="8">
            <p>{text}</p>
          </TextGuides>
        ))}
      </div>
    </ProjectDetailSection>
  )
}
