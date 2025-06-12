import React from 'react';
import ReactDOM from 'react-dom/client';
import NewMainApp from './src/NewMainApp'; // Updated to use the new app

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <NewMainApp />
  </React.StrictMode>
);