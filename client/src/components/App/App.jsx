import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Profile from '../Profile/Profile'
import './App.css'

const App = () => {
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1]
      window.location.hash = ''
      window.localStorage.setItem('token', token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      <h1>Spotify Profile</h1>
      {token ? (
        <div>
          <button onClick={logout}>Logout</button>
          <Profile token={token} />
        </div>
      ) : (
        <a href={`${backendUrl}/login`}>Login to Spotify</a>
      )}
    </div>
  )
}

export default App
