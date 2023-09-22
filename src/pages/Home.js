import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import LoginBanner from '../components/LoginBanner'

// to optimize when more games are created
function Home() {
  let isLoggedIn = false

  if (typeof user !== 'undefined') {
    isLoggedIn = user.logged_in === '1'
  }
  return (
    <PageLayout>
      {isLoggedIn ? null : <LoginBanner />}
      <div className="home-wrapper">
        <h2>Retrouve tous les jeux ici</h2>
        <div className="games-selection">
          <Link to="/find-number">
            <div className="card" style={{ '--rating': 90 }}>
              <div className="icon">🔢</div>
              <div className="title">Les nombres, des maths ?</div>
              <p className="description">Retrouve les bons nombres, le plus rapidemment possible...</p>
              <div className="rating"></div>
              <span className="link">Jouer</span>
            </div>
          </Link>
          <Link to="/find-color">
            <div className="card" style={{ '--rating': 90 }}>
              <div className="icon">🦄</div>
              <div className="title">Les couleurs et la mémoire</div>
              <p className="description">Travaille ta mémoire, et tes couleurs !</p>
              <div className="rating"></div>
              <span className="link">Jouer</span>
            </div>
          </Link>
          <Link to="/preposition">
            <div className="card" style={{ '--rating': 0 }}>
              <div className="icon">🔜</div>
              <div className="title">Les prépositions (à, de, pour...)</div>
              <p className="description">Retrouve les bonnes prépositions, dans différents contextes...</p>
              <div className="rating"></div>
              <span className="link">Jouer</span>
            </div>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}

export default Home
