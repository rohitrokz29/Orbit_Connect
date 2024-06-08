import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { SocketState } from './contexts/SocketContext.jsx'
import { UserState } from './contexts/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserState>
      <SocketState>
        <App />
      </SocketState>
    </UserState>
  </React.StrictMode>,
)
