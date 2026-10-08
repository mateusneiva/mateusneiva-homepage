import { test, expect } from '@/test/browser-fixtures'

test('About presents its story before the journey and connects principles to projects', async ({
  page,
  isMobile,
}, testInfo) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    const about = page.locator('#about')
    await about.scrollIntoViewIfNeeded()
    const intro = about.locator('[data-about-intro]')
    const journey = about.locator('[data-about-journey]')
    await expect(intro.locator('p')).toHaveCount(4)
    await expect(intro).toContainText('Zelda')
    await expect(intro).toContainText('Minecraft')
    for (const title of locale === 'pt'
      ? ['Explorar', 'Construir', 'Compartilhar']
      : ['Explore', 'Build', 'Share']) {
      await expect(journey.getByRole('heading', { name: title, exact: true })).toBeVisible()
    }
    const introBounds = await intro.boundingBox()
    const journeyBounds = await journey.boundingBox()
    expect(journeyBounds!.y).toBeGreaterThanOrEqual(introBounds!.y + introBounds!.height)
    const skillsBounds = await about.locator('[data-skills-matrix]').boundingBox()

    const principles = about.locator('[data-about-principles]')
    if (!isMobile) expect((await principles.boundingBox())!.x).toBeLessThan(skillsBounds!.x)
    await principles.scrollIntoViewIfNeeded()
    await expect(principles.getByRole('heading', { level: 4 })).toHaveCount(3)
    await expect(
      principles.getByRole('heading', {
        name: locale === 'pt' ? 'O que guia minhas escolhas.' : 'What guides my decisions.',
        exact: true,
      }),
    ).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (locale === 'pt') await principles.screenshot({ path: testInfo.outputPath('about-principles.png') })
    await principles
      .getByRole('link', {
        name: locale === 'pt' ? 'Veja essas escolhas nos projetos' : 'See these decisions in my projects',
        exact: true,
      })
      .click()
    await expect(page).toHaveURL(/#projects$/)
    await expect(page.locator('#projects')).toBeInViewport()
  }
})
