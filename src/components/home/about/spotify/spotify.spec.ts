import { test, expect } from '@/test/browser-fixtures'
import { spotifyCacheKey, spotifyPlaybackSchema, spotifyProfileResponseSchema } from '@/lib/spotify/schema'

const track = {
  title: 'Song of Storms',
  artist: 'Artist One, Artist Two',
  album: 'An Album',
  imageUrl: 'https://i.scdn.co/image/example',
  songUrl: 'https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6',
}

const profile = {
  name: 'Mateus Neiva',
  avatarUrl: 'https://i.scdn.co/image/profile',
  profileUrl: 'https://open.spotify.com/user/example',
}
const fixtureImage = '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><rect width="72" height="72" fill="#354832"/><path d="M22 43V29h28v14M29 50V22M43 50V22" fill="none" stroke="#bff264" stroke-width="3"/></svg>'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/spotify/profile', (route) => route.fulfill({ json: { profile: null } }))
})

test('Spotify displays cover, artists and links only when the block becomes visible', async ({ page }, testInfo) => {
  let requests = 0
  await page.route('**/api/spotify/profile', (route) => route.fulfill({ json: { profile } }))
  await page.route('**/api/spotify', (route) => {
    requests++
    return route.fulfill({ json: { status: 'playing', track } })
  })
  await page.route('**/_next/image?**', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: fixtureImage,
  }))
  for (const locale of ['pt', 'en']) {
    const before = requests
    await page.goto(`/${locale}`)
    expect(requests).toBe(before)
    const widget = page.locator('[data-spotify-widget]')
    await widget.scrollIntoViewIfNeeded()
    await expect(widget).toHaveAttribute('data-spotify-status', 'playing')
    await expect(widget.getByText(locale === 'pt' ? 'Ouvindo agora' : 'Listening now', { exact: true })).toBeVisible()
    const visualizer = widget.locator('[data-spotify-visualizer]')
    await expect(visualizer).toBeVisible()
    await expect(visualizer).toHaveAttribute('aria-hidden', 'true')
    const bar = visualizer.locator('span').first()
    await expect(bar).toHaveCSS('animation-name', 'none')
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await expect(bar).toHaveCSS('animation-name', 'spotify-bar')
    const transform = await bar.evaluate((node) => getComputedStyle(node).transform)
    await expect.poll(() => bar.evaluate((node) => getComputedStyle(node).transform)).not.toBe(transform)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(widget.getByRole('heading', { name: track.title, exact: true })).toBeVisible()
    await expect(widget).toContainText(track.artist)
    const cover = widget.getByRole('img', { name: locale === 'pt' ? 'Capa de An Album' : 'Cover of An Album' })
    await expect(cover).toBeVisible()
    await expect.poll(() => cover.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    const link = widget.getByRole('link', { name: locale === 'pt' ? 'Abrir no Spotify' : 'Open in Spotify', exact: true })
    await expect(link).toHaveAttribute('href', track.songUrl)
    await expect(link).toHaveAttribute('target', '_blank')
    const identity = widget.locator('[data-spotify-profile]')
    await expect(identity).toContainText(profile.name)
    const avatar = identity.getByRole('img', { name: locale === 'pt' ? 'Foto de Mateus Neiva' : 'Photo of Mateus Neiva' })
    await expect(avatar).toBeVisible()
    await expect.poll(() => avatar.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    await expect(identity.getByRole('link')).toHaveAttribute('href', profile.profileUrl)
    await identity.getByRole('link').focus()
    const profileTooltip = page.locator('[data-custom-tooltip]')
    await expect(profileTooltip).toContainText(locale === 'pt' ? 'Abrir perfil no Spotify' : 'Open Spotify profile')
    await expect(profileTooltip).toContainText(profile.name)
    await page.keyboard.press('Escape')
    await identity.getByRole('link').evaluate((node) => (node as HTMLElement).blur())
    await expect(profileTooltip).toHaveCount(0)
    const openBounds = await link.boundingBox()
    const labelBounds = await link.locator('span').last().boundingBox()
    const profileBounds = await identity.getByRole('link').boundingBox()
    const nameBounds = await identity.getByText(profile.name, { exact: true }).boundingBox()
    const avatarBounds = await avatar.boundingBox()
    expect(nameBounds!.y + nameBounds!.height / 2).toBeCloseTo(avatarBounds!.y + avatarBounds!.height / 2, 0)
    expect(labelBounds!.y + labelBounds!.height / 2).toBeCloseTo(nameBounds!.y + nameBounds!.height / 2, 0)
    await expect(link.locator('[data-arrow-direction="up-right"]')).toHaveCount(1)
    await expect(widget).toHaveCSS('padding', '24px')
    expect(openBounds!.y + openBounds!.height / 2).toBeCloseTo(profileBounds!.y + profileBounds!.height / 2, 0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (locale === 'pt') await widget.screenshot({ path: testInfo.outputPath('spotify-playing.png') })
  }
})

test('Spotify padding stays consistent when long metadata wraps at different widths', async ({ page }) => {
  await page.route('**/api/spotify/profile', (route) => route.fulfill({ json: { profile: { ...profile, avatarUrl: null } } }))
  await page.route('**/api/spotify', (route) => route.fulfill({ json: {
    status: 'playing',
    track: { ...track, imageUrl: null, title: 'A long song title that wraps naturally across multiple lines', artist: 'Artist One, Artist Two, Artist Three, Artist Four' },
  } }))
  await page.goto('/pt')
  const widget = page.locator('[data-spotify-widget]')
  for (const width of [320, 393, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await widget.scrollIntoViewIfNeeded()
    await expect(widget).toHaveAttribute('data-spotify-status', 'playing')
    await expect(widget).toHaveCSS('padding', '24px')
    const bounds = await widget.boundingBox()
    const identity = await widget.locator('[data-spotify-profile]').boundingBox()
    expect(bounds!.y + bounds!.height - (identity!.y + identity!.height)).toBeCloseTo(24, 0)
    const link = await widget.getByRole('link', { name: 'Abrir no Spotify', exact: true }).boundingBox()
    expect(link!.x).toBeGreaterThanOrEqual(bounds!.x + 24)
    expect(link!.x + link!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width - 24)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  }
})

test('Spotify track link levitates on hover and shows the track in its tooltip', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover requires a fine pointer.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/api/spotify', (route) => route.fulfill({ json: { status: 'playing', track: { ...track, imageUrl: null } } }))
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const widget = page.locator('[data-spotify-widget]')
  await widget.scrollIntoViewIfNeeded()
  await expect(widget).toHaveAttribute('data-spotify-status', 'playing')
  await expect(page.locator('#about')).toHaveCSS('opacity', '1')
  const link = widget.getByRole('link', { name: 'Abrir no Spotify', exact: true })
  await link.hover()
  const tooltip = page.locator('[data-custom-tooltip]')
  await expect(tooltip).toHaveCSS('opacity', '1')
  await expect(tooltip).toContainText(track.title)
  await expect(tooltip).toContainText(track.artist)
  await expect.poll(() => link.locator('span').first().evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42)).toBeCloseTo(-2, 1)
  await page.mouse.move(0, 0, { steps: 8 })
  await expect(tooltip).toHaveCount(0)
})

