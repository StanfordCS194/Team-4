import React, { Component, Fragment } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import './Toolbar.css';

import ColorPicker from '../colorpicker/ColorPicker';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import ColorFillIcon from '@material-ui/icons/FormatColorFill';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['undo', 'save', 'delete', 'color'],
      openColorPicker: false,
      icons: [<UndoIcon />, <SaveIcon />, <DeleteIcon />, <ColorFillIcon />]
    };
  }

  createToolIcons() {
    return (this.state.icons.map((icon, i) => {
      return <Fab
                  id={this.state.tools[i]}
                  key={this.state.tools[i]}
                  color="primary"
                  className="tools"
                  onClick={() => this.handleButtonClick(this.state.tools[i])}
                  >
                  {this.state.icons[i]}
              </Fab>
    }))
  }

  createToolDivs() {
    return (
      <Fragment>
          {this.createToolIcons()}
          <ColorPicker
            openColorPicker={this.state.openColorPicker}
            onColorChange={this.props.onColorChange}
          />
      </Fragment>
    );
  }

  handleButtonClick(id) {
    if (id === 'color') {
      this.setState({ openColorPicker: !this.state.openColorPicker })
    }
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
