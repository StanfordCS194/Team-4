import React from 'react';
import { Rect, Group, Text } from 'react-konva';
import Konva from 'konva';

class StickyButton extends React.Component {
    constructor(props) {
        super(props);
        this.group = React.createRef();
    }

    onMouseOver = () => {
        document.body.style.cursor = 'pointer';
        this.group.current.to({
            scaleX: 1.1,
            scaleY: 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    };

    onMouseOut = () => {
        document.body.style.cursor = 'default';
        this.group.current.to({
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    };

    render() {
        return (
            <Group
                ref={this.group}
                onClick={this.props.onClick}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                x={this.props.x}
                y={this.props.y}
            >
                <Rect
                   width={this.props.width}
                   height={this.props.width}
                   fill={'#fffdd0'}
                   stroke={this.props.stroke}
                   strokeWidth={3}
                />
                <Text
                   text={this.props.text}
                   fontFamily={"Klee"}
                   height={this.props.width}
                   x={this.props.width/2-8}
                   y={this.props.width/2-15}
                   fontSize={25}
                />
            </Group>
        );
    }
}

export default StickyButton;