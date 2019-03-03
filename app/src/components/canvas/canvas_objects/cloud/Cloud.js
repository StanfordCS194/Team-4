import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Circle, Text, Group, Tween, Transformer, RegularPolygon } from 'react-konva';
import Konva from 'konva';
import Textarea from "../textarea/Textarea";

// Todo: Text within cloud (like sticky) support
class Cloud extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finalTextValue: '',
            textEditVisible: this.props.textEditVisible,
            textX: - this.props.width / 2.5,
            textY: - this.props.height / 3 + 175,
        }
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
        const fill = this.props.fill;
        return (
            <Group
                ref={this.group}
                scaleX={1.3} // bigger animation for big cloud
                scaleY={1.3}
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
                <Textarea
                    id={this.props.id}
                    textEditVisible={this.state.textEditVisible}
                    finalTextValue={this.state.finalTextValue}
                    width={this.props.width / 1.5}
                    height={this.props.height / 1.5}
                    fontSize={this.props.fontSize}
                    textareaX={this.props.x + this.state.textX}
                    textareaY={this.props.y + this.state.textY}
                    x={this.state.textX}
                    y={this.state.textY}
                />
            </Group>
        )
    }
}

export default Cloud;