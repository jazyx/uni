/**
 * src/pages/Frame.jsx
 *
 * <Frame> is mounted by default. GameWrapper is always shown in
 * the Outlet slot. What GameWrapper displays depends on the
 * state of the WebSocket connection and being logged in.
 */

import { Outlet } from 'react-router-dom'
import Tabs from './Tabs'
import { Recorder } from '../components'
import '../css/frame.css'


export default function Frame() {
  return (
    <div id="frame">
      <div>
        <Tabs />
        <Outlet />
      </div>
      <Recorder />
    </div>
  )
}