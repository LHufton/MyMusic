import express from 'express'
import https from 'https'
import fs from 'fs'
import dotenv from 'dotenv'
import spotifyRoutes from './routes/spotify.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// HTTPS options with paths to your key and certificate files
const options = {
  key: fs.readFileSync('path/to/your-key.pem'),
  cert: fs.readFileSync('path/to/your-cert.pem')
}

app.use(express.json())
app.use('/', spotifyRoutes)

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
