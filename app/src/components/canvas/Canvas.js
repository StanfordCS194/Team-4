import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

import './Canvas.css';

import Sticky from './canvas_objects/sticky/Sticky';
import Plaintext from './canvas_objects/plaintext/Plaintext';
import TransformerComponent from './canvas_objects/transformercomponent/TransformerComponent';
import ImageComponent from './canvas_objects/image/image'
import Arrow from './canvas_objects/arrow/Arrow';
import Cloud from './canvas_objects/cloud/Cloud';


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
      this.stage = React.createRef();
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
          objectArray: [],
          activeSticky: null,
          selectedCanvasObjectId: '',
          imageSrc: ''
    };
      this.handleClick = this.handleClick.bind(this);
      this.downloadURI = this.downloadURI.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
  }

    componentWillMount() {
        // add event listener for clicks
        document.addEventListener('click', this.handleClick, false);
    }

    downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  // Todo: Find more elegant way to solve this problem. Hacky solution for now
  handleClick(e) {
      console.log(e);
      if (e.target.id === "saveToImageBtn") {
          let dataURL = this.stage.current.getStage().toDataURL({pixelRatio: 3}); // Todo: Dynamically change this number based on stage scale for optimal image quality
          console.log(dataURL);
          this.downloadURI(dataURL, 'stage.png'); // Todo: Dynamically name this image, maybe {Name of board} + {Date/Time printed}
      }
  }

  handleStageClick(e) {
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedCanvasObjectId: ''
      });
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      console.log('clicked transformer');
      return;
    }

    // find clicked sticky (group) by its id
    const id = e.target.parent.attrs.id;
    const sticky = this.state.objectArray.find(sticky => sticky.props.id.toString() === id);
    if (sticky) {
      this.setState({
        selectedCanvasObjectId: id
      });
    } else {
      this.setState({
        selectedCanvasObjectId: ''
      });
    }
  }

  handleMouseDown(e) {
    // Remove transformer if you drag another sticky
    // Only keep transformer if you click it directly
    if (e.target.getParent()) {
      const clickedOnTransformer =
          e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      } else {
        this.setState({
          selectedCanvasObjectId: ''
        });
      }
    }
  }

  handleDblClick(e) {
    // Removes greeting text when justOpenedApp
    if (e.target.nodeType === "Shape" && this.state.justOpenedApp === false) {
      return;
    }
    this.setState({ justOpenedApp: false});

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
        height={200}
        width={800}
        fontSize={80}
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
        height={250}
        width={250}
        fontSize={35}
      />
      );
    }
    this.setState({
      objectArray: this.state.objectArray.slice(0,this.state.id).concat([newComponent]),
      id: this.state.id + 1,
    });
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
    };

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
    });
  }

  undo() {
    if (this.state.id <= 0) { return; }
    this.setState({
      id: this.state.id - 1,
    });
  }

  addCloudToBoard() {
      let newComponent = (
          <Cloud
              id={this.state.id}
              draggable={true}
              x={this.stage.current.getStage().width()/2-20} // Todo: subtract half of cloud width
              y={this.stage.current.getStage().height()/2-90} // Todo: subtract half of cloud height
              fill={'#7EC0EE'}
              scale={1}
          />
      );
      this.setState({
          objectArray: this.state.objectArray.slice(0,this.state.id).concat([newComponent]),
          id: this.state.id + 1,
      });
  }

  addArrowToBoard() {
      let newComponent = (
          <Arrow
              id={this.state.id}
              draggable={true}
              x={this.stage.current.getStage().width()/2-150} // Todo: subtract half of arrow width
              y={this.stage.current.getStage().height()/2-40} // Todo: subtract half of arrow height
              scale={1}
          />
      );
      this.setState({
          objectArray: this.state.objectArray.slice(0,this.state.id).concat([newComponent]),
          id: this.state.id + 1,
      });
  }

  // handle keypresses
  handleKeyPress = (e) => {
    // if command-z, undo previously added object
    if (e.metaKey && e.keyCode === 90) {
      this.undo();
    } else if (e.keyCode === 73) {
      console.log('i!');
      this.setState({
        imageSrc: 'https://fcbk.su/_data/stickers/taz/taz_00.png'
      })
    }

    /* Todo: Creates arrow (cmd+a) or cloud (cmd+c)
       (dev purposes), probably want to create with double clicks,
        but couldn't figure out how to read for keys other than
        cmd when double-clicking.
        Change or get rid of this when we've found the cleaner solution
     */

    // Make arrow
    if (e.shiftKey && e.keyCode === 65) {
        this.addArrowToBoard();
    }

    // Make cloud
      if (e.shiftKey && e.keyCode === 67) {
        this.addCloudToBoard();
      }
  };

  // add document level keydown listeners
  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  render() {
    return (
      <Stage
          ref={this.stage}
        container={'container'}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={true}
        listening={true}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
        x={this.state.stageX}
        y={this.state.stageY}
        onMouseDown={(e) => this.handleMouseDown(e)}
        onClick={(e) => this.handleStageClick(e)}
        onDblClick={(e) => this.handleDblClick(e)}
        onWheel={(e) => this.handleOnWheel(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onKeyDown={(e) => this.handleKeyPress(e)}
        >
        <Layer>
          <ImageComponent
            src={this.state.imageSrc}/>

          <OpeningGreeting
            justOpenedApp={this.state.justOpenedApp}
          />
          <TransformerComponent
              selectedCanvasObjectId={this.state.selectedCanvasObjectId}
          />
          {this.state.objectArray.slice(0,this.state.id)}
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;