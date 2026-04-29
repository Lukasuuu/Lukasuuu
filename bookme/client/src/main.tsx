import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[BookMe] SW registered:', reg.scope);
        // Check for updates on page load
        reg.update();
      })
      .catch((err) => console.warn('[BookMe] SW registration failed:', err));
  });
}