test('Spotify distinguishes paused, recent and unavailable states', async ({ page }) => {
  let payload: unknown
  await page.addInitScript((key) => localStorage.removeItem(key), spotifyCacheKey)
  await page.route('**/api/spotify', (route) => route.fulfill({ json: payload }))
  for (const [status, label] of [
    ['paused', 'Em pausa'],
    ['recent', 'Última faixa ouvida'],
    ['idle', 'Nada tocando no momento. A próxima faixa aparece por aqui.'],
    ['unconfigured', 'Spotify ainda não conectado.'],
    ['unavailable', 'A trilha sonora está indisponível por enquanto.'],
  ]) {
    const hasTrack = status === 'paused' || status === 'recent'
    payload = {
      status,
      track: hasTrack ? { ...track, imageUrl: null } : null,
      ...(status === 'recent' ? { playedAt: new Date().toISOString() } : {}),
    }
    await page.goto('/pt')
    const widget = page.locator('[data-spotify-widget]')
    await widget.scrollIntoViewIfNeeded()
    await expect(widget).toHaveAttribute('data-spotify-status', status)
    await expect(widget.getByText(label, { exact: true })).toBeVisible()
    await expect(widget.getByRole('link')).toHaveCount(hasTrack ? 1 : 0)
    await expect(widget.getByText('Ouvindo agora', { exact: true })).toHaveCount(0)
    await expect(widget.locator('[data-spotify-visualizer]')).toHaveCount(0)
  }
})

