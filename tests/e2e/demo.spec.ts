import { expect, test } from '@playwright/test'
test('local and server demos render responsively', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Smart Data Table v0.1.0')).toBeVisible()
  await expect(page.getByText('Person 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Server' }).click()
  await expect(page.getByText('Normalized server data')).toBeVisible()
  await page.setViewportSize({ width: 390, height: 800 })
  await expect(page.locator('.sdt-mobile')).toBeVisible()
})
