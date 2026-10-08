import { beforeEach, expect, it, vi } from 'vitest'
import { getPosts } from './index'

const mocks = vi.hoisted(() => ({ local: vi.fn() }))
vi.mock('./local', () => ({ getLocalPosts: mocks.local }))

beforeEach(() => { mocks.local.mockReset() })

it('lists only local metadata in reverse chronological order', async () => {
  const post = { title: 'A post', description: 'A description', tags: [], readingTime: 1, content: 'Markdown body' }
  mocks.local.mockResolvedValueOnce([
    { ...post, slug: 'older', url: '/posts/older', date: '2026-01-01' },
    { ...post, slug: 'newer', url: '/posts/newer', date: '2026-09-01' },
  ])
  const result = await getPosts('pt')
  expect(result.map((item) => item.slug)).toEqual(['newer', 'older'])
  expect(result.every((item) => !('content' in item) && !('source' in item))).toBe(true)
  expect(mocks.local).toHaveBeenCalledWith('pt')
})
