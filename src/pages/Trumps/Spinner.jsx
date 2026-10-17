/**
 * frontend/src/pages/Trumps/Spinner.jsx
 */


import { useState, useRef, useEffect } from 'react'
const DURATION = 1000
const LINE_HEIGHT = 24
const RADEG = Math.PI / 180



function easeInOut(t) {
  return (1 - Math.cos(Math.PI * t)) / 2
}


export default function Spinner({ questions, question, answer }) {
  const STEP = 360 / questions.length
  const RADIUS = LINE_HEIGHT / Math.sin(STEP * RADEG)
  const diameter = parseInt(RADIUS * 2)
  // document.documentElement.style.setProperty(
  //   "--diameter", diameter
  // )
  const [ rotation, setRotation ] = useState(0)
  const rotateRef = useRef(0)
  const frameRef = useRef(null)

  function rotateTo() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    const start = rotateRef.current

    // Choose the next forward rotation that aligns this line.
    const offset = (360 - (question * STEP + start) % 360)
    const end = start + offset + 360
    const complete = end - start

    const startTime = performance.now()

    function animate(now) {
      const t = Math.min((now - startTime) / DURATION, 1)
      const angle = start + complete * easeInOut(t)

      rotateRef.current = angle
      setRotation(angle)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        // Exact final alignment; with no floating-point drift.
        const exact = end
        rotateRef.current = exact
        setRotation(exact)
        frameRef.current = null
      }
    }

    frameRef.current = requestAnimationFrame(animate)
  }


  const lines = questions.map((question, index) => {
    const transform = `rotateX(${index * STEP}deg)
                       translateZ(${RADIUS}px)`
    const style = { transform }

    return (
      <p
        key={index}
        className="question"
        style={style}
      >
        {question}
      </p>
    )
  })


  const drumStyle = {
    transform: `rotateX(${rotation}deg)`
  }


  useEffect(rotateTo, [question, answer])


  return (
    <div className="spinner">
      <div
        className="drum"
        style={drumStyle}
      >
        {lines}
      </div>
      <div className="blur-above"></div>
      <div className="blur-below"></div>
    </div>
  )
}