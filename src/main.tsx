import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <NotificationProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </NotificationProvider>
  </ThemeProvider>
)
