import React, { useEffect, useState } from 'react'

function Timer({ howManySeconds, onGameOver }) {
  const [counter, setCounter] = useState(howManySeconds)

  useEffect(() => {
    let timer
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000)
    } else {
      onGameOver() // Call the callback function when the timer reaches zero
    }

    return () => {
      clearTimeout(timer)
    }
  }, [counter, onGameOver])

  const minutes = Math.floor(counter / 60)
  const seconds = counter % 60

  return (
    <div className="timer">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  )
}

export default Timer
