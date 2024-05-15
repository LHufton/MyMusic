const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
const spotifyRoutes = require('./routes/spotify')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use('/spotify', spotifyRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
