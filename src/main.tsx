import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cairo/arabic-400.css'
import '@fontsource/cairo/arabic-700.css'
import '@fontsource/cairo/arabic-900.css'
import './index.css'
import App from './App'
import { GameProvider } from './lib/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode><GameProvider><App /></GameProvider></StrictMode>,
)
