'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useViewportActivity(ref: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let intersecting = false
    function updateActivity() {
      setActive(intersecting && !document.hidden)
    }

    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      updateActivity()
    })

    if (ref.current) observer.observe(ref.current)
    document.addEventListener('visibilitychange', updateActivity)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateActivity)
    }
  }, [ref])

  return active
}
