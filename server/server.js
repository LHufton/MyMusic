import express from 'express'
import dotenv from 'dotenv'
import spotifyRoutes from './routes/Spotify.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use('/spotify', spotifyRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
