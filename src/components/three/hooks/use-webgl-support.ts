'use client'

import { useSyncExternalStore } from 'react'

let cachedSupport: boolean | undefined

function subscribe(listener: () => void) {
  if (cachedSupport === undefined) {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
      cachedSupport = Boolean(context)
      context?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      cachedSupport = false
    }
    listener()
  }
  return () => {}
}

export function useWebglSupport() {
  return useSyncExternalStore(subscribe, () => cachedSupport ?? false, () => false)
}
