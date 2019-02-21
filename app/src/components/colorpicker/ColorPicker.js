import React, { Fragment } from 'react';
import { CirclePicker } from 'react-color';
import './ColorPicker.css';


class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.openColorPicker) {
      return <CirclePicker className="colorPicker"/>;
    }
    return null;
  }
}

export default ColorPicker;
