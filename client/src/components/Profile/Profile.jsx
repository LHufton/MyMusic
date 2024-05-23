import React, { useEffect, useState } from 'react'

const Profile = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetch('/api/me')
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error('Error fetching profile:', error))
  }, [])

  return (
    <div>
      <h1>Spotify Profile</h1>
      {profile ? (
        <div>
          <h2>Welcome, {profile.display_name}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Profile
