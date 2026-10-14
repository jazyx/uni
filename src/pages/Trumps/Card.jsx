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
    correct,
    playing: player,
  } = props
  const [ picture, setPicture ] = useState(() => (
    <div className="img">
      <Throbber />
    </div>)
  )



  const chooseCard = () => {
    if (player === false) { return }

    console.log("correct:", correct)
    sendMessage({
      subject: "TRUMPS.ANSWER",
      group,
      correct,
      player
    })
  }


  const statistics = categories.map(key => {
    const value = props[key]
    const swap = substitutes[key]
    if (swap) {
      key = swap
    }
    return (
      <li
        key={key}
      >
        <span>{key}</span><span>{value}</span>
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
      img.onerror =() => reject(image)
      img.src = src
    })
    // .then(
    //   setPicture(() => <img src={src}/>) // COMMENT OUT
    // )
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