import { test, expect } from '@/test/browser-fixtures'

test('title layers stay still without mouse movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const title = page.locator('#about [data-parallax-title]')
  await title.scrollIntoViewIfNeeded()
  const outline = title.locator('[data-parallax-title-outline]')
  await expect(outline).toHaveAttribute('aria-hidden', 'true')
  await expect(title.getByRole('heading', { level: 2 })).toHaveAccessibleName('Curiosidade como ponto de partida.')
  await expect.poll(() => outline.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42)).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('reduced motion hides the decorative title copy', async ({ page }) => {
  await page.goto('/pt')
  await page.evaluate(() => window.scrollTo({ top: 250, behavior: 'instant' }))
  const title = page.locator('#about [data-parallax-title]')
  await expect(title.locator('[data-parallax-title-outline]')).toBeHidden()
  await expect(title.getByRole('heading', { level: 2 })).toHaveCSS('transform', 'none')
})

test('mouse movement animates only the outline while the foreground stays still', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Text pointer parallax requires a fine pointer.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const title = page.locator('#about [data-parallax-title]')
  await title.scrollIntoViewIfNeeded()
  await expect(page.locator('#about')).toHaveCSS('opacity', '1')
  const foreground = title.getByRole('heading', { level: 2 })
  const outline = title.locator('[data-parallax-title-outline]')
  const width = page.viewportSize()!.width
  const height = page.viewportSize()!.height
  await page.mouse.move(width * 0.15, height / 2, { steps: 6 })
  await expect(foreground).toHaveCSS('transform', 'none')
  await expect.poll(() => outline.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)).toBeLessThan(-20)
  const before = await outline.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)
  await page.mouse.move(width * 0.85, height / 2, { steps: 6 })
  await expect(foreground).toHaveCSS('transform', 'none')
  await expect.poll(() => outline.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m41)).toBeGreaterThan(before + 40)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})

test('hero and contact use the same decorative outline while preserving colored titles', async ({ page }) => {
  await page.goto('/pt')
  const hero = page.locator('[data-hero-copy] [data-parallax-title]')
  const contact = page.locator('#contact [data-parallax-title]')
  await expect(hero.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(contact.getByRole('heading', { level: 2 })).toHaveCount(1)
  for (const title of [hero, contact]) {
    await expect(title.locator('[data-parallax-title-outline]')).toHaveAttribute('aria-hidden', 'true')
    await expect(title.locator('h1, h2')).toHaveCSS('transform', 'none')
    await expect(title.locator('h1 > .text-accent, h2 > .text-accent')).toHaveCount(1)
    await expect(title.locator('h1 > .text-accent, h2 > .text-accent')).toHaveClass(/text-accent/)
  }
})
