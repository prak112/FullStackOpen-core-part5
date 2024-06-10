import { useState, useEffect } from 'react'

import { Blog, AddBlogForm } from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Footer from './components/Footer'

export default function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setnotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')
  const [newBlog, setNewBlog] = useState({})

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
      setnotificationMessage('ERROR: Invalid username or password')
      setNotificationType('fail')
      setTimeout(() => {
        setnotificationMessage(null)
        setNotificationType('')
      }, 5000)
    }
  }


  const addBlogToList = async(event) => {
    event.preventDefault()
    const newBlog = {
      title: event.target.Title.value,
      author: event.target.Author.value,
      url: event.target.URL.value
    }
    setNewBlog(newBlog)
    try{
      const response = await blogService.addBlog(newBlog)
      setBlogs(blogs.concat(response))
      setnotificationMessage(`New blog added! ${response.title} by ${response.author}`) 
      setNotificationType('success')
    }
    catch(exception){
      setnotificationMessage('ERROR: Unable to add blog')
      setNotificationType('fail')
      setTimeout(() => {
        setnotificationMessage(null)
        setNotificationType('')
      }, 5000)
    }    
  }


  return (
    <div style={{ padding: '20px' }}>
    <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? <LoginForm 
            handleLogin={handleLogin} 
            username={username} 
            password={password} 
            setUsername={setUsername} 
            setPassword={setPassword}/>
        : <div>
            <h2>Saved Blogs</h2>
            <p>{user.name} Logged in</p>
            <button onClick={() => setUser(null)}>Logout</button>
            <br />
            <AddBlogForm 
              addBlogToList={addBlogToList} 
              title={newBlog.title} 
              author={newBlog.author} 
              url={newBlog.url} />
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

