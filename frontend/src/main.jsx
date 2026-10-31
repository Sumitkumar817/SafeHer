import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Add this import
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Add this opening tag */}
      <App />
    </BrowserRouter> {/* <-- Add this closing tag */}
  </React.StrictMode>,
)