/**
 * frontend/src/pages/Tabs.jsx
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../state/'
import { Connection, Options } from '../components/'



export default function Tabs() {
  const { sendMessage, group, user_name, role } = useContext(WSContext)
  const {
    activity,
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



  const options = (role === "teacher" && activity.options)
    ? <Options {...activity.options} />
    : null


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

      { options }

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