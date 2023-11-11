import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
    domain="hvazquez.auth0.com"
    clientId="6XPCQ4ZlyBLWc4MdctGtr7oN3BlOcfKs"
    authorizationParams={{
      redirect_uri: window.location.origin
      //redirect_uri: "https://127.0.0.1:5173/dashboard"
    }}
  >
    <App />
    </Auth0Provider>
  </React.StrictMode>,
)
