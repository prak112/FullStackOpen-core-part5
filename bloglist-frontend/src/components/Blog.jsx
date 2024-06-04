import PropTypes from 'prop-types'

function Blog ({ blog }) {
  return (
    <div>
        <li>
            <a href={blog.url}>{blog.title}</a> by {blog.author}
        </li>
    </div>
  )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

function AddBlogForm({ addBlogToList, title, author, url }){
    return(
        <div>
            <h2>Add a new blog</h2>
            <form onSubmit={addBlogToList}>
                <div>
                    Title: <input type="text" value={title} name="Title" onChange={(e) => e.target.value}/>
                </div>
                <div>
                    Author: <input type="text" value={author} name="Author" onChange={(e) => e.target.value}/>
                </div>
                <div>
                    URL: <input type="text" value={url} name="URL" onChange={(e) => e.target.value}/>
                </div>
                <div>
                    <button type="submit">Add Blog</button>
                </div>
            </form>
        </div>
    )
}

AddBlogForm.propTypes = {
    addBlogToList: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
}

export { Blog, AddBlogForm }


