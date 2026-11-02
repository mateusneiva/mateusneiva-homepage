import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Locale } from '@/i18n/routing'
import { readHeadings, type MarkdownHeading } from '@/lib/markdown-headings'

export type CaseStudyHeading = MarkdownHeading
export type CaseStudy = { content: string; headings: CaseStudyHeading[] }

const PROJECT_SLUG = /^[a-z0-9-]+$/

export async function getCaseStudy(locale: Locale, slug: string): Promise<CaseStudy | null> {
  if (!PROJECT_SLUG.test(slug)) return null
  try {
    const content = await readFile(path.join(process.cwd(), 'content', 'projects', locale, `${slug}.md`), 'utf8')
    return { content, headings: readHeadings(content) }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null
    throw error
  }
}
