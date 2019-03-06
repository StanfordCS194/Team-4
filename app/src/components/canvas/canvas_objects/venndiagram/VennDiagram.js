import React from 'react';
import { Circle, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';
import Textarea from "../textarea/Textarea";

// Todo: Text within cloud (like sticky) support
class VennDiagram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // textEditVisible: this.props.textEditVisible,
            // textX: 606 / 2,
            // textY: 426 / 2,
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
        const fill = this.props.outlineColor;
        const xOffset = 25;
        const yOffset = 426/5;
        const height = 426/1.75;
        const width = 606/4;

        return (
            <Group
                ref={this.group}
                scaleX={1.3}
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