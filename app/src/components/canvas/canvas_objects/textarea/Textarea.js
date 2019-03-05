import React, { Component } from 'react';
import {Tween, Transformer, Group, Text, Rect} from 'react-konva';
import Portal from "../portal/Portal";

class Textarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // finalTextValue: '',
            finalTextValue: this.props.finalTextValue,
            textAreaValue: '',
            textEditVisible: this.props.textEditVisible,
            textareaX: this.props.textareaX,
            textareaY: this.props.textareaY,
        };
        this.getTextValue = this.getTextValue.bind(this);
    }

    getTextValue() {
        return this.state.finalTextValue;
    }

    handleTextEdit(e) {
      this.setState({
        textAreaValue: e.target.value
      });
    }

    // on pressing enter, exit text edit
    handleTextareaKeyDown(e) {
        const KEY_CODE_ENTER = 13;
        if (e.keyCode === KEY_CODE_ENTER) {
            this.setState({
                finalTextValue: e.target.value,
                textEditVisible: false,
                draggable: true,
            });
        }
    }

    // On dbl click, set make text editor visible and focus on textedit
    handleTextDblClick(e) {
        const absPos = e.target.getAbsolutePosition();
        this.setState({
            finalTextValue: '', //hide the current sticky text
            textEditVisible: true,
            draggable: false,
            textareaX: absPos.x,
            textareaY: absPos.y,
        });
        let textarea = document.getElementById(this.props.id.toString());
        textarea.focus();
    }

    // On focus out/ blur of text area, leave editing mode
    handleBlur() {
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
                    fontSize={this.props.fontSize}
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
                      value={this.state.textAreaValue}
                      id={this.props.id.toString()}
                      style={{
                          display: this.state.textEditVisible ? 'block' : 'none',
                          position: 'absolute',
                          top: this.state.textareaY + 'px',
                          left: this.state.textareaX + 'px',
                          width: this.props.width,
                          height: this.props.height,
                          fontSize: this.props.fontSize,
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