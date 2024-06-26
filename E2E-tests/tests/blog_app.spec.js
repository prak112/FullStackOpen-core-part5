const helper = require('./helper').default
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        // reset test DB
        await request.post('/api/testing/reset')
        // register new users
        await request.post('/api/users', {
            data: {
                username: 'foo',
                name: 'Fooper Man',
                password: 'secret-stuff'
            }
        })
        await request.post('/api/users', {
            data: {
                username: 'bloo',
                name: 'Blooper Man',
                password: 'parody-stuff'
            }
        })

        await page.goto('/')
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
            await helper.loginWith(page, 'foo', 'secret-stuff')

            await expect(page.getByText('Fooper Man logged in')).toBeVisible()
        })

        test('fails with invalid credentials', async ({ page }) => {
            await page.getByTestId('username').fill('foo')
            await page.getByTestId('password').fill('invalid')
            await page.getByTestId('login').click()

            const notificationDiv = page.getByTestId('notification')
            await expect(notificationDiv).toHaveText(/ERROR: Invalid/)
            await expect(page.getByText('Fooper Man logged in')).not.toBeVisible()
        })

        // verify user actions
        describe('Logged in user', () => {
            beforeEach(async ({ page }) => {
                await helper.loginWith(page, 'foo', 'secret-stuff')
            })

            // verify if user can add a blog
            test('adds a blog', async ({ page }) => {
                await helper.addBlogTo(page, 'Test blog 1', 'Sallita', 'https://www.example.com')
                const notificationDiv = page.getByTestId('notification')
                
                await expect(notificationDiv).toHaveText(/New blog added!/) // ERROR:JWT-User identity overlap -> RESOLVED-DEBUG_LOG-E2E-1
                const locator = page.locator('.blog')
                await expect(locator).toHaveText('Test blog 1 by Sallita')
            })

            // verify if user can like blog
            test('can like existing blog', async ({ page }) => {
                await helper.addBlogTo(page, 'Test blog 1', 'Sallita', 'https://www.example.com')
                await page.getByRole('button', { name: 'View' }).click()
                await page.getByRole('button', { name: 'Like' }).click()

                await expect(page.getByTestId('likes')).toHaveText(/1 likes/)
            })

            // verify if same user can delete blog
            test('can remove added blog', async({ page }) => {
                await page.pause()
                await helper.addBlogTo(page, 'Test blog 1', 'Sallita', 'https://www.example.com')
                await page.getByRole('button', { name: 'View' }).click()
                page.on('dialog', async dialog => {
                    console.log('Delete confirmation: ', dialog.message())
                    await dialog.accept()
                })

                await page.getByRole('button', {name: 'Remove'}).click()
                const notificationDiv = page.getByTestId('notification')
                await expect(notificationDiv).toHaveText(/Removed blog: /)
            })
        })
        
        // verify if delete button is visible to another user who did not add blog
        describe('Another logged in user', () => {
            beforeEach(async({ page }) => {
                await helper.loginWith(page, 'foo', 'secret-stuff')
                await helper.addBlogTo(page, 'Test blog 1', 'Sallita', 'https://www.example.com')
                await page.getByRole('button', {name: 'Logout ?'}).click()
            })

            test("cannot find 'Remove' button", async({ page }) => {
                await helper.loginWith(page, 'bloo', 'parody-stuff')
                await page.getByRole('button', {name: 'View'}).click()
                await expect(page.getByRole('button', {name: 'Remove'})).toBeHidden()
            })
        })

        
    })
})