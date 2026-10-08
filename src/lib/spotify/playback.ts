import 'server-only'
import { z } from 'zod'
import { getSpotifyAccessToken, isSpotifyConfigured, requestSpotify } from './client'
import { spotifyImageUrl, spotifySongUrl, type SpotifyPlayback, type SpotifyTrack } from './schema'

const trackResponseSchema = z.object({
  type: z.literal('track'),
  name: z.string().min(1),
  artists: z.array(z.object({ name: z.string().min(1) })).min(1),
  album: z.object({
    name: z.string(),
    images: z.array(z.object({ url: spotifyImageUrl })).default([]),
  }),
  external_urls: z.object({ spotify: spotifySongUrl }),
})

const playbackResponseSchema = z.object({
  is_playing: z.boolean(),
  item: z.unknown(),
})

const recentResponseSchema = z.object({
  items: z.array(
    z.object({
      track: z.unknown(),
      played_at: z.string().datetime({ offset: true }),
    }),
  ),
})

function toPublicTrack(value: unknown): SpotifyTrack | null {
  const result = trackResponseSchema.safeParse(value)
  if (!result.success) return null

  const track = result.data
  return {
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    imageUrl: track.album.images[1]?.url ?? track.album.images[0]?.url ?? null,
    songUrl: track.external_urls.spotify,
  }
}

async function getLastPlayed(accessToken: string): Promise<SpotifyPlayback> {
  const response = await requestSpotify('/me/player/recently-played?limit=1', accessToken)
  if (!response.ok) return { status: 'unavailable', track: null }

  const recent = recentResponseSchema.safeParse(await response.json())
  if (!recent.success) return { status: 'unavailable', track: null }

  const lastPlayed = recent.data.items[0]
  if (!lastPlayed) return { status: 'idle', track: null }

  const track = toPublicTrack(lastPlayed.track)
  return track
    ? { status: 'recent', track, playedAt: lastPlayed.played_at }
    : { status: 'idle', track: null }
}

export async function getSpotifyPlayback(): Promise<SpotifyPlayback> {
  if (!isSpotifyConfigured()) return { status: 'unconfigured', track: null }

  try {
    const token = await getSpotifyAccessToken()
    if (!token) return { status: 'unavailable', track: null }

    const response = await requestSpotify('/me/player/currently-playing', token)
    if (response.status === 204) return await getLastPlayed(token)
    if (!response.ok) return { status: 'unavailable', track: null }

    const current = playbackResponseSchema.safeParse(await response.json())
    if (!current.success) return { status: 'unavailable', track: null }

    const track = toPublicTrack(current.data.item)
    if (track) return { status: current.data.is_playing ? 'playing' : 'paused', track }

    return await getLastPlayed(token)
  } catch {
    return { status: 'unavailable', track: null }
  }
}
