/**
 * frontend/src/pages/GameWrapper.jsx
 *
 * This component is always shown in the Outlet slot. What it
 * displays will depend on:
 * + A successful connection to the WebSocket server, meaning that
 *   UserContext.hasConnected is true. If not, the Throbber will
 *   show.
 * + A successful login meaning that the server has echoed back a
 *   group, user_id, user_name and role. If not, the LogIn page
 *   will show.
 *
 * FUTURE: will allow hosts to change the current activity
 * QUESTION: should this be distributed to Frame and Menu?
 */


import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../state/'
import Throbber from '../components/Throbber'
import LogIn from './LogIn'
import Memory from './Memory'
// import Carousel from './Carousel'



export default function GameWrapper() {
  const [ Activity, setActivity ] = useState(() => Throbber)

  const { hasConnected, user_name } = useContext(UserContext)


  const loadActivity = () => {
    if (!hasConnected) {
      setActivity(() => Throbber)
    } else if (!user_name) {
      setActivity(() => LogIn)
    } else {
      setActivity(() => Memory)
      // setActivity(() => Carousel)
    }
  }


  useEffect(loadActivity, [hasConnected, user_name])


  return (
    <div id="main">
      <Activity />
    </div>
  )
}