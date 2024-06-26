
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
  const loggedUser = JSON.parse(window.sessionStorage.getItem('loggedBlogappUser'))


  // eslint-disable-next-line no-unused-vars
  const [blogLikes, setBlogLikes] = useState(0)
  const [isUserSame, setIsUserSame] = useState(false) // update 'Remove' button display

  // GET likes for each blog from session storage
  useEffect(() => {
    const storedLikes = window.sessionStorage.getItem(`blogLikes-${blog.user}`)
    setBlogLikes(storedLikes ? parseInt(storedLikes) : 0)

    // verify if user logged also added blog
    loggedUser.name === blog.user.name ? setIsUserSame(true) : setIsUserSame(false)
  }, [blog])

  // SET session storage for likes of each blog
  useEffect(() => {
    window.sessionStorage.setItem(`blogLikes-${blog.user}`, blog.likes)
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
    <div data-testid='blog-info' style={blogStyle}>
      <li className='blog'>
        {blog.title} by {blog.author}
      </li>    
      <ToggleContent showButtonLabel='View' hideButtonLabel='Hide'>
        <div>
          <p><a href={blog.url}>{blog.url}</a></p>
          <p data-testid="likes">
            {blog.likes} likes 
            <button className='blog-like' onClick={() => updateLikes(blog)}>
              Like
            </button>
          </p>
          <p>Added by {blog.user.name}</p>
        </div>
        <button 
          style={{
            ...buttonStyle,
            display: isUserSame ? 'inline-block' : 'none'
          }} 
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


