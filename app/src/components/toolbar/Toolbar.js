import React, {Component} from 'react';
import { ButtonToolbar} from 'react-bootstrap';
import './Toolbar.css';

import ColorPicker from '../colorpicker/ColorPicker';

import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tools: ['undo', 'save', 'delete', 'color'],
            openColorPicker: false,
            icons: [<UndoIcon key="undo"/>, <SaveIcon key="save"/>, <DeleteIcon key="delete"/>, null],
            onClicks: [this.props.undo, this.props.saveBoard, this.props.delete, this.nullFunction]
        };
    }

    nullFunction() {
        /**
         * For lack of a better way to deal with having no onClick function defined for the
         * color picker in createToolIcons
         */
        console.log("nullFunction does nothing");
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
                onClick={() => this.state.onClicks[i]()}
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

    // clicking anywhere should close the color picker
    handleClick = e => {
        if (e.target.id !== 'color' && e.target.id !== 'colorDot') {
            this.setState({openColorPicker: false});
        } else {
            this.setState({openColorPicker: !this.state.openColorPicker});
        }

        // if (e.target.id === 'undo') {
        //     this.props.undo();
        // }
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
