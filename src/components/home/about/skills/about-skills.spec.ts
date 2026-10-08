import { test, expect } from '@/test/browser-fixtures'

test('skills groups are localized and brand icons remain legible in both themes', async ({ page, isMobile }, testInfo) => {
  for (const locale of ['pt', 'en']) {
    await page.goto(`/${locale}`)
    const matrix = page.locator('[data-skills-matrix]')
    await matrix.scrollIntoViewIfNeeded()
    await expect(matrix).toHaveAttribute('data-skills-view', 'summary')
    await expect(matrix.locator('[data-skill-group]')).toHaveCount(3)
    await expect(matrix.locator('[data-skill-group] button')).toHaveCount(0)
    await expect(matrix.getByRole('list')).toHaveCount(3)
    await expect(matrix.getByRole('listitem')).toHaveCount(29)
    for (const tag of await matrix.locator('[data-proximity-tag]').all()) {
      await expect(tag).toBeVisible()
    }
    for (const name of ['Grafana', 'Oracle Cloud', 'Drizzle ORM', 'Express.js', 'Expo', 'Zustand', 'TanStack Query']) {
      await expect(matrix.getByText(name, { exact: true })).toHaveCount(1)
    }
    await expect(matrix).not.toContainText('RESTful APIs')
    await expect(matrix).not.toContainText('TanStack Query (React Query)')
    const expand = matrix.getByRole('button', { name: locale === 'pt' ? 'Ver stack completa' : 'Explore the full stack', exact: true })
    await expect(expand).toHaveAttribute('aria-expanded', 'false')
    await expand.focus()
    await page.keyboard.press('Enter')
    await expect(matrix).toHaveAttribute('data-skills-view', 'complete')
    await expect(matrix.getByRole('button', { name: locale === 'pt' ? 'Voltar ao resumo' : 'Back to summary', exact: true })).toHaveAttribute('aria-expanded', 'true')
    await expect(matrix.locator('h4')).toHaveCount(14)
    await expect(matrix.locator('[data-skill-description]')).toHaveCount(3)
    const slots = await matrix.locator('[data-technology-icon]').evaluateAll((icons) =>
      icons.map((icon) => {
        const { width, height } = icon.getBoundingClientRect()
        return { width, height }
      })
    )
    expect(slots.every(({ width, height }) => width === 18 && height === 18)).toBe(true)
    const labels = locale === 'pt'
      ? ['Linguagens', 'Web, desktop & mobile', 'Estado & formulários', 'UI & design system', 'Acessibilidade, performance & i18n', 'APIs & servidores', 'Dados & ORM', 'Validação & documentação', 'Autenticação', 'Desenvolvimento', 'Testes & CI', 'Infraestrutura', 'Observabilidade', 'Qualidade de código']
      : ['Languages', 'Web, desktop & mobile', 'State & forms', 'UI & design system', 'Accessibility, performance & i18n', 'APIs & servers', 'Data & ORM', 'Validation & documentation', 'Authentication', 'Development', 'Testing & CI', 'Infrastructure', 'Observability', 'Code quality']
    await expect(matrix.getByRole('list')).toHaveCount(labels.length)
    await expect(matrix).not.toContainText('Cursor')
    await expect(matrix).not.toContainText('OpenCode')
    const categories = await matrix.locator('h4').evaluateAll((headings) =>
      headings.map((heading) => {
        const { x, y } = heading.getBoundingClientRect()
        return { x, y }
      })
    )
    expect(categories.every(({ x }) => Math.abs(x - categories[0].x) < 1)).toBe(true)
    expect(categories.every(({ y }, index) => index === 0 || y > categories[index - 1].y)).toBe(true)
    for (const [index, names] of [
      ['TypeScript', 'JavaScript'],
      ['React', 'Next.js', 'Vite', 'React Native', 'Electron', 'Expo'],
      ['Zustand', 'Redux', 'Jotai', 'TanStack Query', 'React Hook Form'],
      ['Tailwind CSS', 'Styled Components', 'Framer Motion', 'Storybook', 'Design tokens', 'Responsive Design'],
      ['a11y', 'SEO & Core Web Vitals', 'i18n'],
      ['Node.js', 'Fastify', 'Express.js', 'RESTful APIs', 'GraphQL', 'WebSockets'],
      ['SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Drizzle ORM'],
      ['Zod', 'Swagger (OpenAPI)'],
      ['JWT', 'OAuth 2.0'],
      ['Git', 'Turborepo', 'Conventional Commits', 'Changesets'],
      ['Vitest', 'Jest', 'Playwright', 'GitHub Actions (CI/CD)'],
      ['Linux', 'Docker', 'Nginx', 'Oracle Cloud', 'Vercel'],
      ['Grafana', 'Prometheus', 'Winston / Pino'],
      ['Biome', 'Prettier', 'ESLint', 'Husky'],
    ].entries()) {
      const list = matrix.getByRole('list', { name: labels[index], exact: true })
      await expect(list.getByRole('listitem')).toHaveCount(names.length)
      for (const name of names) await expect(list).toContainText(name)
    }
    if (!isMobile) {
      for (const label of [labels[2], labels[3], locale === 'pt' ? 'Desenvolvimento' : 'Development']) {
        const positions = await matrix.getByRole('list', { name: label, exact: true }).getByRole('listitem').evaluateAll((items) =>
          items.map((item) => {
            const { x, y } = item.getBoundingClientRect()
            return { x, y }
          })
        )
        expect(positions[0].y).toBe(positions[1].y)
        expect(positions[0].x).toBeLessThan(positions[1].x)
      }
    }
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme })
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      if (theme === 'dark') {
        await expect(matrix.locator('[data-proximity-tag]').filter({ hasText: 'Design tokens' }).locator('svg')).toHaveCSS('color', 'rgb(255, 255, 255)')
      }
      const lowContrast = await matrix.locator('[data-proximity-tag], h3, h4, [data-skill-description]').evaluateAll((elements) => {
        const luminance = (color: string) => {
          const channels = color.match(/[\d.]+/g)!.slice(0, 3).map((value) => {
            const channel = Number(value) / 255
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
          })
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        }
        return elements.flatMap((element) => {
          const isTag = element.hasAttribute('data-proximity-tag')
          let backgroundNode: Element | null = isTag ? element : element.closest('[data-skill-group]')
          let backgroundColor = 'rgba(0, 0, 0, 0)'
          while (backgroundNode && backgroundColor === 'rgba(0, 0, 0, 0)') {
            backgroundColor = getComputedStyle(backgroundNode).backgroundColor
            backgroundNode = backgroundNode.parentElement
          }
          const background = luminance(backgroundColor)
          const targets = isTag
            ? [{ node: element.querySelector('svg')!, minimum: 3 }, { node: element.querySelector('[data-technology-label]')!, minimum: 4.5 }]
            : [{ node: element, minimum: 4.5 }]
          return targets.flatMap(({ node, minimum }) => {
            const foreground = luminance(getComputedStyle(node).color)
            const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
            return ratio < minimum ? [{ name: element.textContent, ratio, minimum }] : []
          })
        })
      })
      expect(lowContrast, `${locale} / ${theme}: icon and text contrast`).toEqual([])
      if (locale === 'pt' && theme === 'dark') {
        await matrix.screenshot({ path: testInfo.outputPath('skills-matrix.png') })
      }
    }
    const collapse = matrix.getByRole('button', { name: locale === 'pt' ? 'Voltar ao resumo' : 'Back to summary', exact: true })
    await collapse.focus()
    await page.keyboard.press('Enter')
    await expect(matrix).toHaveAttribute('data-skills-view', 'summary')
    await expect(matrix.locator('h4')).toHaveCount(0)
    await expect(expand).toBeFocused()
    await expect(matrix.getByRole('list')).toHaveCount(3)
    await expect(matrix.getByRole('listitem')).toHaveCount(29)
    if (locale === 'pt') await matrix.screenshot({ path: testInfo.outputPath('skills-summary.png') })
  }
})

