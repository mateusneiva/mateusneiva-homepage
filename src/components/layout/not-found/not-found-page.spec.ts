import { test, expect } from '@/test/browser-fixtures'

test('unknown routes show a localized 404 with navigation and noindex', async ({ page }) => {
  for (const locale of ['pt', 'en']) {
    for (const path of ['not-a-page', 'unknown/deep/path', 'projects/missing', 'posts/missing']) {
      const response = await page.goto(`/${locale}/${path}`)
      expect(response?.status()).toBe(404)
      await expect(page.locator('[data-not-found-page]')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale === 'pt' ? 'Este caminho saiu do mapa.' : 'This path went off the map.')
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
      await expect(page.locator('[data-not-found-page]').getByRole('link').first()).toHaveAttribute('href', `/${locale}`)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    }
  }
})
