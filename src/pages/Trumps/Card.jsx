/**
 * frontend/src/pages/Trumps/Card.jsx
 */

import { useContext } from 'react'
import { WSContext } from '../../state'


export default function Card(props) {
  const {
    DEPOT
  } = useContext(WSContext)
  const {
    name,
    image,
    categories,
    substitutes
  } = props


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


  return (
    <div
      className="trump-card"
    >
      <h4>{name}</h4>
      <img src={`${DEPOT}${image}`} alt={name} />
      <ul>{statistics}</ul>
    </div>
  )
}