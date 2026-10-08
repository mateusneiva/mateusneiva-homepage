import { spotifyCacheKey, spotifyCacheSchema, type SpotifyCache } from './schema'

type CacheStorage = Pick<Storage, 'getItem' | 'setItem'>

let snapshot: SpotifyCache | null = null
let serializedSnapshot: string | null = null

export function getSpotifyCacheSnapshot() {
  const cached = readSpotifyCache()
  const serialized = cached ? JSON.stringify(cached) : null
  if (serialized !== serializedSnapshot) {
    snapshot = cached
    serializedSnapshot = serialized
  }
  return snapshot
}

export function subscribeSpotifyCache(listener: () => void) {
  window.addEventListener('storage', listener)
  return () => window.removeEventListener('storage', listener)
}

export function readSpotifyCache(storage?: CacheStorage): SpotifyCache | null {
  try {
    const target = storage ?? (typeof window === 'undefined' ? null : window.localStorage)
    const value = target?.getItem(spotifyCacheKey)
    if (!value) return null
    const result = spotifyCacheSchema.safeParse(JSON.parse(value))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function writeSpotifyCache(value: SpotifyCache, storage?: CacheStorage) {
  try {
    const target = storage ?? (typeof window === 'undefined' ? null : window.localStorage)
    const result = spotifyCacheSchema.safeParse(value)
    if (result.success) target?.setItem(spotifyCacheKey, JSON.stringify(result.data))
  } catch {
    // The widget can still update when browser storage is unavailable.
  }
}
