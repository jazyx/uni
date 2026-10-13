/**
 * frontend/src/pages/Trumps/Card.jsx
 */

import { useContext } from 'react'
import { WSContext } from '../../state'


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
    playing: player
  } = props


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

  return (
    <div
      className={className}
      onClick={chooseCard}
    >
      <h4>{name}</h4>
      <img src={`${DEPOT}${image}`} alt={name} />
      <ul>{statistics}</ul>
    </div>
  )
}