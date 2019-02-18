import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

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

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865'],
    }
  }

  // Sticky 'raises' when dragged
  dragStart(e) {
    // e.target.to({
    //   scaleX: 1.1,
    //   scaleY: 1.1,
    //   easing: Konva.Easings.ElasticEaseOut,
    // });
    //
    // // make rect have shadow
    // let rect = e.target.find('Rect')[0];
    // rect.setAttrs({
    //   shadowOffsetX: 15,
    //   shadowOffsetY: 15,
    // });
    //
    // stickyGroup.moveToTop();
  }

  // Sticky comes back down when dropped
  dragEnd(e) {
    // stickyGroup.on('dragend', function (e) {
    //   e.target.to({
    //     scaleX: 1,
    //     scaleY: 1,
    //     easing: Konva.Easings.ElasticEaseOut,
    //   });
    //
    //   // remove shadow
    //   let rect = e.target.find('Rect')[0];
    //   rect.setAttrs({
    //     shadowOffsetX: 0,
    //     shadowOffsetY: 0,
    //   });
    //   layer.draw();
    // });
  }

  selectSticky(e) {

  }

  editText(e) {

  }



  render() {
    return (
      <Transformer
        keepRatio={true}
        anchorSize={10}
        borderStroke={'gray'}
        rotationSnaps={[0, 90, 180, 270]}
        >
        <Group
          draggable={true}
          name={"stickyGroup"}
          scaleX={1.1}
          scaleY={1.1}
          id={this.props.id.toString()}
          dragStart={(e) => this.dragStart(e)}
          dragEnd={(e) => this.dragEnd(e)}
          onClick={(e) => this.selectSticky(e)}
          onDblClick={(e) => this.editText(e)}
          >
          <Rect
            x={this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125}
            y={this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10}
            width={250}
            height={250}
            fill={this.state.colors[Math.floor(Math.random() * this.state.colors.length)]}
            shadowColor={'black'}
            rotation={Math.floor(Math.random() * (11) - 5)}
            >
            <Tween
              shadowOffsetX={15}
              shadowOffsetY={15}
              duration={0.5}
              scaleX={1.1}
              scaleY={1.1}
              easing={Konva.Easings.ElasticEaseOut}
              />
              <Tween
                duration={1}
                easing={Konva.Easings.ElasticEaseOut}
                scaleX={1}
                scaleY={1}
                shadowOffsetX={0}
                shadowOffsetY={0}
                />
            </Rect>
          <Text
            x={this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125}
            y={this.props.y / this.props.scaleX - this.props.scaleY / this.props.scaleX}
            text={''}
            fontSize={35}
            fontFamily={'Klee'}
            fill={'#555'}
            width={250}
            padding={20}
            align={'center'}
            listening={true}
            rotation={Math.floor(Math.random() * (11) - 5)}
            scaleX={1}
            scaleY={1}
            />
        </Group>
      </Transformer>
    );
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

    // Add plain text
    if (window.event.metaKey) {
      this.createPlainText(e);
      return;
    }

    this.state.id += 1;
    this.setState({ stickyArray: this.state.stickyArray + [
      <Sticky
        id={this.state.id}
        scaleX={this.state.scaleX}
        x={e.clientX}
        y={e.clientY}
        stageX={this.state.stageX}
        stageY={this.state.stageY}
        /> ]});

  }

  createPlainText(e) {

  }

  render() {
    console.log(this.state)
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
