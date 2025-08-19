import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { emailService } from './services/emailService'; // Import email service

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Initialize EmailJS
try {
  const initialized = emailService.initialize();
  if (!initialized) {
    console.error('Failed to initialize EmailJS. Please check your configuration.');
  }
} catch (error) {
  console.error('Error during EmailJS initialization:', error);
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
