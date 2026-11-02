import { test, expect } from '@/test/browser-fixtures'
import { projects } from '@/data/projects'

test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt')
  expect(response.status()).toBe(200)
  const body = await response.text()
  expect(body).toMatch(/User-Agent: \*/i)
  expect(body).toMatch(/Allow: \//i)
  expect(body).toContain('Sitemap: https://mateusneiva.com/sitemap.xml')
})

test('sitemap.xml lists every localized page with language alternates', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const body = await response.text()
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  for (const locale of ['pt', 'en']) {
    for (const path of ['', '/posts', '/posts/sobre-este-espaco', ...projects.map((p) => `/projects/${p.slug}`)]) {
      expect(urls).toContain(`https://mateusneiva.com/${locale}${path}`)
    }
  }
  expect(new Set(urls).size).toBe(urls.length)
  expect(body).toContain('hreflang="en"')
  expect(body).toContain('hreflang="pt"')
})

for (const locale of ['pt', 'en']) {
  test(`home exposes title, description and social metadata in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await expect(page).toHaveTitle('Mateus Neiva — Software Developer')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Mateus Neiva')
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', locale === 'pt' ? 'pt_BR' : 'en_US')
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /opengraph-image/)
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  })
}

test('project pages declare a canonical URL and language alternates', async ({ page }) => {
  for (const project of projects) {
    await page.goto(`/en/projects/${project.slug}`)
    await expect(page).toHaveTitle(`${project.name} | Mateus Neiva`)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://mateusneiva.com/en/projects/${project.slug}`)
    await expect(page.locator('link[rel="alternate"][hreflang="pt"]')).toHaveAttribute(
      'href',
      `https://mateusneiva.com/pt/projects/${project.slug}`,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', project.name)
  }
})

test('post pages declare title, canonical URL and article metadata', async ({ page }) => {
  await page.goto('/pt/posts/sobre-este-espaco')
  await expect(page).toHaveTitle('Um espaço para construir e compartilhar | Mateus Neiva')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://mateusneiva.com/pt/posts/sobre-este-espaco')
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/)
})
