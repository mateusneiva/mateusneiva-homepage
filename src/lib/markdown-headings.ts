import { slugify } from '@/lib/slugify'

export type MarkdownHeading = { id: string; title: string }

export function readHeadings(content: string): MarkdownHeading[] {
  let fenced = false
  const headings: MarkdownHeading[] = []
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith('```')) fenced = !fenced
    const match = !fenced && /^## (.+)$/.exec(line)
    if (match) headings.push({ id: slugify(match[1]), title: match[1].trim() })
  }
  return headings
}
