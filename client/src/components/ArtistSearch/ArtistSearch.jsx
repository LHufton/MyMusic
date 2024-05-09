import { useState } from 'react'
import axios from 'axios'
import './ArtistSearch.css'
const ArtistSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const searchArtists = async () => {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=artist`,
      {
        headers: {
          Authorization: `Bearer ${new URLSearchParams(
            window.location.hash
          ).get('access_token')}`
        }
      }
    )
    setResults(data.artists.items)
  }
  return (
    <div className="artist-search-container">
      <input
        type="text"
        placeholder="Enter Artist Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchArtists}>Search</button>
      <ul>
        {results.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  )
}
export default ArtistSearch
