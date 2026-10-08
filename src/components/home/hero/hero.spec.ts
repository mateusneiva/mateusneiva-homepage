import { test, expect } from '@/test/browser-fixtures'

test('hero uses stacked full-width buttons on mobile and inline buttons on desktop', async ({ page, isMobile }) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)
    const actions = page.locator('[data-hero-actions]')
    const container = await actions.boundingBox()
    const buttons = await actions.getByRole('link').all()
    const first = await buttons[0].boundingBox()
    const second = await buttons[1].boundingBox()
    if (isMobile) {
      expect(first!.width).toBeCloseTo(container!.width, 0)
      expect(second!.width).toBeCloseTo(container!.width, 0)
      expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height)
    } else {
      expect(first!.y).toBeCloseTo(second!.y, 0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})
