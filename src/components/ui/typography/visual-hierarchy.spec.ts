import { test, expect } from '@/test/browser-fixtures'

test('cards and footer use serif headings, navigation is transparent, and highlights keep metadata plain', async ({ page }) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)

    await expect(page.locator('#projects h3').first()).toHaveCSS('font-family', /Lora/)
    await expect(page.locator('#posts h3').first()).toHaveCSS('font-family', /Lora/)
    await expect(page.locator('footer nav h3').first()).toHaveCSS('font-family', /IBM.Plex.Mono/)
    await expect(page.locator('footer nav a').first()).toHaveCSS('font-family', /Space.Grotesk/)
    await expect(page.locator('footer').getByText('Mateus Neiva', { exact: true })).toHaveCSS('font-family', /Lora/)
    await expect(page.locator('footer').getByText(locale === 'pt' ? 'Desenvolvedor de software' : 'Software developer', { exact: true })).toHaveCSS('font-family', /Lora/)
    await expect(page.locator('header').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    const hero = page.locator('main > section').first()
    await expect(hero.locator('p strong')).toHaveCount(2)
    await expect(page.locator('[data-about-intro] strong')).toHaveCount(5)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('Mateus Neiva')
    expect(description).not.toMatch(/<\/?(?:name|highlight)>/)
  }
})
