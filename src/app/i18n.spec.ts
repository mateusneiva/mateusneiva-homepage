import { test, expect } from '@/test/browser-fixtures'

const paths = ['', '/posts', '/posts/sobre-este-espaco', '/projects/softness']

test('the root path redirects to the browser language', async ({ browser }) => {
  for (const [locale, expected] of [
    ['pt-BR', '/pt'],
    ['en-US', '/en'],
  ] as const) {
    const context = await browser.newContext({ locale })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(expected)
    await context.close()
  }
})

test('the language switch keeps the current page and updates the document language', async ({ page }) => {
  for (const path of paths) {
    await page.goto(`/pt${path}`)
    const group = page.getByRole('group', { name: 'Mudar idioma', exact: true })
    await expect(group.getByRole('link', { name: 'PT', exact: true })).toHaveAttribute('aria-current', 'true')
    await group.getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(`/en${path}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(
      page.getByRole('group', { name: 'Change language', exact: true }).getByRole('link', { name: 'EN', exact: true }),
    ).toHaveAttribute('aria-current', 'true')
  }
})

test('the chosen language is remembered when returning to the root path', async ({ page }) => {
  await page.goto('/pt')
  await page.getByRole('group', { name: 'Mudar idioma', exact: true }).getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en')
  await page.goto('/')
  await expect(page).toHaveURL('/en')
})
