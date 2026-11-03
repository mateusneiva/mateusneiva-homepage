import 'server-only'
import { cache } from 'react'
import { z } from 'zod'

export const repositoryUrl = 'https://github.com/mateusneiva/mateusneiva-homepage'

const repositorySchema = z.object({
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
})

export const getRepositoryStats = cache(async () => {
  try {
    const response = await fetch('https://api.github.com/repos/mateusneiva/mateusneiva-homepage', {
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

const commitShaPattern = /^[0-9a-f]{7,40}$/

export function getCommitSha(sha: string | undefined = process.env.VERCEL_GIT_COMMIT_SHA): string | null {
  return sha && commitShaPattern.test(sha) ? sha.slice(0, 7) : null
}
