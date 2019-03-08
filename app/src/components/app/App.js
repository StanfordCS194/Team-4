import React, {Component, Fragment} from 'react';
import './App.css';
import Toolbar from '../toolbar/Toolbar';
import Konva from 'konva';


import Canvas from '../canvas/Canvas';
import Sidebar from 'react-sidebar';
import {Stage, Layer, Rect} from 'react-konva';

import AddIcon from '@material-ui/icons/Add';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Arrow from "../canvas/canvas_objects/arrow/Arrow";
import Cloud from "../canvas/canvas_objects/cloud/Cloud";
import VennDiagram from "../canvas/canvas_objects/venndiagram/VennDiagram";

class App extends Component {
    constructor(props) {
        super(props);
        this.rightSidebarStage = React.createRef();
        this.canvas = React.createRef();
        this.state = {
            sidebarOpen: false,
            rightSidebarOpen: false,
            user: {name: 'Marilu Bravo', img: '.public/media/anon.png'},
            nextColor: '#fffdd0',
            nextStickyScale: 1,
            smallSelected: true,
            medSelected: false,
            largeSelected: false,

            // My Boards state vars
            viewingMyBoards: false,
            boards: [],
            editingBoardIndex: 0,
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.onSetRightSidebarOpen = this.onSetRightSidebarOpen.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.onVennDiagramButtonClicked = this.onVennDiagramButtonClicked.bind(this);
        this.onCloudButtonClicked = this.onCloudButtonClicked.bind(this);
        this.onArrowButtonClicked = this.onArrowButtonClicked.bind(this);
        this.onSaveToImageClicked = this.onSaveToImageClicked.bind(this);
        this.saveBoardToBoardList = this.saveBoardToBoardList.bind(this);
    }

    saveBoardToBoardList() {
        let newBoards = [];
        if (this.state.boards.length === 0) { // no saved boards
            newBoards = newBoards.concat(this.canvas.current.saveBoard());
        } else {
            newBoards = this.state.boards.slice(); // todo: find way of doing this that scales better
            newBoards[this.state.editingBoardIndex] = this.canvas.current.saveBoard();
        }
        this.setState({boards: newBoards});
    }

    switchToBoard(boardIndex) {
        this.setState({editingBoardIndex: boardIndex});
        this.canvas.current.clearBoardAndLoadNewBoard(this.state.boards[boardIndex]);
        // this.canvas.current.loadBoard(this.state.boards[boardIndex]);
        // this.canvas.current.loadBoard(JSON.stringify(this.state.boards[boardIndex]));
        console.log("switched to board " + boardIndex);
    }

    makeNewBoard() {
        this.setState((state) => {
            return {
                boards: state.boards.concat({}),
                editingBoardIndex: state.boards.length
            };
        }, () =>  {
            this.canvas.current.clearBoardAndLoadNewBoard(null, this.saveBoardToBoardList);
            // this.saveBoardToBoardList();
        });
        // this.canvas.current.loadBoard(this.state.boards[this.state.editingBoardIndex]); //todo make copy?

        // this.canvas.current.clearBoardAndLoadNewBoard(null);
        // this.saveBoardToBoardList();

    }

    onColorChange(color) {
        this.setState({nextColor: color.hex})
    }

    onUndo() {
        this.canvas.current.undo();
    }

    onVennDiagramButtonClicked() {
        this.canvas.current.addVennDiagramToBoard();
    }

    onCloudButtonClicked() {
        this.canvas.current.addCloudToBoard();
    }

    onArrowButtonClicked() {
        this.canvas.current.addArrowToBoard();
    }

    onSaveToImageClicked() {
        this.canvas.current.saveToImage();
    }

    onMouseOverRightSidebarElement(e) {
        document.body.style.cursor = 'pointer';
        e.target.to({
            scaleX: 1.1 * e.target.attrs.scaleX,
            scaleY: 1.1 * e.target.attrs.scaleY,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    onMouseOutRightSidebarElement(e) {
        document.body.style.cursor = 'pointer';
        console.log(e.target);
        e.target.to({
            scaleX: e.target.attrs.scaleX / 1.1,
            scaleY: e.target.attrs.scaleY / 1.1,
            easing: Konva.Easings.ElasticEaseOut,
        });
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    onSetRightSidebarOpen(open) {
        this.setState({rightSidebarOpen: open});
    }

    makeSideBarContent(user) {
        if (this.state.viewingMyBoards) {
            return (
                <Fragment>
                    <div className="sidebarContent" id="user">
                        <h3><AccountIcon id="accountIcon"/><span id="userName">My Boards</span></h3>
                    </div>
                    <div className="sidebarContent" id="backToMain" onClick={() => this.setState({viewingMyBoards: false})}>
                        <h3><a href='#'>back</a></h3>
                    </div>
                    <div className="sidebarContent" id="newBoard" onClick={() => this.makeNewBoard()}>
                        <h3><a href='#'>make new board</a></h3>
                    </div>
                    <div className="sidebarContent" id="savedBoards" onClick={() => this.setState({viewingMyBoards: true})}>
                        <ul>
                            {this.state.boards.map((board, i) =>
                                <li onClick={() => this.switchToBoard(i)}>{i}</li>
                            )}
                        </ul>
                    </div>


                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className="sidebarContent" id="user">
                        <h3><AccountIcon id="accountIcon"/><span id="userName">{user.name}</span></h3>
                    </div>
                    <div className="sidebarContent">
                        <a href='#' id="saveToImageBtn" onClick={this.onSaveToImageClicked}>Save Board to Image</a>
                    </div>
                    <div className="sidebarContent">
                        <a href='#' onClick={() => this.setState({viewingMyBoards: true})}>My Boards</a>
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
    }

    makeRightSideBarContent(user) {
        return (
            <Fragment>
                <div className="sidebarContent">
                    <Stage
                        width={350}
                        height={1000}
                        listening={true}
                        ref={this.rightSidebarStage}
                    >
                        <Layer>
                            <Rect // Todo: dynamically place these stickies to be in center of stage
                                id="smallStickyButton"
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                x={30}
                                y={50}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                scaleX={1.0}
                                scaleY={1.0}
                                onClick={() => this.setState({
                                    nextStickyScale: 1,
                                    smallSelected: true,
                                    medSelected: false,
                                    largeSelected: false,
                                })}
                                stroke={this.state.smallSelected ? 'black' : null}
                                strokeWidth={3}
                            >
                            </Rect>
                            <Rect
                                id="medStickyButton"
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                scaleX={1.333}
                                scaleY={1.333}
                                x={110}
                                y={40}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                onClick={() => this.setState({
                                    nextStickyScale: 2,
                                    smallSelected: false,
                                    medSelected: true,
                                    largeSelected: false,
                                })}
                                stroke={this.state.medSelected ? 'black' : null}
                                strokeWidth={3}

                            >
                            </Rect>
                            <Rect
                                id="largeStickyButton"
                                fill={'#fffdd0'}
                                width={60}
                                height={60}
                                scaleX={1.7}
                                scaleY={1.7}
                                x={210}
                                y={30}
                                onMouseOver={(e) => this.onMouseOverRightSidebarElement(e)}
                                onMouseOut={(e) => this.onMouseOutRightSidebarElement(e)}
                                onClick={() => this.setState({
                                    nextStickyScale: 3,
                                    smallSelected: false,
                                    medSelected: false,
                                    largeSelected: true,
                                })}
                                stroke={this.state.largeSelected ? 'black' : null}
                                strokeWidth={3}

                            >
                            </Rect>
                            <Arrow
                                id={"sidebarArrow"}
                                draggable={false}
                                y={200}
                                x={75}
                                scale={0.75}
                                scaleX={0.75}
                                scaleY={0.75}
                                onClick={this.onArrowButtonClicked}
                                isButton={true}
                            />
                            <Cloud
                                scale={0.4}
                                id={"sidebarCloud"}
                                draggable={false}
                                x={180}
                                y={350}
                                fill={'white'}
                                scaleX={0.4}
                                scaleY={0.4}
                                onClick={this.onCloudButtonClicked}
                                isButton={true}
                                textEditVisible={false}
                            />
                            <VennDiagram
                                id={"sidebarVennDiagram"}
                                draggable={false}
                                x={180}
                                y={650}
                                outlineColor={'black'}
                                scale={.7}
                                isButton={true}
                                onClick={this.onVennDiagramButtonClicked}
                            />
                        </Layer>
                    </Stage>
                </div>
            </Fragment>
        );
    }

    render() {
        return (
            <Fragment>
                <Sidebar
                    sidebar={this.makeSideBarContent(this.state.user)}
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={{
                        sidebar: {
                            background: "white",
                            textAlign: "center",
                            padding: "10px",
                            backgroundColor: "#2EC4B6",
                            zIndex: "2"
                        }
                    }}
                >
                    <div id="handle" onMouseEnter={() => this.onSetSidebarOpen(true)}>
                        <AccountIcon id="accountIconTab"/>
                    </div>
                </Sidebar>
                <Toolbar
                    onColorChange={this.onColorChange}
                    nextColor={this.state.nextColor}
                    undo={this.onUndo}
                    saveBoard={this.saveBoardToBoardList}
                />

                <Sidebar
                    sidebar={this.makeRightSideBarContent(this.state.user)}
                    open={this.state.rightSidebarOpen}
                    onSetOpen={this.onSetRightSidebarOpen}
                    styles={{
                        sidebar: {
                            background: "white",
                            textAlign: "center",
                            padding: "10px",
                            backgroundColor: "#2EC4B6",
                            zIndex: "2"
                        }
                    }}
                    pullRight={true}
                >
                    <div id="rightHandle" onMouseEnter={() => this.onSetRightSidebarOpen(true)}>
                        <AddIcon id="addIcon"/>
                    </div>
                </Sidebar>
                <div id="canvas-container">
                    <Canvas
                        ref={this.canvas}
                        nextColor={this.state.nextColor}
                        nextStickyScale={this.state.nextStickyScale}
                    />
                </div>

                <div className="logo"><img src="./public/media/logo.png" id="logo"/>hi there</div>
            </Fragment>
        );
    }
}

export default App;
