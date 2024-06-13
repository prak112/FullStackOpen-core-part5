import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null
const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

// Configuring the request interceptor to include token in the header
axios.interceptors.request.use((config) => {
    if(token){
        config.headers.Authorization = token
    }
    return config
})

// GET
const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

// POST
const addBlog = async (newBlog) => {
    const response = await axios.post(baseUrl, newBlog)
    return response.data
}

// UPDATE
const updateBlog = async (id, updatedBlog) => {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
    return response.data
}

// DELETE
const removeBlog = async(id, blogToDelete) => {
    const response = await axios.delete(`${baseUrl}/${id}`, blogToDelete)
    return response.status
}


export default { getAll, addBlog, updateBlog, removeBlog, setToken }