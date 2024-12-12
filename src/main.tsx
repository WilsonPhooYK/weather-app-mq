import './global.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Weather from './app/weather/page';
import AppContextProvider from './context/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <Weather />
    </AppContextProvider>
  </StrictMode>,
)
