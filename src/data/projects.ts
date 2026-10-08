import type { TechnologyName } from './technologies'

export type ProjectCategory = 'web' | 'ui' | 'automation'
export type Project = {
  id: 'softness' | 'polaris' | 'shiva'
  name: string
  slug: string
  category: ProjectCategory
  repository: string
  website?: string
  image?: string
  stack: TechnologyName[]
}

export const projects: Project[] = [
  {
    id: 'softness',
    name: 'Softness',
    slug: 'softness',
    category: 'web',
    repository: 'https://github.com/mateusneiva/softness',
    website: 'https://softness.mateusneiva.com/',
    stack: ['Next.js', 'TypeScript', 'Stripe', 'Zustand'],
  },
  {
    id: 'polaris',
    name: 'Polaris Kit',
    slug: 'polaris-kit',
    category: 'ui',
    repository: 'https://github.com/polaris-kit/polaris-kit',
    website: 'https://main--6a6a03885409ae6257b04aac.chromatic.com',
    stack: ['React', 'TypeScript', 'Storybook', 'Turborepo'],
  },
  {
    id: 'shiva',
    name: 'Shiva Toolbox',
    slug: 'shiva-toolbox',
    category: 'automation',
    repository: 'https://github.com/shiva-toolbox/shiva-toolbox',
    stack: ['TypeScript', 'Discord.js', 'Prisma', 'PostgreSQL'],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
