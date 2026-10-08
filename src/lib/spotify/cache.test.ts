import { expect, it, vi } from 'vitest'
import { readSpotifyCache, writeSpotifyCache } from './cache'
import { spotifyCacheKey, type SpotifyCache } from './schema'

const cached: SpotifyCache = {
  playback: {
    status: 'recent',
    playedAt: '2026-10-06T12:00:00.000Z',
    track: {
      title: 'A song',
      artist: 'An artist',
      album: 'An album',
      imageUrl: null,
      songUrl: 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6',
    },
  },
  savedAt: '2026-10-06T12:10:00.000Z',
}

function storage(value: string | null = null) {
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_, next: string) => {
      value = next
    }),
  }
}

it('persists and restores the track with its playback and synchronization timestamps', () => {
  const target = storage()
  writeSpotifyCache(cached, target)
  expect(target.setItem).toHaveBeenCalledWith(spotifyCacheKey, expect.any(String))
  expect(readSpotifyCache(target)).toEqual(cached)
})

it.each(['not JSON', '{}', 'null'])('ignores a corrupted cache entry: %s', (value) => {
  expect(readSpotifyCache(storage(value))).toBeNull()
})

it('rejects invalid timestamps and never replaces the last song with an empty state', () => {
  expect(readSpotifyCache(storage(JSON.stringify({ ...cached, savedAt: 'not a date' })))).toBeNull()
  const target = storage(JSON.stringify(cached))
  writeSpotifyCache({ playback: { status: 'idle', track: null }, savedAt: cached.savedAt }, target)
  expect(target.setItem).not.toHaveBeenCalled()
  expect(readSpotifyCache(target)).toEqual(cached)
})

it('stores only the fields allowed by the public cache schema', () => {
  const target = storage()
  const value = { ...cached, access_token: 'private-token', client_secret: 'private-secret' }
  writeSpotifyCache(value, target)
  expect(JSON.parse(target.setItem.mock.calls[0][1])).toEqual(cached)
})

it('handles disabled storage and quota errors without interrupting the widget', () => {
  const target = {
    getItem: vi.fn(() => {
      throw new Error('Storage blocked')
    }),
    setItem: vi.fn(() => {
      throw new Error('Quota exceeded')
    }),
  }
  expect(readSpotifyCache(target)).toBeNull()
  expect(() => writeSpotifyCache(cached, target)).not.toThrow()
})

it('restores the public profile together with the last track', () => {
  const target = storage()
  const value = {
    ...cached,
    profile: {
      name: 'Mateus Neiva',
      avatarUrl: 'https://i.scdn.co/image/avatar',
      profileUrl: 'https://open.spotify.com/user/example',
    },
  }
  writeSpotifyCache(value, target)
  expect(readSpotifyCache(target)).toEqual(value)
})
