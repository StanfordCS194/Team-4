//import React from 'react';
//import ReactDOM from 'react-dom';
//import './css/index.css';
//import App from './components/app/App';
//import registerServiceWorker from './js/registerServiceWorker';
//import epiphany_canvas from './js/epiphany_canvas';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';


const ReactDom = require('react-dom');
const registerServiceWorker = require ('./js/registerServiceWorker');
const epiphany_canvas = require ('./js/epiphany_canvas')
const App = require ('./components/app/App')

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
epiphany_canvas();


const express = require('express')
const app = express()

app.use(express.static('public'))
app.listen(3000, () => console.log('Server running on port 3000'))