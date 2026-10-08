import { test, expect } from '@/test/browser-fixtures'

test('footer keeps its dark palette when the page switches between light and dark themes', async ({ page }) => {
  await page.goto('/pt')
  const footer = page.locator('footer[data-theme="dark"]')
  await footer.scrollIntoViewIfNeeded()
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await expect(footer).toHaveCSS('background-color', 'rgb(25, 27, 23)')
    await expect(footer).toHaveCSS('opacity', '1')
    await expect(footer).toHaveCSS('color', 'rgb(231, 229, 228)')
    await expect(footer.locator('nav h3').first()).toHaveCSS('color', 'rgb(190, 242, 100)')
    await expect(footer.getByRole('link', { name: 'Mateus Neiva', exact: true })).toHaveCSS('color', 'rgb(231, 229, 228)')
  }
})

test('footer displays public repository links and localized GitHub counts', async ({ page }) => {
  const repository = 'https://github.com/mateusneiva/mateusneiva-homepage'
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    const footer = page.locator('[data-footer-repository]')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.getByRole('link', { name: 'mateusneiva-homepage', exact: true })).toHaveAttribute('href', repository)
    const stars = footer.locator(`a[href="${repository}/stargazers"]`)
    await expect(stars).toHaveText(locale === 'pt' ? /\d+ estrelas/ : /\d+ stars/)
    await expect(stars).toHaveAttribute('target', '_blank')
    await expect(footer.locator(`a[href="${repository}/forks"]`)).toHaveText(/\d+ forks/)
    await expect(page.locator('footer[data-theme="dark"]')).not.toContainText('Next.js / TypeScript / Motion')
  }
})
