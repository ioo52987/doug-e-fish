import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import reportWebVitals from './reportWebVitals.js';
import { HashRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /*<React.StrictMode>*/
    <HashRouter basename="/">
      <App />
    </HashRouter>
  /*</React.StrictMode>*/
);



// ********************************** SETUP AIRTABLE API DEFAULTS WITH AXIOS **********************************
//base endpoint to call with each request
axios.defaults.baseURL = 'https://api.airtable.com/v0/appZ344IY3438RjUG/';
//content type to send with all POST requests 
axios.defaults.headers.post['Content-Type'] = 'application/json';
//authenticate to the base with the API key 
axios.defaults.headers['Authorization'] = `Bearer ${process.env.REACT_APP_AIRTABLE_PERSONAL_ACCESS_TOKEN}`;



// If you want to start measuring performance in your app, pass a function
// to log results (example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
