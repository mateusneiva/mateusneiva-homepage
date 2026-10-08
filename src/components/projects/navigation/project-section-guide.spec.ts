import { test, expect } from '@/test/browser-fixtures'

test('section guide tracks scrolling and navigates to each section', async ({
  page,
  isMobile,
}, testInfo) => {
  await page.goto('/pt/projects/softness')
  const guide = page.getByRole('navigation', {
    name: 'Nesta página',
    exact: true,
  })
  if (isMobile) {
    await expect(page.locator('[data-project-guide]')).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    return
  }
  await expect(guide.getByRole('link')).toHaveCount(6)
  await expect(
    guide.getByRole('link', { name: 'Apresentação', exact: true })
  ).toHaveAttribute('aria-current', 'location')
  await page.evaluate(() => document.fonts.ready)
  const sectionOrder = await page.locator('article section[id]').evaluateAll(
    (sections) => sections.map((section) => section.id)
  )
  expect(sectionOrder.slice(0, 2)).toEqual(['project-links', 'project-stack'])
  const accent = await page.locator('html').evaluate((node) =>
    `rgb(${getComputedStyle(node).getPropertyValue('--color-accent').trim().split(/\s+/).join(', ')})`
  )
  await expect(page.locator('#project-links a').first()).toHaveCSS('color', accent)
  await page.screenshot({ path: testInfo.outputPath('project-intro.png') })
  for (const [name, id] of [
    ['Sobre o projeto', 'project-overview'],
    ['O que ele faz', 'project-features'],
    ['Como foi construído', 'project-architecture'],
    ['Tecnologias', 'project-stack'],
    ['Explore o projeto', 'project-links'],
  ]) {
    await guide.getByRole('link', { name, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`#${id}$`))
    await expect(
      guide.getByRole('link', { name, exact: true })
    ).toHaveAttribute('aria-current', 'location')
    await expect(page.locator(`#${id}`)).toBeVisible()
  }
  await page.locator('#project-overview').evaluate((section) =>
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top - 80,
      behavior: 'instant',
    })
  )
  await expect(
    guide.getByRole('link', { name: 'Sobre o projeto', exact: true })
  ).toHaveAttribute('aria-current', 'location')
  if (!isMobile) {
    const position = await page.locator('[data-project-guide]').boundingBox()
    const content = await page.locator('[data-project-content]').boundingBox()
    const shell = await page.locator('main').boundingBox()
    expect(position!.x + position!.width).toBeLessThan(content!.x)
    expect(position!.x).toBeGreaterThanOrEqual(shell!.x)
    expect(position!.y).toBeCloseTo(32, 0)
    await page.screenshot({ path: testInfo.outputPath('project-sections.png') })
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
})

test('section links do not replace back navigation to the originating page', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The section guide is only displayed on desktop.')
  await page.goto('/pt')
  await page
    .locator('#projects')
    .getByRole('link', { name: 'Polaris Kit — Ver detalhes', exact: true })
    .click()
  const guide = page.getByRole('navigation', {
    name: 'Nesta página',
    exact: true,
  })
  await guide
    .getByRole('link', { name: 'Como foi construído', exact: true })
    .click()
  await expect(
    guide.getByRole('link', { name: 'Como foi construído', exact: true })
  ).toHaveAttribute('aria-current', 'location')
  await page
    .getByRole('button', { name: 'Voltar aos projetos', exact: true })
    .click()
  await expect(page).toHaveURL('/pt')
})

test('English project content is expanded and its guide is localized', async ({
  page,
  isMobile,
}) => {
  await page.goto('/en/projects/shiva-toolbox')
  const guide = page.getByRole('navigation', {
    name: 'On this page',
    exact: true,
  })
  if (isMobile) {
    await expect(page.locator('[data-project-guide]')).toBeHidden()
  } else {
    await expect(
      guide.getByRole('link', { name: "How it's built", exact: true })
    ).toBeVisible()
  }
  await expect(page.locator('#project-overview p')).toHaveCount(2)
  await expect(page.locator('#project-architecture p')).toHaveCount(2)
  const text = await page.locator('main > article').innerText()
  expect(text.split(/\s+/).length).toBeGreaterThan(350)
})

test('serif titles are paired with sans-serif body text', async ({ page }) => {
  await page.goto('/pt/projects/softness')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'font-family',
    /Lora/
  )
  await expect(page.locator('#project-overview h2')).toHaveCSS(
    'font-family',
    /Lora/
  )
  await expect(page.locator('#project-overview p').first()).toHaveCSS(
    'font-family',
    /Space.?Grotesk/
  )
  await page.goto('/pt/posts/sobre-este-espaco')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'font-family',
    /Lora/
  )
})
