const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        // reset test DB
        await request.post('http://localhost:3003/api/testing/reset') 
        // register new user
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'foo',
                name: 'Fooper Man',
                password: 'secret-stuff'
            }
        })

        await page.goto('http://localhost:5173');
    })

    // verify home page
    test('Login form is shown', async ({ page }) => {
        const locator = page.getByText('Log in to application')
        await expect(locator).toBeVisible();
        await expect(page).toHaveTitle(/Blog/);
    })

    // verify login
    describe('Login', () => {
        test('success with valid credentials', async ({ page }) => {
            await page.getByTestId('username').fill('foo')
            await page.getByTestId('password').fill('secret-stuff')
            await page.getByTestId('login').click()
            
            await expect(page.getByText('Fooper Man logged in')).toBeVisible()
        })

        test('fails with invalid credentials', async({ page }) => {
            await page.getByTestId('username').fill('foo')
            await page.getByTestId('password').fill('invalid')
            await page.getByTestId('login').click()

            const notificationDiv = await page.getByTestId('notification')
            await expect(notificationDiv).toHaveText(/ERROR: Invalid/)
            await expect(page.getByText('Fooper Man logged in')).not.toBeVisible()
        })
    })
})