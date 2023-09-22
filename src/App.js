import '../css/styles.scss'
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import AppContext from './data/AppContext'
import AppDispatch from './data/AppDispatch'

//ELEMENTS
import Navigation from './components/Navigation'
import Home from './pages/Home'
import FindNumber from './pages/FindNumber'
import Preposition from './pages/Preposition'
import FindColor from './pages/FindColor'

function App() {
  const initialState = {
    test: 'coucou',
    loggedIn: false,
    selectedLevel: null,
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState)

  function appReducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true
        return
      case 'logout':
        draft.loggedIn = false
        return
      case 'test':
        draft.test = 'test'
        return
      default:
        return draft
    }
  }

  return (
    <AppContext.Provider value={state}>
      <AppDispatch.Provider value={dispatch}>
        <Navigation />
        <Routes>
          <Route path="/find-number" element={<FindNumber />} />
          <Route path="/find-color" element={<FindColor />} />
          <Route path="/preposition" element={<Preposition />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </AppDispatch.Provider>
    </AppContext.Provider>
  )
}

export default App
