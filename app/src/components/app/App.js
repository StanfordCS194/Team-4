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
            editingBoardName: false,
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
        this.onSaveButtonClicked = this.onSaveButtonClicked.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    saveBoardToBoardList(keepOrder, callback) {
        /**
         * Updates board in board list to match what is currently on canvas
         * @param: keepOrder: whether or not to retain the original order of the boards
         * or to instead place the newly saved board to the top of the list
         * @param: callback: optional callback function to execute after board has been saved
         */
        let newBoard = this.canvas.current.saveBoard();
        let newBoards = [];
        let oldBoards = this.state.boards.slice();
        let editingBoardIndex = this.state.editingBoardIndex;
        newBoard.lastUpdated = new Date();
        newBoard.name = oldBoards[editingBoardIndex].name; // keep name from before

        if (keepOrder) {
            // Update board at editingBoardIndex to be new board
            newBoards = oldBoards;
            newBoards[editingBoardIndex] = newBoard;
        } else {
            // Move saved board to start of array since it is the most recently updated
            newBoards = [newBoard];
            newBoards = newBoards.concat(oldBoards.slice(0, editingBoardIndex), oldBoards.slice(editingBoardIndex + 1));
        }
        // Update state to reflect boards list change
        this.setState((state) => {
            return {
                boards: newBoards,
                editingBoardIndex: keepOrder ? state.editingBoardIndex : 0,
            }
        }, () => {
            if (callback) callback();
        });
        return newBoards;
    }

    onSaveButtonClicked() {
        let newBoards = this.saveBoardToBoardList(false, null);
        this.postBoardListUpdate(newBoards);
    }

    deleteBoard(boardIndex) {
        if (this.state.boards.length > 1) {
            let newBoards = this.state.boards.slice();
            newBoards.splice(boardIndex, 1);
            this.setState({
                boards: newBoards,
            }, () => { // After board is deleted, switch view to most recently updated board
                this.switchToBoard(0, false);
                // this.postBoardListUpdate(newBoards);
            });
        }
    }

    switchToBoard(boardIndex, shouldSavePreviousBoard) {
        console.log("board name switched to: " + this.state.boards[boardIndex].name);
        if (shouldSavePreviousBoard) {
            // delay loading board until after saving current board
            this.saveBoardToBoardList(true, this.loadBoardAndUpdateBoardIndex(boardIndex));
        } else {
            this.loadBoardAndUpdateBoardIndex(boardIndex);
        }
    }

    loadBoardAndUpdateBoardIndex(boardIndex) {
        this.setState({editingBoardIndex: boardIndex});
        this.canvas.current.clearBoardAndLoadNewBoard(this.state.boards[boardIndex]);
        console.log("switched to board " + boardIndex);
    }

    insertNewBoardObjectInBoardsList(callback) { //Todo: warn user to save before switching, or just automatically save current board
        /**
         * Puts a new board at the front of the user's board list.
         */
        let newBoard = {};
        let newBoards = [newBoard];

        newBoard.lastUpdated = new Date();
        newBoard.name = "New Board";
        this.setState((state) => {
            return {
                boards: newBoards.concat(state.boards),
            };
        }, () => {
            if (callback) callback()
        });
    }

    handleNewBoardButtonClicked() {
        // Create new board object in boards list
        // this.insertNewBoardObjectInBoardsList(() => {
        this.saveBoardToBoardList(true, () => {
            // Save board currently editing
            // this.saveBoardToBoardList(true, () => {
            this.insertNewBoardObjectInBoardsList(() => {

                // Clear canvas and save empty board to newly created object in boards list
                this.canvas.current.clearBoardAndLoadNewBoard(null, () => {
                    this.setState({editingBoardIndex: 0}, () => this.saveBoardToBoardList(true, null));
                });
            });

        });
    }

    onColorChange(color) {
        this.setState({nextColor: color.hex})
    }

    onDelete() {
        this.canvas.current.delete();
    }

    onUndo() {
        this.canvas.current.undo();
    }

    onVennDiagramButtonClicked() {
        this.setState({rightSidebarOpen: false});
        this.canvas.current.addVennDiagramToBoard();
    }

    onCloudButtonClicked() {
        this.setState({rightSidebarOpen: false});
        this.canvas.current.addCloudToBoard();
    }

    onArrowButtonClicked() {
        this.setState({rightSidebarOpen: false});
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
        if (open) {
            this.onSetRightSidebarOpen(false);
            // this.saveBoardToBoardList(true); //todo get rid of this, makes too much lag
        }
        this.setState({sidebarOpen: open});
    }

    onSetRightSidebarOpen(open) {
        if (open) this.onSetSidebarOpen(false);
        this.setState({rightSidebarOpen: open});
    }

    switchLeftSidebarView(callback) {
        this.onSetSidebarOpen(false);
        setTimeout(() => {
            if (callback) callback()
        }, 350);
    }

    handleBoardNameTextAreaKeyDown(e, board, i) {
        if (e.keyCode === 13) { // Pressed enter
            if (!e.target.value) return;
            this.handleBoardNameInputBlur(i);
        }
    }

    handleClickOnBoardName(e, i, board) {
        this.setState({editingBoardName: true});
        let input = document.getElementById("input" + i);
        let boardName = document.getElementById("boardName" + i);
        boardName.style.display = 'none';
        input.style.display = 'block';
        input.value = this.state.boards[i].name;
        input.focus();
    }

    handleBoardNameInputBlur(i) {
        this.setState({editingBoardName: false});
        let input = document.getElementById("input" + i);
        let boardName = document.getElementById("boardName" + i);

        this.onBoardNameChanged(i, input.value);
        input.style.display = 'none';
        boardName.style.display = 'block';
    }

    onBoardNameChanged(boardIndex, newName) {
        let changedBoard = this.state.boards[boardIndex];
        changedBoard.name = newName;
        let newBoards = this.state.boards.slice();

        newBoards[boardIndex] = changedBoard;
        this.setState({boards: newBoards}, () => console.log(this.state.boards[boardIndex].name));
    }

    handleKeyPress = (e) => {
        /**
         * Delete a board by pressing delete when viewing my boards bar
         */
        if (this.state.viewingMyBoards && this.state.sidebarOpen && e.keyCode === 8 && !this.state.editingBoardName) {
            this.deleteBoard(this.state.editingBoardIndex);
        }
    };

    handleLogin(username, id) {
        document.addEventListener("keydown", this.handleKeyPress, false); // listener for deleting boards

        axios.get('/user/' + id)
            .then((res) => {
                console.log(res);
                if (!res.data && this.state.user_id) {
                    this.setState({user_id: null});
                }
                this.switchLeftSidebarView(
                    () => {
                        this.setState({
                            username: res.data.username,
                            boards: res.data.boards.length ? JSON.parse(res.data.boards) : [],
                            user_id: res.data._id,
                            editingBoardIndex: 0,
                        }, () => {
                            this.insertNewBoardObjectInBoardsList(this.saveBoardToBoardList);
                            this.onSetSidebarOpen(true);
                        }); // after loading saved boards, add board currently editing to user's board list
                    });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    handleLogout() {
        this.saveBoardToBoardList(true, () => {
            this.postBoardListUpdate(this.state.boards, () => {
                axios.post('/admin/logout').catch((error) => console.log(error));
                this.switchLeftSidebarView(
                    () => {
                        this.setState({username: null, user_id: null});
                        this.canvas.current.clearBoardAndLoadNewBoard();
                        this.onSetSidebarOpen(true)
                    }
                )
            });
        });
    }

    postBoardListUpdate(newBoards, callback) {
        // Handle circular references
        let cache = [];
        let newBoardsJson = JSON.stringify(newBoards, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    try {
                        return JSON.parse(JSON.stringify(value));
                    } catch (error) {
                        return;
                    }
                }
                cache.push(value);
            }
            return value;
        });
        cache = null;
        // let req = {board_representation: JSON.stringify(newBoards), id: this.state.user_id};
        let req = {board_representation: newBoardsJson, id: this.state.user_id};
        axios.post('/user/board', req)
            .then((res) => {
                console.log(res);
                if (callback) callback();
            })
            .catch((error) => console.log(error));
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
            console.log("this.state.boards:");
            console.log(this.state.boards);
            return ( //todo: this should probably be its own react component
                <Fragment>
                    <div className="sidebarContent" id="my-boards-heading">
                        <h3>
                            <ArrowBackIcon
                                id="arrow-back-icon"
                                onClick={() => this.switchLeftSidebarView(() => {
                                    this.setState({viewingMyBoards: false}, () => {this.onSetSidebarOpen(true)});
                                })}
                            />
                            <span id="userName">My Boards</span>
                        </h3>
                    </div>
                    <div id="new-board-button" onClick={() => this.handleNewBoardButtonClicked()}>
                        <AddCircleIcon id="new-board-button-addIcon"/>
                    </div>
                    <div className="sidebarContent" id="savedBoards"
                         onClick={() => this.setState({viewingMyBoards: true})}>
                        <ul>
                            {this.state.boards.map((board, i) =>
                                <li className={i === this.state.editingBoardIndex ? "saved-board-elem-selected" : "saved-board-elem"}
                                >
                                    <div>
                                        <img
                                            className={i === this.state.editingBoardIndex ? "board-thumbnail-selected" : "board-thumbnail"}
                                            src={board.imgUri}
                                            onClick={() => this.switchToBoard(i, true)}
                                        />
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
                    <div className="sidebarContent" id="saveToImageBtn">
                        <a href='#' onClick={this.onSaveToImageClicked}>Save Board to Image</a>
                    </div>
                    <div className="sidebarContent" id="viewMyBoardsBtn">
                        <a href='#' onClick={() => this.switchLeftSidebarView(() => {
                            this.setState({viewingMyBoards: true}, () => this.onSetSidebarOpen(true));
                        })}
                        >My Boards</a>
                    </div>
                    <div className="sidebarContent" id="logoutButton">
                        <a href='#' onClick={() => this.handleLogout()}>Log Out</a>
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
                                    rightSidebarOpen: false
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
                                    rightSidebarOpen: false
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
                                    rightSidebarOpen: false
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
                    delete={this.onDelete}
                    saveBoard={this.onSaveButtonClicked}
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
                        saveBoardToBoardList={this.onSaveButtonClicked}
                    />
                </div>

                <div className="logo"><img src="./public/media/logo.png" id="logo"/></div>
            </Fragment>
        );
    }
}

export default App;
