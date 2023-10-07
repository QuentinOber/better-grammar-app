import { useEffect, useState, useRef, useContext } from 'react'
import PageLayout from '../components/PageLayout'
import { useImmerReducer } from 'use-immer'

//components
import frenchPrepositions from '../data/FrenchPrepositions.json'
import Timer from '../components/timer'
import ScoreBoard from '../components/ScoreBoard'
import SuccessSound from '../assets/SuccessSound.mp3'
import FailedSound from '../assets/FailedSound.mp3'

//hooks
import { useSaveResults } from '../hooks/useSaveResults'

function FindPreposition() {
  const [randomPreposition, setRandomPreposition] = useState(null)
  const [timerKey, setTimerKey] = useState(0)
  const [shouldBounce, setShouldBounce] = useState(false)
  const [pointWinnedAnimation, setPointWinnedAnimation] = useState(false)
  const [pointLostAnimation, setPointLostAnimation] = useState(false)
  const [gameDurationInSec, setGameDurationInSec] = useState(null)

  const [isSavedDone, setIsSavedDone] = useState(false)
  const allPreposition = ['à', 'de', 'pour', 'au', 'aux', 'dans', 'sur', 'avec', 'en', 'du', 'chez']

  const initialState = {
    isLevelVisible: true,
    selectedLevel: '',
    isPlaying: false,
    isGameOver: false,
    hasTimerStated: false,
    foundPrepositions: [],
    skippedPrepositions: {},
    userPoints: 0,
    isSavedDone: false,
  }

  const [keys, setKeys] = useState([])
  const [state, dispatch] = useImmerReducer(prepositionsReducer, initialState)

  function prepositionsReducer(draft, action) {
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
            setGameDurationInSec(60)
            break
          default:
            setGameDurationInSec(30)
        }
        const newKeys = Object.keys(frenchPrepositions[draft.selectedLevel])
        setKeys(newKeys)
        draft.isPlaying = true
        return
      case 'gameOver':
        draft.isGameOver = true
        draft.isPlaying = false
        if (user && user.logged_in === '1') {
          useSaveResults(draft.userPoints, draft.selectedLevel, 'preposition')
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
        if (action.value == randomPreposition.value) {
          const successAudio = new Audio(SuccessSound)
          successAudio.play()
          draft.foundPrepositions.push(randomPreposition.key)
          draft.userPoints = draft.userPoints + 2
          setPointWinnedAnimation(true)
          setTimeout(() => setPointWinnedAnimation(false), 500)
          setShouldBounce(true)
          setTimeout(() => setShouldBounce(false), 1000)
          return
        } else {
          const failedAudio = new Audio(FailedSound)
          failedAudio.play()
          setPointLostAnimation(true)
          setTimeout(() => setPointLostAnimation(false), 300)
          draft.skippedPrepositions[randomPreposition.key] = randomPreposition.value
          draft.userPoints > 0 && draft.userPoints--
          return
        }

      case 'failToAnswer':
        const failedAudio = new Audio(FailedSound)
        failedAudio.play()
        setPointLostAnimation(true)
        setTimeout(() => setPointLostAnimation(false), 300)
        draft.skippedPrepositions[randomPreposition.key] = randomPreposition.value
        draft.userPoints > 0 && draft.userPoints--

        return
      default:
        return draft
    }
  }

  useEffect(() => {
    let selectedLevelPrepositions = frenchPrepositions[state.selectedLevel]
    let filteredKeys = []
    const skippedPrepositionsKeys = Object.keys(state.skippedPrepositions)

    if (keys && keys.length > 0) {
      filteredKeys = keys.filter(
        (item) => !state.foundPrepositions.includes(item) && !skippedPrepositionsKeys.includes(item)
      )
    }

    if (state.isPlaying) {
      if (filteredKeys.length) {
        const randomIndex = Math.floor(Math.random() * filteredKeys.length)
        const randomKey = filteredKeys[randomIndex]
        const randomValue = selectedLevelPrepositions[randomKey]
        setRandomPreposition({ key: randomKey, value: randomValue })
      } else {
        dispatch({ type: 'gameOver' })
      }
    }
  }, [state.foundPrepositions, state.skippedPrepositions, keys])

  const allLevels = { easy: 'Facile', intermediate: 'Intermédiare', hard: 'Difficile' }

  return (
    <PageLayout>
      <div className="find-preposition-wrapper">
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

        <div className={state.isPlaying ? 'wrapper-preposition-game' : 'hide'}>
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
          <div className="preposition-frame">
            <p className={`preposition ${shouldBounce ? 'bounce confetti' : ''}`}>
              {randomPreposition ? randomPreposition.key : '...'}
            </p>

            <div className="game-actions">
              {allPreposition.map((preposition) => (
                <label>
                  <input
                    unchecked
                    type="radio"
                    name="preposition"
                    value={preposition}
                    onChange={(e) => {
                      dispatch({ type: 'checkAnswer', value: e.target.value })
                    }}
                  />
                  <span>{preposition}</span>
                </label>
              ))}

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
            activity="preposition"
          />
        </div>

        <div className={Object.keys(state.skippedPrepositions).length > 0 ? 'missed-prepositions' : 'hide'}>
          <span className="main-highlight">
            {Object.keys(state.skippedPrepositions).length > 1 ? 'Prépositions loupées :' : 'Préposition loupée :'}
          </span>
          <ul>
            {Object.entries(state.skippedPrepositions).map(([key, value]) => {
              return (
                <li key={key}>
                  {key} : <span className="main-highlight">{value}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}

export default FindPreposition
