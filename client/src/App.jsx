import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/Login/Login'
import Profile from './components/Profile/Profile'
import Playlist from './components/Playlist/Playlist'
import ArtistSearch from './components/ArtistSearch/ArtistSearch'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/playlist" component={Playlist} />
        <Route path="/artist-search" component={ArtistSearch} />
      </Switch>
    </Router>
  )
}

export default App
