/**
 * frontend/src/pages/Trumps/index.js
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../../state'
import { getColor, toneColor } from '../../utilities/colors'
import Card from './Card'
import Spinner from './Spinner'
import './trumps.css'



export default function Trumps() {
  const {
    group,
    user_name,
    role,
    sendMessage,
    applyState,
    DEPOT
  } = useContext(WSContext)
  const { activity } = useContext(ActivityContext)
  const {
    category,
    categories,
    substitutes,
    questions
  } = activity
  const index = categories.indexOf(category) * 2 
              + (Math.random() < 0.5)
 
 
  const [ players, setPlayers ] = useState([])

  const options = { categories, substitutes }

  const cards = activity.dealt.map(card => (
    <Card 
      key={card.name}
      {...card}
      {...options}
    />
  ))


  return (
    <div id="trumps">
      {cards}
      <Spinner index={index} questions={questions} />
    </div>
  )
}