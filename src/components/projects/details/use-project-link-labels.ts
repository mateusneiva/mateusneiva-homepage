import { useTranslations } from 'next-intl'
import type { Project } from '@/data/projects'

/** Per-project button labels from `ProjectDetails.<id>.websiteLabel` / `repositoryLabel`, falling back to the shared ones. */
export function useProjectLinkLabels(project: Project) {
  const details = useTranslations('ProjectDetails')
  const projects = useTranslations('Projects')
  const labelFor = (key: 'websiteLabel' | 'repositoryLabel', fallback: string) => {
    const path = `${project.id}.${key}` as Parameters<typeof details.has>[0]
    return details.has(path) ? details(path) : fallback
  }
  return {
    website: labelFor('websiteLabel', projects('visit')),
    repository: labelFor('repositoryLabel', projects('source')),
  }
}
