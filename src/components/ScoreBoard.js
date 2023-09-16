import React, { useEffect } from 'react'

function ScoreBoard({ onRestartGame, userPoints }) {
  return (
    <div className="scoreboard-wrapper">
      <h2>C'est terminé !</h2>
      <div className="my-score">
        Ton score est de <span className="main-highlight">{userPoints} points</span>. Tu peux faire mieux ?
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
        Nouveau jeu
      </button>
    </div>
  )
}

export default ScoreBoard
