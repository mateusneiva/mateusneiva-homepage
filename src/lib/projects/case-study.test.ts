import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { getCaseStudy } from './case-study'

let directory: string

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'portfolio-projects-'))
  await mkdir(path.join(directory, 'content/projects/pt'), { recursive: true })
  vi.spyOn(process, 'cwd').mockReturnValue(directory)
})

afterEach(async () => {
  await rm(directory, { recursive: true, force: true })
})

it('reads the localized Markdown and lists its level-two headings outside code fences', async () => {
  await writeFile(
    path.join(directory, 'content/projects/pt/demo.md'),
    '## Contexto\n\nTexto.\n\n### Detalhe\n\n```sh\n## not a heading\n```\n\n## Decisões & limites\n',
  )
  expect(await getCaseStudy('pt', 'demo')).toMatchObject({
    headings: [
      { id: 'contexto', title: 'Contexto' },
      { id: 'decisoes-limites', title: 'Decisões & limites' },
    ],
  })
})

it('returns null when the project has no case study in that locale', async () => {
  expect(await getCaseStudy('pt', 'missing')).toBeNull()
  expect(await getCaseStudy('en', 'demo')).toBeNull()
})

it('rejects slugs that could leave the content folder', async () => {
  expect(await getCaseStudy('pt', '../../package')).toBeNull()
})
