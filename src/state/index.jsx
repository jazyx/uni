/**
 * frontend/src/state/index.jsx
 *
 * description
 */


import { ENVProvider, ENVContext } from './ENVContext'
import { WSProvider, WSContext } from'./WSContext'
import {
  ActivityProvider,
  ActivityContext
} from'./ActivityContext'


const Provider = ({ children }) => {
  return (
    <ENVProvider>
      <WSProvider>
        <ActivityProvider>
          {children}
        </ActivityProvider>
      </WSProvider>
    </ENVProvider>
  )
}


export {
  Provider,
  ENVContext,
  WSContext,
  ActivityContext
}