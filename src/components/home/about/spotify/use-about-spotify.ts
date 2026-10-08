'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react'
import { useViewportActivity } from '@/components/ui/motion/use-viewport-activity'
import { getSpotifyCacheSnapshot, subscribeSpotifyCache, writeSpotifyCache } from '@/lib/spotify/cache'
import {
  spotifyPlaybackSchema,
  spotifyProfileResponseSchema,
  type SpotifyCache,
  type SpotifyPlayback,
  type SpotifyProfile,
} from '@/lib/spotify/schema'

const POLL_INTERVAL_MS = 30_000
const RETRY_INTERVAL_MS = 60_000
const CLOCK_INTERVAL_MS = 60_000

export function useAboutSpotify(container: RefObject<HTMLElement | null>) {
  const active = useViewportActivity(container)
  const cached = useSyncExternalStore(subscribeSpotifyCache, getSpotifyCacheSnapshot, () => null)
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null)
  const [profile, setProfile] = useState<SpotifyProfile | null>(null)
  const [cachedAt, setCachedAt] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const lastKnown = useRef<SpotifyCache | null>(null)
  const profileRef = useRef<SpotifyProfile | null>(null)
  const profileLoaded = useRef(false)

  useEffect(() => {
    if (!cached) return

    lastKnown.current = cached
    if (cached.profile) profileRef.current = cached.profile
  }, [cached])

  useEffect(() => {
    if (!active || profileLoaded.current) return
    const controller = new AbortController()

    async function updateProfile() {
      try {
        const response = await fetch('/api/spotify/profile', {
          signal: controller.signal,
          cache: 'no-store',
        })
        if (!response.ok) return

        const result = spotifyProfileResponseSchema.safeParse(await response.json())
        if (controller.signal.aborted || !result.success || !result.data.profile) return

        profileRef.current = result.data.profile
        setProfile(result.data.profile)

        if (lastKnown.current) {
          const cached = { ...lastKnown.current, profile: result.data.profile }
          lastKnown.current = cached
          writeSpotifyCache(cached)
        }
      } catch {
        // Preserve a cached identity if the profile cannot be refreshed.
      } finally {
        if (!controller.signal.aborted) profileLoaded.current = true
      }
    }

    void updateProfile()
    return () => controller.abort()
  }, [active])

  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    const clock = setInterval(() => setNow(new Date()), CLOCK_INTERVAL_MS)

    async function updatePlayback() {
      let next: SpotifyPlayback = { status: 'unavailable', track: null }

      try {
        const response = await fetch('/api/spotify', {
          signal: controller.signal,
          cache: 'no-store',
        })
        if (response.ok) {
          const result = spotifyPlaybackSchema.safeParse(await response.json())
          if (result.success) next = result.data
        }
      } catch {
        // Preserve the last known song on a temporary request failure.
      }

      if (controller.signal.aborted) return
      const updatedAt = new Date()
      setNow(updatedAt)

      if (next.track) {
        const cached: SpotifyCache = {
          playback: next,
          savedAt: updatedAt.toISOString(),
          ...(profileRef.current ? { profile: profileRef.current } : {}),
        }
        lastKnown.current = cached
        writeSpotifyCache(cached)
        setPlayback(next)
        setCachedAt(null)
      } else if ((next.status === 'unavailable' || next.status === 'idle') && lastKnown.current) {
        setPlayback(lastKnown.current.playback)
        setCachedAt(lastKnown.current.savedAt)
      } else {
        setPlayback(next)
        setCachedAt(null)
      }

      if (next.status !== 'unconfigured') {
        timer = setTimeout(
          updatePlayback,
          next.status === 'unavailable' ? RETRY_INTERVAL_MS : POLL_INTERVAL_MS,
        )
      }
    }

    void updatePlayback()
    return () => {
      controller.abort()
      clearTimeout(timer)
      clearInterval(clock)
    }
  }, [active])

  const currentPlayback = playback ?? cached?.playback ?? null
  const currentProfile = profile ?? cached?.profile ?? null
  const lastSyncedAt = playback ? cachedAt : (cached?.savedAt ?? null)
  const track = currentPlayback?.track ?? null
  const status: SpotifyPlayback['status'] | 'cached' | 'loading' =
    lastSyncedAt && track ? 'cached' : (currentPlayback?.status ?? 'loading')
  const timestamp = currentPlayback?.status === 'recent' ? currentPlayback.playedAt : lastSyncedAt

  return { track, profile: currentProfile, status, timestamp, now, playbackStatus: currentPlayback?.status }
}
