import fs from 'fs'
import https from 'https'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import spotifyRoutes from './routes/Spotify.js'

dotenv.config() // Load environment variables

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5001

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj))

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_REDIRECT_URI
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      return done(null, { profile, accessToken })
    }
  )
)

app.use('/api', spotifyRoutes)

const frontendPath = path.join(__dirname, '../client/dist')
app.use(express.static(frontendPath))

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: frontendPath })
})

try {
  const keyPath = path.resolve(__dirname, 'SS1/localhost-key.pem')
  const certPath = path.resolve(__dirname, 'SS1/localhost.pem')

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`)
  })
} catch (error) {
  console.error('Error starting HTTPS server:', error.message)
}
