import { getLocale } from 'next-intl/server'
import { Hero, About, Projects, PostsSection, Contact } from '@/components/home'
import { getPosts } from '@/lib/posts'

export default async function Home() {
  const locale = await getLocale()
  const posts = await getPosts(locale)
  return (
    <main id="content" className="page-container">
      <Hero />
      <About />
      <Projects />
      <PostsSection posts={posts.slice(0, 3)} />
      <Contact />
    </main>
  )
}
