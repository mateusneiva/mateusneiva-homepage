import { test, expect } from '@/test/browser-fixtures'

test('wheel inertia uses native scroll and anchor navigation stays functional', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Wheel inertia is verified on a fine-pointer device; touch remains native.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  await expect(page.locator('html')).toHaveClass(/lenis/)
  await page.mouse.move(30, 300)
  await page.mouse.wheel(0, 700)
  await expect(page.locator('html')).toHaveClass(/lenis-smooth/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(650)
  await page.locator('footer nav').first().getByRole('link', { name: 'Sobre', exact: true }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.locator('#about')).toBeInViewport()
  await page.getByRole('button', { name: 'Voltar ao topo', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('container reaches 1200px and the footer has two counter-flow text rows', async ({ page, isMobile }) => {
  if (!isMobile) await page.setViewportSize({ width: 1600, height: 1000 })
  await page.goto('/pt')
  if (!isMobile) expect((await page.locator('main').boundingBox())!.width).toBeCloseTo(1200, 0)
  await expect(page.locator('[data-footer-marquee-row]')).toHaveCount(2)
  await expect(page.locator('footer')).toHaveCSS('opacity', '1')
  await expect(page.locator('[data-footer-marquee-row="0"]')).toContainText('Da curiosidade às boas ideias.')
  await expect(page.locator('[data-footer-marquee-row="1"]')).toContainText('Do código às novas possibilidades.')
})
