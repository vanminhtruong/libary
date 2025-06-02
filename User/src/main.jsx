import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { store } from './store'
import i18next from './i18n/config'
import App from './App.jsx'
import './index.css'  // Import Tailwind CSS
import './assets/styles/animations.css'  // Import custom animations
import "primereact/resources/themes/lara-light-indigo/theme.css";     // theme
import "primereact/resources/primereact.min.css";                     // core css
import "primeicons/primeicons.css";    

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
)
