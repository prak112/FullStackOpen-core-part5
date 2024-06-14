import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

describe('<BlogForm />', () => {
    test('handles form data and calls addBlogToList onSubmit', async() => {
        // setup simulated env
        const user = userEvent.setup()
        const mockAddBlogHandler = vi.fn()
        render(<BlogForm addBlogToList={mockAddBlogHandler} />)

        // capture form fields
        const inputs = screen.getAllByRole('textbox')   // all form fields accessed by role
        const addBlogButton = screen.getByText('Add Blog')

        // simulate test data
        await user.type(inputs[0], 'Test blog title')
        await user.type(inputs[1], 'Test blog author')
        await user.type(inputs[2], 'Test blog URL')
        await user.click(addBlogButton)

        // verify simulated test data
        const mockFormData = mockAddBlogHandler.mock.calls  // data format : [  [ { key1: value1,... } ] ]
        expect(mockFormData).toHaveLength(1)
        expect(mockFormData[0][0].title).toBe('Test blog title')
        expect(mockFormData[0][0].author).toBe('Test blog author')
        expect(mockFormData[0][0].url).toBe('Test blog URL')
    })
})