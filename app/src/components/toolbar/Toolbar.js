import React, { Component, Fragment } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import './Toolbar.css';
import { Button } from 'react-native'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import ColorIcon from '@material-ui/icons/FormatColorFill';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['undo', 'save', 'delete'],
    };
  }

  createToolDivs() {
    return (
      <Fragment>
      <Fab 
        id={this.state.tools[0]} 
        color="primary" 
        className={this.state.tools[0]}
        onClick={() => console.log('Undo')}
        >
          <UndoIcon /></Fab>
      <Fab id={this.state.tools[1]} color="primary" className={this.state.tools[1]}>
          <SaveIcon /></Fab>
        <Fab id={this.state.tools[2]} color="primary" className={this.state.tools[2]}>
          <ColorIcon /></Fab>
      <Fab id={this.state.tools[2]} color="primary" className={this.state.tools[2]}>
          <DeleteIcon /></Fab>
      </Fragment>
    );
  }

  render() {
    return (
      <ButtonToolbar className="toolbar">
        {this.createToolDivs()}
      </ButtonToolbar>
    );
  }
}

export default Toolbar;
