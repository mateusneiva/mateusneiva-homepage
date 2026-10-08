import { test, expect } from '@/test/browser-fixtures'

test('hero places the computer before copy and uses stacked full-width buttons on mobile', async ({ page, isMobile }) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)
    const workspace = await page.locator('[data-hero-workspace]').boundingBox()
    const copy = await page.locator('[data-hero-copy]').boundingBox()
    const actions = page.locator('[data-hero-actions]')
    const container = await actions.boundingBox()
    const buttons = await actions.getByRole('link').all()
    const first = await buttons[0].boundingBox()
    const second = await buttons[1].boundingBox()
    if (isMobile) {
      expect(copy!.y).toBeGreaterThanOrEqual(workspace!.y + workspace!.height)
      expect(first!.width).toBeCloseTo(container!.width, 0)
      expect(second!.width).toBeCloseTo(container!.width, 0)
      expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height)
    } else {
      expect(workspace!.x).toBeGreaterThanOrEqual(copy!.x + copy!.width)
      expect(first!.y).toBeCloseTo(second!.y, 0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})
