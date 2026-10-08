import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { getLocalPosts } from './local'

let directory: string
let folder: string
const article = (date: string, draft = false) =>
  `---\ntitle: "A post"\ndescription: "A description"\ndate: "${date}"\ndraft: ${draft}\n---\n\n## Heading\n\nSome content.`

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'portfolio-posts-'))
  folder = path.join(directory, 'content/posts/pt')
  await mkdir(folder, { recursive: true })
  vi.spyOn(process, 'cwd').mockReturnValue(directory)
})

afterEach(async () => {
  await rm(directory, { recursive: true, force: true })
})

it('publishes Markdown while excluding drafts and scheduled posts', async () => {
  await writeFile(path.join(folder, 'published.md'), article('2020-01-01'))
  await writeFile(path.join(folder, 'draft.md'), article('2020-01-01', true))
  await writeFile(path.join(folder, 'future.md'), article('2999-01-01'))
  const posts = await getLocalPosts('pt')
  expect(posts).toHaveLength(1)
  expect(posts[0]).toMatchObject({
    url: '/posts/published',
    readingTime: 1,
  })
  expect(posts[0].content).toContain('## Heading')
})

it('returns an empty list when there is no localized content', async () => {
  expect(await getLocalPosts('en')).toEqual([])
})

it('rejects incomplete metadata and impossible dates', async () => {
  await writeFile(path.join(folder, 'invalid.md'), '---\ntitle: "Missing metadata"\n---\nContent')
  await expect(getLocalPosts('pt')).rejects.toThrow()
  await writeFile(path.join(folder, 'invalid.md'), article('2026-02-31'))
  await expect(getLocalPosts('pt')).rejects.toThrow()
})
