import { test, expect } from '@/test/browser-fixtures'

test('floating top button appears after scrolling and returns to the top', async ({ page }) => {
  await page.goto('/pt')
  const top = page.getByRole('button', { name: 'Voltar ao topo', exact: true })
  await expect(top).toHaveCount(0)
  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }))
  await expect(top).toBeVisible()
  expect(await top.evaluate((node) => getComputedStyle(node.parentElement!).position)).toBe('fixed')
  await top.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect(top).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
