import { expect, test } from '@playwright/test'
test('local and server demos render responsively', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Smart Data Table v0.1.0 beta')).toBeVisible()
  await expect(page.getByText('Person 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Server' }).click()
  await expect(page.getByText('Normalized server data')).toBeVisible()
  await expect(page.getByText('Person 1', { exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 800 })
  await page.reload()
  await expect(page.locator('.sdt-mobile')).toBeVisible()
})

test('sorting and row selection have keyboard-accessible names and state', async ({ page }) => {
  await page.goto('/')

  const nameHeader = page.getByRole('columnheader', { name: 'Name' })
  const sortButton = nameHeader.getByRole('button', { name: 'Name' })
  await sortButton.focus()
  await page.keyboard.press('Enter')
  await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
  await page.keyboard.press('Enter')
  await expect(nameHeader).toHaveAttribute('aria-sort', 'descending')
  await expect(page.locator('.sdt-desktop tbody tr[tabindex]')).toHaveCount(0)

  const firstRowCheckbox = page.getByRole('checkbox', { name: 'Select row 1', exact: true })
  await firstRowCheckbox.focus()
  await page.keyboard.press('Space')
  await expect(firstRowCheckbox).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('selection')).toHaveText('Selected: 67')

  await page.setViewportSize({ width: 390, height: 800 })
  await page.reload()
  const mobileCheckbox = page.getByRole('checkbox', { name: 'Select row 1', exact: true })
  await mobileCheckbox.focus()
  await page.keyboard.press('Space')
  await expect(mobileCheckbox).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('selection')).toHaveText('Selected: 1')
})
