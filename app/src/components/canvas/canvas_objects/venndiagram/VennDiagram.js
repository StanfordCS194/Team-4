import React from 'react';
import { Circle, Group } from 'react-konva';
import Konva from 'konva';

class VennDiagram extends React.Component {
    constructor(props) {
        super(props);
        let loaded = this.props.isBeingLoaded;
        this.state = {
            className: 'vennDiagram',
            id: this.props.id,
            x: this.props.x,
            y: this.props.y,
            scale: this.props.scale,
            rotation: loaded ? this.props.rotation : 0,
            scaleX: loaded ? this.props.scaleX : this.props.scale,
            scaleY: loaded ? this.props.scaleY : this.props.scale,

        };
        this.group = React.createRef();
        this.textarea = React.createRef();
        this.getStateObj = this.getStateObj.bind(this);
    }

    getStateObj() {
        /**
         * Returns an object representing the current state of the VennDiagram component.
         * @return {object} state An object containing the current state of the VennDiagram component.
         */
        return this.state;
    }

    handleTransform(e) {
        /**
         * Updates the scale, rotation, and position of the VennDiagram after transforming.
         * @param {object} e An onTransform event object.
         */
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y,
        });
    }

    animateRaise() {
        /**
         * Animates VennDiagram with magnification to appear as
         * if it were being "lifted" from the board.
         */
        this.group.current.to({
            scaleX: 1.1 * this.state.scaleX,
            scaleY: 1.1 * this.state.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    animateDrop() {
        /**
         * Animates VennDiagram by returning to normal size
         * to appear as if it were being "placed" on the board.
         */
        this.group.current.to({
            scaleX: this.state.scaleX / 1.1,
            scaleY: this.state.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    onMouseOver() {
        /**
         * Adds cursor styling to pointer on hover and animates
         * VennDiagram if it is a button.
         */
        document.body.style.cursor = 'pointer';
        if (this.props.isButton) {
            this.animateRaise();
        }
    }

    onMouseOut() {
        /**
         * Adds cursor styling to default when not hovered over
         * and animates VennDiagram if it is a button.
         */
        document.body.style.cursor = 'default';
        if (this.props.isButton) {
            this.animateDrop();
        }
    }

    onDragStart(e) {
        /**
         * Animates VennDiagram to "lift" from board on drag start.
         * @param: {object} e An onDragStart event object.
         */
        this.animateRaise();
        e.target.moveToBottom();
    }

    onDragEnd(e) {
        /**
         * Animates VennDiagram to "place" on board on drag end.
         * @param: {object} e An onDragEnd event object.
         */
        this.animateDrop();
        this.setState({
            x: e.target.x(),
            y: e.target.y()
        });
    }

    componentDidMount() {
        /**
         * Animates VennDiagram being "dropped" on board on creation.
         */
        if (!this.props.isBeingLoaded) this.animateDrop();
    }

    render() {
        const scale = this.props.scale;
        const fill = this.props.outlineColor;

        return (
            <Group
                ref={this.group}
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleY}
                draggable={this.props.draggable}
                id={this.props.id.toString()}
                x={this.state.x}
                y={this.state.y}
                onMouseOver={(e) => this.onMouseOver(e)}
                onMouseOut={(e) => this.onMouseOut(e)}
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onClick={this.props.onClick}
                onTransform={(e) => this.handleTransform(e)}
                rotation={this.state.rotation}
            >
                <Circle
                    radius={scale*210}
                    x={scale*90}
                    stroke={fill}
                    strokeWidth={5}
                />
                <Circle
                    radius={scale*210}
                    x={scale*-90}
                    stroke={fill}
                    strokeWidth={5}
                />
            </Group>
        );
    }
}

export default VennDiagram;