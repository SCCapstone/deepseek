import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = "819406474947-1q39kj7i1epls3b4g9ru2863eddf1c5f.apps.googleusercontent.com";
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
  </React.StrictMode>
);