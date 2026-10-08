import { z } from 'zod'

export const spotifySongUrl = z.string().url().refine((value) => {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return url.protocol === 'https:' && url.hostname === 'open.spotify.com' && url.pathname.startsWith('/track/')
})

export const spotifyImageUrl = z.string().url().refine((value) => {
  if (!URL.canParse(value)) return false
  const url = new URL(value)
  return url.protocol === 'https:' && url.hostname === 'i.scdn.co' && url.pathname.startsWith('/image/')
})

const trackSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string(),
  imageUrl: spotifyImageUrl.nullable(),
  songUrl: spotifySongUrl,
})

export const spotifyProfileSchema = z.object({
  name: z.string().min(1),
  avatarUrl: spotifyImageUrl.nullable(),
  profileUrl: z.string().url().refine((value) => {
    if (!URL.canParse(value)) return false
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'open.spotify.com' && url.pathname.startsWith('/user/')
  }),
})

export const spotifyProfileResponseSchema = z.object({ profile: spotifyProfileSchema.nullable() })
export type SpotifyProfile = z.infer<typeof spotifyProfileSchema>

export const spotifyPlaybackSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('playing'), track: trackSchema }),
  z.object({ status: z.literal('paused'), track: trackSchema }),
  z.object({
    status: z.literal('recent'),
    track: trackSchema,
    playedAt: z.string().datetime({ offset: true }),
  }),
  z.object({ status: z.literal('idle'), track: z.null() }),
  z.object({ status: z.literal('unconfigured'), track: z.null() }),
  z.object({ status: z.literal('unavailable'), track: z.null() }),
])

export type SpotifyPlayback = z.infer<typeof spotifyPlaybackSchema>
export type SpotifyTrack = z.infer<typeof trackSchema>

export const spotifyCacheKey = 'portfolio:spotify:last-track:v1'
export const spotifyCacheSchema = z
  .object({
    playback: spotifyPlaybackSchema,
    savedAt: z.string().datetime({ offset: true }),
    profile: spotifyProfileSchema.optional(),
  })
  .refine(({ playback }) => playback.track !== null)

export type SpotifyCache = z.infer<typeof spotifyCacheSchema>
