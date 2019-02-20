import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

import Sticky from '../sticky/Sticky';
import Plaintext from '../plaintext/Plaintext';

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
      stickyArray: [],
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
    let newComponent = null;
    // Add plain text
    if (window.event.metaKey) {
      newComponent = (
      <Plaintext
        id={this.state.id}
        scaleX={this.state.scaleX}
        x={e.evt.clientX}
        y={e.evt.clientY}
        stageX={this.state.stageX}
        stageY={this.state.stageY}
        />
      );
    } else {
      newComponent = (
      <Sticky
        id={this.state.id}
        scaleX={this.state.scaleX}
        x={e.evt.clientX}
        y={e.evt.clientY}
        stageX={this.state.stageX}
        stageY={this.state.stageY}
        />
      );
    }
    this.setState({stickyArray: this.state.stickyArray.concat([newComponent])});
    // console.log(this.state.stickyArray);
    this.setState({id: this.state.id + 1});
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
