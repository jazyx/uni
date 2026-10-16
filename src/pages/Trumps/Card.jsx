/**
 * frontend/src/pages/Trumps/Card.jsx
 */

import { useState, useContext, useEffect } from 'react'
import { WSContext } from '../../state'
import { Throbber } from '../../components'


export default function Card(props) {
  const {
    sendMessage,
    group,
    DEPOT
  } = useContext(WSContext)
  const {
    name,
    image,
    categories,
    substitutes,
    question,
    correct,
    playing: player,
    hint
  } = props

  const [ picture, setPicture ] = useState(() => (
    <div className="img">
      <Throbber />
    </div>)
  )

  const answerLine = Math.floor(question / 2)


  const chooseCard = () => {
    if (player === false) { return }

    console.log("correct:", correct)
    sendMessage({
      subject: "TRUMPS.ANSWER",
      group,
      correct,
      player,
      image
    })
  }


  const statistics = categories.map((key, index) => {
    const value = props[key]
    const swap = substitutes[key]
    const className = (index === answerLine)
      ? (hint)
        ? hint // "hilite" | "hover"
        : null
      : null

    const spanClass = (hint === "blur")
      ? "blur"
      : null

    if (swap) {
      key = swap
    }
    return (
      <li
        key={key}
        className={className}
      >
        <span>{key}</span>
        <span className={spanClass}>
          {value}
        </span>
      </li>
    )
  })


  const className = (player === false)
    ? "trump-card"
    : "trump-card active"


  const loadPicture = () => {
    if (!image) { return }

    const src = `${DEPOT}${image}`

    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        setPicture(() => <img src={src}/>)
        resolve(src)
      }
      img.onerror = () => reject(`Image not found: ${src}`)
      img.src = src
    })
    .catch(error => console.error(error))
  }


  useEffect(loadPicture, [image])


  return (
    <div
      className={className}
      onClick={chooseCard}
    >
      <h4>{name}</h4>
      {picture}
      <ul>{statistics}</ul>
    </div>
  )
}