import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer, RegularPolygon } from 'react-konva';
import Konva from 'konva';

class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.group = React.createRef();
    }

    animateRaise() {
        this.group.current.to({
            scaleX: 1.1,
            scaleY: 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    animateDrop() {
        this.group.current.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
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
    };

    componentDidMount() {
        this.group.current.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    render() {
        const scale = this.props.scale;
        return (
            <Group
                ref={this.group}
                scaleX={1.1}
                scaleY={1.1}
                draggable={this.props.draggable}
                id={this.props.id.toString()}
                x={this.props.x}
                y={this.props.y}
                onMouseOver={(e) => this.onMouseOver(e)}
                onMouseOut={(e) => this.onMouseOut(e)}
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onClick={this.props.onClick}
                >
                <Rect
                    width={scale*300}
                    height={scale*20}
                    fill={'black'}
                    shadowColor={'black'}
                    />
                <RegularPolygon
                    width={scale*150}
                    height={scale*20}
                    radius={scale*50}
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