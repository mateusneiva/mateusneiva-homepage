import { test, expect } from '@/test/browser-fixtures'

test('homepage keeps the original section order and coherent About reading order', async ({ page, isMobile }) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('main > section').first().getByRole('link', { name: locale === 'pt' ? 'Vamos conversar' : "Let's Talk", exact: true })).toBeVisible()

    const sections = await page.locator('main > section[id]').evaluateAll((items) => items.map((item) => item.id))
    expect(sections).toEqual(['about', 'projects', 'posts', 'contact'])
    await expect(page.locator('main > section').first().locator('a[href="#about"]')).toHaveCount(1)

    const about = page.locator('#about')
    const selectors = [
      '[data-about-intro]',
      '[data-about-journey]',
      '[data-about-principles]',
      '[data-skills-matrix]',
      '[data-spotify-widget]',
    ]
    const domOrder = await about.locator(selectors.join(', ')).evaluateAll(
      (items, patterns) => items.map((item) => patterns.findIndex((pattern) => item.matches(pattern))),
      selectors,
    )
    expect(domOrder).toEqual([0, 1, 2, 3, 4])
    const skills = await about.locator('[data-skills-matrix]').boundingBox()
    const principles = await about.locator('[data-about-principles]').boundingBox()
    if (!isMobile) expect(principles!.x).toBeLessThan(skills!.x)

    if (isMobile) {
      const positions = []
      for (const selector of selectors) positions.push(await about.locator(selector).boundingBox())
      for (let index = 1; index < positions.length; index++) {
        expect(positions[index]!.y).toBeGreaterThanOrEqual(positions[index - 1]!.y + positions[index - 1]!.height - 1)
      }
    }

    const footerLinks = await page.locator('footer nav').first().getByRole('link').evaluateAll(
      (links) => links.map((link) => link.getAttribute('href')),
    )
    expect(footerLinks).toEqual([`/${locale}`, `/${locale}#about`, `/${locale}#projects`, `/${locale}/posts`])
    const linksBox = await page.locator('[data-footer-links]').boundingBox()
    const identityBox = await page.locator('[data-footer-identity]').boundingBox()
    if (isMobile) {
      expect(identityBox!.y).toBeGreaterThanOrEqual(linksBox!.y + linksBox!.height)
    } else {
      expect(identityBox!.x + identityBox!.width).toBeLessThan(linksBox!.x)
      expect(identityBox!.y).toBeCloseTo(linksBox!.y, 0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})
