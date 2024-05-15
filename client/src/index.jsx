import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './components/App'
import Profile from './components/Profile'
import Login from './components/Login'
import Playlist from './components/Playlist'
import './App.css'

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
