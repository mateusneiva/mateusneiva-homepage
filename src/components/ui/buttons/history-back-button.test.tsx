// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { HistoryBackButton } from './history-back-button'

const router = vi.hoisted(() => ({ back: vi.fn(), replace: vi.fn() }))
vi.mock('@/i18n/navigation', () => ({ useRouter: () => router }))

it('goes back when a previous page exists', async () => {
  vi.stubGlobal('navigation', { canGoBack: true })
  render(<HistoryBackButton label="Voltar" fallback="/posts" />)
  await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
  expect(router.back).toHaveBeenCalledOnce()
  expect(router.replace).not.toHaveBeenCalled()
})

it.each(['/posts', '/#projects'])('uses the fallback %s on direct entry', async (fallback) => {
  vi.stubGlobal('navigation', { canGoBack: false })
  render(<HistoryBackButton label="Voltar" fallback={fallback} />)
  await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
  expect(router.replace).toHaveBeenCalledWith(fallback)
  expect(router.back).not.toHaveBeenCalled()
})
