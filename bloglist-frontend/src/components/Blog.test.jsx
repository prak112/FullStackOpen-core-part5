import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { vi } from 'vitest'


describe('<Blog />', () => {
    // setup component render and mock function
    let container
    const mockLikesHandler = vi.fn()

    beforeEach(() => {
        const blog = {
            title: 'Test blog using react-testing-library',
            author: 'Test-Fooper',
            url: 'https://www.testing-fooper.com',
            user: {
                id: '12345',
                name: 'Fooper',
                username: 'fooper-12345'
            }
        }
        // collect simulated component render
        container = render(<Blog blog={blog} updateLikesInDb={mockLikesHandler}/>).container
    })

    test('renders Blog', () => {    
        const div = container.querySelector('.blog') // find by CSS selector
        expect(div).toHaveTextContent(
            'Test blog using react-testing-library by Test-Fooper'
        )
    })

    test("clicking 'View' button renders URL and likes", () => {
        const toggleButton = screen.getByText('View')
        fireEvent.click(toggleButton)   // instead of userEvent

        const content = container.querySelector('.hidden-content')
        expect(content).toBeInTheDocument()
    })

    test("clicks 'Like' button twice", () => {
        const likeButton = container.querySelector('.blog-like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(mockLikesHandler).toHaveBeenCalledTimes(2)
    })
})
