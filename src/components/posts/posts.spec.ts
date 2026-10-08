import { test, expect } from '@/test/browser-fixtures'

test('an article returns to the home page and restores the reading position', async ({ page }) => {
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const article = page.locator('#posts article a').first()
  await article.scrollIntoViewIfNeeded()
  const scroll = await page.evaluate(() => window.scrollY)
  await article.click()
  await expect(page).toHaveURL('/pt/posts/sobre-este-espaco')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Um espaço para construir e compartilhar',
    }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Voltar', exact: true }).click()
  await expect(page).toHaveURL('/pt')
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - scroll))
    .toBeLessThan(32)
})

test('direct article entry falls back to the localized posts index', async ({ page }) => {
  await page.goto('/en/posts/sobre-este-espaco')
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page).toHaveURL('/en/posts')
  await expect(page.locator('main article')).toHaveCount(1)
})
