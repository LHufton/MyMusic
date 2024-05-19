import { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import './Playlist.css'

const Playlist = ({ token }) => {
  const [playlistName, setPlaylistName] = useState('')
  const [trackUris, setTrackUris] = useState([])
  const [message, setMessage] = useState('')

  const createPlaylist = async () => {
    try {
      const userResponse = await axios.get('http://localhost:5173/spotify/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const userId = userResponse.data.id
      await axios.post(
        'http://localhost:5173/spotify/playlist',
        {
          userId,
          playlistName,
          trackUris
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setMessage('Playlist created successfully!')
    } catch (error) {
      console.error('Error creating playlist', error)
      setMessage('Failed to create playlist')
    }
  }

  return (
    <div>
      <h1>Create Playlist</h1>
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Track URIs (comma separated)"
        value={trackUris}
        onChange={(e) => setTrackUris(e.target.value.split(','))}
      />
      <button onClick={createPlaylist}>Create Playlist</button>
      {message && <p>{message}</p>}
    </div>
  )
}

Playlist.propTypes = {
  token: PropTypes.string.isRequired
}

export default Playlist
