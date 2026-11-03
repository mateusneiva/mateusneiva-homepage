import { test, expect } from '@/test/browser-fixtures'

test('sections below the hero skip rendering work until they approach the viewport', async ({ page }) => {
  await page.goto('/pt')
  for (const id of ['about', 'projects', 'posts', 'contact']) {
    await expect(page.locator(`main > section#${id}`)).toHaveCSS('content-visibility', 'auto')
  }
  await expect(page.locator('main > section').first()).toHaveCSS('content-visibility', 'visible')
})

test('anchor navigation reaches deferred sections and keeps the page free of horizontal scroll', async ({ page }) => {
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  await page.locator('footer nav').first().getByRole('link', { name: 'Projetos', exact: true }).click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.locator('#projects')).toBeInViewport()
  await expect(page.locator('#projects h2').first()).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
