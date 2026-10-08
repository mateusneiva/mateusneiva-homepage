import { test, expect } from '@/test/browser-fixtures'

test('footer text rows move in opposite directions without fading the footer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  const marquee = page.locator('[data-footer-marquee]')
  await marquee.scrollIntoViewIfNeeded()
  await expect(marquee).not.toContainText(/[↙↗]/)
  const top = page.locator('[data-footer-marquee-row="0"] > div')
  const bottom = page.locator('[data-footer-marquee-row="1"] > div')
  const first = await top.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)
  const second = await bottom.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)
  await expect.poll(() => top.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)).toBeLessThan(first - 1)
  await expect.poll(() => bottom.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)).toBeGreaterThan(second + 1)
  await expect(page.locator('footer[data-theme="dark"]')).toHaveCSS('opacity', '1')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
