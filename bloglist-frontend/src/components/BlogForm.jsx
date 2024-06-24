import PropTypes from 'prop-types'
import { useState } from 'react'


export default function BlogForm({ addBlogToList }){
    const [newBlog, setNewBlog] = useState({})

    const addBlog = (event) => {
        event.preventDefault()
        addBlogToList(newBlog)  // passed to processBlogInfo in App.jsx, adds to Blogs list
        setNewBlog({})
    }

    return(
        <div>
            <h2>Add a new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    Title:
                    <input
                        type="text"
                        data-testid="title"
                        name="Title"
                        value={newBlog.title || ''}
                        onChange={
                            (event) => setNewBlog({ ...newBlog, title: event.target.value })} />
                </div>
                <div>
                    Author: 
                    <input 
                        type="text"
                        data-testid="author" 
                        name="Author" 
                        value={newBlog.author || ''} 
                        onChange={
                            (event) => setNewBlog({ ...newBlog, author: event.target.value })} />
                </div>
                <div>
                    URL: 
                    <input 
                        type="text"
                        data-testid="url"
                        name="URL" 
                        value={newBlog.url || ''} 
                        onChange={
                            (event) => setNewBlog({ ...newBlog, url: event.target.value })} />
                </div>
                <div>
                    <button type="submit" data-testid="add-blog" >
                        Add Blog
                    </button>
                </div>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    addBlogToList: PropTypes.func
}