/**
 * frontend/src/state/ActivityContext.jsx
 *
 * description
 */


import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'
import { WSContext } from './'


export const ActivityContext = createContext()


export const ActivityProvider = ({ children }) => {
  const { on, off } = useContext(WSContext)

  const [ members, setMembers ] = useState([])
  const [ activities, setActivities ] = useState([])
  const [ activityNames, setActivityNames ] = useState([])
  const [ active, setActive ] = useState("")
  const [ activity, setActivity ] = useState({})
  const [ component, setComponent ] = useState("")
  


  const pending = message => {
    if (message.status === "handled") {
      console.log("handled:", message)
      if (message.message) {
        message = message.message
      }

      switch (message.sender_id) {
        case "GROUP": {
          return treatGroupMessage(message)
        }
        // default: {
        //   return treatActivityMessage(message)
        // }
      }
    }
  }


  /**
   * Called when the server sends a message that was not explicitly
   * requested
   * @param {object} message should have a structure like {
   *          "sender_id": "SYSTEM | GROUP | <ACTIVITY>",
   *          "subject": "NAMESPACE.LABEL",
   *          "recipient_id": <current user_id>,
   *          ...more data
   *        }
   */
  const incoming = message => {
    console.log("incoming:", message)

    switch (message.sender_id) {
      case "GROUP": {
        return treatGroupMessage(message)
      }
      case "SYSTEM": {
        return // already handled
      }
      default: {
        return treatActivityMessage(message)
      }
    }
  }


  const treatGroupMessage = message => {
    switch (message.subject) {
      case "GROUP.ACTIVITY": {
        return treatNewActivity(message)
      }
      case "GROUP.UPDATE": {
        return treatActivityUpdate(message)
      }
      case "JOINING_GROUP": {
        return // 
      }
      case "LEAVING_GROUP": {
        return //
      }
    }
  }


  const treatNewActivity = message => {
    const { state } = message
    const { members, activities, active, activity } = state
    setMembers(members)
    adoptActivities(activities)
    setActive(active) // lowercase human-readable name
    setActivity(activity)
    setComponent(activity.component)
  }


  const adoptActivities = activities => {
    setActivities(activities)

    const names = activities.map(({ id, name }) => (
      { id, name: name.en } // TODO: use localized language
    ))
    setActivityNames(names)
  }  


  // const treatActivityMessage = message => {
  //   switch (message.subject) {
  //     case "GROUP.ACTIVITY": {

  //     }
  //   }
  // }


  const treatActivityUpdate = message => {
    console.log("ACTIVITY UPDATE:", message)

    setActivity(message.activity)
  }


  const registerListeners = () => {
    on("pending", pending)
    on("incoming", incoming)

    return () => {
      off("pending", pending)
      off("incoming", incoming)
    }
  }


  useEffect(registerListeners, [])
  

  return (
    <ActivityContext.Provider
      value ={{
        // members,
        activities,
        activityNames,
        active,
        activity,
        component
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}


export default {
  label: "Activity",
  Context: ActivityContext,
  Provider: ActivityProvider
}
