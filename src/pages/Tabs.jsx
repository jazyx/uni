/**
 * frontend/src/pages/Tabs.jsx
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../state/'
import { Connection } from '../components/'



export default function Tabs() {
  const { sendMessage, group } = useContext(WSContext)
  const {
    activity
  } = useContext(ActivityContext)
  const [ theme, setTheme ] = useState(activity.theme || "")


  const selectTheme = ({ target }) => {
    setTheme(target.value)
  }


  const newGame = () => {
    const message = {
      group,
      subject: "NEW_GAME", // generic, no Activity namespace
      theme
    }

    sendMessage(message)
  }


  const options = activity.themes?.map(theme => (
    <option
      key={theme}
    >
      {theme}
    </option>
  ))


  const display = (true) // (role)
    ? <button
        onClick={newGame}
      >
        New Game
      </button>
    : <p>{activity.name.en}</p> // TODO: Localize


  const setTopic = () => {
    if (activity.theme) {
      setTheme(activity.theme)
    }
  }


  useEffect(setTopic, [activity])


  return (
    <div id="tabs">
      <select
        value={theme}
        onChange={selectTheme}
      >
        {options}
      </select>
      {display}
      <Connection />
    </div>
  )
}