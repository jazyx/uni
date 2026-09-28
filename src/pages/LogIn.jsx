/**
 * frontend/src/pages/LogIn.jsx
 */


import { useState, useRef, useEffect, useContext } from 'react'
import { UserContext } from '../state/'
import { Throbber } from '../components'


const FAILURE_STRING = "Login failed. Please try again."


export default function LogIn({ name }) {
  const {
    user_name,
    user_id,
    isConnected,
    logIn,
    loggingIn,
    setLoggingIn
  } = useContext(UserContext)

  const [ userName, setUserName ] = useState(name || user_name)
  const [ reason, setReason ] = useState("")


  const inputRef = useRef()


  const updateUserName = ({ target }) => {
    setUserName(target.value)
  }


  const login = event => {
    event.preventDefault()
    loginWith(userName)
  }


  const loginWith = userName => {
    const userData = {
      user_name: userName.trim()
    }

    setLoggingIn(true) // show Throbber
    setReason("")

    logIn(userData)
    // Replay will be treated in GameSocket and result will be
    // emitted to UserContext. Failure to login resolves with
    // response.status = "LOGIN_FAILED"
    .then(response => {
      console.log("response:", response)
      if (response.status !== "LOGGED_IN") {
        setReason(FAILURE_STRING)
      }
    })
    .catch(error => console.warn(error))
    .finally(() => setLoggingIn(false))
  }


  const autoLogIn = () => {
    if (name) {
      loginWith(name)
    }
  }


  useEffect(autoLogIn, [name])


  return (
    <div id="login">
      <h1>English Games</h1>

      <form>
        <span>Write your name:</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={userName}
          onChange={updateUserName}
        />
        <button
          disabled={!isConnected || !userName}
          onClick={login}
        >
          Let's Play!
        </button>
        <span className="feedback">{reason}</span>
      </form>
      { loggingIn && <Throbber /> }
    </div>
  )
}