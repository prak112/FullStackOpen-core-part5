const loginWith = async(page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByTestId('login').click()
}

const addBlogTo = async(page, title, author, url) => {
    await page.getByRole('button', { name: 'Add Blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByTestId('add-blog').click()
}

const likeBlog = async(page) => {
    await page.getByRole('button', { name: 'View' }).click()
    await page.getByRole('button', { name: 'Like' }).click()
}

export default { loginWith, addBlogTo, likeBlog }