test('technology labels remain readable and contained at 200% zoom', async ({ page }) => {
  await page.goto('/pt')
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  const matrix = page.locator('[data-skills-matrix]')
  await matrix.scrollIntoViewIfNeeded()
  for (const view of ['summary', 'complete']) {
    if (view === 'complete') {
      const expand = matrix.getByRole('button', { name: 'Ver stack completa', exact: true })
      await expand.focus()
      await expand.press('Enter')
      await expect(matrix).toHaveAttribute('data-skills-view', 'complete')
      await expect(matrix.locator('h4')).toHaveCount(14)
      await expect(matrix.getByRole('list')).toHaveCount(14)
    }
    const overflow = await matrix.locator('[data-proximity-tag]').evaluateAll((tags) =>
      tags.flatMap((tag) => {
        const bounds = tag.getBoundingClientRect()
        const list = tag.closest('ul')!.getBoundingClientRect()
        const label = tag.querySelector('[data-technology-label]')!
        const text = label.getBoundingClientRect()
        const icon = tag.querySelector('[data-technology-icon]')!.getBoundingClientRect()
        const fits = bounds.left >= list.left - 1 && bounds.right <= list.right + 1
          && text.left >= icon.right && text.right <= bounds.right + 1
          && label.scrollWidth <= label.clientWidth + 1
        return fits ? [] : [tag.textContent]
      })
    )
    expect(overflow, `${view} at 200% zoom`).toEqual([])
    await expect(matrix.locator('[data-technology-label]').first()).toHaveCSS('font-size', '12px')
    const scaledIcon = await matrix.locator('[data-technology-icon]').first().boundingBox()
    expect(scaledIcon!.width).toBe(36)
  }
})

test('visible technology tags retain their proximity hover', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Proximity hover requires a fine pointer.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/pt')
  const tag = page.locator('[data-skills-matrix] [data-proximity-tag]').filter({ hasText: 'TypeScript' })
  await tag.scrollIntoViewIfNeeded()
  await tag.hover()
  const edge = tag.locator('[data-tag-edge-glow]')
  await expect.poll(async () => Number(await edge.evaluate((node) => getComputedStyle(node).opacity))).toBeGreaterThan(0.95)
  await page.mouse.move(0, 0)
  await expect.poll(async () => Number(await edge.evaluate((node) => getComputedStyle(node).opacity))).toBeLessThan(0.05)
})
