import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

import Sticky from '../sticky/Sticky';

class OpeningGreeting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.justOpenedApp) {
      return (
        <Text
          x={window.innerWidth / 2 - 250}
          y={window.innerHeight / 2 - 50}
          text={'Double click anywhere to start!'}
          fontSize={30}
          fontFamily={'Klee'}
          fill={'#555'}
          width={500}
          padding={20}
          align={'center'}
          >
        </Text>
      );
    }
    return null;
  }
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justOpenedApp: true,
      creatingSticky: false,
      editingStickyText: false,
      stageWidth: window.innerWidth,
      stageHeight: window.innerHeight,
      id: 0,
      stageX: 0,
      stageY: 0,
      scaleX: 1,
      KEY_CODE_ENTER: 13,
      KEY_CODE_DELETE_1: 46,
      KEY_CODE_DELETE_2: 8,
      stickyArray: [
        <Rect x={0}
        y={0}
        width={250}
        height={250}
        backgroundColor={'red'}/>],
      activeSticky: null,
    };
  }

  handleButtonClick(e) {
    console.log(e);
  }

  handleDblClick(e) {
    this.setState({ justOpenedApp: false });
    // So that we don't create a sticky when we're trying to edit a sticky
    if (e.target.nodeType === "Shape") {
      return;
    }

    // Add plain text
    if (window.event.metaKey) {
      this.createPlainText(e);
      return;
    }
    this.setState({id: this.state.id + 1});
    console.log('event', e.evt);
    let newSticky = (
      <Sticky
        id={this.state.id}
        scaleX={this.state.scaleX}
        x={e.evt.clientX}
        y={e.evt.clientY}
        stageX={this.state.stageX}
        stageY={this.state.stageY}
        />
      );
    this.setState({stickyArray: this.state.stickyArray.concat([newSticky])});
    console.log(this.state.stickyArray);
  }

  createPlainText(e) {

  }

  render() {
    console.log('RENDER', this.state);
    return (
      <Stage
        container={'container'}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={true}
        listening={true}
        scaleX={this.state.scaleX}
        x={this.state.stageX}
        y={this.state.stageY}
        onClick={(e) => this.handleButtonClick(e)}
        onDblClick={(e) => this.handleDblClick(e)}
        >
        <Layer>
          <OpeningGreeting
            justOpenedApp={this.state.justOpenedApp}
          />
          {this.state.stickyArray}
        </Layer>
      </Stage>
    );
  }
}
//
// import React, { Component } from 'react';
// import { render } from 'react-dom';
// import { Stage, Layer, Rect, Text } from 'react-konva';
// import Konva from 'konva';
//
// class ColoredRect extends React.Component {
//   state = {
//     color: 'green'
//   };
//   handleClick = () => {
//     this.setState({
//       color: Konva.Util.getRandomColor()
//     });
//   };
//   render() {
//     return (
//       <Rect
//         x={20}
//         y={20}
//         width={50}
//         height={50}
//         fill={this.state.color}
//         shadowBlur={5}
//         onClick={this.handleClick}
//       />
//     );
//   }
// }

export default Canvas;
