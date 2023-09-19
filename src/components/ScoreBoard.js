import React, { useEffect, useState } from 'react'
import LoginBanner from './LoginBanner'
import { formatDate } from '../hooks/DateFormat'

function ScoreBoard({ onRestartGame, userPoints, isGameOver, level }) {
  let isLoggedIn = false

  const [topScores, setTopScores] = useState([])
  const [myScores, setMyScores] = useState([])

  if (typeof user !== 'undefined') {
    isLoggedIn = user.logged_in === '1'
  }

  useEffect(() => {
    const apiTopUrl = `/wp-json/better-grammar/v1/find_number_top_15/${level}`

    const fetchTopScores = () => {
      fetch(apiTopUrl)
        .then((response) => response.json())
        .then((data) => setTopScores(data))
        .catch((error) => console.error('Error fetching data:', error))
    }

    const apiMyScoresUrl = `/wp-json/better-grammar/v1/find_number_top_5/${level}`

    const nonce = wpApiSettings.nonce
    const fetchMyScores = () => {
      if (isLoggedIn) {
        fetch(apiMyScoresUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce,
          },
        })
          .then((response) => response.json())
          .then((data) => setMyScores(data))
          .catch((error) => console.error('Error fetching my top 5 scores:', error))
      } else {
        return
      }
    }

    if (isGameOver) {
      setTimeout(fetchTopScores, 2000) // 2-second delay
      setTimeout(fetchMyScores, 2000)
    }
  }, [isGameOver])

  return (
    <div className="scoreboard-wrapper">
      <h2>C'est terminé !</h2>
      {isLoggedIn ? null : <LoginBanner />}
      <div className="my-score">
        Bravo ! Ton score est de <span className="main-highlight">{userPoints} points</span>. Tu peux faire mieux ?
      </div>

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
              {myScores.length > 0 &&
                myScores.map((score, index) => (
                  <tr key={index}>
                    <td>
                      <span className="main-highlight">{score.game_results}</span>
                    </td>
                    <td>{formatDate(score.result_date)}</td>
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
          {topScores.map((score, index) => (
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
