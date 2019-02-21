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
      editingShape: false,
      stageWidth: window.innerWidth,
      stageHeight: window.innerHeight,
      id: 0,
      stageX: 0,
      stageY: 0,
      scaleX: 1,
      scaleY: 1,
      scaleBy: 1.05,
      stickyArray: [],
      activeSticky: null,
    };
  }

  handleClick(e) {
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
    this.setState({id: this.state.id + 1});
  }

  handleOnWheel(e) {
    let oldScale = this.state.scaleX;

    let mousePointTo = {
      x: this.state.stageX / oldScale - this.state.stageX / oldScale,
      y: this.state.stageY / oldScale - this.state.stageY / oldScale,
    };

    let stageDimensions = {
      x: window.innerWidth * this.state.scaleX,
      y: window.innerHeight * this.state.scaleX,
    }

    let newScale =
      e.evt.deltaY > 0 ?
      oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;

    this.setState({
      scaleX: newScale,
      scaleY: newScale,
      stageX:
        -(mousePointTo.x - e.evt.x / newScale) *
        newScale,
      stageY:
        -(mousePointTo.y - e.evt.y / newScale) *
        newScale
    });
  }

  render() {
    return (
      <Stage
        container={'container'}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={true}
        listening={true}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
        x={this.state.stageX}
        y={this.state.stageY}
        onClick={(e) => this.handleClick(e)}
        onDblClick={(e) => this.handleDblClick(e)}
        onWheel={(e) => this.handleOnWheel(e)}
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

export default Canvas;
