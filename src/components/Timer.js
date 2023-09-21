import { useEffect, useState } from 'react'

function Timer({ howManyseconds, onGameOver }) {
  const [counter, setCounter] = useState(howManyseconds)

  useEffect(() => {
    let timer
    if (counter > 0) {
      timer = setTimeout(() => setCounter((prevCounter) => prevCounter - 1), 1000)
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
