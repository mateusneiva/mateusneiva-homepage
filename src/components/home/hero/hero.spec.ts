import { test, expect } from '@/test/browser-fixtures'

test('hero dot field spans the viewport behind the copy and buttons stack on mobile', async ({
  page,
  isMobile,
}) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)
    const visual = page.locator('[data-hero-visual]')
    const bounds = await visual.boundingBox()
    const viewport = await page.evaluate(() => document.body.clientWidth)
    expect(bounds!.x).toBeCloseTo(0, 0)
    expect(bounds!.width).toBeCloseTo(viewport, 0)
    await expect(visual).toHaveCSS('pointer-events', 'none')
    await expect(visual).toHaveCSS('z-index', '-10')

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
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true)
  }
})
