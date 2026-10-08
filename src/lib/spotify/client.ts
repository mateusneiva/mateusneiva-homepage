import 'server-only'
import { z } from 'zod'

const API_URL = 'https://api.spotify.com/v1'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const REQUEST_TIMEOUT_MS = 5000
const tokenSchema = z.object({ access_token: z.string().min(1) })

function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) return null
  return { clientId, clientSecret, refreshToken }
}

export function isSpotifyConfigured() {
  return getCredentials() !== null
}

export async function getSpotifyAccessToken(): Promise<string | null> {
  const configuration = getCredentials()
  if (!configuration) return null

  const { clientId, clientSecret, refreshToken } = configuration
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) return null
  const token = tokenSchema.safeParse(await response.json())
  return token.success ? token.data.access_token : null
}

export function requestSpotify(path: string, accessToken: string) {
  return fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
}
