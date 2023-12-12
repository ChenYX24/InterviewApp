import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Room from './pages/Room'
import CameraToggle from './component/CameraToggle'; 
function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/camera" element={<CameraToggle />} />
      </Routes>
    </Router>
  )
}

export default App
