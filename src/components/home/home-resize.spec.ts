import { test, expect } from '@/test/browser-fixtures'

test('homepage can shrink and expand after its 3D scenes load without horizontal overflow', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('main > section').first().locator('canvas')).toBeVisible()
  const workspace = page.locator('[data-voxel-workspace="02"]')
  await workspace.scrollIntoViewIfNeeded()
  await expect(workspace.locator('canvas')).toBeVisible()
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
    await expect
      .poll(
        () =>
          page.locator('main [role="img"] canvas').evaluateAll((canvases) =>
            canvases.every((canvas) => {
              const bounds = canvas.getBoundingClientRect()
              const scene = canvas.closest('[role="img"]')!.getBoundingClientRect()
              return (
                Math.abs(bounds.width - scene.width) < 1 &&
                bounds.right <= document.documentElement.clientWidth
              )
            }),
          ),
        `3D canvases fit their containers at ${width}px`,
      )
      .toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`resize-${width}.png`) })
  }
})
