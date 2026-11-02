import { useTranslations } from 'next-intl'
import type { NarrativeProjectId } from '@/data/projects'
import { ProjectDetailSection } from './project-detail-section'
import { TextGuides } from '@/components/layout/construction/text-guides'

export function ProjectNarrative({ id, kind }: { id: NarrativeProjectId; kind: 'overview' | 'architecture' }) {
  const t = useTranslations('ProjectDetails')
  const paragraphs =
    kind === 'overview'
      ? [t(`${id}.overview`), t(`${id}.overviewMore`)]
      : [t(`${id}.architecture.one`), t(`${id}.architecture.two`)]
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
