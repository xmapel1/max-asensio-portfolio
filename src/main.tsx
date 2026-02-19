import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container missing in index.html')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
