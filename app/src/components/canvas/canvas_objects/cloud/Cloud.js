import React from 'react';
import { Rect, Circle, Group } from 'react-konva';
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
        /**
         * Returns an object representing the current state of the cloud component.
         * @return {object} state An object containing the current state of the Cloud component.
         */
        let state = this.state;
        state.finalTextValue = this.textarea.current.getTextValue(); // need to get final text value which is a level deeper in textarea component
        state.fontSize = this.textarea.current.getFontSize(); // need final font size
        return state;
    }

    handleTransform(e) {
        /**
         * Updates the scale, rotation, and position of the Cloud after transforming.
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

    animateRaise() {
        /**
         * Animates Cloud with magnification to appear as
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
         * Animates Cloud by returning to normal size
         * to appear as if it were being "placed" on the board.
         */
        this.group.current.to({
            scaleX: this.state.scaleX / 1.1,
            scaleY: this.state.scaleX / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    onMouseOver() {
        /**
         * Adds cursor styling to pointer on hover and animates
         * Cloud if it is a button.
         */
        document.body.style.cursor = 'pointer';
        if (this.props.isButton) {
            this.animateRaise();
        }
    }

    onMouseOut() {
        /**
         * Adds cursor styling to default when not hovered over
         * and animates Cloud if it is a button.
         */
        document.body.style.cursor = 'default';
        if (this.props.isButton) {
            this.animateDrop();
        }
    }

    onDragStart(e) {
        /**
         * Animates Cloud to "lift" from board on drag start.
         * @param: {object} e An onDragStart event object.
         */
        this.animateRaise();
        e.target.moveToTop();
    }

    onDragEnd(e) {
        /**
         * Animates Cloud to "place" on board on drag end.
         * @param: {object} e An onDragEnd event object.
         */
        this.animateDrop();
        this.setState({
            x: e.target.x(),
            y: e.target.y()
        });

        let textarea = document.getElementById(this.props.id);
        textarea.style.top = e.evt.clientY + 'px';
        textarea.style.left = e.evt.clientX + 'px';
    }

    componentDidMount() {
        /**
         * Focuses on Cloud textarea after mounting to enable immediate text editing on creation.
         */
        // Need setTimeout because getElementById must occur after render
        setTimeout(() => {
            let textarea = document.getElementById(this.props.id.toString());
            if (!this.props.isBeingLoaded) {
                this.animateDrop();
                textarea.focus();
            }
        });

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
        );
    }
}

export default Cloud;