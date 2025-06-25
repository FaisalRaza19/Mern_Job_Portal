import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { ContextApi } from './Context/context.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextApi>
        <App />
      </ContextApi>
    </BrowserRouter>
  </React.StrictMode>
)
