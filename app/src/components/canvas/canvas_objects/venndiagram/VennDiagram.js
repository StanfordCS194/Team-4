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
        return this.state;
    }

    handleTransform(e) {
        // Update the scaleX and scaleY after transforming
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y,
        });
    }

    animateRaise() {
        this.group.current.to({
            scaleX: 1.1 * this.state.scaleX,
            scaleY: 1.1 * this.state.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    animateDrop() {
        this.group.current.to({
            scaleX: this.state.scaleX / 1.1,
            scaleY: this.state.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    // Add cursor styling
    onMouseOver() {
        document.body.style.cursor = 'pointer';
        if (this.props.isButton) {
            this.animateRaise();
        }
    }

    onMouseOut() {
        document.body.style.cursor = 'default';
        if (this.props.isButton) {
            this.animateDrop();
        }
    }

    // Raising and lowering animations
    onDragStart(e) {
        e.target.to({
            scaleX: 1.1 * e.target.attrs.scaleX,
            scaleY: 1.1 * e.target.attrs.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });
        e.target.moveToTop();
        e.target.getStage().findOne('Transformer').moveToTop();
    }

    onDragEnd(e) {
        e.target.to({
            scaleX: e.target.attrs.scaleX / 1.1,
            scaleY: e.target.attrs.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        this.setState({
            x: e.target.x(),
            y: e.target.y()
        });
    }

    componentDidMount() {
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
        )
    }
}

export default VennDiagram;