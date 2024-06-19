const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    })

    test('Login page is shown', async ({ page }) => {
        const locator = page.getByText('Log in to application')
        await expect(locator).toBeVisible();
        await expect(page).toHaveTitle(/Blog/);
    })
})