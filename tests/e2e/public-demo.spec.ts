import { expect, test } from '@playwright/test'

test('public entry opens approved orders and supports local/API navigation and deep links', async ({ page }) => {
  await page.goto('/')
  const navigation = page.getByRole('navigation', { name: 'Demo examples' })
  await expect(navigation.getByRole('link', { name: 'Orders · سفارش‌ها' })).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('.renderer-card-top')).toContainText('Orders')
  await expect(page.locator('.renderer-card')).toContainText('Olivia Rhye')
  await page.setViewportSize({ width: 390, height: 800 })
  await expect(page.locator('.renderer-order-summary').first()).toContainText('#ORD-1048')
  await page.locator('.renderer-order-summary input').first().check()
  await expect(page.locator('.renderer-selected')).toContainText('1 selected')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await navigation.getByRole('link', { name: 'Local / API · محلی و سرور' }).click()
  await expect(page.getByRole('heading', { name: 'Smart Data Table', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Server', exact: true }).click()
  await expect(page.getByText('Normalized server data')).toBeVisible()
  await page.reload()
  await expect(navigation.getByRole('link', { name: 'Local / API · محلی و سرور' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await navigation.getByRole('link', { name: 'Orders · سفارش‌ها' }).click()
  await expect(page.locator('.renderer-card')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Smart Data Table', exact: true })).toBeVisible()
})
