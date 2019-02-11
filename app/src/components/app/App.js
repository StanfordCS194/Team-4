import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../toolbar/Toolbar';
import Canvas from '../canvas/Canvas';
import FloatingToolbar from '../floatingToolbar/FloatingToolbar'
import Sidebar from 'react-sidebar';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AccountIcon from '@material-ui/icons/AccountCircle';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true,
      user: {name: 'Marilu Bravo', img: '/anon.png'}
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  makeSideBarContent(user) {
    return (
      <Fragment>
        <div className="sidebarContent" id="user">
          <AccountIcon id="accountIcon"/>
          <a>{user.name}</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>My Boards</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Account Settings</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Logout</a>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <h3 style={{ textAlign: 'center' }}>epiphany</h3>
        <Sidebar
          sidebar={this.makeSideBarContent(this.state.user)}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white", textAlign: "center", padding: "10px", backgroundColor: "#3f51b5"} }}
        >
          <div id="handle" onMouseEnter={() => this.onSetSidebarOpen(true)}>
          >
          </div>
        </Sidebar>
        <div className="main">
        </div>
        <Toolbar />
      </Fragment>
    );
  }
}

export default App;
