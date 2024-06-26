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
    page.getByTestId('blog-info').getByText(`${title} by ${author}`).waitFor({ state: "visible" })
}

const likeBlog = async(page, times, filterText) => {
    const blogLocator = page.getByTestId('blog-info').filter({ hasText: filterText })
    await blogLocator.getByRole('button', { name: 'View' }).click()
    for (let i = 0; i < times; i++){
        await blogLocator.getByRole('button', { name: 'Like' }).click()
        console.log(`Liked ${filterText} ${i + 1} times`)
    }
    blogLocator.getByText(`${times} likesLike`).waitFor()
}

export default { loginWith, addBlogTo, likeBlog }