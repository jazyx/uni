/**
 * frontend/src/components/Connection.jsx
 * 
 * Creates a green dot that gradually transitions to orange if 
 * there are no ACK signs of life from the socket. Each incoming
 * ACK message will increment ackCount, and force the dot to
 * remount (due to key={ackCount}).
 * 
 * A click on the dot will force the socket to issue a new PING
 * request, which should either result in a new incoming ACK or
 * in the socket being recreated. In either case, the dot should
 * be restored to its "I'm still active" green within a short time.
 */


import { useState, useEffect, useContext } from 'react'
import { WSContext } from '../state/'
import { Throbber } from './'



const DURATION = "30000ms" // equivalent to gameSocket.keepaliveMs



export default function Connection(props) {
  const {
    isConnected,
    isLoggedIn,
    ackCount,
    cpr
  } = useContext(WSContext)
  const [ fading, setFading ] = useState(false)
  

  const doCPR = () => {
    cpr()
  }


  const style = (isLoggedIn)
    ? (isConnected)
      ? (fading)
        ? { "backgroundColor": "#c60",
            transition: `background-color ${DURATION} linear` }
        : { "backgroundColor": "#090",
            transition: "none"
          }
      : { "backgroundColor": "#900" } // throbber also shows
    : { backgroundColor: "#888",
        pointerEvents: "none",
        cursor: "default"
      }


  const refreshConnection = () => {
    setFading(false) // shows green

    // Get the browser to paint the green div before starting the
    // transition, otherwise React will apply both not-fading and
    // fading styles during the same re-render.
    const id = requestAnimationFrame(() => setFading(true))

    // Cleanup
    return () => cancelAnimationFrame(id)
  }

  useEffect(refreshConnection, [ackCount])


  return (
    <div 
      key={ackCount} // forces recreation of style on rerender
      className="connection"
      onClick={doCPR}
      style={style}
    >
      { isLoggedIn && !isConnected && <Throbber /> }
    </div>
  )
}