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
      await document.fonts.ready
      if (cancelled) return
      finished = true
      setLoading(false)
    }

    if (document.readyState === 'complete') {
      void finish()
    } else {
      window.addEventListener('load', finish, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', finish)
    }
  }, [loading])

  return loading
}
