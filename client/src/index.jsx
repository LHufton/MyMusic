import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './components/App/App'
import Profile from './components/Profile/Profile'
import Login from './components/Login/Login'
import Playlist from './components/Playlist/Playlist'
import './index.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/playlist" element={<Playlist />} />
      <Route path="/app" element={<App />} />
    </Routes>
  </Router>
)
