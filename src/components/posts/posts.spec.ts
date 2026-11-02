import { test, expect } from '@/test/browser-fixtures'

test('an article links back to the home page', async ({ page }) => {
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const article = page.locator('#posts article a[href="/pt/posts/sobre-este-espaco"]')
  await article.scrollIntoViewIfNeeded()
  await article.click()
  await expect(page).toHaveURL('/pt/posts/sobre-este-espaco')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Um espaço para construir e compartilhar',
    }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click()
  await expect(page).toHaveURL('/pt')
})

test('direct article entry goes back to the localized home page', async ({ page }) => {
  await page.goto('/en/posts/sobre-este-espaco')
  await page.getByRole('link', { name: 'Back to home', exact: true }).click()
  await expect(page).toHaveURL('/en')
})
