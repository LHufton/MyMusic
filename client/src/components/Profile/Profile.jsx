import { useState, useEffect } from 'react'
import axios from 'axios'
import './Profile.css'
const Profile = () => {
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await axios.get(
        `/api/profile?access_token=${new URLSearchParams(
          window.location.hash
        ).get('access_token')}`
      )
      setProfile(data)
    }
    fetchProfile()
  }, [])
  if (!profile) return <div>Loading...</div>
  return (
    <div className="profile-container">
      <h1>Welcome, {profile.display_name}</h1>
      {profile.images.length > 0 && (
        <img src={profile.images[0].url} alt="Profile" />
      )}
      <p>{profile.email}</p>
    </div>
  )
}
export default Profile
