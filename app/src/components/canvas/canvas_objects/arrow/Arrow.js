import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer, RegularPolygon } from 'react-konva';
import Konva from 'konva';


// Todo: Transformer support
class Arrow extends React.Component {
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
                onClick={this.props.onClick}
                >
                <Rect
                    width={this.props.scale*300}
                    height={this.props.scale*20}
                    fill={'black'}
                    shadowColor={'black'}
                    />
                <RegularPolygon
                    width={this.props.scale*150}
                    height={this.props.scale*20}
                    radius={this.props.scale*50}
                    y={this.props.scale*10}
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