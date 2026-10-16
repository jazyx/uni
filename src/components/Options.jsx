/**
 * frontend/src/components/Options.jsx
 *
 * Used by Trumps activity. Allows the teacher to choose what hint
 * is given for finding the right statistic, and to toggle between
 * comparing 2 items (comparative) and comparing 3 (superlatives).
 *
 * Messages are sent directly to the backend to force a
 * GROUP.UPDATE incoming message.
 */


import { useState, useContext } from 'react'
import { WSContext, ActivityContext } from '../state'


export default function Options(props) {
  const { sendMessage, group } = useContext(WSContext)
  const { activity } = useContext(ActivityContext)
  const { hint, compare } = activity
  const [ pressed, setPressed ] = useState(false)


  const togglePressed = event => {
    const isPressed = event ? !pressed : false
    setPressed(isPressed)

    if (isPressed) {
      // Ensure that any click outside the options will close them
      document.body.onmouseup = closeOptions
    }
  }


  const closeOptions = ({ target }) => {
    if (target.closest(".options-pane")) { return }

    document.body.onmouseup = null
    togglePressed()
  }


  const updateHint = ({ target }) => {
    const { id: hint } = target
    sendMessage({
      subject: "TRUMPS.SET_HINT",
      group,
      hint
    })
  }



  const selectTrio = ({target}) => {
    const { checked } = target
    const compare = 2 + checked

    sendMessage({
      subject: "TRUMPS.SET_COMPARE",
      group,
      compare
    })
  }


  const createPane = () => {
    return (
      <div
        className="options-pane"
      >
        <div className="hints">
          <label>
            <input
              type="radio"
              name="hint"
              id="hilite"
              checked={hint==="hilite"}
              onChange={updateHint}
            />
            <span>hilite</span>
          </label>
          <label>
            <input
              type="radio"
              name="hint"
              id="hover"
              checked={hint==="hover"}
              onChange={updateHint}
            />
            <span>hover</span>
          </label>
          <label>
            <input
              type="radio"
              name="hint"
              id="none"
              checked={hint==="none"}
              onChange={updateHint}
            />
            <span>none</span>
          </label>
          <label>
            <input
              type="radio"
              name="hint"
              id="blur"
              checked={hint==="blur"}
              onChange={updateHint}
            />
            <span>blur</span>
          </label>
        </div>

        <label className="trio">
          <input
            type="checkbox"
            onChange={selectTrio}
            checked={compare===3}
          />
          <span>Trio</span>
        </label>
      </div>
    )
  }


  const className = (pressed)
    ? "pressed"
    : null


  const pane = (pressed)
    ? createPane()
    : null



  return (
    <div
      className="options"
    >
      <button
        className={className}
        onClick={togglePressed}
      >
        <span>≡</span>
      </button>
      {pane}
    </div>
  )
}