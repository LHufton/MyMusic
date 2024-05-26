import fs from 'fs'
import https from 'https'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import spotifyRoutes from './routes/Spotify.js'

// Load environment variables
dotenv.config() // Ensure this is at the very top

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('CLIENT_ID:', process.env.CLIENT_ID)
console.log('REDIRECT_URI:', process.env.REDIRECT_URI)
console.log('SESSION_SECRET:', process.env.SESSION_SECRET)

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

app.use('/api', spotifyRoutes)

// Force HTTPS redirection
app.use((req, res, next) => {
  if (
    req.headers['x-forwarded-proto'] !== 'https' &&
    process.env.NODE_ENV === 'production'
  ) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  }
  next()
})

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
