'use client'

import { useEffect, useState } from 'react'

// A fresh document resets this flag; client-side navigation keeps it.
let finished = false

export function useInitialLoading() {
  const [loading, setLoading] = useState(() => !finished)

  useEffect(() => {
    if (!loading) return
    let cancelled = false
    const finish = async () => {
      // Motion features must be loaded before `ready` flips, otherwise late-mounted
      // animations never run their initial `animate` target.
      await Promise.all([document.fonts.ready, import('@/components/ui/motion/motion-features')])
      if (cancelled) return
      finished = true
      setLoading(false)
    }

    void finish()

    return () => {
      cancelled = true
    }
  }, [loading])

  return loading
}
