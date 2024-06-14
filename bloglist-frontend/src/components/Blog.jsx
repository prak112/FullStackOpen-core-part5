
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import ToggleContent from './ToggleContent'

export default function Blog ({ blog, updateLikesInDb, removeBlogInDb }) {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const buttonStyle = { 
    background: '#fd7136', 
    color: 'white', 
    borderRadius: '5px'
  }

  // eslint-disable-next-line no-unused-vars
  const [blogLikes, setBlogLikes] = useState(0)

  // GET likes for each blog from local storage
  useEffect(() => {
    const storedLikes = window.localStorage.getItem(`blogLikes-${blog.user.id}`)
    setBlogLikes(storedLikes ? parseInt(storedLikes) : 0)
  }, [blog])

  // SET local storage for likes of each blog
  useEffect(() => {
    window.localStorage.setItem(`blogLikes-${blog.user.id}`, blog.likes)
  }, [blog])


  const updateLikes = (blog) => {
    let currentLikes = blog.likes + 1
    setBlogLikes(currentLikes)
    const updatedBlog = { 
      ...blog, 
      likes: currentLikes
    }
    updateLikesInDb(updatedBlog)
  }

  const removeBlog = (blog) => {
    if(window.confirm(`Remove blog : ${blog.title} by ${blog.author} ?`)){
      removeBlogInDb(blog)
    }
  }


  return (
    <div style={blogStyle}>
      <li className='blog'>
        {blog.title} by {blog.author}
      </li>    
      <ToggleContent showButtonLabel='View' hideButtonLabel='Hide'>
        <div>
          <p><a href={blog.url}>{blog.url}</a></p>
          <p>
            {blog.likes} likes 
            <button className='blog-like' onClick={() => updateLikes(blog)}>
              Like
            </button>
          </p>
          <p>Added by {blog.user.name}</p>
        </div>
        <button 
          style={buttonStyle} 
          onClick={() => removeBlog(blog)}>
            Remove
        </button>
      </ToggleContent>
    </div>
  )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateLikesInDb: PropTypes.func,
    removeBlogInDb: PropTypes.func
}


