import { useEffect, useState, useRef, useContext } from 'react'
import PageLayout from '../components/PageLayout'
import { useImmerReducer } from 'use-immer'

//components
import frenchNumbers from '../data/FrenchNumbers.json'
import Timer from '../components/timer'
import ScoreBoard from '../components/ScoreBoard'
import SuccessSound from '../assets/SuccessSound.mp3'
import FailedSound from '../assets/FailedSound.mp3'

//hooks
import { useSaveResults } from '../hooks/useSaveResults'

function FindNumber() {
  const [randomNumber, setRandomNumber] = useState(null)
  const [timerKey, setTimerKey] = useState(0)
  const [shouldBounce, setShouldBounce] = useState(false)
  const [pointWinnedAnimation, setPointWinnedAnimation] = useState(false)
  const [pointLostAnimation, setPointLostAnimation] = useState(false)
  const [gameDurationInSec, setGameDurationInSec] = useState(null)

  const [isSavedDone, setIsSavedDone] = useState(false)

  const inputRef = useRef(true)

  const initialState = {
    isLevelVisible: true,
    selectedLevel: '',
    isPlaying: false,
    isGameOver: false,
    hasTimerStated: false,
    foundNumbers: [],
    skippedNumbers: {},
    userPoints: 0,
    isSavedDone: false,
  }

  const [keys, setKeys] = useState([])
  const [state, dispatch] = useImmerReducer(numberReducer, initialState)

  function numberReducer(draft, action) {
    switch (action.type) {
      case 'selectLevel':
        draft.isLevelVisible = false
        draft.selectedLevel = action.value
        switch (action.value) {
          case 'easy':
            setGameDurationInSec(30)
            break
          case 'intermediate':
            setGameDurationInSec(60)
            break
          case 'hard':
            setGameDurationInSec(120)
            break
          default:
            setGameDurationInSec(30)
        }
        const newKeys = Object.keys(frenchNumbers[draft.selectedLevel])
        setKeys(newKeys)
        draft.isPlaying = true
        return
      case 'gameOver':
        draft.isGameOver = true
        draft.isPlaying = false
        inputRef.current.value = ''
        if (user && user.logged_in === '1') {
          useSaveResults(draft.userPoints, draft.selectedLevel, 'number')
            .then(() => {
              setIsSavedDone(true)
            })
            .catch((error) => {
              console.error('An error occurred:', error)
              setIsSavedDone(true)
            })
        } else {
          setIsSavedDone(true)
        }
        return
      case 'restartGame':
        Object.assign(draft, initialState)
        setTimerKey((prevKey) => prevKey + 1)
        return
      case 'checkAnswer':
        if (
          action.value.replace(/\s+|-/g, '').toLowerCase() == randomNumber.value.replace(/\s+|-/g, '').toLowerCase()
        ) {
          const successAudio = new Audio(SuccessSound)
          successAudio.play()
          draft.foundNumbers.push(randomNumber.key)
          inputRef.current.value = ''
          draft.userPoints = draft.userPoints + 2
          setPointWinnedAnimation(true)
          setTimeout(() => setPointWinnedAnimation(false), 500)
          setShouldBounce(true)
          setTimeout(() => setShouldBounce(false), 1000)
        }
        return
      case 'failToAnswer':
        const failedAudio = new Audio(FailedSound)
        failedAudio.play()
        setPointLostAnimation(true)
        setTimeout(() => setPointLostAnimation(false), 300)
        draft.skippedNumbers[randomNumber.key] = randomNumber.value
        draft.userPoints > 0 && draft.userPoints--
        inputRef.current.value = ''

        return
      default:
        return draft
    }
  }

  useEffect(() => {
    let selectedLevelNumbers = frenchNumbers[state.selectedLevel]
    let filteredKeys = []
    const skippedNumbersKeys = Object.keys(state.skippedNumbers)

    if (keys && keys.length > 0) {
      filteredKeys = keys.filter((item) => !state.foundNumbers.includes(item) && !skippedNumbersKeys.includes(item))
    }
    inputRef.current.focus() // focus on the input from start

    if (state.isPlaying) {
      if (filteredKeys.length) {
        const randomIndex = Math.floor(Math.random() * filteredKeys.length)
        const randomKey = filteredKeys[randomIndex]
        const randomValue = selectedLevelNumbers[randomKey]
        setRandomNumber({ key: randomKey, value: randomValue })
      } else {
        dispatch({ type: 'gameOver' })
      }
    }
  }, [state.foundNumbers, state.skippedNumbers, keys])

  const allLevels = { easy: 'Facile', intermediate: 'Intermédiare', hard: 'Difficile' }

  return (
    <PageLayout>
      <div className="find-number-wrapper">
        <div className={state.isLevelVisible ? 'select-level-wrapper' : 'hide'}>
          <h1>Sélectionne ton niveau</h1>
          <div className="levels">
            {Object.keys(allLevels).map((key) => (
              <button key={key} className="game-button" onClick={() => dispatch({ type: 'selectLevel', value: key })}>
                {allLevels[key]}
              </button>
            ))}
          </div>
        </div>

        <div className={state.isPlaying ? 'wrapper-number-game' : 'hide'}>
          <div className="game-header">
            {state.isPlaying ? (
              <Timer
                key={timerKey}
                howManyseconds={gameDurationInSec}
                onGameOver={() => {
                  dispatch({ type: 'gameOver' })
                }}
              />
            ) : null}
            <div
              className={`score ${pointWinnedAnimation ? ' point-winned-animation' : ''} ${
                pointLostAnimation ? ' point-lost-animation' : ''
              }`}
            >
              {state.userPoints} {state.userPoints > 1 ? 'points' : 'point'}
            </div>
          </div>
          <div className="number-frame">
            <p className={`number ${shouldBounce ? 'bounce confetti' : ''}`}>
              {randomNumber ? randomNumber.key.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '...'}
            </p>

            <div className="game-actions">
              <input
                ref={inputRef}
                onChange={(e) => {
                  dispatch({ type: 'checkAnswer', value: e.target.value })
                }}
                placeholder="Le nombre..."
                type="text"
                className="input-number"
              />
              <button onClick={() => dispatch({ type: 'failToAnswer' })} className="game-button">
                ?
              </button>
            </div>
          </div>
        </div>
        <div className={state.isGameOver ? 'game-is-over' : 'hide'}>
          <ScoreBoard
            userPoints={state.userPoints}
            onRestartGame={() => {
              dispatch({ type: 'restartGame' })
            }}
            isSavedDone={isSavedDone}
            level={state.selectedLevel}
            activity="number"
          />
        </div>

        <div className={Object.keys(state.skippedNumbers).length > 0 ? 'missed-numbers' : 'hide'}>
          <span className="main-highlight">
            {Object.keys(state.skippedNumbers).length > 1 ? 'Nombres loupés :' : 'Nombre loupé :'}
          </span>
          <ul>
            {Object.entries(state.skippedNumbers).map(([key, value]) => {
              return (
                <li key={key}>
                  <span className="main-highlight">{key}</span> : {value}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default FindNumber
