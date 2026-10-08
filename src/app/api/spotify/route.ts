import { unstable_cache } from 'next/cache'
import { getSpotifyPlayback } from '@/lib/spotify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const readPlayback = unstable_cache(getSpotifyPlayback, ['spotify-playback-v2'], { revalidate: 30 })

export async function GET() {
  const playback = await readPlayback()
  return Response.json(playback, { headers: { 'Cache-Control': 'no-store' } })
}