test('Spotify polling pauses outside the viewport and preserves the track while refreshing', async ({ page }) => {
  await page.clock.install()
  let requests = 0
  let releaseResume!: () => void
  const resumeGate = new Promise<void>((resolve) => { releaseResume = resolve })
  await page.route('**/api/spotify', async (route) => {
    requests++
    if (requests >= 3) await resumeGate
    return route.fulfill({ json: { status: requests === 1 ? 'playing' : 'paused', track: { ...track, imageUrl: null } } })
  })
  await page.goto('/pt')
  const widget = page.locator('[data-spotify-widget]')
  await widget.scrollIntoViewIfNeeded()
  await expect(widget).toHaveAttribute('data-spotify-status', 'playing')
  await page.clock.fastForward(30_001)
  await expect(widget).toHaveAttribute('data-spotify-status', 'paused')
  expect(requests).toBe(2)
  const title = await widget.getByRole('heading', { name: track.title, exact: true }).elementHandle()
  await page.locator('header').first().scrollIntoViewIfNeeded()
  await expect(widget).not.toBeInViewport()
  await page.clock.runFor(100)
  const before = requests
  await page.clock.fastForward(60_001)
  expect(requests).toBe(before)
  await widget.scrollIntoViewIfNeeded()
  await expect.poll(() => requests).toBe(before + 1)
  await expect(widget).toHaveAttribute('data-spotify-status', 'paused')
  await expect(widget.getByRole('heading', { name: track.title, exact: true })).toBeVisible()
  await expect(widget.getByText('Consultando o Spotify…', { exact: true })).toHaveCount(0)
  expect(await title!.evaluate((element) => element.isConnected)).toBe(true)
  const response = page.waitForResponse('**/api/spotify')
  releaseResume()
  await response
})

test('the public Spotify endpoint returns validated metadata without credentials', async ({ request }) => {
  const response = await request.get('/api/spotify')
  expect(response.status()).toBe(200)
  expect(response.headers()['cache-control']).toBe('no-store')
  const payload = await response.json()
  expect(spotifyPlaybackSchema.safeParse(payload).success).toBe(true)
  expect(Object.keys(payload).sort()).toEqual(payload.status === 'recent' ? ['playedAt', 'status', 'track'] : ['status', 'track'])
  const profileResponse = await request.get('/api/spotify/profile')
  expect(profileResponse.status()).toBe(200)
  const identity = await profileResponse.json()
  expect(spotifyProfileResponseSchema.safeParse(identity).success).toBe(true)
  expect(Object.keys(identity)).toEqual(['profile'])
  if (identity.profile) expect(Object.keys(identity.profile).sort()).toEqual(['avatarUrl', 'name', 'profileUrl'])
})

