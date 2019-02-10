import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../toolbar/Toolbar';
import Canvas from '../canvas/Canvas';

class App extends Component {
  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>epiphany</h3>
        <div className="main">

        </div>
        <Toolbar />
      </Fragment>
    );
  }
}

export default App;
