import express from 'express'
import axios from 'axios'

const router = express.Router()

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

console.log('SPOTIFY_CLIENT_ID:', client_id)
console.log('SPOTIFY_REDIRECT_URI:', redirect_uri)

router.get('/login', (req, res) => {
  const scopes =
    "'user-read-private', 'user-read-email', 'playlist-modify-private','playlist-modify-public'"
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
    scopes
  )}&redirect_uri=${encodeURIComponent(redirect_uri)}`
  console.log('Redirecting to:', url)
  res.redirect(url)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code || null
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    }).toString(),
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  try {
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers
    })
    const accessToken = response.data.access_token

    // Store the access token in the session
    req.session.accessToken = accessToken

    // Redirect to frontend without exposing the token
    res.redirect('http://localhost:5173')
  } catch (error) {
    console.error(error)
    res.status(500).send('Authentication failed')
  }
})

router.get('/me', async (req, res) => {
  const accessToken = req.session.accessToken
  if (!accessToken) {
    return res.status(401).send('Access token missing')
  }
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed to fetch user data')
  }
})

router.post('/playlist', async (req, res) => {
  const accessToken = req.session.accessToken
  if (!accessToken) {
    return res.status(401).send('Access token missing')
  }
  const { userId, playlistName, trackUris } = req.body
  try {
    const createPlaylistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: playlistName,
        public: false
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    const playlistId = createPlaylistResponse.data.id
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    res.status(200).send('Playlist created successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed to create playlist')
  }
})

export default router
