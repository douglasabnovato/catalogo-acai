import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Certifique-se de que esta linha existe!
import App from './App'
import { CODIGO_PORTFOLIO, deveMedir, loadMetrics } from './shared/lib/metrics'

if (deveMedir()) loadMetrics(import.meta.env.VITE_GOATCOUNTER_CODE || CODIGO_PORTFOLIO)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)