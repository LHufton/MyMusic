import { useState, useEffect } from 'react'
import axios from 'axios'
import './Profile.css'

const Profile = ({ token }) => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5001/spotify/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile', error)
      }
    }

    fetchProfile()
  }, [token])

  return (
    <div>
      {profile ? (
        <div>
          <h2>{profile.display_name}</h2>
          <img src={profile.images[0]?.url} alt="Profile" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Profile
