import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer, RegularPolygon } from 'react-konva';
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
        return this.state;
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

    handleTransform(e) {
        // Update the scaleX and scaleY after transforming
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y
        });
    }

    // Add cursor styling
    onMouseOver(e) {
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
    };

    componentDidMount() {
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
                    height={20}
                    fill={'black'}
                    shadowColor={'black'}
                    />
                <RegularPolygon
                    width={150}
                    height={20}
                    radius={50}
                    y={scale*10}
                    fill={'black'}
                    shadowColor={'black'}
                    sides={3}
                    rotation={-90}
                />
            </Group>
        )
    }
}

export default Arrow;