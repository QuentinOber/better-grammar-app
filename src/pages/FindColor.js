import { useEffect, useState } from 'react'
import SuccessSound from '../assets/SuccessSound.mp3'

import frenchColors from '../data/FrenchColors.json'

function FindColor() {
  const frenchColorsCSS = Object.values(frenchColors.easy)
  const frenchColorsNames = Object.keys(frenchColors.easy)

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)

  function shuffleCards() {
    const shuffledCards = [...frenchColorsCSS, ...frenchColorsNames]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ value: card, id: Math.random(), matched: false }))

    console.log(shuffledCards)

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }

  function handleCardClick(card) {
    if (!disabled) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }
  }

  useEffect(() => shuffleCards(), [])

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)
      if (
        (frenchColorsCSS.includes(choiceOne.value) && frenchColorsCSS.includes(choiceTwo.value)) ||
        (frenchColorsNames.includes(choiceOne.value) && frenchColorsNames.includes(choiceTwo.value))
      ) {
        setTimeout(() => resetTurn(), 1000)
      } else {
        if (
          frenchColors.easy[choiceOne.value] === choiceTwo.value ||
          frenchColors.easy[choiceTwo.value] === choiceOne.value
        ) {
          setTimeout(() => {
            const successAudio = new Audio(SuccessSound)
            successAudio.play()
            setCards((prevCards) => {
              return prevCards.map((card) => {
                if (card.value === choiceOne?.value || card.value === choiceTwo?.value) {
                  return { ...card, matched: true }
                } else return card
              })
            })
          }, 500)

          setTimeout(() => resetTurn(), 1000)
        } else {
          setTimeout(() => resetTurn(), 1000)
        }
      }
    }
  }, [choiceOne, choiceTwo])

  function resetTurn() {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns((prevTurn) => prevTurn + 1)
    setDisabled(false)
  }

  return (
    <div className="find-color-wrapper">
      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <div className={card === choiceOne || card === choiceTwo || card.matched ? 'flipped' : ''}>
              <div
                className="front"
                style={
                  frenchColorsCSS.includes(card.value) || card.matched
                    ? {
                        backgroundColor: frenchColorsCSS.includes(card.value)
                          ? card.value
                          : frenchColors.easy[card.value],
                        color: 'white',
                        textShadow: '1px 1px 1px black',
                      }
                    : { backgroundColor: 'white' }
                }
              >
                {(frenchColorsNames.includes(card.value) || card.matched) &&
                  (frenchColorsNames.includes(card.value)
                    ? card.value
                    : Object.keys(frenchColors.easy).find((k) => frenchColors.easy[k] === card.value))}
              </div>
              <div className="back" onClick={() => handleCardClick(card)}>
                ?
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="game-footer">
        <p className="main-highlight">Essais : {turns}</p>
        <button onClick={shuffleCards}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>{' '}
          Recommecer
        </button>
      </div>
    </div>
  )
}

export default FindColor
