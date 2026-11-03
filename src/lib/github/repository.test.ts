import { afterEach, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T>(fn: T) => fn,
}))

import { getRepositoryStats } from './repository'

afterEach(() => vi.unstubAllGlobals())

it('fetches the stats of the repository in the given GitHub URL', async () => {
  const fetchMock = vi.fn().mockResolvedValue(Response.json({ stargazers_count: 12, forks_count: 3 }))
  vi.stubGlobal('fetch', fetchMock)
  await expect(getRepositoryStats('https://github.com/mateusneiva/softness')).resolves.toEqual({
    stargazers_count: 12,
    forks_count: 3,
  })
  expect(fetchMock.mock.calls[0][0]).toBe('https://api.github.com/repos/mateusneiva/softness')
})

it('returns null for private or missing repositories', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 404 })))
  await expect(getRepositoryStats('https://github.com/mateusneiva/private')).resolves.toBeNull()
})

it('returns null without calling the API for URLs that are not GitHub repositories', async () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  await expect(getRepositoryStats('https://example.com/a/b')).resolves.toBeNull()
  expect(fetchMock).not.toHaveBeenCalled()
})

it('returns null when the response has an unexpected shape or the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ stargazers_count: 'many' })))
  await expect(getRepositoryStats('https://github.com/mateusneiva/softness')).resolves.toBeNull()
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
  await expect(getRepositoryStats('https://github.com/mateusneiva/softness')).resolves.toBeNull()
})
