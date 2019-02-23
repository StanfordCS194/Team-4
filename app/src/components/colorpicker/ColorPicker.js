import React, { Fragment } from 'react';
import { CirclePicker } from 'react-color';
import './ColorPicker.css';


class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(color, e) {
    this.props.onColorChange(color);
  }

  render() {
    if (this.props.openColorPicker) {
      return <CirclePicker
      className="colorPicker"
      onChangeComplete={this.handleChange}
      colors={['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865']}/>;
    }
    return null;
  }
}

export default ColorPicker;
