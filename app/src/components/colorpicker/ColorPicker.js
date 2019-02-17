import React, { Fragment } from 'react';
import { CirclePicker } from 'react-color';
import './ColorPicker.css';


class ColorPicker extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
  }


  render() {
    const isPickingColor = this.props.openColorPicker;
    let colorPicker;

    if (isPickingColor) {
      colorPicker = <CirclePicker className="colorPicker"/>
    } else {
      colorPicker = null;
    }
    

    return (
      <Fragment>
          {colorPicker}
      </Fragment>
    );
  }
}

export default ColorPicker;