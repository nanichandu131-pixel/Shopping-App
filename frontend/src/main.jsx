import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store/index.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-8 text-sm">Loading SmartPrice Compare...</div>}>
          <App />
        </Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
