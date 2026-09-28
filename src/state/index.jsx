/**
 * frontend/src/state/index.jsx
 *
 * description
 */


import { ENVProvider, ENVContext } from './ENVContext'
import { UserProvider, UserContext } from'./UserContext'


const Provider = ({ children }) => {
  return (
    <ENVProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ENVProvider>
  )
}


export {
  Provider,
  ENVContext,
  UserContext
}