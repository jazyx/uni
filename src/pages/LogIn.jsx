/**
 * frontend/src/pages/LogIn.jsx
 */


import { useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { WSContext } from '../state/'
import { Throbber } from '../components'


const FAILURE_STRING = "Login failed. Please try again."


export default function LogIn({ name }) {
  const {
    user_name,
    hasConnected,
    logIn,
    loggingIn,
    setLoggingIn
  } = useContext(WSContext)
  let { group: id } = useParams()
  if (!id) {
    id = "eng"
  }

  const [ group, setGroup ] = useState(id)
  const [ userName, setUserName ] = useState(name || user_name)
  const [ reason, setReason ] = useState("")


  const inputRef = useRef()


  const updateValue = ({ target }) => {
    switch (target.name) {
      case "userName": {
        return setUserName(target.value)
      }
      case "group": {
        return setGroup(target.value)
      }
    }
  }


  const login = event => {
    event.preventDefault()
    loginWith(userName)
  }


  const loginWith = userName => {
    const userData = {
      user_name: userName.trim(),
      group: group.trim()
    }

    setLoggingIn(true) // show Throbber
    setReason("")

    logIn(userData)
    // Replay will be treated in GameSocket and result will be
    // emitted to WSContext. Failure to login resolves with
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


  return (
    <div id="login">
      <h1>English Games</h1>

      <form>
        <span>Group name:</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          name="group"
          value={group}
          onChange={updateValue}
        />
        <span>Write your name:</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          name="userName"
          value={userName}
          onChange={updateValue}
        />
        <button
          disabled={!hasConnected || !userName || !group}
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