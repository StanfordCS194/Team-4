import React from 'react';
import Portal from '../portal/Portal';
import Outline from '../outline/Outline';
import { Rect, Text } from 'react-konva';
import Konva from 'konva';

class Sticky extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: this.props.nextColor,
      editingStickyText: false,
      transformer: true,
      draggable: true,
      stickyTextHeight: 250,
      stickyTextWidth: 250,
      position: {
        x: this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125,
        y: this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10,
      },
      rotation: Math.floor(Math.random() * (11) - 5),
      textAreaValue: '',
      finalTextValue: '',
      textEditVisible: false,
      textX: 0,
      textY: 0,
    }
  }

  handleTextEdit(e) {
    this.setState({
      textAreaValue: e.target.value
    });
  }

  // on pressing enter, exit text edit
  handleTextareaKeyDown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.setState({
        finalTextValue: e.target.value,
        textEditVisible: false,
        draggable: true,
      });
    }
  }

  // On dbl click, set make text editor visible and focus on textedit
  handleTextDblClick(e) {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      finalTextValue: '', //hide the current sticky text
      textEditVisible: true,
      draggable: false,
      textX: absPos.x,
      textY: absPos.y,
    });
    let textarea = document.getElementById(this.props.id.toString());
    textarea.focus();
  }

  // On focus out/ blur of text area, leave editing mode
  handleBlur() {
    let textarea = document.getElementById(this.props.id.toString());
    this.setState({
      finalTextValue: textarea.value,
      textEditVisible: false,
      draggable: true,
      transformer: false,
    });
  }

  handleTransform(e) {
    console.log("transformed", e);
    // we can read attrs here and send them to store
  }

  handleClick() {
    this.setState({ transformer: true });
  }

  // focus on sticky text after mounting
  componentDidMount() {
    // need to put code within a setTimeout because
    // getElementById must happen after render
    setTimeout( () => {
      let textarea = document.getElementById(this.props.id.toString());
      textarea.focus();
      if (this.state.transformer) {
        const stage = this.transformer.getStage();
        const rectangle = stage.findOne('.' + this.props.id.toString());

        rectangle.to( {
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        this.transformer.attachTo(rectangle);
        this.transformer.getLayer().batchDraw();
      }
    });
  }

  componentDidUpdate() {
    setTimeout( () => {
      console.log('TIMEOUT');
      if (this.state.transformer) {
        const stage = this.transformer.getStage();
        const rectangle = stage.findOne('.' + this.props.id.toString());
        this.transformer.attachTo(rectangle);
        this.transformer.getLayer().batchDraw();
      }
    });
  }

  // Add cursor styling
  onMouseOver() {
    document.body.style.cursor = 'pointer';
  }
  onMouseOut() {
    document.body.style.cursor = 'default';
  }

  render() {
    return (
      <Outline
        x={this.props.x}
        y={this.props.y}
        scaleX={this.props.scaleX}
        id={this.props.id.toString()}
        transformer={this.state.transformer}
        obj={this.rect}
        >
        <Rect
          ref={node => { this.rect = node; }}
          name={this.props.id.toString()}
          width={250}
          height={250}
          fill={this.state.color}
          shadowColor={'black'}
          scaleX={1.1}
          scaleY={1.1}
          />
        <Text
          text={this.state.finalTextValue}
          fontSize={35}
          fontFamily={'Klee'}
          fill={'#555'}
          width={this.state.stickyTextWidth}
          height={this.state.stickyTextHeight}
          padding={20}
          align={'center'}
          listening={true}
          scaleX={1}
          scaleY={1}
          />
        <Portal>
          <textarea
            value={this.state.textAreaValue}
            id={this.props.id.toString()}
            style={{
              display: this.state.textEditVisible ? 'block' : 'none',
              position: 'absolute',
              top: this.state.textY + 'px',
              left: this.state.textX + 'px',
            }}
            onChange={(e) => this.handleTextEdit(e)}
            onKeyDown={(e) => this.handleTextareaKeyDown(e)}
            onBlur={() => this.handleBlur()}
            />
        </Portal>
      </Outline>
    );
  }
}

export default Sticky;
