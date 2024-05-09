import React, { useState, useEffect } from 'react'
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.hash).get(
      'access_token'
    )

    fetch(`/api/profile?access_token=${accessToken}`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
  }, [])

  if (!profile) return <div>Loading...</div>

  return (
    <div className="profile-container">
      <h1>Welcome, {profile.display_name}</h1>
      {profile.images.length && (
        <img src={profile.images[0].url} alt="Profile" />
      )}
      <p>{profile.email}</p>
    </div>
  )
}

export default Profile
