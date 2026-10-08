import { unstable_cache } from 'next/cache'
import { getSpotifyProfile } from '@/lib/spotify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const readProfile = unstable_cache(async () => {
  const profile = await getSpotifyProfile()
  if (!profile) throw new Error('Spotify profile unavailable')
  return profile
}, ['spotify-public-profile'], { revalidate: 3600 })

export async function GET() {
  const profile = await readProfile().catch(() => null)
  return Response.json({ profile }, { headers: { 'Cache-Control': 'no-store' } })
}
