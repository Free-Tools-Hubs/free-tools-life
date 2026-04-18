import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useToastStore } from './store/useToastStore'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// Check for private mode / storage availability
try {
  localStorage.setItem('test', '1');
  localStorage.removeItem('test');
} catch (e) {
  useToastStore.getState().addToast('Running in Private Mode? Your progress will NOT be saved after closing the tab.', 'error');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
