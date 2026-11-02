export const projectSections = [
  { id: 'project-intro', label: 'intro' },
  { id: 'project-stack', label: 'stack' },
  { id: 'project-overview', label: 'overview' },
  { id: 'project-features', label: 'features' },
  { id: 'project-architecture', label: 'architecture' },
  { id: 'project-links', label: 'links' },
] as const

export const projectLeadSections = projectSections.slice(0, 2)
export const projectClosingSection = projectSections[projectSections.length - 1]

export type ProjectSectionId = (typeof projectSections)[number]['id']
export const projectSectionIds = projectSections.map((section) => section.id)
