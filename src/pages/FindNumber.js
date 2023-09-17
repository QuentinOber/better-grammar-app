import React, { useEffect, useContext, useState, useRef } from 'react'
import PageLayout from '../components/PageLayout'
import AppContext from '../data/AppContext'
import AppDispatch from '../data/AppDispatch'
import { useImmerReducer } from 'use-immer'
import frenchNumbers from '../data/FrenchNumbers.json'

//components
import Timer from '../components/timer'
import ScoreBoard from '../components/ScoreBoard'
import SuccessSound from '../assets/SuccessSound.mp3'
import FailedSound from '../assets/FailedSound.mp3'

function FindNumber() {
  const [randomNumber, setRandomNumber] = useState(null)
  const [timerKey, setTimerKey] = useState(0)

  const [shouldBounce, setShouldBounce] = useState(false)
  const [pointWinnedAnimation, setPointWinnedAnimation] = useState(false)
  const [pointLostAnimation, setPointLostAnimation] = useState(false)

  const inputRef = useRef(true)
  const timerRef = useRef(true) // useless?

  const initialState = {
    hasClickedStarted: false,
    isLevelVisible: false,
    selectedLevel: 'easy',
    isPlaying: false,
    isGameOver: false,
    hasTimerStated: false,
    foundNumbers: [],
    skippedNumbers: {},
    userPoints: 0,
  }

  const [keys, setKeys] = useState([])
  const [state, dispatch] = useImmerReducer(numberReducer, initialState)

  function numberReducer(draft, action) {
    switch (action.type) {
      case 'start':
        draft.hasClickedStarted = true
        draft.isLevelVisible = true
        return
      case 'selectLevel':
        draft.isLevelVisible = false
        draft.selectedLevel = action.value
        const newKeys = Object.keys(frenchNumbers[draft.selectedLevel])
        setKeys(newKeys)
        draft.isPlaying = true
        return
      case 'gameOver':
        draft.isGameOver = true
        // draft.isGameOver = true
        draft.isPlaying = false
        return
      case 'restartGame':
        Object.assign(draft, initialState)
        setTimerKey((prevKey) => prevKey + 1)
        return
      case 'checkAnswer':
        if (action.value.replace(/\s+/g, '').toLowerCase() == randomNumber.value.replace(/\s+/g, '').toLowerCase()) {
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
        console.log(Object.keys(draft.skippedNumbers))
        draft.userPoints > 0 && draft.userPoints--
        inputRef.current.value = ''

        return
      case 'test':
        console.log('test')
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
    console.log('state.foundNumbers:', state.foundNumbers)
    console.log('keys:', keys)

    console.log(filteredKeys)

    if (filteredKeys.length) {
      const randomIndex = Math.floor(Math.random() * filteredKeys.length)
      const randomKey = filteredKeys[randomIndex]
      const randomValue = selectedLevelNumbers[randomKey]
      setRandomNumber({ key: randomKey, value: randomValue })
    } else {
      dispatch({ type: 'gameOver' })
    }
  }, [state.foundNumbers, state.skippedNumbers, keys])

  console.log(state)

  return (
    <PageLayout>
      <div className="game-wrapper">
        <div className={state.hasClickedStarted ? 'hide' : 'start-wrapper'}>
          <h1>Write the correct number in French</h1>
          <button onClick={() => dispatch({ type: 'start' })} class="game-button">
            Start now!
          </button>
        </div>
        <div className={state.isLevelVisible ? 'select-level-wrapper' : 'hide'}>
          <h1>Sélectionne ton niveau</h1>
          <div className="levels">
            <button className="game-button" onClick={() => dispatch({ type: 'selectLevel', value: 'easy' })}>
              Facile
            </button>
            <button className="game-button" onClick={() => dispatch({ type: 'selectLevel', value: 'intermediate' })}>
              Intermédiaire
            </button>
            <button className="game-button" onClick={() => dispatch({ type: 'selectLevel', value: 'advanced' })}>
              Avancé
            </button>
          </div>
        </div>

        <div className={state.isPlaying ? 'wrapper-number-game' : 'hide'}>
          <div className="game-header">
            {state.isPlaying ? (
              <Timer
                ref={timerRef}
                key={timerKey}
                howManySeconds={20}
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
              {randomNumber ? randomNumber.key : '...'}
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
          />
        </div>

        <div className={Object.keys(state.skippedNumbers).length > 0 ? 'missed-numbers' : 'hide'}>
          <span className="main-highlight">
            {Object.keys(state.skippedNumbers).length > 1
              ? 'Nombres loupés (missed numbers) :'
              : 'Nombre loupé (missed number) :'}
          </span>
          <ul>
            {Object.entries(state.skippedNumbers).map(([key, value]) => {
              return (
                <li>
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
