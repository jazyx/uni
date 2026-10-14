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
    activity,
    // activities,
    activityNames,
    active
  } = useContext(ActivityContext)
  const [ theme, setTheme ] = useState(activity.theme || "")
  const [ activeName, setActiveName ] = useState(active)



  const selectActivity = ({ target }) => {
    const id = target.value
    setActiveName(id)

    const message = {
      group,
      subject: "GROUP.SET_ACTIVITY",
      active: id
    }

    sendMessage(message)
  }


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


  const activityOptions = activityNames.map(({ id, name}) => (
    <option
      key={id}
      value={id}
    >
      {name}
    </option>
  ))


  const themeOptions = activity.themes?.map(theme => (
    <option
      key={theme}
      value={theme}
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
    setActiveName(active)

    if (activity.theme) {
      setTheme(activity.theme)
    }
  }


  useEffect(setTopic, [activity, active])


  return (
    <div id="tabs">
      <select
        value={activeName}
        onChange={selectActivity}
      >
        {activityOptions}
      </select>

      { activity.themes && (
          <select
            value={theme}
            onChange={selectTheme}
          >
            {themeOptions}
          </select>
        )
      }
      {display}
      <Connection />
    </div>
  )
}