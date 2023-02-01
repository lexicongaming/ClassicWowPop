import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import BackgroundVideo from './components/BackgroundVideo';

import './index.css';
import App from './App/App';

render(
  <BrowserRouter>
    <BackgroundVideo />
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
