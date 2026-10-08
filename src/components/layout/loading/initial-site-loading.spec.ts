import { test, expect } from '@/test/browser-fixtures'

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`initial logo loading disappears after assets are ready and does not return on navigation (${reducedMotion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    let release!: () => void
    const fontsReady = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/*.woff2', async (route) => {
      await fontsReady
      await route.continue()
    })

    const locale = reducedMotion === 'reduce' ? 'en' : 'pt'
    await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' })
    const loading = page.locator('[data-initial-loading]')
    await expect(loading).toBeVisible()
    await expect(loading).toContainText(locale === 'pt' ? 'Carregando o site de Mateus Neiva…' : "Loading Mateus Neiva's website…")
    const logo = loading.locator(':scope > span').first()
    await expect(logo.locator('svg use').first()).toHaveAttribute('href', '/logo.svg#logo-mark')
    await expect(logo).toHaveCSS('animation-name', 'none')
    await expect(page.locator('[data-hero-copy]')).toHaveCSS('opacity', '0')
    await expect(loading.locator(':scope > div > span')).toHaveCSS('animation-name', reducedMotion === 'reduce' ? 'none' : 'logo-progress')
    release()
    await expect(loading).toHaveCount(0)
    await expect(page.locator('[data-hero-copy]')).toHaveCSS('opacity', '1')

    const nextLocale = locale === 'pt' ? 'en' : 'pt'
    await page.getByRole('link', { name: nextLocale.toUpperCase(), exact: true }).click()
    await expect(page).toHaveURL(`/${nextLocale}`)
    await expect(loading).toHaveCount(0)
    await page.locator('footer nav').first().getByRole('link', { name: 'Posts', exact: true }).click()
    await expect(page).toHaveURL(`/${nextLocale}/posts`)
    await expect(loading).toHaveCount(0)
  })
}
