import 'virtual:windi.css'
import 'virtual:windi-devtools'
import React from 'react'
import ReactDOM from 'react-dom'
import { Auth0Provider } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import './index.css'
import App from './App'

console.log(import.meta.env.VITE_AUTH0_DOMAIN)

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={import.meta.env.VITE_AUTH0_AUDIENCE}
    >
      <Router>
        <div className="dark">
        <App />
        </div>
      </Router>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
