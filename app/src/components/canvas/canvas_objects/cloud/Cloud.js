import React from 'react';
import { Rect, Circle, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';
import Textarea from "../textarea/Textarea";

class Cloud extends React.Component {
    constructor(props) {
        super(props);
        let loaded = this.props.isBeingLoaded;
        this.state = {
            id: this.props.id,
            className: 'cloud',
            finalTextValue: loaded ? this.props.finalTextValue : '',
            textEditVisible: this.props.textEditVisible,
            textX: - this.props.width / 2.5,
            textY: - this.props.height / 3 + 175,
            scaleX: loaded ? this.props.scaleX : 1,
            scaleY: loaded ? this.props.scaleX : 1,
            width: this.props.width,
            height: this.props.height,
            x: this.props.x,
            y: this.props.y,
            fill: this.props.fill,
            scale: this.props.scale,
            fontSize: this.props.fontSize,
            rotation: loaded ? this.props.rotation : 0,

        };
        this.group = React.createRef();
        this.textarea = React.createRef();
        this.getStateObj = this.getStateObj.bind(this);
    }

    getStateObj() {
        let state = this.state;
        state.finalTextValue = this.textarea.current.getTextValue(); // need to get final text value which is a level deeper in textarea component
        return state;
    }

    handleTransform(e) {
        // Update the scaleX and scaleY of sticky after transforming
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            x: e.currentTarget.attrs.x,
            y: e.currentTarget.attrs.y
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
            scaleY: this.state.scaleX / 1.1,
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
        e.target.to({ // Todo just call animateRaise()
            scaleX: 1.1 * e.target.attrs.scaleX,
            scaleY: 1.1 * e.target.attrs.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });
        e.target.moveToTop();
        e.target.getStage().findOne('Transformer').moveToTop();
    }

    onDragEnd(e) {
        e.target.to({ // Todo just call animateDrop()
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
        if (!this.props.isBeingLoaded) this.animateDrop();
    }

    render() {
        const scale = this.state.scale;
        const fill = this.state.fill;
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
                    ref={this.textarea}
                    id={this.props.id}
                    textEditVisible={this.state.textEditVisible}
                    finalTextValue={this.state.finalTextValue}
                    width={this.state.width / 1.5}
                    height={this.state.height / 1.5}
                    fontSize={this.state.fontSize}
                    textareaX={this.state.x + this.state.textX}
                    textareaY={this.state.y + this.state.textY}
                    x={this.state.textX}
                    y={this.state.textY}
                />
            </Group>
        )
    }
}

export default Cloud;