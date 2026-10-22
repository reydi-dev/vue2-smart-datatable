// Copy into an isolated Package Lab's tests/e2e/clarity.spec.ts for packed-consumer validation.
import { test, expect } from '@playwright/test'

test('packed Clarity coexists with the Vuetify host and preserves slots, actions and mobile selection', async ({
  page,
}) => {
  await page.goto('/local')
  const table = page.getByTestId('local-table')
  await expect(page.locator('.v-application')).toBeVisible()
  await expect(table.locator('.v-btn, .v-input, .v-expansion-panel')).toHaveCount(0)
  await expect(table.locator('.status-chip').first()).toBeVisible()
  await expect(table.locator('.mdi-eye-outline').first()).toBeVisible()
  await table.getByRole('button', { name: 'Inspect', exact: true }).first().click()
  await expect(page.getByTestId('last-action')).toHaveText('inspect on user #1')
  await table.getByRole('checkbox', { name: 'Select row 1', exact: true }).check()
  await expect(page.getByTestId('selected-ids')).toHaveText('1')
  await page.setViewportSize({ width: 360, height: 760 })
  await expect(table.locator('.sdt-mobile')).toBeVisible()
  await expect(table.getByRole('checkbox', { name: 'Select row 1', exact: true })).toBeChecked()
  await table.locator('.sdt-mobile__disclosure > summary').first().click()
  await expect(table.locator('.sdt-mobile__details').first()).toContainText('Email')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360)
})

test('packed provider jump requests only page 30 in a 100-page API fixture', async ({ page }) => {
  const requested: number[] = []
  await page.route('**/api/users?*', async (route) => {
    const url = new URL(route.request().url())
    const target = Number(url.searchParams.get('page'))
    const size = Number(url.searchParams.get('per_page'))
    requested.push(target)
    const data = Array.from({ length: size }, (_, index) => {
      const id = (target - 1) * size + index + 1
      return {
        id,
        name: `Page ${target} User ${id}`,
        email: `user${id}@example.test`,
        role: 'viewer',
        status: 'active',
        createdAt: '2026-01-01',
      }
    })
    await route.fulfill({ json: { data, total: 1000 } })
  })
  await page.goto('/server')
  const table = page.getByTestId('server-table')
  await expect(table.locator('tbody tr')).toHaveCount(10)
  const input = table.getByRole('textbox', { name: 'Go to page', exact: true })
  await input.fill('۳')
  await input.fill('۳۰')
  expect(requested).toEqual([1])
  await input.press('Enter')
  await expect(table.locator('tbody tr').first()).toContainText('Page 30 User 291')
  expect(requested).toEqual([1, 30])
  await input.fill('101')
  await input.press('Enter')
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  expect(requested).toEqual([1, 30])
})
