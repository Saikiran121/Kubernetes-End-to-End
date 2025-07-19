import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // optional, create file or remove if you don't need it

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
