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
import ReactDOM from 'react-dom';


class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['undo', 'save', 'delete', 'color'],
      openColorPicker: false,
      icons: [<UndoIcon />, <SaveIcon />, <DeleteIcon />, null]
    };
  }
    // Todo: probably not the best way to make picker go away
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
                  onClick={(e) => this.handleButtonClick(this.state.tools[i], e)}
                  >
                  {this.state.icons[i]}
                  {this.state.tools[i] === 'color' &&
                    <ColorPicker
                        openColorPicker={this.state.openColorPicker}
                        onColorChange={this.props.onColorChange}
                    />
                  }
                  {this.state.tools[i] === 'color' &&
                  <span className="dot" style={{backgroundColor: this.props.nextColor}}/>}
              </Fab>

    }))
  }

  createToolDivs() {
    return (
      <Fragment>
          {this.createToolIcons()}
      </Fragment>
    );
  }

  handleButtonClick(id, e) {
    if (id === 'color') {
      this.setState({ openColorPicker: !this.state.openColorPicker });
    }
  }

  handleClick = e => {
      // Todo: doesn't go away when clicking other toolbar buttons
      if (!ReactDOM.findDOMNode(this).contains(e.target)) {
          this.setState({ openColorPicker: false });
      }
  };

  render() {
    return (
      <ButtonToolbar className="toolbar">
        {this.createToolDivs()}
      </ButtonToolbar>
    );
  }
}

export default Toolbar;
