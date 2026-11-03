import 'server-only'
import { cache } from 'react'
import { z } from 'zod'

export const repositoryUrl = 'https://github.com/mateusneiva/mateusneiva-homepage'

const repositorySchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
})

export type RepositoryStats = z.infer<typeof repositorySchema>

const repositoryPattern = /^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/?$/

export const getRepositoryStats = cache(async (url: string = repositoryUrl): Promise<RepositoryStats | null> => {
  const path = repositoryPattern.exec(url)?.[1]
  if (!path) return null
  try {
    const response = await fetch(`https://api.github.com/repos/${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    const result = repositorySchema.safeParse(await response.json())
    return result.success ? result.data : null
  } catch {
    return null
  }
})
