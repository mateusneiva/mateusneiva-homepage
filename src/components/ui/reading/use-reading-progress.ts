'use client'

import { useEffect, type RefObject } from 'react'
import { useMotionValue } from 'framer-motion'

export function useReadingProgress(ref: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0)

  useEffect(() => {
    const article = ref.current
    if (!article) return
    let frame = 0

    const update = () => {
      frame = 0
      const bounds = article.getBoundingClientRect()
      const start = window.scrollY + bounds.top
      const end = window.scrollY + bounds.bottom - window.innerHeight
      const distance = end - start
      const value = distance > 0
        ? Math.min(1, Math.max(0, (window.scrollY - start) / distance))
        : (bounds.bottom <= window.innerHeight ? 1 : 0)
      progress.set(value)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(article)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ref, progress])

  return progress
}
