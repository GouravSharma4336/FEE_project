import { StrictMode } from 'react';
// StrictMode: Development tool from React that checks for common bugs and deprecated methods

import { createRoot } from 'react-dom/client';
// createRoot: React 18 API that attaches and renders the React application inside the real DOM

import './index.css';
// Global CSS: Imports design tokens, typography, layout classes, and dark/light theme variables

import App from './App.jsx';
// App: Root component containing route definitions and navigation layout

// Mount the App component into the HTML div with id="root"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
