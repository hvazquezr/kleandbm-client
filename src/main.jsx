import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import { SnackbarProvider } from 'notistack';
import App from './App.jsx'
import {appUrl, auth0Audience, auth0Domain, auth0ClientId} from './config/UrlConfig.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
    <Auth0Provider
    domain={auth0Domain}
    clientId={auth0ClientId}
    authorizationParams={{
      //redirect_uri: window.location.origin
      redirect_uri: `${appUrl}/dashboard`,
      audience:auth0Audience,
      //scope:"read:projects"
    }}
  >

      <SnackbarProvider maxSnack={4}>
        <App />
      </SnackbarProvider>
    </Auth0Provider>
)
