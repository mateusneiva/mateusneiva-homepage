import { test, expect } from '@/test/browser-fixtures'

test('homepage can shrink and expand without horizontal overflow', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await page.locator('#posts').scrollIntoViewIfNeeded()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))

  for (const width of [390, 1024, 320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await expect
      .poll(
        () =>
          page.evaluate(() => ({
            viewport: window.innerWidth,
            fits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          })),
        `page width after resizing to ${width}px`,
      )
      .toEqual({ viewport: width, fits: true })
    await page.screenshot({ path: testInfo.outputPath(`resize-${width}.png`) })
  }
})
