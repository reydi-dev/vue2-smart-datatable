import { expect, test } from '@playwright/test'

test('production pagination jumps on Enter, rejects out-of-range pages, and works on mobile', async ({ page }) => {
  await page.goto('/')
  const target = page.getByRole('textbox', { name: 'Go to page', exact: true })
  await target.fill('۳')
  await expect(page.getByText('Person 1', { exact: true })).toBeVisible()
  await expect(page.getByText('Person 51', { exact: true })).toHaveCount(0)
  await target.press('Enter')
  await expect(page.getByText('Person 51', { exact: true })).toBeVisible()
  await expect(page.locator('.sdt-pagination__count')).toHaveText('51–67 of 67')
  await target.fill('4')
  await target.press('Enter')
  await expect(page.locator('.sdt-pagination [role="alert"]')).toContainText('1–3')
  await expect(target).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Person 51', { exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 800 })
  await target.fill('٢')
  await page.getByRole('button', { name: 'Go', exact: true }).click()
  await expect(page.locator('.sdt-mobile')).toBeVisible()
  await expect(page.locator('.sdt-pagination__count')).toHaveText('26–50 of 67')
  await expect(page.locator('.sdt-pagination [role="alert"]')).toHaveCount(0)
})

test('local and server demos render responsively', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Smart Data Table', exact: true })).toBeVisible()
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
  await expect(firstRowCheckbox).toBeChecked()
  await expect(page.getByTestId('selection')).toHaveText('Selected: 67')

  await page.setViewportSize({ width: 390, height: 800 })
  await page.reload()
  const mobileCheckbox = page.getByRole('checkbox', { name: 'Select row 1', exact: true })
  await mobileCheckbox.focus()
  await page.keyboard.press('Space')
  await expect(mobileCheckbox).toBeChecked()
  await expect(page.getByTestId('selection')).toHaveText('Selected: 1')
})

test('server filters update the visible rows and total', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Server' }).click()
  await expect(page.locator('.sdt-desktop tbody tr')).toHaveCount(25)

  await page.getByRole('button', { name: 'Filters' }).click()
  await page.locator('.sdt-filter').nth(1).locator('input').last().fill('Person 67')

  await expect(page.locator('.sdt-desktop tbody tr')).toHaveCount(1)
  await expect(page.getByText('Person 67', { exact: true })).toBeVisible()
  await expect(page.locator('.sdt-pagination__count')).toContainText('1')
})

test('custom email cell remains available in mobile details', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')
  await page.locator('.sdt-mobile__disclosure > summary').first().click()
  await expect(page.getByRole('link', { name: 'person1@example.com' })).toBeVisible()
})
