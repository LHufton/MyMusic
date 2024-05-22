import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'

const router = express.Router()

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

const spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
})

console.log('SPOTIFY_CLIENT_ID:', client_id)
console.log('SPOTIFY_REDIRECT_URI:', redirect_uri)

router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-private',
    'playlist-modify-public'
  ]
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true)
  console.log('Redirecting to:', authorizeURL)
  res.redirect(authorizeURL)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code || null

  try {
    const data = await spotifyApi.authorizationCodeGrant(code)
    const accessToken = data.body['access_token']
    const refreshToken = data.body['refresh_token']

    // Set the access token and refresh token on the API object
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.setRefreshToken(refreshToken)

    // Store the access token and refresh token in the session
    req.session.accessToken = accessToken
    req.session.refreshToken = refreshToken

    // Redirect to frontend without exposing the token
    res.redirect('http://localhost:5173')
  } catch (error) {
    console.error('Error during authorization code grant:', error)
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
    console.error('Error fetching user data:', error)
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
    console.error('Error creating playlist:', error)
    res.status(500).send('Failed to create playlist')
  }
})

export default router
