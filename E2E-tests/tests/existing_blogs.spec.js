const helper = require('./helper').default
const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App setup', () => {
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

    describe('Has existing blogs', () => {
        beforeEach(async ({ page }) => {
            await helper.loginWith(page, 'foo', 'secret-stuff')

            await helper.addBlogTo(page, 'Test blog 1', 'Sallita', 'https://www.example.com')
            await helper.addBlogTo(page, 'Test blog 12', 'Sampuri', 'https://www.example.com')
            await helper.addBlogTo(page, 'Test blog 123', 'Sampuri', 'https://www.example.com')
            await helper.addBlogTo(page, 'Test blog 1234', 'Sallita', 'https://www.example.com')

            await page.pause()  // manual 'like' clicks and execution successful

            await helper.likeBlog(page, 5, 'Test blog 1 by Sallita')
            await helper.likeBlog(page, 8, 'Test blog 12 by Sampuri')
            await helper.likeBlog(page, 3, 'Test blog 123 by Sampuri')
            await helper.likeBlog(page, 9, 'Test blog 1234 by Sallita')
            await page.getByRole('button', { name: 'Logout ?' }).click()
        })

        test('sorted by descending likes', async ({ page }) => {
            await helper.loginWith(page, 'bloo', 'parody-stuff')

            // clicks 'View' concurrently
            const viewBlogButtons = await page.$$('[role="button"][name="View"]')
            const clickPromises = viewBlogButtons.map((button) => button.click())
            await Promise.all(clickPromises)

            // assertions examined in listed-order
            await expect(page.getByTestId('likes').first()).toHaveText(/9 likes/)
            await expect(page.getByTestId('likes').nth(1)).toHaveText(/8 likes/)
            await expect(page.getByTestId('likes').nth(2)).toHaveText(/5 likes/)
            await expect(page.getByTestId('likes').nth(3)).toHaveText(/3 likes/)
        })
    })
})