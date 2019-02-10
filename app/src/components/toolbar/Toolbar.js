import React, { Component, Fragment } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './Toolbar.css';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['undo', 'save', 'delete'],
    };
  }

  createToolDivs() {
    let tools = [];
    // for (let i = 0; i < this.state.tools.length; i++) {
    //   tools.push(<Button variant="primary" id={this.state.tools[i]} key={this.state.tools[i]}> {this.state.tools[i]} </Button>);
    // }
    tools.push(<Fab id={this.state.tools[0]} color="primary" className={this.state.tools[0]}>
        <UndoIcon /></Fab>);
    tools.push(<Fab id={this.state.tools[1]} color="primary" className={this.state.tools[1]}>
        <SaveIcon /></Fab>);  
    tools.push(<Fab id={this.state.tools[2]} color="primary" className={this.state.tools[2]}>
        <DeleteIcon /></Fab>);

    const res = (
      <div className="tools">{tools}</div>
    );
    return res;
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
