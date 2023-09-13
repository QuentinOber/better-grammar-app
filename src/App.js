import '../css/styles.scss'
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

//ELEMENTS
import Navigation from './components/Navigation'
import Home from './pages/Home'
import FindNumber from './pages/FindNumber'
import Preposition from './pages/Preposition'

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/find-number" element={<FindNumber />} />
        <Route path="/games" element={<Home />} />
        <Route path="/preposition" element={<Preposition />} />
      </Routes>
    </>
  )
}

export default App
