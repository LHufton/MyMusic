import { useState } from 'react'
import axios from 'axios'
import './Playlist.css'
const Playlist = () => {
  const [playlistName, setPlaylistName] = useState('')
  const [userId, setUserId] = useState('')
  const accessToken = new URLSearchParams(window.location.hash).get(
    'access_token'
  )
  const createPlaylist = async () => {
    await axios.post('/api/playlist', {
      accessToken,
      userId,
      playlistName
    })
  }
  return (
    <div className="playlist-container">
      <input
        type="text"
        placeholder="Enter Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={createPlaylist}>Create Playlist</button>
    </div>
  )
}
export default Playlist
