import fs from 'fs'
import https from 'https'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import { Strategy as SpotifyStrategy } from 'passport-spotify'

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = 5001

// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true
  })
)

// Initialize Passport and restore authentication state, if any, from the session
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
      return done(null, profile)
    }
  )
)

// Define the login route
app.get(
  '/login',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
  })
)

// Define the callback route
app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/')
  }
)

// Serve static files from the frontend build directory
const frontendPath = path.join(__dirname, '../client/dist')
app.use(express.static(frontendPath))

// Handle all other routes by serving the frontend
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: frontendPath })
})

try {
  const keyPath = path.resolve(__dirname, 'SS1/localhost-key.pem')
  const certPath = path.resolve(__dirname, 'SS1/localhost.pem')

  console.log('Key Path:', keyPath)
  console.log('Cert Path:', certPath)

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }

  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`)
  })

  // Log the environment variables
  console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID)
  console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI)
} catch (error) {
  console.error('Error starting HTTPS server:', error.message)
  if (error.code === 'ENOENT') {
    console.error(
      'Make sure that the key.pem and cert.pem files exist in the correct path.'
    )
  }
}
