import { test, expect } from '@/test/browser-fixtures'

for (const path of ['/pt/projects/softness', '/pt/posts/sobre-este-espaco']) {
  test(`reading progress follows the article and completes before the footer on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: page.viewportSize()!.width, height: 300 })
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
    const bar = page.locator('[data-reading-progress]')
    await expect(bar).toHaveCSS('position', 'fixed')
    await expect(bar).toHaveCSS('top', '0px')
    const scale = () => bar.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).a)
    await expect.poll(scale).toBe(0)
    const { start, end } = await page.locator('main > article').evaluate((article) => {
      const bounds = article.getBoundingClientRect()
      return { start: window.scrollY + bounds.top, end: window.scrollY + bounds.bottom - window.innerHeight }
    })
    expect(end).toBeGreaterThan(start)
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), (start + end) / 2)
    await expect.poll(scale).toBeCloseTo(0.5, 2)
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.ceil(end))
    await expect.poll(scale).toBe(1)
    expect(await page.evaluate(() => window.scrollY < document.documentElement.scrollHeight - window.innerHeight)).toBe(true)
  })
}
