import { getLocale } from 'next-intl/server'
import { Hero, About, Projects, PostsSection, Contact } from '@/components/home'
import { projects } from '@/data/projects'
import { getRepositoryStats } from '@/lib/github/repository'
import { getPosts } from '@/lib/posts'

export default async function Home() {
  const locale = await getLocale()
  const posts = await getPosts(locale)
  const stats = Object.fromEntries(
    await Promise.all(projects.map(async (project) => [project.id, await getRepositoryStats(project.repository)] as const)),
  )
  return (
    <main id="content" className="page-container">
      <Hero />
      <About />
      <Projects stats={stats} />
      <PostsSection posts={posts.slice(0, 3)} />
      <Contact />
    </main>
  )
}
