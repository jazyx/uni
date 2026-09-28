/**
 * frontend/src/components/Recorder/index.js
 */


import {
  useState,
  useEffect,
  useContext,
  useRef
} from 'react'
import { UserContext } from '../../state/'
import './recorder.css'
import custom from './customRecords.jsx'


const MAX_ENTRIES = -40


export default function Recorder() {
  const {
    on,
    events,
  } = useContext(UserContext)
  const [ visible, setVisible ] = useState(true)
  const [ cleared, setCleared ] = useState(0)
  const [ scrolledToEnd, setScrolledToEnd ] = useState(true)
  const [ history, setHistory ] = useState([])
  const listRef = useRef()
  // if (typeof eventHandler === "object") {
  //   eventHandler.handleEvent = handleEvent
  // }


  function toggleRecorder({ target }) {
    const { checked } = target

    setVisible(checked)

    // if (checked) {
    //   // Apply scroll status to open list
    //   list.scrollTop = scrollTop
    // }
  }


  function clearEvents() {
    history.push({ CLEARED: _timeWithMilliseconds() })
    setCleared(history.length)
  }


  function saveEvents() {
    const fileName = `JSON-${_timeWithMilliseconds()}.json`
    const json = JSON.stringify(history, null, 2)
    const type = 'text/plain;charset=utf-8'
    const blob = new Blob([json], { type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  // Registered listener

  function handleEvent(data, event) {
    const entry = {
      event,
      data,
      time: _timeWithMilliseconds()
    }
    setHistory(current => [...current, entry ])
  }


  // Private functions

  function _timeWithMilliseconds() {
    const time = new Date()
    let ms = time.getMilliseconds()
    ms = ms < 10 ? "00"+ms : ms < 100 ? "0"+ms : ms
    // Add random characters to reduce the risk of key clash
    const chunk = randomChunk()
    
    return `${time.toTimeString().slice(0, 8)}.${ms}${chunk}`
  }


  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  function randomChunk() {
    return "_"+Array.from({length: 3}).map(() => (
      chars[Math.floor(Math.random() * 36)]
    )).join("")
  }


  function setScrolledState() {
    const list = listRef.current
    if (!list) { return }

    const atEnd = list.scrollHeight
                - list.scrollTop
                - list.clientHeight
                < 8 // arbitrary

    setScrolledToEnd(atEnd)
  }


  const entries = (history || []).slice(cleared)
                         .slice(MAX_ENTRIES)
                         .map(entry => {
    const customFunction = custom[entry.event]

    const result = (customFunction) 
      ? customFunction(entry)
      : custom.simple(entry)
    
    return result
    // const {event, data, time} = entry
    // return (
    //   <details
    //     key={time}
    //   >
    //     <summary>
    //       {event}
    //     </summary>
    //     <pre>
    //       {JSON.stringify(data, null, 2)}
    //     </pre>
    //   </details>
    // )
  })


  function registerListeners() {
    events.forEach(event => (
      on(event, handleEvent)
    ))
  }


  function scrollToEnd() {
    if (listRef.current) {
      if (scrolledToEnd) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
    }
  }


  useEffect(registerListeners, [])
  useEffect(scrollToEnd, [history])


  return (
    <div id="recorder-ui">
      <div className="bar">
        <label className="toggle-recorder">
          <input
            type="checkbox"
            checked={visible}
            onChange={toggleRecorder}
            className="George"
          />
        </label>
        { visible && (<>
          <button
            onClick={clearEvents}
          >
            Clear
          </button>
          <button
            onClick={saveEvents}
          >
            Save
          </button>
        </>)}
      </div> 
      { visible && (
        <div
          className="list"
          ref={listRef}
          onScroll={setScrolledState}
        >
          {entries}
        </div>
      )}
    </div>
  )
}