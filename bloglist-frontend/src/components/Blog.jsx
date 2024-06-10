import PropTypes from 'prop-types'

export default function Blog ({ blog }) {
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


