import { expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T>(fn: T) => fn,
}))

import { getCommitSha } from './repository'

it('shortens a valid commit SHA to seven characters', () => {
  expect(getCommitSha('411731c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6')).toBe('411731c')
})

it('returns null when the commit SHA is missing or malformed', () => {
  expect(getCommitSha(undefined)).toBeNull()
  expect(getCommitSha('not-a-sha')).toBeNull()
})
