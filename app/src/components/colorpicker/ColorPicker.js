import React, {Fragment} from 'react';
import {CirclePicker} from 'react-color';
import './ColorPicker.css';
import {Spring} from 'react-spring/renderprops'


class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(color, e) {
        this.props.onColorChange(color);
    }

    render() {
        return <Spring
            from={{circleSize: 0}}
            to={{circleSize: this.props.openColorPicker ? 45 : 0}}>

            {props => <CirclePicker
                className="colorPicker"
                onChangeComplete={this.handleChange}
                colors={['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865']}
                circleSize={props.circleSize}
                width={500}/>}
        </Spring>
    }
}

export default ColorPicker;
