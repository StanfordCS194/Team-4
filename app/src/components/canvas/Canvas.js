import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';

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
    };
  }
//   handleClick = () => {
//     this.setState({
//       color: Konva.Util.getRandomColor()
//     });
//   };
  render() {
    console.log(this.state)
    return (
      <Stage
        container={'container'}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={true}
        listening={true}
        >
        <Layer>
        {this.state.justOpenedApp?
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
        </Text>: <div />}
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
