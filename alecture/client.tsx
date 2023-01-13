import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './layouts/App';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
