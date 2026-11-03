import Image from 'next/image'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { AnchoredHeading } from '@/components/ui/typography/anchored-heading'
import { slugify } from '@/lib/slugify'

const markdownClasses = [
  'text-muted text-[1.075rem] leading-[1.85] [&>*+*]:mt-6',
  '[&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[1.75rem] [&_h2]:font-medium [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.03em] [&_h2]:text-ink',
  '[&_h3]:mt-10 [&_h3]:font-serif [&_h3]:text-[1.35rem] [&_h3]:font-medium [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.03em] [&_h3]:text-ink',
  '[&_a]:text-accent [&_a:hover]:text-ink [&_strong]:text-ink',
  '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li+li]:mt-2',
  '[&_blockquote]:bg-surface [&_blockquote]:p-4 [&_blockquote]:pl-6 [&_blockquote]:italic',
  '[&_pre]:overflow-x-auto [&_pre]:bg-surface [&_pre]:p-6 [&_pre]:text-[0.85rem]',
  '[&_code]:font-mono [&_code]:text-[0.85em]',
  '[&_:not(pre)>code]:bg-surface [&_:not(pre)>code]:px-[0.4em] [&_:not(pre)>code]:py-[0.2em] [&_:not(pre)>code]:text-accent',
  '[&_table]:block [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto',
  '[&_td]:bg-surface [&_td]:p-3 [&_th]:bg-surface [&_th]:p-3',
  '[&_img]:h-auto [&_img]:max-w-full [&_hr]:h-px [&_hr]:border-0 [&_hr]:bg-raised',
].join(' ')

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (node && typeof node === 'object' && 'props' in node) return textOf((node.props as { children?: ReactNode }).children)
  return ''
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className={markdownClasses}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h2: ({ children }) => (
            <AnchoredHeading as="h2" id={slugify(textOf(children))} className="scroll-mt-8">
              {children}
            </AnchoredHeading>
          ),
          h3: ({ children }) => (
            <AnchoredHeading as="h3" id={slugify(textOf(children))} className="scroll-mt-8">
              {children}
            </AnchoredHeading>
          ),
          p: ({ node, children }) => {
            const [only] = node?.children ?? []
            const isImage = node?.children.length === 1 && only?.type === 'element' && only.tagName === 'img'
            return isImage ? <>{children}</> : <p>{children}</p>
          },
          img: ({ src, alt, title }) =>
            typeof src === 'string' && src.startsWith('/') ? (
              <figure className="my-10">
                <Image
                  src={src}
                  alt={alt ?? ''}
                  width={1600}
                  height={900}
                  sizes="(min-width: 1280px) 864px, (min-width: 1024px) calc(100vw - 336px), calc(100vw - 48px)"
                  className="h-auto w-full bg-surface"
                />
                {title && <figcaption className="mt-3 text-sm leading-6 text-subtle">{title}</figcaption>}
              </figure>
            ) : null,
          a: ({ href, children }) => {
            const external = href?.startsWith('https://') || href?.startsWith('http://')
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="group/link interactive-link"
              >
                <LinkLabel>{children}</LinkLabel>
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
