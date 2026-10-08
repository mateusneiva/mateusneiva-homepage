// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it } from 'vitest'
import { ThemeProvider } from './theme-provider'
import { useTheme } from './use-theme'

function Selection() {
  const { theme, setTheme } = useTheme()
  return <button onClick={() => setTheme('dark')}>{theme}</button>
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

it('shares the selected theme between the document and selector and persists it', async () => {
  render(<ThemeProvider><Selection /></ThemeProvider>)
  expect(screen.getByRole('button')).toHaveTextContent('system')
  await userEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('button')).toHaveTextContent('dark')
  expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  expect(localStorage.getItem('theme')).toBe('dark')
})

it('updates when the preference changes in another tab', () => {
  render(<ThemeProvider><Selection /></ThemeProvider>)
  act(() => {
    localStorage.setItem('theme', 'light')
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }))
  })
  expect(screen.getByRole('button')).toHaveTextContent('light')
  expect(document.documentElement).toHaveAttribute('data-theme', 'light')
})

it('falls back to system preference for an invalid saved value', () => {
  localStorage.setItem('theme', 'invalid')
  render(<ThemeProvider><Selection /></ThemeProvider>)
  expect(screen.getByRole('button')).toHaveTextContent('system')
  expect(document.documentElement).toHaveAttribute('data-theme', 'light')
})
