/**
 * frontend/src/pages/Trumps/index.js
 */


import { useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../../state'
import { Score } from '../../components'
import Card from './Card'
import Spinner from './Spinner'
import './trumps.css'



export default function Trumps() {
  const { activity } = useContext(ActivityContext)
  if (activity.id !== "trumps") { return }

  const {
    // group,
    user_name,
    // role,
    // sendMessage,
    applyState,
    // DEPOT
  } = useContext(WSContext)


  const {
    // category,
    categories,
    substitutes,
    questions,
    question,
    answer,
    player,
    players,
    // cards
  } = activity

  const playing = players[player]?.user_name === user_name
    ? player
    : false
  const cardOptions = {
    categories,
    substitutes,
    playing
  }

  // Keep checking connection if it's not myTurn
  const mode = playing === false ? "EAGER" : "IDLE"
  applyState(mode)


  const cardSet = activity.dealt.map((card, index) => (
    <Card
      key={card.name}
      correct={answer === index}
      {...card}
      {...cardOptions}
    />
  ))


  const spinnerOptions = {
    question,
    answer,
    questions
  }


  return (
    <div id="trumps">
      <Score />  {/* allowPeek={false} */}
      <div className="cards">
        {cardSet}
        <Spinner {...spinnerOptions} />
      </div>
    </div>
  )
}