import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import ToggleContent from './components/ToggleContent'
import Footer from './components/Footer'

import blogService from './services/blogs'
import loginService from './services/login'

export default function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  // httpOnly cookie
  useEffect(() => {
    window.sessionStorage.getItem('loggedBlogappUser')
  }, [])

  // Fetch ALL blogs
  const fetchBlogsHook = () => {
    blogService
      .getAll()
      .then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes )
        setBlogs(sortedBlogs)
      })
  }
  useEffect(() => fetchBlogsHook, [])

  const notificationTimeout = (inSeconds) => {
    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType('')
    }, inSeconds * 1000)
  }  

  
  // setup session storage of authenticated user  
  const handleLogin = async(event) => {
    event.preventDefault()
    try{
      const appUser = await loginService.login({ username, password })
      window.sessionStorage.setItem('loggedBlogappUser', JSON.stringify(appUser))
      setUser(appUser)  
      setUsername('')
      setPassword('')
    }
    catch(exception){
      setNotificationMessage('ERROR: Invalid username or password')
      setNotificationType('fail')
      notificationTimeout(5)
    }
  }

  // clear reset user
  const handleLogout = () => {
    setUser(null)
  }

  // form data handled in BlogForm component
  const processBlogInfo = async(blogObject) => {
    try{
      const response = await blogService.addBlog(blogObject)
      fetchBlogsHook()  // to populate user info
      setBlogs(blogs.concat(response))
      setNotificationMessage(`New blog added! '${response.title} by ${response.author}'`) 
      console.log('RESPONSE: ', response.user)
      setNotificationType('success')
      notificationTimeout(4)
    }
    catch(exception){
      setNotificationMessage('ERROR: Unable to add blog')
      setNotificationType('fail')
      notificationTimeout(5)
    }    
  }

  // updated likes handled in Blog component
  const updateLikesInDb = async(updatedBlog) => {
    try {    
      const response = await blogService.updateBlog(updatedBlog.id, updatedBlog)
      const updatedBlogs = blogs.map(blog => blog.id !== response.id ? blog : response)
      setBlogs(updatedBlogs)
    }
    catch(exception){
      setNotificationMessage('ERROR: Unable to update blog likes')
      setNotificationType('fail')
      notificationTimeout(5)
    }
  }

  // delete blog from system
  const removeBlogInDb = async(blogToDelete) => {
    try{      
      await blogService.removeBlog(blogToDelete.id, blogToDelete)
      setNotificationMessage(`Removed blog: ${blogToDelete.title}`)
      setNotificationType('success')
      notificationTimeout(6)
      // refresh blogs viewed
      const currentBlogs = blogs.filter(blog => blog.id !== blogToDelete.id ? blog : null)
      setBlogs(currentBlogs)
    }
    catch(exception){
      setNotificationMessage('ERROR: Unauthorized. Only blogs saved by User can be removed.')
      setNotificationType('fail')
      notificationTimeout(5)
    }
  }


  return (
    <div style={{ padding: '20px' }}>
    <title>Blog List</title>
    <h1 style={{ color: 'yellowgreen', fontStyle: 'oblique' }}>Blog List</h1>
    <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? <LoginForm 
              handleLogin={handleLogin} 
              username={username} 
              password={password} 
              handleUsernameChange={(e) => setUsername(e.target.value)} 
              handlePasswordChange={(e) => setPassword(e.target.value)}/>
        : <div>
            <p>
              {user.name} logged in &nbsp;
              <button onClick={handleLogout}>Logout ?</button>
            </p>
            <br />
            <ToggleContent showButtonLabel='Add Blog' hideButtonLabel='Cancel'>
              <BlogForm addBlogToList={processBlogInfo} />
            </ToggleContent>
            <br />
            {blogs.map((blog) => (
            <Blog 
              key={blog.id} 
              blog={blog} 
              updateLikesInDb={updateLikesInDb}
              removeBlogInDb={removeBlogInDb}
            />
            ))}
          </div>
      }
      <br />
      <Footer />
    </div>
  )
}

