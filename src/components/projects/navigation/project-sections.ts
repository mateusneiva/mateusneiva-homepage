export const projectSections = [
  { id: 'project-intro', label: 'intro' },
  { id: 'project-links', label: 'links' },
  { id: 'project-stack', label: 'stack' },
  { id: 'project-overview', label: 'overview' },
  { id: 'project-features', label: 'features' },
  { id: 'project-architecture', label: 'architecture' },
] as const

export type ProjectSectionId = (typeof projectSections)[number]['id']
export const projectSectionIds = projectSections.map((section) => section.id)
