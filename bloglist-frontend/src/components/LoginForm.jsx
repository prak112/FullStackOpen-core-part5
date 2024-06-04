import PropTypes from 'prop-types'


export default function LoginForm({ handleLogin, username, password, setUsername, setPassword }) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username :&nbsp;
            <input type="text" value={username} name="Username" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div>
            Password :&nbsp;
            <input type="password" value={password} name="Password" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    )
}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
}