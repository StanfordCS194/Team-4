import React from 'react';
import {Rect, Group, RegularPolygon} from 'react-konva';
import Konva from 'konva';

class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.group = React.createRef();
        this.state = {
            id: this.props.id,
            className: 'arrow',
            x: this.props.x,
            y: this.props.y,
            scale: this.props.scale,
            scaleX: this.props.scaleX,
            scaleY: this.props.scaleY,
            rotation: this.props.rotation
        };
        this.getStateObj = this.getStateObj.bind(this);
    }

    getStateObj() {
        /**
         * Returns an object representing the current state of the Arrow component.
         * @return {object} state An object containing the current state of the Arrow component.
         */
        return this.state;
    }

    animateRaise() {
        /**
         * Animates Arrow with magnification to appear as
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
         * Animates Arrow by returning to normal size
         * to appear as if it were being "placed" on the board.
         */
        this.group.current.to({
            scaleX: this.state.scaleX / 1.1,
            scaleY: this.state.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    handleTransform(e) {
        /**
         * Updates the scale, rotation, and position of the Arrow after transforming.
         * @param {object} e An onTransform event object.
         */
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y
        });
    }

    onMouseOver() {
        /**
         * Adds cursor styling to pointer on hover and animates
         * Arrow if it is a button.
         */
        document.body.style.cursor = 'pointer';
        if (this.props.isButton) {
            this.animateRaise();
        }
    }

    onMouseOut() {
        /**
         * Adds cursor styling to default when not hovered over
         * and animates Arrow if it is a button.
         */
        document.body.style.cursor = 'default';
        if (this.props.isButton) {
            this.animateDrop();
        }
    }

    // Raising and lowering animations
    onDragStart(e) {
        /**
         * Animates Arrow to "lift" from board on drag start.
         * @param: {object} e An onDragStart event object.
         */
        this.animateRaise();
        e.target.moveToTop();
    }

    onDragEnd(e) {
        /**
         * Animates Arrow to "place" on board on drag end.
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
         * Animates Arrow being "dropped" on board on creation.
         */
        if (this.props.isBeingLoaded) return;
        this.animateDrop();
    }

    render() {
        const scale = this.state.scale;
        return (
            <Group
                ref={this.group}
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleY}
                draggable={this.props.draggable}
                id={this.props.id.toString()}
                x={this.state.x}
                y={this.state.y}
                rotation={this.state.rotation}
                onTransform={(e) => this.handleTransform(e)}
                onMouseOver={(e) => this.onMouseOver(e)}
                onMouseOut={(e) => this.onMouseOut(e)}
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onClick={this.props.onClick}
            >
                <Rect
                    width={300}
                    height={scale*120}
                    opacity={0}
                    y={scale*-50}
                />
                <Rect
                    width={300}
                    height={20}
                    fill={'black'}
                    shadowColor={'black'}
                />
                <RegularPolygon
                    width={150}
                    height={20}
                    radius={50}
                    y={scale * 10}
                    fill={'black'}
                    shadowColor={'black'}
                    sides={3}
                    rotation={-90}
                />
            </Group>
        );
    }
}

export default Arrow;