import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'

const element = document.getElementById('better-grammar-app')
if (element !== null) {
  const root = ReactDOM.createRoot(element)
  root.render(
    <HashRouter>
      <App />
    </HashRouter>
  )
}
