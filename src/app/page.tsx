import Link from 'next/link'
import { FaFileAlt } from 'react-icons/fa'
import { FaCodepen, FaGithub, FaLinkedin, FaAt } from 'react-icons/fa6'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { Footer } from '@/components/Footer'
import { Shiba } from '@/components/Shiba'

export default function Home() {
  return (
    <main className="m-auto w-full px-6 sm:w-[800px]">
      <Shiba />

      <Section className="flex flex-col" delay={0.1}>
        <div className="flex items-center justify-between pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="pt-2 text-2xl tracking-tight text-white">
              Mateus Neiva
            </h1>
            <h2 className="text-lg tracking-tight text-gray-400">
              Software Developer
            </h2>
          </div>

          <Link href="#social" target="_self">
            <Button color="primary">Get in touch</Button>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-4 leading-7">
          <p>
           I’ve been passionate about technology since I was five years old, 
           and that passion naturally led me to a career in IT. 
           Throughout my journey, I’ve consistently sought to expand my skills and stay up to date with the latest industry trends.
          </p>

          <p>
           With hands-on experience solving technical challenges and building creative solutions, 
           I’m driven by the impact technology can have on real-world problems. 
           My goal is to help businesses thrive through thoughtful, efficient, and modern software development.
          </p>

          <p>Technologies I’ve been working with:</p>

          <ul className="grid list-inside list-[square] grid-cols-1 gap-0.5 marker:text-yellow-400 sm:grid-cols-3">
            <li className="order-1">TypeScript</li>
            <li className="order-4">JavaScript (ES6+)</li>
            <li className="order-7">React</li>
            <li className="order-2">React Native</li>
            <li className="order-5">Node.js</li>
            <li className="order-8">Next.js</li>
            <li className="order-3">Python</li>
            <li className="order-6">Django</li>
            <li className="order-9">Flask</li>
          </ul>
        </div>
      </Section>

      <Section delay={0.4}>
        <div>
          <h3 className="uppercase text-white">Projects</h3>
          <p className="pb-4 pt-1">Some Things I’ve Built</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="https://markdown-blog-drab.vercel.app" target="_blank">
            <Card
              videoSrc="/webm/markdown-blog.webm"
              title="Markdown Blog"
              description="A markdown blog made with Next.js, Styled-Components and GraphQL."
              badges={['Next.js', 'TypeScript', 'Styled Components']}
            />
          </Link>

          <Link href="https://cute-cupcake-a3f6ae.netlify.app" target="_blank">
            <Card
              videoSrc="/webm/dnd-todo.webm"
              title="Dnd Todo"
              description="Todo app with drag and drop feature."
              badges={[
                'React',
                'JavaScript',
                'Styled Components',
                'React Beautiful Dnd',
              ]}
            />
          </Link>

          <Link href="https://github.com/mateusneiva/chatapp" target="_blank">
            <Card
              videoSrc="/webm/chatapp.webm"
              title="ChatApp"
              description="Still working on it."
              badges={['Next.js', 'TailwindCSS', 'PrismaORM']}
            />
          </Link>
        </div>
      </Section>

      <Section id="social" delay={0.4}>
        <div>
          <h3 className="uppercase text-white">Let’s create together!</h3>

          <p className="pb-4 pt-1">Feel free to send me an email</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Link href="mailto:mateus.fneiva@gmail.com" target="_blank">
            <Button color="primary">
              <div className="flex items-center gap-3">
                <FaAt size={18} />
                <p>Email</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                mateus.fneiva@gmail.com
              </p>
            </Button>
          </Link>

          <Link href="/resume.pdf" target="_blank">
            <Button>
              <div className="flex items-center gap-3">
                <FaFileAlt size={18} />
                <p>Resume</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                resume.pdf
              </p>
            </Button>
          </Link>

          <Link href="https://github.com/mateusneiva" target="_blank">
            <Button>
              <div className="flex items-center gap-3">
                <FaGithub size={20} />
                <p>Github</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                mateusneiva
              </p>
            </Button>
          </Link>

          <Link href="https://codepen.io/mateusneiva" target="_blank">
            <Button>
              <div className="flex items-center gap-3">
                <FaCodepen size={20} />
                <p>Codepen</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                mateusneiva
              </p>
            </Button>
          </Link>

          <Link
            href="https://www.linkedin.com/in/mateusfneiva/"
            target="_blank"
          >
            <Button>
              <div className="flex items-center gap-3">
                <FaLinkedin size={20} />
                <p>Linkedin</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                mateusfneiva
              </p>
            </Button>
          </Link>
        </div>
      </Section>

      <Footer />
    </main>
  )
}
