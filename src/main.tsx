/// <reference types="vite/client" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './styles/win9x.css';

const base = import.meta.env.BASE_URL;
document.body.style.backgroundImage = `url(${base}assets/bliss.jpg)`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
