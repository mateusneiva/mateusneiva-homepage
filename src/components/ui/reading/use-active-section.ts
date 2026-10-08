'use client'

import { useEffect, useState } from 'react'

export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    let frame = 0
    let disposed = false
    function update() {
      frame = 0
      const readingLine = Math.min(window.innerHeight * 0.25, 160)
      let current = ids[0] ?? ''
      for (const id of ids) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= readingLine)
          current = id
      }
      setActiveId(current)
    }
    function schedule() {
      if (!disposed && !frame) frame = window.requestAnimationFrame(update)
    }
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(schedule)
    const content = document.getElementById('content')
    if (content) observer?.observe(content)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    void document.fonts?.ready.then(schedule, schedule)
    schedule()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [ids])

  return activeId
}
