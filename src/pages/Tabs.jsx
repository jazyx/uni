/**
 * frontend/src/pages/Tabs.jsx
 */


import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../state/'
import { Connection } from '../components/'



export default function Tabs() {
  const {
    sendMessage,
    user_name,
    role,
    json
  } = useContext(UserContext)
  const [ theme, setTheme ] = useState(json.theme || "")


  const selectTheme = ({ target }) => {
    setTheme(target.value)
  }


  const newGame = () => {
    const message = {
      subject: "NEW_GAME",
      theme
    }

    sendMessage(message)
  }


  const options = json.themes?.map(theme => (
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
    : <p>{json.game}</p>


  const setTopic = () => {
    if (json.theme) {
      setTheme(json.theme)
    }
  }


  useEffect(setTopic, [json])


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