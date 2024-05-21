import './Login.css'

const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  return (
    <div>
      <h1>Login</h1>
      <a href={`${backendUrl}/login`}>Login to Spotify</a>
    </div>
  )
}

export default Login
