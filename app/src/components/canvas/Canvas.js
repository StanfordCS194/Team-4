import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

import './Canvas.css';

import Sticky from './canvas_objects/sticky/NewSticky';
import Plaintext from './canvas_objects/plaintext/Plaintext';

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
        nextColor={this.props.nextColor}
        />
      );
    }
    this.setState({stickyArray: this.state.stickyArray.concat([newComponent])});
    this.setState({id: this.state.id + 1});
  }

  handleOnWheel(e) {
  // Handle zooming by mouse point and scrolling
    let oldScale = this.state.scaleX;

    const stage = e.target.getStage();

    let mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - this.state.stageX / oldScale,
      y: stage.getPointerPosition().y / oldScale - this.state.stageY / oldScale,
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

  onDragEnd(e) {
    if (e.target.nodeType != "Stage") { return; }
    this.setState({
        stageX: e.target.x(),
        stageY: e.target.y()
    })
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
        onDragEnd={(e) => this.onDragEnd(e)}
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
