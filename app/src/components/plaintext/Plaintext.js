import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from './Portal';
import {Text, Group} from 'react-konva';
import Konva from 'konva';

class Plaintext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingStickyText: true,
      dragable: true,
      stickyTextHeight: 250,
      stickyTextWidth: 250,
      position: {
        x: this.props.x - 125,
        y: this.props.y,
      },
      textValue: 'hi there',
      textEditVisible: false,
      textX: 0,
      textY: 0,
    }
  }

  // Sticky 'raises' when dragged
  dragStart(e) {

  }

  dragEnd(e) {

  }

  handleTextEdit(e) {
    this.setState({
      textValue: e.target.value
    });
  }

  handleTextareaKeyDown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.setState({
        textEditVisible: false
      });
    }
  }

  handleTextDblClick(e) {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      textEditVisible: true,
      textX: absPos.x,
      textY: absPos.y
    });
    let textarea = document.getElementById(this.props.id.toString());
    textarea.focus();
  }

  render() {
    return (
      <Group
        draggable={this.state.dragable}
        name={"plaintextGroup"}
        id={this.props.id.toString()}
        scaleX={1}
        scaleY={1}
        x={this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125}
        y={this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10}
        rotation={this.state.rotation}
        dragStart={(e) => this.dragStart(e)}
        dragEnd={(e) => this.dragEnd(e)}
        onDblClick={(e) => this.handleTextDblClick(e)}
        onKeyPress={(e) => this.edit(e)}
        >
        <Text
          text={this.state.textValue}
          fontSize={35}
          fontFamily={'Klee'}
          fill={'#555'}
          width={this.state.stickyTextWidth}
          height={this.state.stickyTextHeight}
          padding={20}
          align={'center'}
          listening={true}
          scaleX={1}
          scaleY={1}
          />
        <Portal>
          <textarea
          id={this.props.id.toString()}
          value={this.state.textValue}
          style={{
            display: this.state.textEditVisible ? 'block' : 'none',
            position: 'absolute',
            top: this.state.textY + 'px',
            left: this.state.textX + 'px'
          }}
          onChange={(e) => this.handleTextEdit(e)}
          onKeyDown={(e) => this.handleTextareaKeyDown(e)}
        />
        </Portal>
      </Group>
    );
  }
}

export default Plaintext;
