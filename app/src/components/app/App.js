import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../toolbar/Toolbar';

import Canvas from '../canvas/Canvas';
import Sidebar from 'react-sidebar';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import AccountIcon from '@material-ui/icons/AccountCircle';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      user: {name: 'Marilu Bravo', img: '/anon.png'},
      nextColor: '#fffdd0',
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  onColorChange(color) {
    this.setState({nextColor: color.hex})
  }

  makeSideBarContent(user) {
    return (
      <Fragment>
        <div className="sidebarContent" id="user">
          <h3><AccountIcon id="accountIcon"/><span id="userName">{user.name}</span></h3>
        </div>
        <div className="sidebarContent">
          <a href='#'>Save Board to PDF</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>My Boards</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Account Settings</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Log Out</a>
        </div>
      </Fragment>
    );
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    return (
      <Fragment>
        <Sidebar
          sidebar={this.makeSideBarContent(this.state.user)}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white", textAlign: "center", padding: "10px", backgroundColor: "#2EC4B6", zIndex: "2"} }}
          >
          <div id="handle" onMouseEnter={() => this.onSetSidebarOpen(true)}>
            <ArrowIcon id="arrowIcon" />
          </div>
        </Sidebar>
        <Toolbar
            onColorChange={this.onColorChange}
            nextColor={this.state.nextColor}
        />
        <Canvas
            nextColor={this.state.nextColor} />

        <div className="logo"><img src="/media/logo.png" id="logo" /></div>
      </Fragment>
    );
  }
}

export default App;
