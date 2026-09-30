/**
 * frontend/src/state/UserContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { ENVContext } from './ENVContext'


export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const { ORIGIN, WSS, DEPOT } = useContext(ENVContext)
  const [ hasConnected, setHasConnected ] = useState(false)
  const [ isConnected, setIsConnected ] = useState(false)
  const [ loggingIn, setLoggingIn ] = useState(false)
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)
  const [ ackCount, setAckCount ] = useState(0)
  const [ user_name, setUserName ] = useState("")
  const [ group, setGroup ] = useState("")
  const [ role, setRole ] = useState("student")
  const [ state, setState ] = useState("default")
  const [ json, setJSON ] = useState({})
  


  const socketOpen = () => {
    setIsConnected(true)  // may get set to false when reconnecting
    setHasConnected(true) // will always remain true now
  }

  const socketClose = () => {
    setIsConnected(false)
  }

  const socketLogging = (data) => {
    const loggedIn = data.status === "LOGGED_IN"
  
    if (loggedIn) {
      setUserName(data.user_name)
      setUserName(data.user_name)
      setGroup(data.group)
      setRole(data.role)

    } else {
      // setUserName("")
    }

    setIsLoggedIn(loggedIn)
  }

  const socketState = (state) => {
    setState(state)
  }

  const socketAlive = (alive) => {
    if (alive) {
      setAckCount(current => current + 1)
    }
  }

  const socketMessage = message => {
    // TODO: handle unsolicited incoming messages
    console.log("message:", message)
  }

  const socketError = data => {
    console.error(data)
  }

  const socketWarn = data => {
    console.warn(data)
  }

  const socketLog = data => {
    console.log(data)
  }

  const openSocket = () => {
    const on = WSS.on

    on("open", socketOpen)
    on("close", socketClose)
    on("logging", socketLogging)
    on("state", socketState)
    on("alive", socketAlive)
    // messages
    // on("pending", socketMessage) // to be resolved by caller
    on("incoming", socketMessage) // unsolicited messages
    // logging
    on("error", socketError)
    on("warn", socketWarn)
    on("info", socketLog)

    WSS.connect()
  }


  const applyState = state => {
    switch (state) {
      case "IDLE":
        WSS.beIdle()
        break
      case "EAGER":
        WSS.beEager()
        break
      default: return // ignore unknown states
    }
    // setState(state) will be emitted by WSS
  }


  useEffect(openSocket, [])


  return (
    <UserContext.Provider
      value ={{
        // https? access
        ORIGIN, // queries
        DEPOT,  // source of images
        // connection
        cpr: WSS.cpr,
        connect: WSS.connect,
        disconnect: WSS.disconnect,
        isConnected,
        hasConnected,
        // login status
        logIn: WSS.logIn,
        logOut: WSS.logOut,
        isLoggedIn,
        // messages
        sendMessage: WSS.send,

        state,
        applyState,

        loggingIn,
        setLoggingIn,
        ackCount,
        user_name,
        group,
        role,

        json,
        setJSON,

        // Only for Recorder
        on: WSS.on,
        events: WSS.events
      }}
    >
      {children}
    </UserContext.Provider>
  )
}


export default {
  label: "User",
  Context: UserContext,
  Provider: UserProvider
}
