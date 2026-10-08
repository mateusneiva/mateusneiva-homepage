import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LinkLabel } from '@/components/ui/typography/link-label'

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

export function Markdown({ content }: { content: string }) {
  return (
    <div className={markdownClasses}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
