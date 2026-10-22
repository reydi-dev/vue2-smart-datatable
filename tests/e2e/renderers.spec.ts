import { expect, test } from '@playwright/test'

test('native desktop renderers support selection, sorting, density, sticky headers and actions without Vuetify', async ({
  page,
}) => {
  const fonts: string[] = []
  page.on('request', (request) => {
    if (/\.(?:woff2?|ttf)(?:\?|$)/i.test(request.url())) fonts.push(request.url())
  })
  await page.goto('/renderers.html')
  await expect(page.locator('.sdt-desktop')).toBeVisible()
  await expect(page.locator('.v-input, .v-btn, .v-data-table, .v-expansion-panel')).toHaveCount(0)
  const row = page.locator('.sdt-desktop tbody tr').first()
  const normalHeight = await row.evaluate((element) => element.getBoundingClientRect().height)
  await page.getByRole('checkbox', { name: 'Compact', exact: true }).check()
  expect(await row.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(normalHeight)
  await page.getByRole('checkbox', { name: 'Select row 1', exact: true }).check()
  const all = page.getByRole('checkbox', { name: 'Select all rows on this page', exact: true })
  await expect(all).toHaveJSProperty('indeterminate', true)
  await all.check()
  await expect(page.locator('.renderer-selected')).toContainText('8 selected across pages')
  const header = page.getByRole('columnheader', { name: 'Amount', exact: true })
  await header.getByRole('button').click()
  await expect(header).toHaveAttribute('aria-sort', 'ascending')
  await expect(header).toHaveCSS('position', 'sticky')
  await page.locator('.sdt-desktop').evaluate((element) => {
    element.scrollTop = 160
  })
  const headerTop = await header.evaluate((element) => element.getBoundingClientRect().top)
  const viewportTop = await page.locator('.sdt-desktop').evaluate((element) => element.getBoundingClientRect().top)
  expect(Math.abs(headerTop - viewportTop)).toBeLessThan(3)
  await row.getByRole('button', { name: 'Inspect order' }).click()
  await expect(page.getByTestId('renderer-action')).toContainText('inspect:')
  expect(fonts).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280)
})

test('RTL mobile cards show long, empty, multiline and unbroken values without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/renderers.html')
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('fa')
  await expect(page.locator('.sdt-root')).toHaveAttribute('dir', 'rtl')
  const cards = page.locator('.sdt-mobile__row')
  const second = cards.nth(1)
  const disclosure = second.locator('summary')
  await disclosure.focus()
  await page.keyboard.press('Enter')
  await expect(second.locator('details')).toHaveAttribute('open', '')
  await expect(second.locator('.sdt-mobile__field--full').filter({ hasText: 'بسته بین ساعت' })).toContainText(
    'بسته بین ساعت',
  )
  await expect(second.locator('.sdt-cell__preview')).toHaveCount(0)
  await expect(second.getByText('phoenix@layers.studio', { exact: true }).first()).toBeVisible()
  await cards.nth(2).locator('summary').click()
  await expect(cards.nth(2).locator('.sdt-cell__empty')).toContainText(['ثبت نشده', 'ثبت نشده'])
  await cards.nth(3).locator('summary').click()
  await expect(cards.nth(3).locator('.sdt-mobile__field--full').filter({ hasText: 'راهنمای تحویل:' })).toContainText(
    'راهنمای تحویل:',
  )
  await cards.nth(5).locator('summary').click()
  await expect(
    cards.nth(5).locator('.sdt-mobile__field--full').filter({ hasText: 'REF-20261021-WAREHOUSE-NORTH' }),
  ).toContainText('REF-20261021-WAREHOUSE-NORTH')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.getByRole('checkbox', { name: 'غیرفعال', exact: true }).check()
  await expect(second.getByRole('button', { name: 'بررسی سفارش', exact: true })).toBeDisabled()
  await cards.first().locator('summary').click()
  await expect(cards.first().locator('details')).toHaveAttribute('open', '')
  await page.getByRole('combobox', { name: 'پوسته', exact: true }).selectOption('dark')
  await expect(cards.first()).toHaveCSS('background-color', 'rgb(32, 43, 38)')
})

test('native desktop descriptions expand safely and loading row actions cannot execute', async ({ page }) => {
  await page.goto('/renderers.html')
  const first = page.locator('.sdt-desktop tbody tr').first()
  const expand = first.getByRole('button', { name: 'Show full text', exact: true })
  await expand.click()
  await expect(first.getByRole('button', { name: 'Hide full text', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await page.getByRole('checkbox', { name: 'Busy first action', exact: true }).check()
  const action = first.getByRole('button', { name: 'Inspect order', exact: true })
  await expect(action).toBeDisabled()
  await expect(action).toHaveAttribute('aria-busy', 'true')
  await expect(action).toHaveText('Inspect order')
  await page.getByRole('checkbox', { name: 'Busy first action', exact: true }).uncheck()
  await action.click()
  await expect(page.getByTestId('renderer-action')).toHaveText('inspect: ORD-1048')
})
