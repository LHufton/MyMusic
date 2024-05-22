import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Profile from '../Profile/Profile'
import './App.css'

const App = () => {
  const [token, setToken] = useState('')
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_API_BASE_URL

  console.log('Backend URL:', backendUrl)

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/me`, {
          method: 'GET',
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setToken(data.accessToken)
        } else {
          console.log('No access token found')
        }
      } catch (error) {
        console.error('Error checking access token:', error)
      }
    }

    checkToken()
  }, [backendUrl])

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
