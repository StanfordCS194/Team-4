//import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/app/App';
import registerServiceWorker from './js/registerServiceWorker';
import epiphany_canvas from './js/epiphany_canvas';
// import bootstrap from 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
epiphany_canvas();

//
const express = require('express')
const app = express()

app.use(express.static('public'))
app.listen(3000, () => console.log('Server running on port 3000'))