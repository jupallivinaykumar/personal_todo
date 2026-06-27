import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('App startup failed:', error);
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: #020617; color: #e2e8f0; font-family: Arial, sans-serif; text-align: center;">
      <div style="max-width: 720px;">
        <h1 style="margin-bottom: 12px; font-size: 32px; color: #ffffff;">App configuration error</h1>
        <p style="margin-bottom: 10px; font-size: 18px;">The app could not start because required Firebase settings are missing.</p>
        <p style="margin: 0; color: #94a3b8;">If this is deployed on Netlify, add the <code>VITE_FIREBASE_*</code> environment variables in Site settings and redeploy.</p>
      </div>
    </div>
  `;
}