'use client'

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'
import { cn } from '@/lib/cn'

const COPIED_FEEDBACK_MS = 1500

export function AnchoredHeading({
  as: Tag,
  id,
  anchor = id,
  className,
  children,
}: {
  as: 'h2' | 'h3'
  id: string
  anchor?: string
  className?: string
  children: ReactNode
}) {
  const t = useTranslations('Headings')
  const [copied, setCopied] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyLink(event: MouseEvent<HTMLHeadingElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setPointer({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
    const { origin, pathname, search } = window.location
    await navigator.clipboard.writeText(`${origin}${pathname}${search}#${anchor}`)
    window.history.replaceState(null, '', `#${anchor}`)
    setCopied(true)
  }

  return (
    <>
      <Tag id={id} onClick={copyLink} className={cn('group/heading relative cursor-pointer', className)}>
        <span aria-hidden="true" className="absolute -left-5 top-0 flex h-[1lh] select-none items-center">
          <span
            className={cn(
              'font-mono text-[0.7em] text-subtle opacity-0 transition-opacity group-hover/heading:opacity-60',
              copied && 'text-accent opacity-100',
            )}
          >
            #
          </span>
        </span>
        {children}
        <span
          aria-hidden="true"
          style={{ left: pointer.x, top: pointer.y }}
          className={cn(
            'pointer-events-none absolute isolate z-10 -mt-3 -translate-x-1/2 -translate-y-full whitespace-nowrap bg-surface px-3 py-2 font-sans text-[13px] font-medium leading-5 tracking-tight text-ink opacity-0 shadow-[0_6px_12px_rgb(0_0_0/0.08),0_16px_32px_rgb(0_0_0/0.12)] transition-opacity',
            copied && 'opacity-100',
          )}
        >
          <ConstructionFrame variant="tooltip" />
          {t('copied')}
        </span>
      </Tag>
      <span role="status" className="sr-only">
        {copied ? t('copied') : ''}
      </span>
    </>
  )
}
