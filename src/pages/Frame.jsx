/**
 * src/pages/Frame.jsx
 *
 * <Frame> is mounted by default. GameWrapper is always shown in
 * the Outlet slot. What GameWrapper displays depends on the
 * state of the WebSocket connection and being logged in.
 */

import { useContext, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { UserContext } from '../state'
import Tabs from './Tabs'
import { Recorder } from '../components' // DEBUGGING ONLY
import { parsePath } from '../utilities/location'
import '../css/frame.css'


export default function Frame() {
  const { hasConnected, logIn } = useContext(UserContext)

  function checkClientStatus() {
    if (!hasConnected) { return }

    const { name, group } = parsePath() // from /uni/Name/group/*

    if (name) {
      logIn({ user_name: name, group })
      .then(response => {
        console.log("response:", response)
      })
    }
  }


  useEffect(checkClientStatus, [hasConnected])


  return (
    <div id="frame">
      <div>
        <Tabs />
        <Outlet />
      </div>

      <Recorder /> {/* DEBUGGING ONLY */}
    </div>
  )
}