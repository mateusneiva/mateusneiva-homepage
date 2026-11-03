import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@/test/browser-fixtures'

const pages = [
  '/pt',
  '/en',
  '/pt/posts',
  '/pt/posts/sobre-este-espaco',
  '/pt/projects/softness',
  '/en/projects/licht-launcher',
  '/pt/not-a-page',
]

for (const colorScheme of ['dark', 'light'] as const) {
  for (const path of pages) {
    test(`${path} has no detectable accessibility violations in the ${colorScheme} theme`, async ({ page }) => {
      await page.emulateMedia({ colorScheme })
      await page.goto(path)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      expect(
        violations.map((violation) => ({ rule: violation.id, targets: violation.nodes.map((node) => node.target) })),
      ).toEqual([])
    })
  }
}

test('the home page can be navigated by keyboard with a visible focus indicator', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Keyboard navigation is a desktop interaction.')
  await page.goto('/pt')
  await expect(page.locator('[data-initial-loading]')).toHaveCount(0)
  const seen = new Set<string>()
  for (let step = 0; step < 12; step++) {
    await page.keyboard.press('Tab')
    const focus = await page.evaluate(() => {
      const element = document.activeElement
      if (!element || element === document.body) return null
      const box = element.getBoundingClientRect()
      return {
        id: `${element.tagName}:${element.textContent?.trim().slice(0, 30) ?? ''}:${element.getAttribute('href') ?? ''}`,
        focusVisible: element.matches(':focus-visible'),
        visible: box.width > 0 && box.height > 0,
      }
    })
    expect(focus, `Tab stop ${step + 1} should land on an element`).not.toBeNull()
    expect(focus!.visible).toBe(true)
    expect(focus!.focusVisible).toBe(true)
    seen.add(focus!.id)
  }
  expect(seen.size).toBeGreaterThan(6)
})

for (const path of pages.slice(0, 6)) {
  test(`${path} exposes a single main landmark and a single h1`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })
}
