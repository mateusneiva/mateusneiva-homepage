import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Locale } from '@/i18n/routing'
import { slugify } from '@/lib/slugify'

export type CaseStudyHeading = { id: string; title: string }
export type CaseStudy = { content: string; headings: CaseStudyHeading[] }

const PROJECT_SLUG = /^[a-z0-9-]+$/

function readHeadings(content: string): CaseStudyHeading[] {
  let fenced = false
  const headings: CaseStudyHeading[] = []
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith('```')) fenced = !fenced
    const match = !fenced && /^## (.+)$/.exec(line)
    if (match) headings.push({ id: slugify(match[1]), title: match[1].trim() })
  }
  return headings
}

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
