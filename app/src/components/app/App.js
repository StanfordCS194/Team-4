import React, {Component, Fragment} from 'react';
import {Stage, Layer, Rect} from 'react-konva';
import Konva from 'konva';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import './App.css';
import Canvas from '../canvas/Canvas';
import Sidebar from 'react-sidebar';
import Toolbar from '../toolbar/Toolbar';
import TimeAgo from 'react-timeago';
import LoginRegister from '../sidebar/LoginRegister';


import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Arrow from "../canvas/canvas_objects/arrow/Arrow";
import Cloud from "../canvas/canvas_objects/cloud/Cloud";
import VennDiagram from "../canvas/canvas_objects/venndiagram/VennDiagram";

import axios from 'axios';

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
            username: null,
            user_id: null,
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
        let newBoard = this.canvas.current.saveBoard();
        let newBoards = [newBoard];
        let oldBoards = this.state.boards;
        let editingBoardIndex = this.state.editingBoardIndex;
        newBoard.lastUpdated = new Date();
        newBoard.name = "New Board";

        // Move saved board to start of array since it is the most recently updated
        if (oldBoards.length > 0) {
            newBoards = newBoards.concat(oldBoards.slice(0, editingBoardIndex), oldBoards.slice(editingBoardIndex + 1));
            newBoard.name = oldBoards[editingBoardIndex].name;
        }
        this.setState({
            boards: newBoards,
            editingBoardIndex: 0,
        });
        this.postBoardListUpdate(newBoards);
    }

    switchToBoard(boardIndex) {
        this.setState({editingBoardIndex: boardIndex});
        this.canvas.current.clearBoardAndLoadNewBoard(this.state.boards[boardIndex]);
        console.log("switched to board " + boardIndex);
    }

    makeNewBoard() { //Todo: warn user to save before switching, or just automatically save current board
        let newBoards = [{lastUpdated: new Date(), name: "New Board"}];
        this.setState((state) => {
            return {
                boards: newBoards.concat(state.boards),
                editingBoardIndex: 0
            };
        }, () => {
            this.canvas.current.clearBoardAndLoadNewBoard(null, this.saveBoardToBoardList);
            this.postBoardListUpdate(this.state.boards);
            // let boardNameInput = document.getElementById("input0");
            // console.log("boardNameInput:");
            // console.log(boardNameInput);
            // boardNameInput.focus(); //todo focus new board name on create
        });
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
        if (open) this.onSetRightSidebarOpen(false);
        this.setState({sidebarOpen: open});
    }

    onSetRightSidebarOpen(open) {
        if (open) this.onSetSidebarOpen(false);
        this.setState({rightSidebarOpen: open});
    }

    switchLeftSidebarView(viewingMyBoards) {
        this.onSetSidebarOpen(false);
        setTimeout(() => { // lets board close animation complete first
            this.setState({viewingMyBoards: viewingMyBoards}, () => this.onSetSidebarOpen(true));
        }, 350);
    }

    handleBoardNameTextAreaKeyDown(e, board, i) {
        if (e.keyCode === 13) { // Pressed enter
            if (!e.target.value) return;
            let changedBoard = board;
            let newBoards = this.state.boards;
            changedBoard.name = e.target.value;
            newBoards[i] = changedBoard;
            this.setState({boards: newBoards}, () => console.log(this.state.boards[i].name));
            this.postBoardListUpdate(newBoards);

            let input = document.getElementById("input" + i);
            let boardName = document.getElementById("boardName" + i);
            boardName.style.display = 'block';
            input.style.display = 'none';
        }
    }

    handleClickOnBoardName(e, i, board) {
        let input = document.getElementById("input" + i);
        let boardName = document.getElementById("boardName" + i);
        boardName.style.display = 'none';
        input.style.display = 'block';
        input.value = this.state.boards[i].name;
        input.focus();
    }

    handleBoardNameInputBlur(i) {
        let input = document.getElementById("input" + i);
        let boardName = document.getElementById("boardName" + i);
        input.style.display = 'none';
        boardName.style.display = 'block';
    }

    handleLogin(username, id) {
        axios.get('/user/'+id)
            .then((res) => {
                console.log(res);
                if (!res.data && this.state.user_id) {
                    this.setState({user_id: null});
                }
                this.setState({
                    username: res.data.username,
                    boards: JSON.parse(res.data.boards),
                    user_id: res.data._id
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    postBoardListUpdate(newBoards) {
        let req = {boards: JSON.stringify(newBoards), id: this.state.user_id};
        axios.post('/user/'+this.state.user_id+'/board', req).catch((error) => console.log(err));
    }

    makeSideBarContent = () => {
        if (!this.state.user_id) {
            return (
                <LoginRegister
                    // logIn={(username, id) => this.setState({username: username, user_id: id})}
                    logIn={(username, id) => this.handleLogin(username, id)}
                />
            );
        }
        if (this.state.viewingMyBoards) {
            return ( //todo: this should probably be its own react component
                <Fragment>
                    <div className="sidebarContent" id="my-boards-heading">
                        <h3>
                            <ArrowBackIcon
                                id="arrow-back-icon"
                                onClick={() => this.switchLeftSidebarView(false)}
                            />
                            <span id="userName">My Boards</span>
                        </h3>
                    </div>
                    <div id="new-board-button" onClick={() => this.makeNewBoard()}>
                        <AddCircleIcon id="new-board-button-addIcon"/>
                    </div>
                    <div className="sidebarContent" id="savedBoards"
                         onClick={() => this.setState({viewingMyBoards: true})}>
                        <ul>
                            {this.state.boards.map((board, i) =>
                                <li className={i === this.state.editingBoardIndex ? "saved-board-elem-selected" : "saved-board-elem"}
                                    onClick={() => this.switchToBoard(i)}>
                                    <div>
                                        <img
                                            className={i === this.state.editingBoardIndex ? "board-thumbnail-selected" : "board-thumbnail"}
                                            src={board.imgUri}/>
                                    </div>

                                    <div id="board-name-container">
                                        <div
                                            id={"boardName" + i}
                                            className={"board-name"}
                                            onClick={(e) => this.handleClickOnBoardName(e, i, board)}>{board.name}
                                        </div>
                                        <input
                                            id={"input" + i} className="board-name-input"
                                            onKeyDown={(e) => this.handleBoardNameTextAreaKeyDown(e, board, i)}
                                            onBlur={() => this.handleBoardNameInputBlur(i)}
                                            maxLength="25"
                                        />
                                    </div>

                                    <div>Last saved <TimeAgo date={board.lastUpdated}/></div>
                                </li>
                            )}
                        </ul>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className="sidebarContent" id="user">
                        <h3><AccountIcon id="accountIcon"/><span id="userName">{this.state.username}</span></h3>
                    </div>
                    <div className="sidebarContent">
                        <a href='#' id="saveToImageBtn" onClick={this.onSaveToImageClicked}>Save Board to Image</a>
                    </div>
                    <div className="sidebarContent">
                        <a href='#' onClick={() => this.switchLeftSidebarView(true)}>My Boards</a>
                    </div>
                    <div className="sidebarContent">
                        <a href='#'>Account Settings</a>
                    </div>
                    <div className="sidebarContent">
                        <a href='#' onClick={() => {
                            axios.post('/admin/logout').catch((error) => console.log(err));
                            this.setState({username: null, user_id: null});
                        }}>Log Out</a>
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

    // on update, check if user is still logged in
    componentDidUpdate() {
        axios.get('/admin/check')
            .then((res) => {
                console.log(res);
                if (!res.data && this.state.user_id) {
                    this.setState({user_id: null});
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    render() {
        console.log(this.state.username);
        return (
            <Fragment>
                <Sidebar
                    sidebar={this.makeSideBarContent()}
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={{
                        sidebar: {
                            background: "white",
                            textAlign: "center",
                            padding: "0px 10px 10px 10px",
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
                        saveBoardToBoardList={this.saveBoardToBoardList}
                    />
                </div>

                <div className="logo"><img src="./public/media/logo.png" id="logo"/>hi there</div>
            </Fragment>
        );
    }
}

export default App;
