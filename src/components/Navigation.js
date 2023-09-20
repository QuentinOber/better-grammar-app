import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="nav-wrapper">
      <Link to="/">
        <button> ← Tous les jeux</button>
      </Link>
      {currentPath === '/find-number' && (
        <>
          <button className="selected">Les nombres</button>
        </>
      )}

      {currentPath === '/preposition' && (
        <>
          <button className="selected">Les prépositions</button>
        </>
      )}
    </div>
  )
}

export default Navigation
