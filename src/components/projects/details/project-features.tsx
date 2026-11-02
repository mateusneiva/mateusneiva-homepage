import { useTranslations } from 'next-intl'
import type { NarrativeProjectId } from '@/data/projects'
import { ProjectDetailSection } from './project-detail-section'
import { TextGuides } from '@/components/layout/construction/text-guides'

export function ProjectFeatures({ id }: { id: NarrativeProjectId }) {
  const t = useTranslations('ProjectDetails')
  return (
    <ProjectDetailSection id="project-features" title={t('features')}>
      <ol className="space-y-6">
        {(['one', 'two', 'three', 'four'] as const).map((feature, index) => (
          <li key={feature} className="flex gap-5 leading-8 text-muted">
            <span className="pt-1 font-mono text-xs text-accent">0{index + 1}</span>
            <TextGuides leading="8" className="min-w-0 flex-1">
              <p>{t(`${id}.features.${feature}`)}</p>
            </TextGuides>
          </li>
        ))}
      </ol>
    </ProjectDetailSection>
  )
}
