// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { Tooltip } from './tooltip'

it('dismisses on activation while preserving the action and keyboard focus', async () => {
  const action = vi.fn()
  const user = userEvent.setup()
  render(<Tooltip label="GitHub" description="mateusneiva"><button onClick={action}>Open profile</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Open profile' })
  await user.hover(trigger)
  expect(await screen.findByRole('tooltip')).toHaveTextContent('mateusneiva')
  await user.click(trigger)
  expect(action).toHaveBeenCalledTimes(1)
  expect(trigger).toHaveFocus()
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  await user.unhover(trigger)
  await user.hover(trigger)
  expect(await screen.findByRole('tooltip')).toBeInTheDocument()
  await user.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
})

it('removes the popup before the linked action runs instead of waiting for an exit animation', async () => {
  let visibleDuringAction: boolean | undefined
  const user = userEvent.setup()
  render(<Tooltip label="Spotify"><button onClick={() => { visibleDuringAction = Boolean(document.querySelector('[data-custom-tooltip]')) }}>Open Spotify</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Open Spotify' })
  await user.hover(trigger)
  await screen.findByRole('tooltip')
  await user.click(trigger)
  expect(visibleDuringAction).toBe(false)
  expect(trigger).toHaveFocus()
})
