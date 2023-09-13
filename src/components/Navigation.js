import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <div className="nav-wrapper">
      <Link to="/games">
        <button> ← Tous les jeux</button>
      </Link>
      <Link to="/find-number">
        <button>Les nombres</button>
      </Link>
      <Link to="/preposition">
        <button>Les prépositions</button>
      </Link>
    </div>
  )
}

export default Navigation
