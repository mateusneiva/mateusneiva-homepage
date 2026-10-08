'use client'

import { useEffect, useRef } from 'react'
import { frame, cancelFrame } from 'framer-motion'
import { ReactLenis, type LenisRef } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'

const options: LenisOptions = {
  autoRaf: false,
  lerp: 0.12,
  smoothWheel: true,
  syncTouch: false,
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
  prevent: (node) => node.matches('textarea, input, select, [data-lenis-prevent]'),
}

export function SmoothScroll() {
  const ref = useRef<LenisRef>(null)
  const pathname = usePathname()
  const locale = useLocale()

  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => ref.current?.lenis?.raf(timestamp)
    const synchronize = () => {
      const lenis = ref.current?.lenis
      lenis?.stop()
      lenis?.start()
    }
    const anchor = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.closest('[data-project-guide]')) return
      const url = new URL(link.href)
      const current = new URL(window.location.href)
      if (url.origin !== current.origin || url.pathname.replace(/\/$/, '') !== current.pathname.replace(/\/$/, '') || !url.hash) return
      let id: string
      try { id = decodeURIComponent(url.hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      const lenis = ref.current?.lenis
      if (!target || !lenis) return
      event.preventDefault()
      if (url.hash !== current.hash) window.history.pushState(window.history.state, '', url.hash)
      lenis.scrollTo(target, {
        onComplete: () => {
          if (event.detail === 0) {
            target.tabIndex = -1
            target.focus({ preventScroll: true })
          }
        },
      })
    }
    frame.update(update, true)
    window.addEventListener('popstate', synchronize)
    window.addEventListener('click', anchor, true)
    return () => {
      cancelFrame(update)
      window.removeEventListener('popstate', synchronize)
      window.removeEventListener('click', anchor, true)
    }
  }, [])

  useEffect(() => {
    const lenis = ref.current?.lenis
    lenis?.resize()
    lenis?.stop()
    lenis?.start()
  }, [pathname, locale])

  return <ReactLenis root options={options} ref={ref} />
}
