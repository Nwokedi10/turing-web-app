import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseProvider } from './config/FirebaseConfig';
import { AuthProvider } from './providers/AuthProvider';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <FirebaseProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FirebaseProvider>
    </React.StrictMode>
  );

  reportWebVitals();
} else {
  console.error('Element with id "root" not found. Make sure your HTML has a <div id="root"></div> element.');
}
