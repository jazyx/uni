/**
 * frontend/src/pages/GameWrapper.jsx
 *
 * This component is always shown in the Outlet slot. What it
 * displays will depend on:
 * + A successful connection to the WebSocket server, meaning that
 *   UserContext.hasConnected is true. If not, the Throbber will
 *   show.
 * + A successful login meaning that the server has echoed back a
 *   user_name. If not, the LogIn page will show.
 */


import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { UserContext } from '../state/'
import Throbber from '../components/Throbber'
import LogIn from './LogIn'
import Memory from './Memory'
// import Carousel from './Carousel'

const NAME_REGEX = /\/\w+\/([^\/]+)/



export default function GameWrapper() {
  // HACK to set role = "teacher" if name param has format
  // someName—teacher
  const { name: label } = useParams() // "/:name"
  let match  = NAME_REGEX.exec(location.pathname)
  match = decodeURI((match && match[1]) || "")

  const [ Activity, setActivity ] = useState(() => Throbber)

  const {
    hasConnected,
    user_name,
    // setRole
  } = useContext(UserContext)
  // const { setRole } = useContext(GameContext)


  const params = (label || match || "").split("+")
  const [name, teacher] = params
  const role = teacher === "teacher" ? "teacher" : ""


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


  // const updateRole = () => {
  //   setRole(role)
  // }


  useEffect(loadActivity, [hasConnected, user_name])
  // useEffect(updateRole, [role])


  return (
    <div id="main">
      <Activity name={name} role={role}/>
    </div>
  )
}