import PropTypes from 'prop-types'
import { useState } from 'react'


export default function BlogForm({ addBlogToList }){
    const [newBlog, setNewBlog] = useState({})

    const addBlog = (event) => {
        event.preventDefault()
        addBlogToList(newBlog)  // passed to addBlog in App, adds to Blogs list
        setNewBlog({})
    }

    return(
        <div>
            <h2>Add a new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    Title: <input type="text" name="Title" value={newBlog.title} onChange={(event) => event.target.value}/>
                </div>
                <div>
                    Author: <input type="text" name="Author" value={newBlog.author} onChange={(event) => event.target.value}/>
                </div>
                <div>
                    URL: <input type="text" name="URL" value={newBlog.url} onChange={(event) => event.target.value}/>
                </div>
                <div>
                    <button type="submit">Add Blog</button>
                </div>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    addBlogToList: PropTypes.func
}