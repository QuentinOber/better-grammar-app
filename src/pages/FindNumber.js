import React, { useEffect, useContext, useState, useRef } from 'react'
import PageLayout from '../components/PageLayout'
import AppContext from '../data/AppContext'
import AppDispatch from '../data/AppDispatch'
import { useImmerReducer } from 'use-immer'
import frenchNumbers from '../data/FrenchNumbers.json'

//components
import Timer from '../components/timer'
import ScoreBoard from '../components/ScoreBoard'
// import SuccessSound from '../assets/SuccessSound.mp3'

function FindNumber() {
  const [randomNumber, setRandomNumber] = useState(null)
  const [timerKey, setTimerKey] = useState(0)

  const [shouldBounce, setShouldBounce] = useState(false)
  const [pointWinnedAnimation, setPointWinnedAnimation] = useState(false)
  const [pointLostAnimation, setPointLostAnimation] = useState(false)

  const inputRef = useRef(true)
  const timerRef = useRef(true) // useless?

  const initialState = {
    hasClickedStarted: true,
    isLevelVisible: false,
    selectedLevel: null,
    isPlaying: true,
    isGameOver: false,
    hasTimerStated: false,
    foundNumbers: [],
    skippedNumbers: {},
    userPoints: 0,
  }

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
          draft.foundNumbers.push(randomNumber.key)
          inputRef.current.value = ''
          draft.userPoints = draft.userPoints + 2
          setPointWinnedAnimation(true)
          setTimeout(() => setPointWinnedAnimation(false), 300)
          setShouldBounce(true)
          setTimeout(() => setShouldBounce(false), 1000)
        }
        return
      case 'failToAnswer':
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

  const keys = Object.keys(frenchNumbers)
  const skippedNumbersKeys = Object.keys(state.skippedNumbers)
  const filteredKeys = keys.filter((item) => !state.foundNumbers.includes(item) && !skippedNumbersKeys.includes(item))

  useEffect(() => {
    inputRef.current.focus() // focus on the input from start
    console.log('state.foundNumbers:', state.foundNumbers)
    console.log('keys:', keys)

    console.log(filteredKeys)

    if (filteredKeys.length) {
      const randomIndex = Math.floor(Math.random() * filteredKeys.length)
      const randomKey = filteredKeys[randomIndex]
      const randomValue = frenchNumbers[randomKey]
      setRandomNumber({ key: randomKey, value: randomValue })
    } else {
      dispatch({ type: 'gameOver' })
    }
  }, [state.foundNumbers, state.skippedNumbers])

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
            <button className="game-button" onClick={() => dispatch({ type: 'selectLevel', value: 'hard' })}>
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
            <p className={`number ${shouldBounce ? 'bounce' : ''}`}>{randomNumber ? randomNumber.key : '...'}</p>

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
