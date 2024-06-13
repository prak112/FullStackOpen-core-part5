import PropTypes from 'prop-types'


export default function LoginForm({ handleLogin, username, password, handleUsernameChange, handlePasswordChange }) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username :&nbsp;
            <input type="text" value={username} name="Username" onChange={handleUsernameChange} autoComplete="username" />
          </div>
          <div>
            Password :&nbsp;
            <input type="password" value={password} name="Password" onChange={handlePasswordChange} autoComplete="current-password" />
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
    handlePasswordChange: PropTypes.func.isRequired,
    handleUsernameChange: PropTypes.func.isRequired,
}