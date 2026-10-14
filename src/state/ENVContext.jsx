/**
 * frontend/state/ENVContext.jsx
 * 
 * Reads from the .env file and provides the paths to the backend
 * for HTTPS? queries, WebSocket queries and fetching images.
 * WSS is an object exposing a number of API functions, like
 * connect(), send() and on("event", callback).
 */


import { createContext } from 'react'
import { createGameSocket } from '../utilities/GameSocket.js'


const BASE    = import.meta.env.BASE_URL
const LOCAL   = import.meta.env.VITE_LOCAL
const REMOTE  = import.meta.env.VITE_REMOTE
const PATH    = import.meta.env.VITE_PATH
const L_DEPOT = import.meta.env.VITE_LOCAL_DEPOT
const R_DEPOT = import.meta.env.VITE_REMOTE_DEPOT

const dev = /^localhost:517\d$/.test(
  window.location.host
)
 
// For HTTPS? queries
const ORIGIN = dev ? LOCAL : REMOTE
const DEPOT  = dev ? L_DEPOT : R_DEPOT

// For WebSocket connection
const WSS = createGameSocket({
  url: ORIGIN + PATH,
  path: "",
  logInDelay: dev ? 600000 /* while debugging */ : 10000
})
 

export const ENVContext = createContext()


export const ENVProvider = ({ children }) => {
  return (
    <ENVContext.Provider
      value ={{
        BASE,   // vite.config.js defineConfig > base
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