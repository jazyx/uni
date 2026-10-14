/**
 * frontend/src/components/Settings.jsx
 *
 * Allows the teacher to:
 *  + Remove a player
 *  + Pass the turn to the player
 *  + Allow the player to peek at names on the backs of the cards
 */


import { useContext } from 'react'
import { WSContext } from '../state'


export default function Settings(props) {
  const { user_name, allowPeek, peek, className, close } = props
  const { sendMessage, group } = useContext(WSContext)

  const removePlayer = () => {
    sendMessage({
      subject: "MEMORY.REMOVE_PLAYER",
      group,
      user_name
    })
    close()
  }

  const activatePlayer = () => {
    sendMessage({
      subject: "ACTIVATE_PLAYER",
      group,
      user_name
    })
    close()
  }

  const allowPeeking = () => {
    sendMessage({
      subject: "MEMORY.ALLOW_PEEKING",
      group,
      user_name,
      peek: !peek
    })
    close()
  }


  const peekTitle = peek
    ? "✅ Peek"
    : "❌ Peek"

  return (
    <div className={className}>
      <button
        onClick={removePlayer}
      >
        Remove
      </button>
      <button
        onClick={activatePlayer}
      >
        Activate
      </button>
      { allowPeek && (
        <button
          onClick={allowPeeking}
        >
          {peekTitle}
        </button>
      )}
    </div>
  )
}