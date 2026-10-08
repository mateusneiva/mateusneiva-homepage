import { test, expect } from '@/test/browser-fixtures'

test('voxel workspace switches companions without recreating the canvas', async ({ page }) => {
  await page.goto('/pt')
  const workspace = page.locator('[data-voxel-workspace="02"]')
  await workspace.scrollIntoViewIfNeeded()
  const choices = workspace.getByRole('group', { name: 'Selecionar modelo do Minecraft' })
  await expect(choices.getByRole('button', { name: 'Allay', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(workspace.locator('canvas')).toBeVisible()
  await expect(workspace.getByText('carregando modelo…')).toHaveCount(0)
  const canvas = await workspace.locator('canvas').elementHandle()

  await workspace.getByRole('button', { name: 'Próximo modelo', exact: true }).click()
  await expect(choices.getByRole('button', { name: 'Abelha', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(workspace.getByRole('img')).toHaveAttribute('aria-label', /Abelha/)
  await choices.getByRole('button', { name: 'Axolote', exact: true }).click()
  await expect(choices.getByRole('button', { name: 'Axolote', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(workspace.getByText('carregando modelo…')).toHaveCount(0)
  await workspace.getByRole('button', { name: 'Próximo modelo', exact: true }).click()
  await expect(choices.getByRole('button', { name: 'Allay', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await workspace.getByRole('button', { name: 'Modelo anterior', exact: true }).click()
  await expect(choices.getByRole('button', { name: 'Axolote', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(await canvas?.evaluate((element) => element.isConnected)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('workspace supports animated scenes and English labels', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'light' })
  await page.goto('/en')
  const workspace = page.locator('[data-voxel-workspace="02"]')
  await workspace.scrollIntoViewIfNeeded()
  await workspace.getByRole('button', { name: 'Bee', exact: true }).click()
  await expect(workspace.getByRole('img')).toHaveAttribute('aria-label', /Bee/)
  await expect(workspace.locator('canvas')).toBeVisible()
  await expect(workspace.getByText('loading model…')).toHaveCount(0)
  await workspace.getByRole('button', { name: 'Next model', exact: true }).click()
  await expect(workspace.getByRole('button', { name: 'Axolotl', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(workspace.getByText('loading model…')).toHaveCount(0)
})
