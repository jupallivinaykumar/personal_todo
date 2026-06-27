import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found.');
}

const missingFirebaseEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
].filter((key) => !import.meta.env[key]);

const renderConfigError = (message: string) => {
  rootElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: #020617; color: #e2e8f0; font-family: Arial, sans-serif; text-align: center;">
      <div style="max-width: 720px;">
        <h1 style="margin-bottom: 12px; font-size: 32px; color: #ffffff;">App configuration error</h1>
        <p style="margin-bottom: 10px; font-size: 18px;">${message}</p>
        <p style="margin: 0; color: #94a3b8;">Add the <code>VITE_FIREBASE_*</code> environment variables in Netlify Site settings, then redeploy.</p>
      </div>
    </div>
  `;
};

if (missingFirebaseEnvVars.length > 0) {
  renderConfigError(`Missing Firebase environment variables: ${missingFirebaseEnvVars.join(', ')}`);
} else {
  import('./App')
    .then(({ default: App }) => {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    })
    .catch((error) => {
      console.error('App startup failed:', error);
      renderConfigError('The app could not start because Firebase initialization failed.');
    });
}