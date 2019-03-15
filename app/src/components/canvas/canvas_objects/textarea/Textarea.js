import React from 'react';
import { Group, Text } from 'react-konva';
import Portal from "../portal/Portal";

class Textarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finalTextValue: this.props.finalTextValue,
            textAreaValue: this.props.finalTextValue,
            textEditVisible: this.props.textEditVisible,
            textareaWidth: this.props.width * this.props.scale,
            textareaHeight: this.props.height * this.props.scale,
            textareaX: this.props.textareaX,
            textareaY: this.props.textareaY,
            fontSize: this.props.fontSize / this.props.scale,
            textareaFontSize: this.props.fontSize
        };
        this.getTextValue = this.getTextValue.bind(this);
        this.fontSize = this.props.fontSize;
    }

    getTextValue() {
        /**
         * Returns the current finalTextValue stored in the state.
         */
        return this.state.finalTextValue;
    }

    getFontSize() {
        /**
         * Returns the current fontSize stored in the state.
         */
        return this.state.fontSize;
    }

    handleTextEdit(e) {
        /**
         * Updates the state textAreaValue variable to hold the
         * new value after the current textarea has been changed.
         * @param: {object} e An onChange event object.
         */
      this.setState({
        textAreaValue: e.target.value
      });
    }

    handleTextareaKeyDown(e) {
        /**
         * On pressing enter, exits the textarea and resets the font
         * size so that overflow text fits within the Konva Text component.
         * @param {object} e An onKeyDown event object from the textarea.
         */
        const KEY_CODE_ENTER = 13;
        if (e.keyCode === KEY_CODE_ENTER) {

            let textarea = document.getElementById(this.props.id);
            let textareaFontSize = this.props.fontSize; // starting size in constructor
            if (textarea.scrollHeight === this.state.textareaHeight ) {
                textarea.style.fontSize = textareaFontSize + "px";
                textarea.style.lineHeight = textareaFontSize - 6 + 'pt';
            }
            // When you have to start strolling, decrease font size and adjust line height until text fits
            while (textarea.scrollHeight > this.state.textareaHeight) {
                textareaFontSize = Number(textarea.style.fontSize.replace("px", ""));
                textareaFontSize -= 1;
                textarea.style.fontSize = textareaFontSize + "px";
                textarea.style.lineHeight = textareaFontSize - 6 + 'pt';
            }
            this.setState({
                finalTextValue: e.target.value,
                textEditVisible: false,
                draggable: true,
                fontSize: textareaFontSize / this.props.scale,
                textareaFontSize: textareaFontSize,
            });
        }
    }

    handleTextDblClick(e) {
        /**
         * Sets textarea as visible and focuses on textarea for immediate editing
         * on double click.
         * @param: {object} e An onDblClick event object from the Konva Text component.
         */
        const absPos = e.target.getAbsolutePosition();
        this.setState({
            finalTextValue: '', //hide the current sticky text
            textEditVisible: true,
            draggable: false,
            textareaX: absPos.x,
            textareaY: absPos.y,
        });
        let textarea = document.getElementById(this.props.id.toString());
        textarea.style.top = absPos.y + 'px';
        textarea.style.left = absPos.x + 'px';
        textarea.focus();
    }

    handleBlur() {
        /**
         * Exits textarea and enables dragging when textarea is no longer in focus.
         */
        let textarea = document.getElementById(this.props.id.toString());
        this.setState({
            finalTextValue: textarea.value,
            textEditVisible: false,
            draggable: true,
        });
    }

    render() {
        return (
            <Group
                id={this.props.id.toString()}
                >
                <Text
                    text={this.state.finalTextValue}
                    fontSize={this.state.fontSize}
                    fontFamily={'Klee'}
                    fill={'#555'}
                    width={this.props.width}
                    height={this.props.height}
                    padding={20}
                    align={'center'}
                    listening={true}
                    scaleX={1}
                    scaleY={1}
                    onDblClick={(e) => this.handleTextDblClick(e)}
                    x={this.props.x}
                    y={this.props.y}
                />
                <Portal>
                  <textarea
                      className={'textarea'}
                      value={this.state.textAreaValue}
                      id={this.props.id.toString()}
                      placeholder={"Start typing!"}
                      style={{
                          display: this.state.textEditVisible ? 'block' : 'none',
                          position: 'absolute',
                          top: this.state.textareaY + 'px',
                          left: this.state.textareaX + 'px',
                          width: this.state.textareaWidth,
                          height: this.state.textareaHeight,
                          fontSize: this.state.textareaFontSize ,
                          lineHeight: this.props.fontSize - 6 + 'pt',
                      }}
                      onChange={(e) => this.handleTextEdit(e)}
                      onKeyDown={(e) => this.handleTextareaKeyDown(e)}
                      onBlur={() => this.handleBlur()}
                  />
                </Portal>
            </Group>
        );
    }
}
export default Textarea;