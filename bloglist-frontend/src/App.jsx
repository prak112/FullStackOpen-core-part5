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
  // const [showBlogForm, setShowBlogForm] = useState(false)

  // Fetch all blogs
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const appUser = JSON.parse(loggedUserJSON)
      setUser(appUser)
      blogService.setToken(appUser.token)
    }
  }, [])


  const notificationTimeout = setTimeout(() => {
    setNotificationMessage(null)
    setNotificationType('')
  }, 5000)


  const handleLogin = async(event) => {
    event.preventDefault()
    try{
      const appUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(appUser))
      setUser(appUser)  
      setUsername('')
      setPassword('')
    }
    catch(exception){
      setNotificationMessage('ERROR: Invalid username or password')
      setNotificationType('fail')
      notificationTimeout()
    }
  }

  // form data handled in BlogForm, so no need to pass it here
  const addBlog = async(blogObject) => {
    try{
      const response = await blogService.addBlog(blogObject)
      setBlogs(blogs.concat(response))
      setNotificationMessage(`New blog added! ${response.title} by ${response.author}`) 
      setNotificationType('success')
    }
    catch(exception){
      setNotificationMessage('ERROR: Unable to add blog')
      setNotificationType('fail')
      notificationTimeout()
    }    
  }

  // const showWhenBlogFormIsVisible = { display: showBlogForm ? '' : 'none' }
  // const showWhenBlogFormIsHidden = { display: showBlogForm ? 'none' : '' }


  return (
    <div style={{ padding: '20px' }}>
    <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? <LoginForm 
            handleLogin={handleLogin} 
            username={username} 
            password={password} 
            handleUsernameChange={(e) => setUsername(e.target.value)} 
            handlePasswordChange={(e) => setPassword(e.target.value)}/>
        : <div>
            <h2>Saved Blogs</h2>
            <p>
              {user.name} Logged in &nbsp;
              <button onClick={() => setUser(null)}>Logout ?</button>
            </p>
            <br />
            <ToggleContent buttonLabel='Add Blog'>
              <BlogForm addBlogToList={addBlog} />
            </ToggleContent>
            <br />
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
      }      
      <br />
      <Footer />
    </div>
  )
}

