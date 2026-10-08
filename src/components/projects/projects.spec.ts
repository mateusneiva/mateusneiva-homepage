import { projects } from '@/data/projects'
import { test, expect } from '@/test/browser-fixtures'

for (const project of projects) {
  test(`${project.name}: clickable card, details, external links and back navigation`, async ({
    page,
  }) => {
    await page.goto('/pt')
    const card = page.locator('#projects article').filter({
      has: page.getByRole('heading', { name: project.name, exact: true }),
    })
    await expect(card.getByRole('link')).toHaveCount(1)
    await expect(card.getByRole('link')).toHaveAttribute(
      'href',
      `/pt/projects/${project.slug}`
    )
    await expect(card.getByText('GitHub', { exact: true })).toHaveCount(0)
    await expect(card.getByText('Ver projeto', { exact: true })).toHaveCount(0)
    await card.getByRole('link').click()
    await expect(page).toHaveURL(`/pt/projects/${project.slug}`)
    await expect(
      page.getByRole('heading', { level: 1, name: project.name })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'O que ele faz', exact: true })
    ).toBeVisible()
    const links = page.locator('#project-links')
    await expect(
      links.getByRole('link', { name: 'GitHub', exact: true })
    ).toHaveAttribute('href', project.repository)
    await expect(
      links.getByRole('link', { name: 'GitHub', exact: true })
    ).toHaveAttribute('rel', 'noopener noreferrer')
    if (project.website)
      await expect(
        links.getByRole('link', { name: 'Ver projeto', exact: true })
      ).toHaveAttribute('href', project.website)
    else
      await expect(
        links.getByRole('link', { name: 'Ver projeto', exact: true })
      ).toHaveCount(0)
    await page
      .getByRole('button', { name: 'Voltar aos projetos', exact: true })
      .click()
    await expect(page).toHaveURL('/pt')
  })
}

test('project filtering preserves the selected category and the internal link', async ({
  page,
}) => {
  await page.goto('/pt')
  for (const [category, name] of [
    ['Aplicações web', 'Softness'],
    ['Design system', 'Polaris Kit'],
    ['Automação', 'Shiva Toolbox'],
  ]) {
    const filter = page
      .locator('#projects')
      .getByRole('button', { name: category, exact: true })
    await filter.click()
    await expect(filter).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#projects article')).toHaveCount(1)
    await expect(page.locator('#projects h3')).toHaveText(name)
  }
  await page
    .locator('#projects')
    .getByRole('button', { name: 'Todos', exact: true })
    .click()
  await expect(page.locator('#projects article')).toHaveCount(3)
})

test('project details preserve their slug when switching languages', async ({
  page,
}) => {
  await page.goto('/en/projects/polaris-kit')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(
    page.getByRole('heading', { name: 'About the project', exact: true })
  ).toBeVisible()
  await page
    .locator('header')
    .getByRole('link', { name: 'PT', exact: true })
    .click()
  await expect(page).toHaveURL('/pt/projects/polaris-kit')
  await expect(
    page.getByRole('heading', { name: 'Sobre o projeto', exact: true })
  ).toBeVisible()
})

test('unknown project slugs return a localized 404', async ({ page }) => {
  const response = await page.goto('/pt/projects/no-such-project')
  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', {
      name: 'Este caminho saiu do mapa.',
      exact: true,
    })
  ).toBeVisible()
})
