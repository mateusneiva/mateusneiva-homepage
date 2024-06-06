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
    <main className="m-auto w-full px-6 sm:w-[730px]">
      <Shiba />

      <Section className="flex flex-col" delay={0.1}>
        <div className="flex items-center justify-between pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="pt-2 text-2xl tracking-tight text-white">
              Mateus Neiva
            </h1>
            <h2 className="text-lg tracking-tight text-gray-400">
              Web Developer
            </h2>
          </div>

          <Link href="#social" target="_self">
            <Button color="primary">Get in touch</Button>
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-4 leading-7">
          <p>
            I have been passionate about technology since I was five years old,
            and this passion led me to a career in IT. I have dedicated my
            professional life to the constant pursuit of knowledge and
            specialization, always updating my skills to keep up with industry
            developments.
          </p>

          <p>
            With solid experience in solving technical problems and developing
            innovative solutions, I am committed to driving business success
            through the efficient application of technology.
          </p>

          <p>Here are a few technologies I’ve been working:</p>

          <ul className="grid list-inside list-[square] grid-cols-1 gap-0.5 marker:text-yellow-400 sm:grid-cols-2">
            <li>TypeScript</li>
            <li>React</li>
            <li>JavaScript (ES6+)</li>
            <li>React Native</li>
            <li>Node.js</li>
            <li>Next.js</li>
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
              imageSrc="/images/markdown-blog.gif"
              title="Markdown Blog"
              description="A markdown blog made with Next.js, Styled-Components and GraphQL."
              badges={['Next.js', 'TypeScript', 'Styled Components']}
            />
          </Link>

          <Link href="https://cute-cupcake-a3f6ae.netlify.app" target="_blank">
            <Card
              imageSrc="/images/dnd-todo.gif"
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
              imageSrc="/images/chatapp.gif"
              title="ChatApp"
              description="Still working on it."
              badges={['Next.js', 'TailwindCSS', 'PrismaORM']}
            />
          </Link>
        </div>
      </Section>

      <Section id="social" delay={0.6}>
        <div>
          <h3 className="uppercase text-white">Let’s create together!</h3>

          <p className="pb-4 pt-1">
            Feel free to send me an email. I am open for collaboration &
            internships.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Link href="mailto:mateus.fneiva@gmail.com" target="_blank">
            <Button color="primary">
              <div className="flex items-center gap-3">
                <FaAt size={16} />
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
                <FaFileAlt size={16} />
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
                <FaGithub size={18} />
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
                <FaCodepen size={18} />
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
                <FaLinkedin size={18} />
                <p>Linkedin</p>
              </div>

              <p className="hidden items-center text-white underline decoration-yellow-400 decoration-dotted decoration-1 underline-offset-2 sm:flex">
                mateusfneiva
              </p>
            </Button>
          </Link>
        </div>
      </Section>

      <Footer delay={0.6} />
    </main>
  )
}
