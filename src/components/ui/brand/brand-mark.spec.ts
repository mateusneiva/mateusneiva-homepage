import { test, expect } from '@/test/browser-fixtures'

test('vector brand is used in the header, footer and favicon and ICO contains multiple sizes', async ({ page, request }, testInfo) => {
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  for (const selector of ['header', 'footer[data-theme="dark"]']) {
    const logo = page.locator(selector).getByRole('link', { name: 'Mateus Neiva', exact: true })
    await expect(logo.locator('use').first()).toHaveAttribute('href', '/logo.svg#logo-mark')
    await expect(logo.locator('use').last()).toHaveAttribute('href', '/logo.svg#logo-dot')
    await expect.poll(() => logo.locator('svg').evaluate((node) => (node as SVGGraphicsElement).getBBox().width)).toBeGreaterThan(0)
  }
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/logo.svg')
  const svg = await request.get('/logo.svg')
  expect(svg.ok()).toBe(true)
  expect(await svg.text()).toContain('<symbol id="logo-mark"')
  const ico = await request.get('/logo.ico')
  expect(ico.ok()).toBe(true)
  const bytes = await ico.body()
  expect(bytes.readUInt16LE(0)).toBe(0)
  expect(bytes.readUInt16LE(2)).toBe(1)
  expect(bytes.readUInt16LE(4)).toBe(6)
  const logo = page.locator('header').getByRole('link', { name: 'Mateus Neiva', exact: true })
  await logo.screenshot({ path: testInfo.outputPath('vector-brand.png') })
})
