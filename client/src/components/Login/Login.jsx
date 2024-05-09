import './Login.css'
const Login = () => (
  <div className="login-container">
    <button onClick={() => (window.location.href = '/api/login')}>
      Login with Spotify
    </button>
  </div>
)
export default Login
