/**
 * frontend/state/ENVContext.jsx
 * 
 * Reads from the .env file and provides the paths to the backend
 * for HTTPS? queries, WebSocket queries and fetching images.
 * WSS is an object exposing a number of API functions, like
 * connect(), send() and on("event", callback).
 */


import { createContext } from 'react'
import { createGameSocket } from '../utilities/gameSocket.js'


const LOCAL  = import.meta.env.VITE_LOCAL
const REMOTE = import.meta.env.VITE_REMOTE
const PATH   = import.meta.env.VITE_PATH
const DEPOT  = import.meta.env.VITE_DEPOT

const dev = /^localhost:517\d$/.test(
  window.location.host
)

// For HTTPS? queries
const ORIGIN = dev ? LOCAL : REMOTE

// For WebSocket connection
const WSS = createGameSocket({
  url: ORIGIN + PATH,
  path: "",
  logInDelay: 600000 // while debugging
})
 

export const ENVContext = createContext()


export const ENVProvider = ({ children }) => {
  return (
    <ENVContext.Provider
      value ={{
        ORIGIN, // HTTPS? queries
        WSS,    // WebSocket queries
        DEPOT   // source of images
      }}
    >
      {children}
    </ENVContext.Provider>
  )
}


export default {
  label: "ENV",
  Context: ENVContext,
  Provider: ENVProvider
}