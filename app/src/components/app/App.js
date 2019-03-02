import React, { Component, Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import Toolbar from '../toolbar/Toolbar';
import Konva from 'konva';


import Canvas from '../canvas/Canvas';
import Sidebar from 'react-sidebar';
import { Stage, Layer, Rect } from 'react-konva';

import AddIcon from '@material-ui/icons/Add';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Arrow from "../canvas/canvas_objects/arrow/Arrow";
import Cloud from "../canvas/canvas_objects/cloud/Cloud";

class App extends Component {
  constructor(props) {
    super(props);
    this.rightSidebarStage = React.createRef();
    this.canvas = React.createRef();
    this.state = {
      sidebarOpen: false,
        rightSidebarOpen: false,
      user: {name: 'Marilu Bravo', img: '/anon.png'},
      nextColor: '#fffdd0',
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.onSetRightSidebarOpen = this.onSetRightSidebarOpen.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onUndo = this.onUndo.bind(this);
    this.onCloudButtonClicked = this.onCloudButtonClicked.bind(this);
    this.onArrowButtonClicked = this.onArrowButtonClicked.bind(this);
  }

  onColorChange(color) {
    this.setState({nextColor: color.hex})
  }

  onUndo() {
    this.canvas.current.undo();
  }

  onCloudButtonClicked() {
      this.canvas.current.addCloudToBoard();
  }

  onArrowButtonClicked() {
      this.canvas.current.addArrowToBoard();
  }

  onMouseOverRightSidebarElement(e) { // Todo: dis don work for custom elements
      document.body.style.cursor = 'pointer';
      e.target.to({
          scaleX: 1.1 * e.target.attrs.scaleX,
          scaleY: 1.1 * e.target.attrs.scaleY,
          easing: Konva.Easings.ElasticEaseOut,
      });
  }

  onMouseOutRightSidebarElement(e) { // Todo: dis one don work either
        document.body.style.cursor = 'pointer';
        console.log("hovering out of sidebar elem");
        console.log(e.target);
        e.target.to({
            scaleX: e.target.attrs.scaleX / 1.1,
            scaleY: e.target.attrs.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
  }

  makeSideBarContent(user) {
    return (
      <Fragment>
        <div className="sidebarContent" id="user">
          <h3><AccountIcon id="accountIcon"/><span id="userName">{user.name}</span></h3>
        </div>
        <div className="sidebarContent">
          <a href='#' id="saveToImageBtn">Save Board to Image</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>My Boards</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Account Settings</a>
        </div>
        <div className="sidebarContent">
          <a href='#'>Log Out</a>
        </div>
      </Fragment>
    );
  }

    makeRightSideBarContent(user) {
        return (
            <Fragment>
                <div className="sidebarContent" >
                    <Stage
                        width={350}
                        height={1000}
                        listening={true}
                        ref={this.rightSidebarStage}
                        >
                        <Layer>
                            <Rect // Todo: dynamically place these stickies to be in center of stage
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                x={30}
                                y={50}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                scaleX={1.0}
                                scaleY={1.0}
                            >
                            </Rect>
                            <Rect
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                scaleX={1.333}
                                scaleY={1.333}
                                x={110}
                                y={40}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}

                            >
                            </Rect>
                            <Rect
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                scaleX={1.7}
                                scaleY={1.7}
                                x={210}
                                y={30}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                            >
                            </Rect>
                            <Arrow
                                id={"sidebarArrow"}
                                draggable={false}
                                y={200}
                                x={75}
                                scale={0.75}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)} // TODO: Get this to work
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                onClick={this.onArrowButtonClicked}
                            />
                            <Cloud
                                scale={0.4}
                                id={"sidebarCloud"}
                                draggable={false}
                                x={180}
                                y={350}
                                fill={'white'}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)} // TODO: Get this to work
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                scaleX={0.4}
                                scaleY={0.4}
                                onClick={this.onCloudButtonClicked}
                            />
                        </Layer>
                    </Stage>
                </div>
            </Fragment>
        );
    }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  onSetRightSidebarOpen(open) {
    this.setState({ rightSidebarOpen: open });
  }

  render() {
    return (
      <Fragment>
        <Sidebar
          sidebar={this.makeSideBarContent(this.state.user)}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white", textAlign: "center", padding: "10px", backgroundColor: "#2EC4B6", zIndex: "2"} }}
          >
          <div id="handle" onMouseEnter={() => this.onSetSidebarOpen(true)}>
              <AccountIcon id="accountIconTab"/>
          </div>
        </Sidebar>
        <Toolbar
          onColorChange={this.onColorChange}
          nextColor={this.state.nextColor}
          undo={this.onUndo}
          />

          <Sidebar
              sidebar={this.makeRightSideBarContent(this.state.user)}
              open={this.state.rightSidebarOpen}
              onSetOpen={this.onSetRightSidebarOpen}
              styles={{ sidebar: { background: "white", textAlign: "center", padding: "10px", backgroundColor: "#2EC4B6", zIndex: "2"} }}
              pullRight={true}
              >
              <div id="rightHandle" onMouseEnter={() => this.onSetRightSidebarOpen(true)}>
                  <AddIcon id="addIcon" />
              </div>
          </Sidebar>
        <Canvas
          ref={this.canvas}
          nextColor={this.state.nextColor}
          />

        <div className="logo"><img src="/media/logo.png" id="logo" /></div>
      </Fragment>
    );
  }
}

export default App;
