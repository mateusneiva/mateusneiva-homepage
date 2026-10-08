const frontendSubgroups = [
  { label: 'languages', titleKey: 'frontendGroups.languages', skills: ['TypeScript', 'JavaScript'] },
  {
    label: 'platforms',
    titleKey: 'frontendGroups.platforms',
    skills: ['React', 'Next.js', 'Vite', 'React Native', 'Electron', 'Expo'],
  },
  {
    label: 'state',
    titleKey: 'frontendGroups.state',
    skills: ['Zustand', 'Redux', 'Jotai', 'TanStack Query', 'React Hook Form'],
  },
  {
    label: 'presentation',
    titleKey: 'frontendGroups.presentation',
    skills: [
      'Tailwind CSS',
      'Styled Components',
      'Framer Motion',
      'Storybook',
      'Design tokens',
      'Responsive Design',
    ],
  },
  {
    label: 'experience',
    titleKey: 'frontendGroups.experience',
    skills: ['a11y', 'SEO & Core Web Vitals', 'i18n'],
  },
] as const

const backendSubgroups = [
  {
    label: 'apis',
    titleKey: 'backendGroups.apis',
    skills: ['Node.js', 'Fastify', 'Express.js', 'RESTful APIs', 'GraphQL', 'WebSockets'],
  },
  {
    label: 'data',
    titleKey: 'backendGroups.data',
    skills: ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Drizzle ORM'],
  },
  { label: 'contracts', titleKey: 'backendGroups.contracts', skills: ['Zod', 'Swagger (OpenAPI)'] },
  { label: 'authentication', titleKey: 'backendGroups.authentication', skills: ['JWT', 'OAuth 2.0'] },
] as const

const toolingSubgroups = [
  {
    label: 'development',
    titleKey: 'toolingGroups.development',
    skills: ['Git', 'Turborepo', 'Conventional Commits', 'Changesets'],
  },
  {
    label: 'testing',
    titleKey: 'toolingGroups.testing',
    skills: ['Vitest', 'Jest', 'Playwright', 'GitHub Actions (CI/CD)'],
  },
  {
    label: 'infrastructure',
    titleKey: 'toolingGroups.infrastructure',
    skills: ['Linux', 'Docker', 'Nginx', 'Oracle Cloud', 'Vercel'],
  },
  {
    label: 'observability',
    titleKey: 'toolingGroups.observability',
    skills: ['Grafana', 'Prometheus', 'Winston / Pino'],
  },
  {
    label: 'quality',
    titleKey: 'toolingGroups.quality',
    skills: ['Biome', 'Prettier', 'ESLint', 'Husky'],
  },
] as const

export const skillGroups = [
  {
    label: 'frontend',
    primary: [
      'TypeScript',
      'React',
      'Next.js',
      'Expo',
      'Tailwind CSS',
      'Zustand',
      'TanStack Query',
      'React Hook Form',
      'Framer Motion',
      'Storybook',
    ],
    skills: frontendSubgroups.flatMap(({ skills }) => [...skills]),
    subgroups: frontendSubgroups,
  },
  {
    label: 'backend',
    primary: [
      'Node.js',
      'Fastify',
      'Express.js',
      'PostgreSQL',
      'Prisma',
      'Drizzle ORM',
      'Redis',
      'Zod',
      'Swagger (OpenAPI)',
    ],
    skills: backendSubgroups.flatMap(({ skills }) => [...skills]),
    subgroups: backendSubgroups,
  },
  {
    label: 'tooling',
    primary: [
      'Git',
      'Turborepo',
      'Docker',
      'Vitest',
      'Playwright',
      'GitHub Actions (CI/CD)',
      'Changesets',
      'Grafana',
      'Oracle Cloud',
      'Vercel',
    ],
    skills: toolingSubgroups.flatMap(({ skills }) => [...skills]),
    subgroups: toolingSubgroups,
  },
] as const

export type SkillName = (typeof skillGroups)[number]['skills'][number]
