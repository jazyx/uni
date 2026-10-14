/**
 * frontend/src/components/Score.jsx
 */


import { useState, useEffect, useContext } from 'react'
import { WSContext, ActivityContext } from '../state'
import { Settings } from './'
import { getColor, toneColor } from '../utilities/colors'
import '../css/settings.css'


export default function Score({ gameOver, allowPeek }) {
  const {
    user_name,
    role
  } = useContext(WSContext)
  const { activity } = useContext(ActivityContext)
  const [ settings, setSettings ] = useState("")
  const [ players, setPlayers ] = useState([])



  const initializePlayers = () => {
    if (!activity || !activity.players) { return }

    activity.players.forEach((player, number) => {
      player.color = getColor({ number, l:0.5, })
    })
    setPlayers(activity.players)
  }


  function showSettings({ target }) {
    const { name } = target.dataset
    if (settings === name) {
      return setSettings()
    }
    setSettings(name)
  }


  function playerCanPeek(name) {
    const playerData = players.find(({user_name}) => (
      user_name === name
    ))
    return !!(playerData && playerData.peek)
  }


  const getHighScore = () => {
    const scores = players.map(({score}) => score)
    return Math.max.apply(null, scores)
  }


  const score = players.map(({
    user_name: name,
    score,
    color,
    offline
  }, index) => {
    let highlight

    if (!gameOver){
      highlight = index === activity.player

    } else {
      const highScore = getHighScore()
      const data = getPlayerData(name)
      highlight = data.score === highScore
    }

    if (color && highlight) {
      color = `#${toneColor(color, 2.0)}`
    }

    let className = highlight
      ? `current${offline ? " offline" : ""}`
      : offline
        ? "offline"
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
          data-name={name}
        >
          {name}:
          <span>{score}</span>
        </p>

        { role === "teacher" &&
          <Settings
            user_name={name}
            className={settingsClass}
            close={setSettings}
            allowPeek={allowPeek}
            peek={name === user_name || playerCanPeek(name)}
          />
        }
      </div>
    )
  })


  useEffect(initializePlayers, [activity?.players])


  return <div className="score">{score}</div>
}