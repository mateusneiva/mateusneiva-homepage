import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProject, projects } from '@/data/projects'
import { routing, type Locale } from '@/i18n/routing'
import { ProjectDetailsHeader } from '@/components/projects/details/project-details-header'
import { ProjectDetailsContent } from '@/components/projects/details/project-details-content'
import { ProjectSectionGuide } from '@/components/projects/navigation/project-section-guide'
import { getCaseStudy } from '@/lib/projects/case-study'
import { ReadingArticle } from '@/components/ui/reading/reading-article'
import { ReadingPager } from '@/components/ui/reading/reading-pager'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const t = await getTranslations({ locale, namespace: 'Projects' })
  return {
    title: project.name,
    description: t(project.id),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { pt: `/pt/projects/${slug}`, en: `/en/projects/${slug}` },
    },
    openGraph: {
      title: project.name,
      description: t(project.id),
      type: 'website',
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const caseStudy = await getCaseStudy(locale, slug)
  const t = await getTranslations({ locale, namespace: 'ProjectDetails' })
  const index = projects.findIndex((item) => item.slug === slug)
  const previous = projects[index - 1]
  const next = projects[index + 1]
  return (
    <main
      id="content"
      className="page-container py-12 sm:py-16"
    >
      <ReadingArticle className="grid min-w-0 gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-14">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <ProjectDetailsHeader project={project} />
        </div>
        <ProjectSectionGuide headings={caseStudy?.headings} />
        <div className="min-w-0 lg:col-start-2 lg:row-start-2" data-project-content>
          <ProjectDetailsContent project={project} caseStudy={caseStudy?.content} />
          <ReadingPager
            label={t('pager')}
            previousLabel={t('previous')}
            nextLabel={t('next')}
            previousEmpty={t('firstProject')}
            nextEmpty={t('lastProject')}
            previous={previous && { href: `/projects/${previous.slug}`, title: previous.name }}
            next={next && { href: `/projects/${next.slug}`, title: next.name }}
          />
        </div>
      </ReadingArticle>
    </main>
  )
}
