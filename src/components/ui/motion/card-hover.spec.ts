import { test, expect } from '@/test/browser-fixtures'

test.use({ reducedMotion: 'no-preference' })

test.beforeEach(async ({ page }) => {
  await page.route('**/api/spotify', (route) => route.fulfill({ json: { status: 'unconfigured', track: null } }))
  await page.route('**/api/spotify/profile', (route) => route.fulfill({ json: { profile: null } }))
})

test('card hover only makes the title and underline green', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Hover is a pointer interaction; navigation is covered on mobile.'
  )
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  for (const selector of ['#projects article a', '#posts article a']) {
    const card = page.locator(selector).first()
    await card.scrollIntoViewIfNeeded()
    const entrance = selector.startsWith('#posts')
      ? page.locator('#posts article').first().locator('..')
      : page.locator('#projects article').first()
    await expect(entrance).toHaveCSS('opacity', '1')
    await expect.poll(() => entrance.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m42)).toBe(0)
    await page.mouse.move(0, 0)
    const stable = await card.evaluate((node) => ({
      background: getComputedStyle(node).backgroundColor,
      shadow: getComputedStyle(node).boxShadow,
      transform: getComputedStyle(node).transform,
    }))
    const title = card.locator('h3 span')
    await card.hover()
    await expect(title).toHaveCSS('background-size', '100% 1px')
    const accent = await page
      .locator('html')
      .evaluate(
        (node) =>
          `rgb(${getComputedStyle(node).getPropertyValue('--color-accent').trim().split(/\s+/).join(', ')})`
      )
    await expect(title).toHaveCSS('color', accent)
    expect(
      await card.evaluate((node) => ({
        background: getComputedStyle(node).backgroundColor,
        shadow: getComputedStyle(node).boxShadow,
        transform: getComputedStyle(node).transform,
      }))
    ).toEqual(stable)
  }
})

test('hero buttons keep their texture without an underline', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is a pointer interaction.')
  await page.goto('/pt')
  await page.evaluate(() => document.fonts.ready)
  const button = page.getByRole('link', {
    name: 'Explore os projetos',
    exact: true,
  })
  await button.hover()
  await expect(button.locator('span').first()).toHaveCSS(
    'background-image',
    'none'
  )
  await expect
    .poll(() =>
      button.evaluate((node) => getComputedStyle(node, '::after').opacity)
    )
    .toBe('1')
  await expect
    .poll(() =>
      button.evaluate((node) => {
        const face = new DOMMatrix(getComputedStyle(node).transform)
        const texture = new DOMMatrix(
          getComputedStyle(node, '::after').transform
        )
        return [face.m41 + texture.m41, face.m42 + texture.m42]
      })
    )
    .toEqual([0, 0])
})
