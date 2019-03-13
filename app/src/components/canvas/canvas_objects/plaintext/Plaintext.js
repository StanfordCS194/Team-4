import React from 'react';
import Sticky from "../sticky/Sticky";

class Plaintext extends React.Component {
    constructor(props) {
        super(props);
        this.sticky = React.createRef();
        this.getStateObj = this.getStateObj.bind(this);
        this.state = {
            className: 'plaintext'
        }
    }

    getStateObj() {
        /**
         * Returns an object representing the current state of the Plaintext component.
         * @return {object} state An object containing the current state of the Plaintext component.
         */
        return this.sticky.current.getStateObj();
    }

    render() {
        return (
            <Sticky
                ref={this.sticky}
                id={this.props.id}
                scaleX={this.props.scaleX}
                scaleY={this.props.scaleY}
                x={this.props.x}
                y={this.props.y}
                stageX={this.props.stageX}
                stageY={this.props.stageY}
                nextColor={'rgba(0, 0, 0, 0)'}
                height={this.props.height}
                width={this.props.width}
                fontSize={this.props.fontSize}
                scale={1}
            />
        );
    }
}

export default Plaintext;