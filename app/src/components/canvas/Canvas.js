import React from 'react';
import {Stage, Layer, Text} from 'react-konva';

import './Canvas.css';

import Sticky from './canvas_objects/sticky/Sticky';
import Plaintext from './canvas_objects/plaintext/Plaintext';
import TransformerComponent from './canvas_objects/transformercomponent/TransformerComponent';
import Arrow from './canvas_objects/arrow/Arrow';
import Cloud from './canvas_objects/cloud/Cloud';
import VennDiagram from './canvas_objects/venndiagram/VennDiagram';


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
        // this.objectRefs = [];
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
            imageSrc: '',
            pastObjRefs: [],
            pastObjArray: [],
            objectRefs: [],
            savedBoard: {},

            selectedCanvasObjectIds: [],
            transformers: []
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.loadBoard = this.loadBoard.bind(this);
        this.clearBoardAndLoadNewBoard = this.clearBoardAndLoadNewBoard.bind(this);
        this.delete = this.delete.bind(this);
    }

    getImageURI() {
        /**
         * Returns the URI of the image of the currently displayed board.
         */
        return this.stage.current.getStage().toDataURL({pixelRatio: 1}); // Todo: Dynamically change this number based on stage scale for optimal image quality
    }

    saveToImage() {
        /**
         * Saves the current board to a .png file which is downloaded locally.
         */
        let uri = this.stage.current.getStage().toDataURL({pixelRatio: 3}); // Todo: Dynamically change this number based on stage scale for optimal image quality
        let link = document.createElement('a');
        link.download = "stage.png"; // Todo: dynamically name stage
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleStageClick(e) {
        /**
         * Draws transformers around selected canvas objects and hides transformers.
         * when stage is clicked, then updates the state variables.
         * @param: {object} e Event object.
         */
        // clicked on stage - clear selection
        if (e.target === e.target.getStage()) {
            this.setState({
                selectedCanvasObjectId: '',
                selectedCanvasObjectIds: [],
                transformers: []
            });
            return;
        }

        // clicked on transformer - do nothing
        const clickedOnTransformer = e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) { return; }

        // find clicked canvas object by its id
        const id = e.target.parent.attrs.id;
        const canvasObject = this.state.objectArray.find(canvasObject => {
            if (!canvasObject ) { return false; }
            else { return canvasObject.props.id.toString() === id.toString(); }
        });

        if (canvasObject) {
            // Allow diagonal resizing for non-stickies and all resizing for arrow
            let objectType = canvasObject.ref.current.state.className;
            let enabledAnchors = [];
            if (objectType !== 'sticky' && objectType !== 'plaintext') {
                enabledAnchors = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
                if (objectType.toString() === 'arrow') {
                    enabledAnchors = enabledAnchors.concat(['middle-right', 'middle-left', 'bottom-center', 'top-center']);
                }
            }

            // Set the text area at the click position as 'poof' position at delete
            let textarea = document.getElementById(canvasObject.props.id);
            if (textarea) {
                textarea.style.top = e.evt.clientY + 'px';
                textarea.style.left = e.evt.clientX + 'px';
            }

            // Draw a transformer around the newly selected canvas object
            let newTransformer = (
                <TransformerComponent
                    selectedCanvasObjectId={id}
                    enabledAnchors={enabledAnchors}
                />);

            // If cmd + click, concat new selection, otherwise make sole selection
            let newTransformersArray = [newTransformer];
            let newSelectedObjectIds = [id];
            if (window.event.metaKey) {
                newTransformersArray = this.state.transformers.slice().concat([newTransformer]);
                newSelectedObjectIds = this.state.selectedCanvasObjectIds.slice().concat([id]);
            }

            this.setState({
                selectedCanvasObjectId: id,
                selectedCanvasObjectIds: newSelectedObjectIds,
                transformers: newTransformersArray,
            });
        } else {
            // Nothing selected
            this.setState({
                selectedCanvasObjectId: '',
                selectedCanvasObjectIds: [],
                transformers: []
            });
        }
    }

    handleMouseDown(e) {
        /**
         * Removes transformer if another canvas object is dragged, unless cmd key is pressed.
         * @param: {object} e An onMouseDown event object.
         */

        if (e.target.getParent()) {
            const clickedOnTransformer = e.target.getParent().className === 'Transformer';
            if (clickedOnTransformer) { return; }
            else {
                // If cmd is pressed, keep the current transformers
                let newTransformersArray = [];
                if (window.event.metaKey) {
                    newTransformersArray = this.state.transformers;
                }
                this.setState({
                    selectedCanvasObjectId: '',
                    transformers: newTransformersArray
                });
            }
        }
    }

    handleDblClick(e) {
        /**
         * Create a new canvas object at the position of the given double click event.
         * @param: {object} e An onDblClick event object.
         */
        // Do nothing if clicked on a Shape that is not the start message or a Venn Diagram (whose component classname is Circle)
        if (e.target.nodeType === "Shape" && this.state.justOpenedApp === false && e.target.className !== 'Circle') {
            return;
        }

        let newComponent = null;
        let componentRef = React.createRef();

        if (window.event.metaKey) {
            newComponent = this.createPlainText(e, componentRef);
        } else {
            newComponent = this.createSticky(e, componentRef);
        }

        this.setState({
            justOpenedApp: false,
            objectRefs: this.state.objectRefs.slice().concat([componentRef]),
            objectArray: this.state.objectArray.slice().concat([newComponent]),
            pastObjArray: this.state.pastObjArray.concat([this.state.objectArray.slice()]),
            pastObjRefs: this.state.pastObjRefs.concat([this.state.objectRefs.slice()]),
            id: this.state.id + 1,
        });

    }

    createPlainText(e, componentRef) {
        /**
         * Creates a new Plaintext object with given event e and React reference componentRef.
         * @param {object} e An onDblClick event object.
         * @param {object} componentRef A React reference for the created Plaintext.
         * @return {Plaintext} A new Plaintext object.
         */
        return (
            <Plaintext
                ref={componentRef}
                id={this.state.id}
                className={'plaintext'}
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleY}
                x={e.evt.clientX}
                y={e.evt.clientY}
                stageX={this.state.stageX}
                stageY={this.state.stageY}
                height={200}
                width={800}
                fontSize={80}
                scale={1}
            />
        );

    }

    createSticky(e, componentRef) {
        /**
         * Creates a new Sticky object at position of the given event with given React reference.
         * @param {object} e An onDblClick event object.
         * @param {object} componentRef A React reference for the created Sticky.
         * @return {Sticky} A new Sticky object.
         */
        return (
            <Sticky
                ref={componentRef}
                id={this.state.id}
                scaleX={this.state.scaleX}
                scaleY={this.state.scaleY}
                x={e.evt.clientX}
                y={e.evt.clientY}
                stageX={this.state.stageX}
                stageY={this.state.stageY}
                nextColor={this.props.nextColor}
                height={250}
                width={250}
                fontSize={60}
                scale={this.props.nextStickyScale}
            />
        );
    }

    handleOnWheel(e) {
        /**
         * Handles zooming by mouse point and two-finger scrolling.
         * @param {object} e An onWheel event object.
         */
        if (this.state.justOpenedApp) return;

        let oldScale = this.state.scaleX;

        const stage = e.target.getStage();

        let mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - this.state.stageX / oldScale,
            y: stage.getPointerPosition().y / oldScale - this.state.stageY / oldScale,
        };

        let newScale =
            e.evt.deltaY > 0 ?
                oldScale * this.state.scaleBy : oldScale / this.state.scaleBy;

        this.setState({
            scaleX: newScale,
            scaleY: newScale,
            stageX: -(mousePointTo.x - e.evt.x / newScale) * newScale,
            stageY: -(mousePointTo.y - e.evt.y / newScale) * newScale
        });
    }

    onDragEnd(e) {
        /**
         * Updates the stage position after the stage has been dragged.
         * @param {object} e An onDragEnd event object.
         */
        if (e.target.nodeType != "Stage") {
            return;
        }
        this.setState({
            stageX: e.target.x(),
            stageY: e.target.y()
        });
    }

    undo() {
        /**
         * Undoes the most recent change to the objectArray.
         */
      if (this.state.pastObjArray.length === 0) { return; }
        this.setState({
            objectArray: this.state.pastObjArray.pop(),
            objectRefs: this.state.pastObjRefs.pop(),
            pastObjArray: this.state.pastObjArray.slice(),
            pastObjRefs: this.state.pastObjRefs.slice(),
            transformers: []
        });
        console.log('after undo: ', this.state.pastObjArray);
    }

    addCloudToBoard() {
        /**
         * Adds a new Cloud object to the current board.
         */
        let componentRef = React.createRef();
        this.setState({});

        let newComponent = (
            <Cloud
                ref={componentRef}
                id={this.state.id}
                finalTextValue={''}
                className={'cloud'}
                draggable={true}
                x={this.stage.current.getStage().width() / 2 - 20} // Todo: subtract half of cloud width
                y={this.stage.current.getStage().height() / 2 - 90} // Todo: subtract half of cloud height
                width={720}
                height={600}
                fill={'#7EC0EE'}
                scale={1}
                fontSize={80}
                textEditVisible={true}
                isButton={false}
            />
        );
        this.setState({
            justOpenedApp: false,
            objectRefs: this.state.objectRefs.slice().concat([componentRef]),
            objectArray: this.state.objectArray.slice().concat([newComponent]),
            pastObjArray: this.state.pastObjArray.concat([this.state.objectArray.slice()]),
            pastObjRefs: this.state.pastObjRefs.concat([this.state.objectRefs.slice()]),
            id: this.state.id + 1,
        });
    }

    addArrowToBoard() {
        /**
         * Adds a new Arrow object to the current board.
         */
        let componentRef = React.createRef();

        let newComponent = (
            <Arrow
                ref={componentRef}
                id={this.state.id}
                draggable={true}
                x={this.stage.current.getStage().width() / 2 - 150} // Todo: subtract half of arrow width
                y={this.stage.current.getStage().height() / 2 - 40} // Todo: subtract half of arrow height
                scale={1}
                scaleX={1.1}
                scaleY={1.1}
            />
        );
        this.setState({
            justOpenedApp: false,
            objectRefs: this.state.objectRefs.slice().concat([componentRef]),
            objectArray: this.state.objectArray.slice().concat([newComponent]),
            pastObjArray: this.state.pastObjArray.concat([this.state.objectArray.slice()]),
            pastObjRefs: this.state.pastObjRefs.concat([this.state.objectRefs.slice()]),
            id: this.state.id + 1,
        });
    }

    addVennDiagramToBoard() {
        /**
         * Adds a new VennDiagram object to the current board.
         */
        let componentRef = React.createRef();

        let newComponent = (
            <VennDiagram
                ref={componentRef}
                id={this.state.id}
                draggable={true}
                x={this.stage.current.getStage().width() / 2 - 20}
                y={this.stage.current.getStage().height() / 2 - 90}
                outlineColor={'black'}
                scale={2.5}
                isButton={false}
            />
        );
        this.setState({
            justOpenedApp: false,
            objectRefs: this.state.objectRefs.slice().concat([componentRef]),
            objectArray: this.state.objectArray.slice().concat([newComponent]),
            pastObjArray: this.state.pastObjArray.concat([this.state.objectArray.slice()]),
            pastObjRefs: this.state.pastObjRefs.concat([this.state.objectRefs.slice()]),
            id: this.state.id + 1,
        });
    }

    saveBoard() {
        /**
         * Saves the currently displayed board into a single object.
         * #TODO: more specific description
         */
        // get state objects from component method getStateObj() and put into array
        let savedComponents = [];
        this.state.objectRefs.slice(0, this.state.id).map(ref => {
          if (!ref) { return; }
          savedComponents = savedComponents.concat(ref.current.getStateObj());
        });

        // save board state
        let savedBoardState = {};
        Object.assign(savedBoardState, this.state);
        delete savedBoardState.objectArray;
        delete savedBoardState.objectRefs;

        // Combine board state and component states into one object
        let savedBoard = {};
        savedBoard.boardState = savedBoardState;
        savedBoard.componentStates = savedComponents;
        savedBoard.imgUri = this.getImageURI(); // thumbnail image

        // todo get rid of set state below, shouldn't affect anything but be check to be sure
        // for testing purposes: save state objects to canvas state to load later
        this.setState({
            savedBoard: savedBoard,
        });
        console.log("saved board:");
        console.log(savedBoard);
        return savedBoard;
    }

    clearBoardAndLoadNewBoard(newBoard, callback) {
        /**
         * Loads a new board by first clearing the current one.
         * Loading a board occurs in the callback function of setState to
         * ensure the board is entirely cleared first.
         * @param: {type} newBoard TODO description
         * @param: {type} callback TODO description
         */
        console.log("clearing board");
        this.setState({
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
                imageSrc: '',
                selectedCanvasObjectIds: [],
                transformers: [],

                objectRefs: [],
                pastObjArray: [],
                pastObjRefs: [],
                savedBoard: {}
            }, () => { // Need to use a callback function to wait until board is cleared
                if (newBoard) { // only loading a board if newBoard is not null
                    console.log("non-null board.");
                    this.loadBoard(newBoard);
                } else {
                    console.log("null board");
                    if (callback) callback();
                }
            }
        );
    }

    loadBoard(board) {
        /**
         * Recreates a board by making a new object from each state object and setting board values
         * @param: {object} board A JSON string representing an array of object states and a board state
         */
        console.log("Loading board");

        let savedComponentStates = board.componentStates;
        let savedBoardState = board.boardState;
        let newObjectRefs = [];
        let newObjArray = [];

        // Update board to have correct state
        this.setState({
            justOpenedApp: savedBoardState.justOpenedApp,
            creatingSticky: false,
            editingShape: false,
            stageWidth: savedBoardState.stageWidth,
            stageHeight: savedBoardState.stageHeight,
            stageX: savedBoardState.stageX,
            stageY: savedBoardState.stageY,
            scaleX: savedBoardState.scaleX,
            scaleY: savedBoardState.scaleY,
            scaleBy: savedBoardState.scaleBy,
            activeSticky: savedBoardState.activeSticky,
            selectedCanvasObjectId: savedBoardState.selectedCanvasObjectId,
            imageSrc: savedBoardState.imageSrc,
            selectedCanvasObjectIds: [],
            transformers: []
        }, () => {
            // For each component state object, create a new object
            savedComponentStates.map(state => {
                console.log(state);
                let newComponent = null;
                let newComponentRef = React.createRef();
                switch (state.className) {
                    case ('sticky'):
                        newComponent = (<Sticky
                            ref={newComponentRef}
                            isBeingLoaded={true}
                            id={state.id}
                            scaleX={state.scaleX}
                            scaleY={state.scaleY}
                            x={state.position.x}
                            y={state.position.y}
                            finalTextValue={state.finalTextValue}
                            rotation={state.rotation}
                            stageX={state.stageX}
                            stageY={state.stageY}
                            nextColor={state.color}
                            height={state.height}
                            width={state.width}
                            fontSize={state.fontSize}
                            scale={state.scale}
                        />);
                        break;
                    case ('arrow'):
                        newComponent = (<Arrow
                            ref={newComponentRef}
                            isBeingLoaded={true}
                            id={state.id}
                            scaleX={state.scaleX}
                            scaleY={state.scaleY}
                            x={state.x}
                            y={state.y}
                            rotation={state.rotation}
                            scale={state.scale}
                            draggable={true}
                        />);
                        break;
                    case ('plaintext'):
                        newComponent = (<Plaintext
                            ref={newComponentRef}
                            id={state.id}
                            scaleX={state.scaleX}
                            x={state.x}
                            y={state.y}
                            stageX={state.stageX}
                            stateY={state.stageY}
                            height={state.height}
                            width={state.width}
                            fontSize={state.fontSize}
                        />);
                        break;
                    case ('cloud'):
                        newComponent = (<Cloud
                            ref={newComponentRef}
                            id={state.id}
                            draggable={true}
                            x={state.x}
                            y={state.y}
                            width={state.width}
                            height={state.height}
                            fill={state.fill}
                            scale={state.scale}
                            fontSize={state.fontSize}
                            textEditVisible={false}
                            isButton={false}
                            isBeingLoaded={true}
                            finalTextValue={state.finalTextValue}
                            scaleX={state.scaleX}
                            scaleY={state.scaleY}
                            rotation={state.rotation}
                        />);
                        break;
                    case ('vennDiagram'):
                        console.log("venn diagram");
                        newComponent = (<VennDiagram
                            ref={newComponentRef}
                            id={state.id}
                            draggable={true}
                            x={state.x}
                            y={state.y}
                            scale={state.scale}
                            rotation={state.rotation}
                            isBeingLoaded={true}
                            outlineColor={'black'}
                            scaleX={state.scaleX}
                            scaleY={state.scaleY}
                        />);
                        break;
                    default:
                        break;
                }
                newObjArray = newObjArray.concat(newComponent);
                newObjectRefs = newObjectRefs.concat(newComponentRef);
            });

            // Update object array, id, and object refs
            this.setState({
                objectArray: newObjArray.slice(),
                id: savedBoardState.id, // for some reason only works when I update this after creating the components
                objectRefs: newObjectRefs.slice(),
            });
        });
    }

    delete() {
        /**
         * Deletes the selected canvas objects by ID and
         * creates a CSS sprite 'poof' in the object's place.
         */
        let newObjectRefs = this.state.objectRefs.slice();
        let newObjectArray = this.state.objectArray.slice();

        let i = 0;
        for (i ; i < this.state.selectedCanvasObjectIds.length; i++) {
            let selectedObjectId = this.state.selectedCanvasObjectIds[i];

            // Add CSS sprite animation of cloud poof
            let textarea = document.getElementById(selectedObjectId);
            if (textarea) {
                textarea.style.display = '';
                let rect = textarea.getBoundingClientRect();

                let poof = document.createElement("div");
                poof.className = "poof";
                poof.style.display = 'block';
                poof.style.position = 'absolute';
                poof.style.top = rect.y + 'px';
                poof.style.left = rect.x + 'px';
                document.body.appendChild(poof);
            }

            // find index of canvasObject to delete
            const canvasObject = this.state.objectArray.find(canvasObject => {
                if (!canvasObject) { return false; }
                else { return canvasObject.props.id.toString() === selectedObjectId.toString(); }
            });
            let index = this.state.objectArray.indexOf(canvasObject);
            newObjectArray[index] = null;
            newObjectRefs[index] = null;
        }

        this.setState({
            objectArray: newObjectArray,
            objectRefs: newObjectRefs,
            pastObjArray: this.state.pastObjArray.concat([this.state.objectArray.slice()]),
            pastObjRefs: this.state.pastObjRefs.concat([this.state.objectRefs.slice()]),
            transformers: []
        });
    }

    isEditingText() {
        /**
         * Returns true if a textarea on the current canvas is open.
         * @return {boolean}
         */

        let textareas = document.getElementsByClassName('textarea');
        let i = 0
        for (i ; i < textareas.length ; i++) {
            let textarea = textareas[i];
            if (textarea.style.display !== 'none') {
                return true;
            }
        }
        return false;
    }


    handleKeyPress = (e) => {
        /**
         * Handles key presses to create new shapes, save/load boards, and delete selected
         * shapes.
         */
        // if command-z, undo previously added object
        if (e.metaKey && e.keyCode === 90) {
            this.undo();
        }

        /* Todo: Creates arrow (cmd+a) or cloud (cmd+c)
         (dev purposes), probably want to create with double clicks,
         but couldn't figure out how to read for keys other than
         cmd when double-clicking.
         Change or get rid of this when we've found the cleaner solution
         */

        // Make arrow
        if (e.shiftKey && e.keyCode === 65 && !this.isEditingText()) {
            this.addArrowToBoard();
        }

        // Make cloud
        if (e.shiftKey && e.keyCode === 67 && !this.isEditingText()) {
            this.addCloudToBoard();
        }

        // Make venn diagram
        if (e.shiftKey && e.keyCode === 86 && !this.isEditingText()) {
            this.addVennDiagramToBoard();
        }

        // Save board
        if (e.shiftKey && e.keyCode === 83 && !this.isEditingText()) {
            this.props.saveBoardToBoardList();
        }

        // Dev: test save board to state variable
        if (e.metaKey && e.keyCode === 67) {
            this.saveBoard();
        }

        // Testing: load board
        if (e.metaKey && e.keyCode === 74) {
            this.loadBoard(this.state.savedBoard);
        }

        // Delete selected canvas object on press of delete key on mac
        // if (e.keyCode === 8 && !this.isEditingText()) {
        if (e.keyCode === 8 && !this.isEditingText() && !this.props.sideBarOpen) {
            this.delete();
        }
    };

    componentDidMount() {
        /**
         * Adds document level keydown listeners
         */
        document.addEventListener("keydown", this.handleKeyPress, false);

    }

    componentWillUnmount() {
        /**
         * Removes document level keydown listeners when un-mounting
         */
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    render() {
        return (
            <Stage
                ref={this.stage}
                container={'container'}
                width={window.innerWidth}
                height={window.innerHeight}
                draggable={!this.state.justOpenedApp}
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
                    {this.state.objectArray.length === 0 &&
                    <OpeningGreeting
                        justOpenedApp={this.state.justOpenedApp}
                    />}
                    {this.state.objectArray.slice()}
                    {this.state.transformers}
                </Layer>
            </Stage>
        );
    }
}

export default Canvas;