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
            textareaX: this.props.textareaX,
            textareaY: this.props.textareaY,
            fontSize: this.props.fontSize
        };
        this.getTextValue = this.getTextValue.bind(this);
        this.fontSize = this.props.fontSize;
    }

    getTextValue() {
        return this.state.finalTextValue;
    }

    getFontSize() {
        return this.state.fontSize;
    }

    handleTextEdit(e) {
      this.setState({
        textAreaValue: e.target.value
      });
    }

    // on pressing enter, exit text edit and reset font size so text fits in textarea
    handleTextareaKeyDown(e) {
        const KEY_CODE_ENTER = 13;
        if (e.keyCode === KEY_CODE_ENTER) {

            let textarea = document.getElementById(this.props.id);
            let fontSizeNum = this.props.fontSize;
            if (textarea.scrollHeight === this.props.height ) {
                textarea.style.fontSize = fontSizeNum + "px";
            }

            // When you have to start strolling, decrease font size and adjust line height until text fits
            while (textarea.scrollHeight > this.props.height) {
                fontSizeNum = Number(textarea.style.fontSize.replace("px", ""));
                fontSizeNum -= 1;
                textarea.style.fontSize = fontSizeNum + "px";

                // Adjust the line height when the difference between text box and text area is noticeable
                if (fontSizeNum < 33) {
                    textarea.style.lineHeight = '25pt'
                } else if (fontSizeNum > 50) {
                  textarea.style.lineHeight = '70pt'
                } else {
                    textarea.style.lineHeight = '35pt'
                }
            }
            this.setState({
                finalTextValue: e.target.value,
                textEditVisible: false,
                draggable: true,
                fontSize: fontSizeNum,
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
                          width: this.props.width,
                          height: this.props.height,
                          fontSize: this.state.fontSize,
                          lineHeight: this.props.fontSize > 50 ? '70pt' : '35pt',
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