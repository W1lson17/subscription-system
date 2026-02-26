import { test, expect } from '@playwright/test'

test.describe('Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the subscription form', async ({ page }) => {
    await expect(page.getByText('Subscription System')).toBeVisible()
    await expect(page.getByLabel('User ID')).toBeVisible()
    await expect(page.getByLabel('Full Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Payment Method')).toBeVisible()
    await expect(page.getByLabel('Amount (USD)')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Subscribe' }).click()
    await expect(page.getByText('User ID is required')).toBeVisible()
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByRole('button', { name: 'Subscribe' }).click()
    await expect(page.getByText('Invalid email format')).toBeVisible()
  })

  test('should create a subscription and redirect to dashboard', async ({ page }) => {
    const uniqueId = `user-e2e-${Date.now()}`

    await page.getByLabel('User ID').fill(uniqueId)
    await page.getByLabel('Full Name').fill('E2E Test User')
    await page.getByLabel('Email').fill('e2e@example.com')

    await page.getByLabel('Payment Method').click()
    await page.getByRole('option', { name: 'Credit Card' }).click()

    await page.getByLabel('Amount (USD)').fill('99.99')

    await page.getByRole('button', { name: 'Subscribe' }).click()

    await expect(page).toHaveURL(/\/dashboard\//)
    await expect(page.getByText('Your Subscription')).toBeVisible()
    await expect(page.getByText('Active')).toBeVisible()
    await expect(page.getByText('E2E Test User')).toBeVisible()
  })

  test('should persist subscription data on page refresh', async ({ page }) => {
    const uniqueId = `user-refresh-${Date.now()}`

    await page.getByLabel('User ID').fill(uniqueId)
    await page.getByLabel('Full Name').fill('Refresh Test User')
    await page.getByLabel('Email').fill('refresh@example.com')

    await page.getByLabel('Payment Method').click()
    await page.getByRole('option', { name: 'PayPal' }).click()

    await page.getByLabel('Amount (USD)').fill('49.99')
    await page.getByRole('button', { name: 'Subscribe' }).click()

    await expect(page).toHaveURL(/\/dashboard\//)

    await page.reload()

    await expect(page.getByText('Your Subscription')).toBeVisible()
    await expect(page.getByText('Refresh Test User')).toBeVisible()
  })

  test('should navigate back to form from dashboard', async ({ page }) => {
    const uniqueId = `user-back-${Date.now()}`

    await page.getByLabel('User ID').fill(uniqueId)
    await page.getByLabel('Full Name').fill('Back Test User')
    await page.getByLabel('Email').fill('back@example.com')

    await page.getByLabel('Payment Method').click()
    await page.getByRole('option', { name: 'Debit Card' }).click()

    await page.getByLabel('Amount (USD)').fill('29.99')
    await page.getByRole('button', { name: 'Subscribe' }).click()

    await expect(page).toHaveURL(/\/dashboard\//)

    await page.getByRole('button', { name: 'New Subscription' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Subscription System')).toBeVisible()
  })
})