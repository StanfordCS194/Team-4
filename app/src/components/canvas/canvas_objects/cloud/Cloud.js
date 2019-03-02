import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Circle, Text, Group, Tween, Transformer, RegularPolygon } from 'react-konva';
import Konva from 'konva';

// Todo: Transformer support
// Todo: Text within cloud (like sticky) support
class Cloud extends React.Component {
    constructor(props) {
        super(props);
    }

    // Add cursor styling
    onMouseOver() {
        document.body.style.cursor = 'pointer';
    }
    onMouseOut() {
        document.body.style.cursor = 'default';
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

    render() {
        const scale = this.props.scale;
        const fill = this.props.fill;
        return (
            <Group
                draggable={this.props.draggable}
                id={this.props.id.toString()}
                x={this.props.x}
                y={this.props.y}
                onMouseOver={(e) => this.onMouseOver(e)}
                onMouseOut={(e) => this.onMouseOut(e)}
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                >
                <Circle
                    radius={scale*210}
                    fill={fill}
                    />
                <Circle
                    radius={scale*210}
                    y={scale*180}
                    x={scale*-180}
                    fill={fill}
                />
                <Circle
                    radius={scale*150}
                    y={scale*240}
                    x={scale*180}
                    fill={fill}
                />
                <Rect
                    width={scale*360}
                    height={scale*240}
                    y={scale*150}
                    x={scale*-180}
                    fill={fill}
                />
            </Group>
        )
    }
}

export default Cloud;