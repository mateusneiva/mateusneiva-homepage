import { test, expect } from '@/test/browser-fixtures'

test('local posts show reading time without a source badge and fit narrow screens', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 900 })
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}/posts`)
    await page.evaluate(() => document.fonts.ready)
    const metadata = page.locator('[data-post-metadata]').first()
    await metadata.scrollIntoViewIfNeeded()
    await expect(page.locator('[data-post-source]')).toHaveCount(0)
    await expect(metadata).toContainText(locale === 'pt' ? 'min de leitura' : 'min read')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})
