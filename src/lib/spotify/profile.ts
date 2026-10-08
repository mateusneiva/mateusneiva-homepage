import 'server-only'
import { z } from 'zod'
import { getSpotifyAccessToken, requestSpotify } from './client'
import { spotifyImageUrl, spotifyProfileSchema, type SpotifyProfile } from './schema'

const profileResponseSchema = z.object({
  display_name: z.string().nullable().optional(),
  images: z.array(z.object({ url: z.string() })).default([]),
  external_urls: z.object({ spotify: z.string() }),
})

export async function getSpotifyProfile(): Promise<SpotifyProfile | null> {
  try {
    const token = await getSpotifyAccessToken()
    if (!token) return null

    const response = await requestSpotify('/me', token)
    if (!response.ok) return null

    const result = profileResponseSchema.safeParse(await response.json())
    if (!result.success) return null

    const profile = spotifyProfileSchema.safeParse({
      name: result.data.display_name?.trim() || 'Mateus Neiva',
      avatarUrl: result.data.images.find(({ url }) => spotifyImageUrl.safeParse(url).success)?.url ?? null,
      profileUrl: result.data.external_urls.spotify,
    })

    return profile.success ? profile.data : null
  } catch {
    return null
  }
}
