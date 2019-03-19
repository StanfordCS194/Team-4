import React from 'react';
import { Rect, Group } from 'react-konva';
import Konva from 'konva';
import Textarea from "../textarea/Textarea";

class Sticky extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: 'sticky',
            id: this.props.id,
            scaleX: this.props.scaleX,
            scaleY: this.props.scaleY,
            height: this.props.height,
            width: this.props.width,
            fontSize: this.props.fontSize,
            scale: this.props.scale,
            color: this.props.nextColor,
            editingStickyText: false,
            draggable: true,
            position: {
                x: this.props.isBeingLoaded? this.props.x : this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - this.props.width / 2,
                y: this.props.isBeingLoaded? this.props.y : this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10,
            },
            rotation: this.props.isBeingLoaded? this.props.rotation : Math.floor(Math.random() * (11) - 5),
            textAreaValue: '',
            finalTextValue: this.props.finalTextValue,
            textEditVisible: !this.props.isBeingLoaded,
            textX: this.props.x - this.props.width / 2,
            textY: this.props.y,
        };
        this.sticky = React.createRef();
        this.textarea = React.createRef();
        this.getStateObj = this.getStateObj.bind(this);
    }

    getStateObj() {
        /**
         * Returns an object representing the current state of the Sticky component.
         * @return {object} state An object containing the current state of the Sticky component.
         */
        let state = this.state;
        state.finalTextValue = this.textarea.current.getTextValue(); // need to get final text value which is a level deeper in textarea component
        state.fontSize = this.textarea.current.getFontSize(); // need final font size
        return state;
    }

    handleTransform(e) {
        /**
         * Updates the scale, rotation, and position of the Sticky after transforming.
         * @param {object} e An onTransform event object.
         */
        this.setState({
            scaleX: e.currentTarget.attrs.scaleX,
            scaleY: e.currentTarget.attrs.scaleY,
            rotation: e.currentTarget.attrs.rotation,
            position: {
                x: e.currentTarget.attrs.x,
                y: e.currentTarget.attrs.y
            }
        });
    }

    componentDidMount() {
        /**
         * Focuses on Sticky textarea after mounting to enable immediate text editing on creation.
         */
        // Need setTimeout because getElementById must occur after render
        setTimeout(() => {
            let textarea = document.getElementById(this.props.id.toString());
            if (!this.props.isBeingLoaded) textarea.focus();
            this.sticky.current.to({
                scaleX: 1,
                scaleY: 1,
                easing: Konva.Easings.ElasticEaseOut,
            });
        });
    }

    onMouseOver(e) {
        /**
         * Styles the cursor to pointer when hovering over Sticky,
         * cmd + mouse over magnifies small stickies for readability.
         * @param {object} e An onMouseOver event object.
         */
        document.body.style.cursor = 'pointer';

        if (window.event.metaKey) {
            let stage = e.target.getStage();
            let maxStickyScale = 1;

            // If there is no need for magnification, return
            if (maxStickyScale / stage.attrs.scaleX < this.props.scale) {
                return;
            }

            // Magnify unreadable stickies to pre-set 'small' sticky size
            e.target.parent.parent.to({
                scaleX: maxStickyScale / stage.attrs.scaleX,
                scaleY: maxStickyScale / stage.attrs.scaleY,
                // easing: Konva.Easings.ElasticEaseOut,
                easing: Konva.Easings.Linear,
                duration: 0.2,
            });
            e.target.parent.parent.moveToTop();
        }
    }

    onMouseOut(e) {
        /**
         * Styles to cursor to default when not hovering over Sticky,
         * returns Sticky to original size after sticky magnification.
         * @type {string} e An onMouseOut event object.
         */
        document.body.style.cursor = 'default';

        // Return to original size after sticky magnification
        e.target.parent.parent.to({
            scaleX: this.props.scale,
            scaleY: this.props.scale,
            easing: Konva.Easings.Linear,
            duration: 0.2
        });
    }

    onDragStart(e) {
        /**
         * Animates Sticky with magnification and shadow to appear as
         * if it were being "lifted" from the board.
         * @param: {object} e An onDragStart event object.
         */
        e.target.to({
            scaleX: 1.1 * e.target.attrs.scaleX,
            scaleY: 1.1 * e.target.attrs.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });

        // make rect have shadow
        let rect = e.target.find('Rect')[0];
        rect.setAttrs({
            shadowOffsetX: 15,
            shadowOffsetY: 15,
        });
        e.target.moveToTop();

    }

    onDragEnd(e) {
        /**
         * Animates Sticky by returning to normal size and removing shadow
         * to appear as if it were being "placed" on the board. Also repositions
         * text area to appear at the new position after drag.
         * @param: {object} e An onDragEnd event object.
         */
        e.target.to({
            scaleX: e.target.attrs.scaleX / 1.1,
            scaleY: e.target.attrs.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        this.setState({
            position: {
                x: e.target.x(),
                y: e.target.y()
            },
        });

        // remove shadow
        let rect = e.target.find('Rect')[0];
        rect.setAttrs({
            shadowOffsetX: 0,
            shadowOffsetY: 0,
        });

        let textarea = document.getElementById(this.props.id);
        textarea.style.top = e.target.y() + 'px';
        textarea.style.left = e.target.x() + 'px';
    }

    render() {
        return (
            <Group
                draggable={this.state.draggable}
                name={this.props.id.toString()}
                id={this.props.id.toString()}
                x={this.state.position.x}
                y={this.state.position.y}
                rotation={this.state.rotation}
                onKeyPress={(e) => this.edit(e)}
                onTransform={(e) => this.handleTransform(e)}
                onMouseOver={(e) => this.onMouseOver(e)}
                onMouseOut={(e) => this.onMouseOut(e)}
                onDragStart={(e) => this.onDragStart(e)}
                onDragEnd={(e) => this.onDragEnd(e)}
                onDrop={(e) => this.onDrop(e)}
                scaleX={this.state.scale}
                scaleY={this.state.scale}
            >
                <Rect
                    ref={this.sticky}
                    width={this.props.width}
                    height={this.props.height}
                    fill={this.state.color}
                    shadowColor={'black'}
                    shadowBlur={0}
                    scaleX={1.1}
                    scaleY={1.1}
                />
                <Textarea
                    ref={this.textarea}
                    id={this.props.id}
                    textEditVisible={this.state.textEditVisible}
                    finalTextValue={this.state.finalTextValue}
                    width={this.props.width}
                    height={this.props.height}
                    fontSize={this.props.fontSize}
                    textareaX={this.state.textX}
                    textareaY={this.state.textY}
                    textX={this.state.position.x}
                    textY={this.state.position.y}
                    scale={this.props.scale}
                />
            </Group>
        );
    }
}

export default Sticky;
