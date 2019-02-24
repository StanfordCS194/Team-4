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
      icons: [<UndoIcon />, <SaveIcon />, <DeleteIcon />, null]
    };
  }

    componentWillMount() {
        // add event listener for clicks
        document.addEventListener('click', this.handleClick, false);
    }

  createToolIcons() {
    return (this.state.icons.map((icon, i) => {
      return <Fab
                  id={this.state.tools[i]}
                  key={this.state.tools[i]}
                  color="primary"
                  className="tools"
                  >
                  {this.state.icons[i]}
                  {this.state.tools[i] === 'color' &&
                    <ColorPicker
                        openColorPicker={this.state.openColorPicker}
                        onColorChange={this.props.onColorChange}
                    />
                  }
                  {this.state.tools[i] === 'color' &&
                  <span id="colorDot" style={{backgroundColor: this.props.nextColor}}/>}
              </Fab>

    }))
  }

  handleClick = e => {
      if (e.target.id !== 'color' && e.target.id !== 'colorDot') {
          this.setState({ openColorPicker: false });
      } else {
          this.setState({ openColorPicker: !this.state.openColorPicker });
      }
  };

  render() {
      return (
          <ButtonToolbar className="toolbar">
            {this.createToolIcons()}
          </ButtonToolbar>
    );
  }
}

export default Toolbar;
