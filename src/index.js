import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StationProfileProvider } from '../src/context/stationContext';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <StationProfileProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StationProfileProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
