/**
 * frontend/src/pages/GameWrapper.jsx
 *
 * This component is always shown in the Outlet slot. What it
 * displays will depend on:
 * + A successful connection to the WebSocket server, meaning that
 *   WSContext.hasConnected is true. If not, the Throbber will
 *   show.
 * + A successful login meaning that the server has echoed back a
 *   group, user_id, user_name and role. If not, the LogIn page
 *   will show.
 *
 * FUTURE: will allow hosts to change the current activity
 * QUESTION: should this be distributed to Frame and Menu?
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../state/'
import Throbber from '../components/Throbber'
import LogIn from './LogIn'
import activities from './'

console.log("activities:", activities)

export default function GameWrapper() {
  const [ Activity, setActivity ] = useState(() => Throbber)
  const {
    hasConnected,
    user_name
  } = useContext(WSContext)
  const {
    component
  } = useContext(ActivityContext)


  const loadActivity = () => {
    if (!hasConnected) {
      setActivity(() => Throbber)
    } else if (component) {
      setActivity(() => activities[component])
    } else {
      setActivity(() => LogIn)
    }
  }


  useEffect(loadActivity, [hasConnected, user_name, component])


  return (
    <div id="main">
      <Activity />
    </div>
  )
}