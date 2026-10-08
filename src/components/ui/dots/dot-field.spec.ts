import { test, expect } from '@/test/browser-fixtures'
import type { Page } from '@playwright/test'

const field = '[data-hero-visual] [data-dot-field]'

type Area = { x: number; y: number; width: number; height: number }

async function fieldArea(page: Page): Promise<Area> {
  const box = (await page.locator(field).boundingBox())!
  const viewport = page.viewportSize()!
  const y = Math.max(box.y, 0)
  return { x: box.x, y, width: box.width, height: Math.min(box.y + box.height, viewport.height) - y }
}

async function paintedPixels(page: Page, area: Area) {
  const image = (await page.screenshot({ clip: area })).toString('base64')
  return page.evaluate(
    async ({ image, selector }) => {
      const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${image}`)).blob())
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const context = canvas.getContext('2d')!
      context.drawImage(bitmap, 0, 0)
      const data = context.getImageData(0, 0, bitmap.width, bitmap.height).data
      const background = getComputedStyle(document.querySelector(selector)!)
        .getPropertyValue('--color-canvas')
        .trim()
        .split(/\s+/)
        .map(Number)
      let painted = 0
      for (let index = 0; index < data.length; index += 4) {
        if (background.some((channel, offset) => Math.abs(data[index + offset] - channel) > 8)) painted++
      }
      return painted
    },
    { image, selector: field },
  )
}

async function dotPixels(page: Page) {
  const area = await fieldArea(page)
  const canvas = page.locator(`${field} canvas`)
  await canvas.evaluate((element: HTMLCanvasElement) => (element.style.visibility = 'hidden'))
  const without = await paintedPixels(page, area)
  await canvas.evaluate((element: HTMLCanvasElement) => (element.style.visibility = ''))
  return (await paintedPixels(page, area)) - without
}

test('hero dot field is decorative, fills its frame and draws dots', async ({ page }) => {
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const element = page.locator(field)
  await expect(element).toHaveAttribute('aria-hidden', 'true')
  const frame = await element.boundingBox()
  const canvas = await element.locator('canvas').boundingBox()
  expect(Math.abs(frame!.width - canvas!.width)).toBeLessThan(1)
  expect(Math.abs(frame!.height - canvas!.height)).toBeLessThan(1)
  await expect.poll(() => dotPixels(page)).toBeGreaterThan(500)
})

test('hero dot field reacts to the pointer', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Pointer interaction requires a fine pointer.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const box = (await page.locator(field).boundingBox())!
  const point = { x: box.x + box.width * 0.85, y: box.y + box.height - 50 }
  const around = { x: point.x - 40, y: point.y - 40, width: 80, height: 80 }
  const before = await paintedPixels(page, around)
  await page.mouse.move(point.x, point.y, { steps: 4 })
  await expect.poll(() => paintedPixels(page, around)).toBeGreaterThan(before + 200)
})

test('reduced motion renders a static dot field', async ({ page }) => {
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  await expect.poll(() => dotPixels(page)).toBeGreaterThan(500)
  const area = await fieldArea(page)
  const first = await page.screenshot({ clip: area })
  await page.waitForTimeout(400)
  expect((await page.screenshot({ clip: area })).equals(first)).toBe(true)
})
