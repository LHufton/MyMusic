import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
})

router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-private',
    'playlist-modify-public'
  ]
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes)
  res.redirect(authorizeURL)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code || null

  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const accessToken = data.body['access_token']
    const refreshToken = data.body['refresh_token']

    spotifyApi.setAccessToken(accessToken)
    spotifyApi.setRefreshToken(refreshToken)

    req.session.accessToken = accessToken
    req.session.refreshToken = refreshToken

    res.redirect('http://localhost:5173/profile')
  } catch (error) {
    res.status(500).send('Authentication failed')
  }
})

router.get('/me', async (req, res) => {
  const accessToken = req.session.accessToken
  if (!accessToken) {
    return res.status(401).send('Access token missing')
  }

  spotifyApi.setAccessToken(accessToken)

  try {
    const data = await spotifyApi.getMe()
    res.json(data.body)
  } catch (error) {
    res.status(500).send('Failed to fetch user data')
  }
})

router.post('/playlist', async (req, res) => {
  const accessToken = req.session.accessToken
  if (!accessToken) {
    return res.status(401).send('Access token missing')
  }

  const { userId, playlistName, trackUris } = req.body
  spotifyApi.setAccessToken(accessToken)

  try {
    const createPlaylistResponse = await spotifyApi.createPlaylist(
      userId,
      playlistName,
      { public: false }
    )
    const playlistId = createPlaylistResponse.body.id

    await spotifyApi.addTracksToPlaylist(playlistId, trackUris)
    res.status(200).send('Playlist created successfully')
  } catch (error) {
    res.status(500).send('Failed to create playlist')
  }
})

export default router
