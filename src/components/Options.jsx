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
  const { hint, compare, categories } = activity
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


  const selectCategory = ({ target }) => {
    const { dataset, checked } = target
    const category = dataset.name
    const categoryData = categories?.find(([ , name ]) => (
      name === category
    ))

    // Ensure that there will be at least 2 categories
    const count = categories.reduce((count, category) => (
      count + category[2]
    ), 0)
    if (count - !checked < 2) {
      return
    }

    categoryData[2] = checked

    sendMessage({
      subject: "TRUMPS.SET_CATEGORIES",
      group,
      categories
    })
  }



  const useCategory = category => {
    return categories?.find(([ , name ]) => name === category)[2]
  }


  const createPane = () => {
    return (
      <div
        className="options-pane"
      >
        <div className="show">
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

        <div className="stats">
          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="weight"
              checked={useCategory("weight")}
            />
            <span>Weight</span>
          </label>
          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="size"
              checked={useCategory("size")}
            />
            <span>Size</span>
          </label>

          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="legs"
              checked={useCategory("legs")}
            />
            <span>Legs</span>
          </label>

          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="babies"
              checked={useCategory("babies")}
            />
            <span>Babies</span>
          </label>

          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="life"
              checked={useCategory("life")}
            />
            <span>Life</span>
          </label>

          <label>
            <input
              type="checkbox"
              onChange={selectCategory}
              data-name="intelligence"
              checked={useCategory("intelligence")}
            />
            <span>Intelligence</span>
          </label>

        </div>
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