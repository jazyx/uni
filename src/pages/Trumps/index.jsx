/**
 * frontend/src/pages/Trumps/index.js
 */


import { useState, useEffect, useContext } from 'react'
import {
  WSContext,
  ActivityContext
} from '../../state'
import { Score } from '../../components'
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
  if (activity.id !== "trumps") { return }

  const {
    // category,
    categories,
    substitutes,
    questions,
    question,
    answer,
    player,
    players,
    cards
  } = activity

  const playing = players[player]?.user_name === user_name
    ? player
    : false
  const cardOptions = { categories, substitutes, playing }

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


  function preloadImages() {
    const { cards } = activity
    if (!cards) { return }
    cards.forEach(({ image }) => {
      const img = new Image()
      img.src = `${DEPOT}${image}`
    })
  }


  useEffect(preloadImages, [cards])


  return (
    <div id="trumps">
      <Score />
      <div className="cards">
        {cardSet}
        <Spinner {...spinnerOptions} />
      </div>
    </div>
  )
}