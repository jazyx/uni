/**
 * frontend/src/pages/Memory.jsx
 *
 * Cards and player scores are read in from a JSON file.
 * The first player can click on two cards.
 *
 * TODO:
 *  + Treat click on found card
 *  + Treat click during FOUND_DELAY
 *  + Make multiuser
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../../state'
import { Score } from '../../components'
import './memory.css'



export default function Memory() {
  const {
    group,
    user_name,
    role,
    sendMessage,
    applyState,
    DEPOT
  } = useContext(WSContext)
  const { activity } = useContext(ActivityContext)
  if (activity.id !== "memory") { return }

  const [ cards, setCards ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [ flippedCards, setFlippedCards ] = useState([])
  const [ gameOver, setGameOver ] = useState(false)


  const flipCard = ({ target }) => {
    if (players[activity.player].user_name !== user_name) {
      // It's not this player's turn. `pointer-actions: none`
      // should already have prevented the click
      return
    }

    target = target.closest("div") // target may initially be img
    const index = Number(target.dataset.index)

    if (cards[index].found) { return }

    switch (flippedCards.length) {
      case 0:
        // Fall through
      case 1:
        flipACard(index)
        break
      default:
        return
    }

    // Handle the change locally
    cards[index].flipped = true
  }


  const flipACard = index => {
    if (flippedCards[0] === index) {
      return
    }

    // Update flippedCards locally before backend confirms
    const flipped = [...flippedCards]
    flipped.push(index)
    setFlippedCards(() => flipped)

    const message = {
      group,
      subject: "MEMORY.FLIP_CARD",
      flipped,
      player: user_name
    }
    sendMessage(message, 1000)
  }


  const layout = cards.map(({image, flipped, found}, index) => {
    image = DEPOT+image
    const name = image.replace(/^.+\//, "")
                      .replace(/\..+$/, "")
                      .replace("_", " ")
    const key = `${index}_${name}`

    const foundClass = ((gameOver && found))
      ? "all-found"
      : "found"

    const style = (gameOver)
      ? playerColor(found)
      : {}

    return (
      <div
        onClick={flipCard}
        data-index={index}
        key={key}
        style={style}
      >
        { found
          ? <img
              src={image}
              alt={name}
              title={name}
              className={foundClass}
            />
          : flipped
            ?
              <img
                src={image}
                alt={name}
                title={name}
              />
            : <p>{`${name}`}</p>
        }
      </div>
    )


    function playerColor(player) {
      const playerData = players.find(data => (
        data.user_name === player
      ))
      return {
        border: `4px inset ${playerData.color}`,
        boxSizing: "border-box"
      }
    }
  })


  function preloadImages() {
    const { cards } = activity.cards
    if (!cards) { return }

    cards.forEach(({ image }) => {
      const img = new Image()
      img.src = `${DEPOT}${image}`
    })

    setCards(cards)
  }


  const gameUpdate = () => {
    const {
      cards,
      players=[],
      player,
      turn_over
    } = activity

    if (!players.length) { return }

    if (turn_over) {
      setFlippedCards([])
    }

    setCards(cards)
    setPlayers(players)
    if (activity.to_find < 1) {
      // Double-check that all cards have non-empty `found`
      const allFound = cards.every(({ found }) => !!found )
      setGameOver(allFound)
    } else {
      setGameOver(false)
    }

    // Ensure only the current player can turn cards
    const myTurn = players[player].user_name === user_name
    const custom = (myTurn)
      ? "all"
      : "none"
    // Set value for pointer-events for div#memory
    document.documentElement.style.setProperty("--events", custom)

    // Set background color to show whose turn it is
    const bg = (myTurn)
      ? "#020"
      : "#222"
    document.documentElement.style.setProperty("--bg", bg)

    // Keep checking connection if it's not myTurn
    const mode = myTurn ? "IDLE" : "EAGER"
    applyState(mode)
  }


  useEffect(preloadImages, [activity?.cards])
  useEffect(gameUpdate, [activity])


  const data = players.find(data => (
    data.user_name === user_name
  ))
  const canPeek = data && (role === "teacher" || data.peek)
  const layoutClass = `layout${canPeek
    ? " peek"
    : ""
  }`


  return (
    <div
      id="memory"
    >
      <Score allowPeek={true} gameOver={gameOver} />
      <div className={layoutClass}>{layout}</div>
    </div>
  )
}