for (const locale of ['pt', 'en']) {
  test(`last played shows elapsed time and updates it in ${locale}`, async ({ page }) => {
    const now = new Date('2026-10-06T12:30:00.000Z')
    const playedAt = new Date(now.getTime() - 12 * 60_000).toISOString()
    await page.clock.install({ time: now })
    await page.route('**/api/spotify', (route) => route.fulfill({ json: {
      status: 'recent', playedAt, track: { ...track, imageUrl: null },
    } }))
    await page.goto(`/${locale}`)
    const widget = page.locator('[data-spotify-widget]')
    await widget.scrollIntoViewIfNeeded()
    await expect(widget).toHaveAttribute('data-spotify-status', 'recent')
    await expect(widget.getByText(locale === 'pt' ? 'Última faixa ouvida' : 'Last Played', { exact: true })).toBeVisible()
    const time = widget.locator('time')
    await expect(time).toHaveAttribute('datetime', playedAt)
    await expect(time).toContainText('12')
    await expect(time).toContainText(locale === 'pt' ? 'há' : 'ago')
    await page.clock.fastForward(60_001)
    await expect(time).toContainText('13')
  })
}

test('the last track survives reloads and temporary API failures without flashing loading', async ({ page }) => {
  let mode = 'playing'
  let release!: () => void
  const gate = new Promise<void>((resolve) => { release = resolve })
  const playedAt = new Date(Date.now() - 5 * 60_000).toISOString()
  await page.route('**/_next/image?**', (route) => route.fulfill({ contentType: 'image/svg+xml', body: fixtureImage }))
  await page.route('**/api/spotify/profile', async (route) => {
    if (mode === 'blocked') await gate
    await route.fulfill({ json: { profile: mode === 'unavailable' ? null : profile } })
  })
  await page.route('**/api/spotify', async (route) => {
    if (mode === 'blocked') {
      await gate
      await route.fulfill({ json: { status: 'recent', playedAt, track: { ...track, imageUrl: null } } })
    } else {
      await route.fulfill({ json: { status: mode, track: mode === 'playing' ? { ...track, imageUrl: null } : null } })
    }
  })
  await page.goto('/pt')
  const widget = page.locator('[data-spotify-widget]')
  await widget.scrollIntoViewIfNeeded()
  await expect(widget).toHaveAttribute('data-spotify-status', 'playing')
  await expect(widget.locator('[data-spotify-profile]').getByRole('img')).toBeVisible()
  await expect(widget.locator('[data-spotify-profile]').getByRole('link')).toHaveAttribute('href', profile.profileUrl)
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).playback.track.title, spotifyCacheKey)).toBe(track.title)

  mode = 'blocked'
  await page.reload()
  await widget.scrollIntoViewIfNeeded()
  await expect(widget).toHaveAttribute('data-spotify-status', 'cached')
  await expect(widget.getByRole('heading', { name: track.title, exact: true })).toBeVisible()
  await expect(widget.getByText('Consultando o Spotify…', { exact: true })).toHaveCount(0)
  await expect(widget.getByText('Ouvindo agora', { exact: true })).toHaveCount(0)
  await expect(widget.locator('[data-spotify-profile]').getByRole('img')).toBeVisible()
  await expect(widget.locator('[data-spotify-profile]')).toContainText(profile.name)
  release()
  await expect(widget).toHaveAttribute('data-spotify-status', 'recent')
  await expect(widget.locator('time')).toHaveAttribute('datetime', playedAt)

  mode = 'unavailable'
  const response = page.waitForResponse('**/api/spotify')
  await page.reload()
  await widget.scrollIntoViewIfNeeded()
  await response
  await expect(widget).toHaveAttribute('data-spotify-status', 'cached')
  await expect(widget.getByRole('heading', { name: track.title, exact: true })).toBeVisible()
  await expect(widget.locator('time')).toHaveAttribute('datetime', playedAt)
  await expect(widget.getByText('Consultando o Spotify…', { exact: true })).toHaveCount(0)
  await expect(widget.locator('[data-spotify-profile]').getByRole('img')).toBeVisible()
  await expect(widget.locator('[data-spotify-profile]').getByRole('link')).toHaveAttribute('href', profile.profileUrl)
})
