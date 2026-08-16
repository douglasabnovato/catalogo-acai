import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Certifique-se de que esta linha existe!
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)