import { test as base, expect } from '@playwright/test'

export const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        const text = message.text()
        if (/Encountered a script tag while rendering React component/.test(text)) {
          errors.push(text)
        }
      })
      await use(errors)
      expect(errors, 'Unexpected browser runtime errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
