import { test, expect } from '@/test/browser-fixtures'

test('contact fields retain examples and reject whitespace-only names', async ({
  page,
  isMobile,
}) => {
  await page.goto('/pt')
  await page.locator('#contact').scrollIntoViewIfNeeded()
  const accent = await page.locator('html').evaluate((node) => `rgb(${getComputedStyle(node).getPropertyValue('--color-accent').trim().split(/\s+/).join(', ')})`)
  await expect(page.locator('#contact a[href="mailto:mateus.fneiva@gmail.com"]')).toHaveCSS('color', accent)
  const name = page.getByRole('textbox', { name: 'Seu nome', exact: true })
  if (isMobile) {
    const form = await page.locator('#contact form').boundingBox()
    const field = await name.boundingBox()
    expect(field!.width).toBeCloseTo(form!.width, 0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await expect(name).toHaveAttribute('placeholder', 'Ex.: Ana Silva')
  await name.fill('   ')
  await page
    .getByRole('textbox', { name: 'Seu e-mail', exact: true })
    .fill('test@example.com')
  await page
    .getByRole('textbox', { name: 'Conte sobre sua ideia', exact: true })
    .fill('Quero conversar sobre uma aplicação web.')
  await page
    .getByRole('button', { name: 'Enviar mensagem', exact: true })
    .click()
  await expect(page.locator('#contact [role="alert"]')).toBeVisible()
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(name).toBeFocused()
  await expect(name).toHaveAttribute('aria-describedby', /-error$/)
  await name.fill('Mateus Neiva')
  await expect(name).toHaveAttribute('aria-invalid', 'false')
  await expect(page.locator('#contact [role="alert"]')).toHaveCount(0)
})

for (const locale of ['pt', 'en']) {
  test(`contact sends a message, preserves failures and shows pending/success feedback in ${locale}`, async ({ page }) => {
    const labels = locale === 'pt'
      ? { name: 'Seu nome', email: 'Seu e-mail', message: 'Conte sobre sua ideia', submit: 'Enviar mensagem', sending: 'Enviando…', success: 'Mensagem enviada!', error: 'Não foi possível enviar' }
      : { name: 'Your name', email: 'Your email', message: 'Tell me about your idea', submit: 'Send message', sending: 'Sending…', success: 'Message sent!', error: 'Your message could not be sent' }
    let calls = 0
    let release!: () => void
    const pending = new Promise<void>((resolve) => { release = resolve })
    await page.route('**/api/contact', async (route) => {
      calls++
      expect(route.request().postDataJSON()).toEqual({ name: 'Ana Silva', email: 'ana@example.com', message: 'Quero conversar sobre um projeto.' })
      if (calls === 1) {
        await route.fulfill({ status: 502, json: { success: false } })
      } else {
        await pending
        await route.fulfill({ json: { success: true } })
      }
    })
    await page.goto(`/${locale}`)
    const form = page.locator('#contact form')
    await form.scrollIntoViewIfNeeded()
    await form.getByRole('textbox', { name: labels.name, exact: true }).fill('  Ana Silva  ')
    await form.getByRole('textbox', { name: labels.email, exact: true }).fill('ana@example.com')
    const message = form.getByRole('textbox', { name: labels.message, exact: true })
    await message.fill('Quero conversar sobre um projeto.')
    await form.getByRole('button', { name: labels.submit, exact: true }).click()
    await expect(form.getByRole('alert')).toContainText(labels.error)
    await expect(message).toHaveValue('Quero conversar sobre um projeto.')
    await form.getByRole('button', { name: labels.submit, exact: true }).click()
    await expect(form.getByRole('button', { name: labels.sending, exact: true })).toBeDisabled()
    await expect(form).toHaveAttribute('aria-busy', 'true')
    release()
    await expect(form.getByRole('status')).toContainText(labels.success)
    await expect(message).toHaveValue('')
    await expect(form.getByRole('alert')).toHaveCount(0)
    await expect(form.getByRole('button', { name: labels.submit, exact: true })).toBeEnabled()
  })
}
