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
import { getColor, toneColor } from '../../utilities/colors'
import Settings from './Settings'
import '../../css/memory.css'



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

  const [ cards, setCards ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [ toFind, setToFind ] = useState(activity.to_find || 999)

  const [ flippedCards, setFlippedCards ] = useState([])
  const [ settings, setSettings ] = useState()




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
    sendMessage(message)
  }


  const layout = cards.map(({image, flipped, found}, index) => {
    image = DEPOT+image
    const name = image.replace(/^.+\//, "")
                      .replace(/\..+$/, "")
                      .replace("_", " ")
    const key = `${index}_${name}`

    const foundClass = ((!toFind && found))
      ? "show-found"
      : "found"

    const style = toFind
      ? {}
      : playerColor(found)

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


  const getHighScore = () => {
    const scores = players.map(({score}) => score)
    return Math.max.apply(null, scores)
  }


  const getPlayerData = user_name => (
    players.find(data => data.user_name === user_name)
  )


  const score = players.map(({
    user_name: name, 
    score, 
    color
  }, index) => {
    let highlight
    if (toFind){
      highlight = index === activity.player

    } else {
      const highScore = getHighScore()
      const data = getPlayerData(name)
      highlight = data.score === highScore
    }

    if (highlight) {
      color = `#${toneColor(color, 2.)}`
    }

    const className = highlight
      ? "current"
      : null

    const style = {
      color
    }

    const settingsClass = (settings === name)
      ? "settings"
      : "settings hide"

    return (
      <div className="player"
        key={`${name}`}
      >
        <p
          className={className}
          style={style}
          onClick={showSettings}
        >
          {name}:
          <span>{score}</span>
        </p>

        { role === "teacher" &&
          <Settings
            user_name={name}
            className={settingsClass}
            close={setSettings}
            peek={name === user_name || playerCanPeek(name)}
          />
        }
      </div>
    )


    function playerCanPeek(name) {
      const playerData = players.find(({user_name}) => (
        user_name === name
      ))
      return !!(playerData && playerData.peek)
    }


    function showSettings() {
      if (settings === name) {
        return setSettings()
      }
      setSettings(name)
    }
  })



  const initializePlayers = players => {
    players.forEach((player, number) => {
      player.color = getColor({ number })
    })
    setPlayers(players)
  }


  function preloadImages(cards) {
    cards.forEach(({ image }) => {
      const img = new Image()
      img.src = `${DEPOT}${image}`
    })
    
    setCards(cards)
  }


  const startGame = () => {
    if (activity.players) {
      initializePlayers(activity.players)
    }
    preloadImages(activity.cards)
  }


  const gameUpdate = () => {
    const {
      cards,
      players=[],
      to_find,
      turn_over
    } = activity

    if (!players.length) { return }

    if (turn_over) {
      setFlippedCards([])
    }

    setCards(cards)
    setPlayers(players)
    setToFind(to_find)

    // Ensure only the current player can turn cards
    const myTurn = players[activity.player].user_name === user_name
    const custom = (myTurn)
      ? "all"
      : "none"

    document.documentElement.style.setProperty("--events", custom)

    // Keep checking connection if it's not myTurn
    const mode = myTurn ? "IDLE" : "EAGER"
    // applyState(mode)
  }


  // useEffect(registerListeners, [])
  useEffect(startGame, [activity.players])
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
      <div className="score">{score}</div>
      <div className={layoutClass}>{layout}</div>
    </div>
  )
}