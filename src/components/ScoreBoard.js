import { useEffect, useState } from 'react'
import LoginBanner from './LoginBanner'
import { useFormatDate } from '../hooks/useDateFormat'
import useFetch from '../hooks/useFetch'

function ScoreBoard({ onRestartGame, userPoints, isSavedDone, level, activity }) {
  let isLoggedIn = false
  if (typeof user !== 'undefined') {
    isLoggedIn = user.logged_in === '1'
  }

  let urlMyTopScores
  isLoggedIn ? (urlMyTopScores = `/wp-json/better-grammar/v1/find_${activity}_top_5/${level}`) : (urlMyTopScores = null)

  const [topScores, setTopScores] = useState(null)
  const [myScores, setMyScores] = useState(null)

  const { data: topScoresData } = useFetch(`/wp-json/better-grammar/v1/find_${activity}_top_15/${level}`, isSavedDone)
  const { data: myScoresData } = useFetch(urlMyTopScores, isSavedDone)

  useEffect(() => {
    if (Array.isArray(topScoresData)) {
      setTopScores(topScoresData)
    }

    if (Array.isArray(myScoresData)) {
      setMyScores(myScoresData)
    }
  }, [topScoresData, myScoresData])

  return (
    <div className="scoreboard-wrapper">
      <h2>C'est terminé !</h2>
      {isLoggedIn ? null : <LoginBanner />}
      <div className="my-score">
        Bravo ! Ton score est de <span className="main-highlight">{userPoints} points</span>. Tu peux faire mieux ?
        <button onClick={() => onRestartGame()} className="retry game-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
          Nouveau Jeu
        </button>
      </div>

      {isLoggedIn && (
        <>
          <h3>🏆 Mes meilleurs scores</h3>
          <table className="score-table">
            <thead>
              <tr>
                <th>Points</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {myScores &&
                myScores.map((score, index) => (
                  <tr key={index}>
                    <td>
                      <span className="main-highlight">{score.game_results}</span>
                    </td>
                    <td>{useFormatDate(score.result_date)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}

      <h3>💪 Les meilleurs </h3>
      <table className="score-table">
        <thead>
          <tr>
            <th>Points</th>
            <th>Joueur</th>
            <th>Rang</th>
          </tr>
        </thead>
        <tbody>
          {topScores &&
            topScores.map((score, index) => (
              <tr key={index}>
                <td>
                  <span className="main-highlight">{score.game_results}</span>
                </td>

                <td>
                  <span className="main-highlight">{score.username}</span>
                </td>
                <td>{index + 1}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoreBoard
