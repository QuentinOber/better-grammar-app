import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  const currentPath = location.pathname

  if (currentPath === '/') return
  else {
    return (
      <div className="nav-wrapper">
        {currentPath === '/' ? (
          ''
        ) : (
          <Link to="/">
            <button> ← Tous les jeux</button>
          </Link>
        )}

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
        {currentPath === '/find-color' && (
          <>
            <button className="selected">Les couleurs</button>
          </>
        )}
      </div>
    )
  }
}

export default Navigation
