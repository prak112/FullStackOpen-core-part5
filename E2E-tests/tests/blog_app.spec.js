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

        await page.goto('http://localhost:5173')
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

            const notificationDiv = page.getByTestId('notification')
            await expect(notificationDiv).toHaveText(/ERROR: Invalid/)
            await expect(page.getByText('Fooper Man logged in')).not.toBeVisible()
        })

        // verify user actions
        describe('Logged in user', () => {
            beforeEach(async({ page }) => {
                await page.getByTestId('username').fill('foo')
                await page.getByTestId('password').fill('secret-stuff')
                await page.getByTestId('login').click()
            })

            // verify if user can add a blog
            test('adds a blog', async({ page }) => {
                await page.getByRole('button', { name: 'Add Blog' }).click()
                await page.getByTestId('title').fill('Test blog 1')
                await page.getByTestId('author').fill('Sallita')
                await page.getByTestId('url').fill('https://www.example.com')
                await page.getByTestId('add-blog').click()

                const notificationDiv = page.getByTestId('notification')
                await expect(notificationDiv).toHaveText(/New blog added!/) // ERROR:JWT-User identity overlap -> RESOLVED-DEBUG_LOG-E2E-1
                const locator = page.locator('.blog')
                await expect(locator).toHaveText('Test blog 1 by Sallita')
            })
        })       
    })
})