import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RainbowProvider from './rainbowkit/rainbow.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <RainbowProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </RainbowProvider>
)
