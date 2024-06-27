import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import spotifyRoutes from './routes/Spotify.js'

dotenv.config()

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

app.use('/api', spotifyRoutes)

const frontendPath = path.join(__dirname, '../client/dist')
app.use(express.static(frontendPath))

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: frontendPath })
})

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`)
})
