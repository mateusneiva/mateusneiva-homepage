import { beforeEach, expect, it, vi } from 'vitest'
import { getSpotifyPlayback, getSpotifyProfile } from './index'
import { spotifyPlaybackSchema } from './schema'

const track = {
  type: 'track',
  name: 'Song of Storms',
  artists: [{ name: 'Artist One' }, { name: 'Artist Two' }],
  album: {
    name: 'An Album',
    images: [{ url: 'https://i.scdn.co/image/large' }, { url: 'https://i.scdn.co/image/medium' }],
  },
  external_urls: { spotify: 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6' },
}

const fetchMock = vi.fn<typeof fetch>()
const json = (value: unknown, status = 200) => Response.json(value, { status })
const token = () => fetchMock.mockResolvedValueOnce(json({ access_token: 'private-access-token' }))
const playedAt = '2026-10-06T12:00:00.000Z'

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
  vi.stubEnv('SPOTIFY_CLIENT_ID', 'fake-client-id')
  vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'private-client-secret')
  vi.stubEnv('SPOTIFY_REFRESH_TOKEN', 'private-refresh-token')
})

it('does not call Spotify without complete credentials', async () => {
  vi.stubEnv('SPOTIFY_REFRESH_TOKEN', '')
  expect(await getSpotifyPlayback()).toEqual({ status: 'unconfigured', track: null })
  expect(fetchMock).not.toHaveBeenCalled()
})

it('refreshes authorization on the server and returns only public track metadata', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ is_playing: true, item: track }))
  const result = await getSpotifyPlayback()
  expect(result).toEqual({
    status: 'playing',
    track: {
      title: 'Song of Storms',
      artist: 'Artist One, Artist Two',
      album: 'An Album',
      imageUrl: 'https://i.scdn.co/image/medium',
      songUrl: track.external_urls.spotify,
    },
  })
  const options = fetchMock.mock.calls[0][1]!
  expect(options.method).toBe('POST')
  expect(String(options.body)).toBe('grant_type=refresh_token&refresh_token=private-refresh-token')
  expect(options.headers).toMatchObject({
    Authorization: `Basic ${Buffer.from('fake-client-id:private-client-secret').toString('base64')}`,
  })
  expect(fetchMock.mock.calls[1][1]?.headers).toEqual({ Authorization: 'Bearer private-access-token' })
  expect(JSON.stringify(result)).not.toMatch(/private-|access_token|refresh_token/)
})

it('identifies paused playback rather than marking it as live', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ is_playing: false, item: track }))
  const result = await getSpotifyPlayback()
  expect(result.status).toBe('paused')
  expect(result.track?.title).toBe(track.name)
  expect(fetchMock).toHaveBeenCalledTimes(2)
})

it('falls back to the last played track when the current endpoint returns 204', async () => {
  token()
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  fetchMock.mockResolvedValueOnce(json({ items: [{ track, played_at: playedAt }] }))
  const result = await getSpotifyPlayback()
  expect(result.status).toBe('recent')
  expect(result.track?.title).toBe(track.name)
  expect(result.status === 'recent' && result.playedAt).toBe(playedAt)
  expect(fetchMock.mock.calls[2][0]).toBe('https://api.spotify.com/v1/me/player/recently-played?limit=1')
})

it('does not interpret podcasts as music tracks', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ is_playing: true, item: { type: 'episode', name: 'A podcast' } }))
  fetchMock.mockResolvedValueOnce(json({ items: [{ track, played_at: playedAt }] }))
  expect((await getSpotifyPlayback()).status).toBe('recent')
})

it('returns an idle state for an empty listening history', async () => {
  token()
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  fetchMock.mockResolvedValueOnce(json({ items: [] }))
  expect(await getSpotifyPlayback()).toEqual({ status: 'idle', track: null })
})

it('supports tracks without cover artwork', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ is_playing: true, item: { ...track, album: { name: 'An Album', images: [] } } }))
  expect((await getSpotifyPlayback()).track?.imageUrl).toBeNull()
})

it.each([401, 403, 429, 500])('handles a Spotify HTTP %s response without exposing its body', async (status) => {
  token()
  fetchMock.mockResolvedValueOnce(json({ error: 'private-provider-details' }, status))
  expect(await getSpotifyPlayback()).toEqual({ status: 'unavailable', track: null })
})

it('handles token failures and timeouts without throwing', async () => {
  fetchMock.mockRejectedValueOnce(new Error('private-network-details'))
  expect(await getSpotifyPlayback()).toEqual({ status: 'unavailable', track: null })
  fetchMock.mockResolvedValueOnce(json({ error: 'invalid_grant' }, 400))
  expect(await getSpotifyPlayback()).toEqual({ status: 'unavailable', track: null })
})

it('rejects malformed playback data', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ is_playing: 'yes', item: track }))
  expect(await getSpotifyPlayback()).toEqual({ status: 'unavailable', track: null })
})

it('validates track links and cover hosts before displaying them', () => {
  const payload = {
    status: 'playing',
    track: { title: 'A song', artist: 'An artist', album: 'An album', imageUrl: null, songUrl: track.external_urls.spotify },
  }
  expect(spotifyPlaybackSchema.safeParse(payload).success).toBe(true)
  for (const songUrl of ['not a URL', 'javascript:alert(1)', 'https://open.spotify.com.example.com/track/example']) {
    expect(spotifyPlaybackSchema.safeParse({ ...payload, track: { ...payload.track, songUrl } }).success).toBe(false)
  }
  expect(spotifyPlaybackSchema.safeParse({ ...payload, track: { ...payload.track, imageUrl: 'https://example.com/cover.png' } }).success).toBe(false)
})

it('returns only the public profile fields required by the card', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({
    display_name: 'Mateus Neiva',
    images: [{ url: 'https://i.scdn.co/image/avatar' }],
    external_urls: { spotify: 'https://open.spotify.com/user/example' },
    email: 'private@example.com',
    product: 'premium',
    country: 'BR',
  }))
  const result = await getSpotifyProfile()
  expect(result).toEqual({
    name: 'Mateus Neiva',
    avatarUrl: 'https://i.scdn.co/image/avatar',
    profileUrl: 'https://open.spotify.com/user/example',
  })
  expect(fetchMock.mock.calls[1][0]).toBe('https://api.spotify.com/v1/me')
  expect(JSON.stringify(result)).not.toMatch(/email|product|country|private|access_token/)
})

it('supports a missing display name or avatar in the Spotify profile', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ display_name: null, images: [], external_urls: { spotify: 'https://open.spotify.com/user/example' } }))
  expect(await getSpotifyProfile()).toEqual({ name: 'Mateus Neiva', avatarUrl: null, profileUrl: 'https://open.spotify.com/user/example' })
})

it('handles an unavailable profile independently from the playback state', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ error: 'Forbidden' }, 403))
  expect(await getSpotifyProfile()).toBeNull()
})

it('ignores unsupported avatar hosts and rejects profile links outside Spotify', async () => {
  token()
  fetchMock.mockResolvedValueOnce(json({ display_name: 'Mateus', images: [{ url: 'https://example.com/avatar' }], external_urls: { spotify: 'https://open.spotify.com/user/example' } }))
  expect((await getSpotifyProfile())?.avatarUrl).toBeNull()
  token()
  fetchMock.mockResolvedValueOnce(json({ display_name: 'Mateus', images: [], external_urls: { spotify: 'https://example.com/profile' } }))
  expect(await getSpotifyProfile()).toBeNull()
})
