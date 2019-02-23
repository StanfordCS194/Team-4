import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from '../portal/Portal';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

class Sticky extends React.Component {
  constructor(props) {
    super(props);

//    Todo: decide if we should keep random sticky colors using this array, maybe by default before a color is specified
//    const colors = ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865'];
    this.state = {
//      color: colors[Math.floor(Math.random() * colors.length)],
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

  handleClick(e) {
    this.setState({ transformer: true });
  }

  buildTransformer() {
    if (this.state.transformer) {
      return (
        <Transformer
          ref={node => { this.transformer = node; }}
          />
        );
    }
    return null;
  }

  // focus on sticky text after mounting
  componentDidMount() {
    // need to put code within a setTimeout because
    // getElementById must happen after render
    setTimeout( () => {
      console.log('TIMEOUT');
      this.setState({
        textEditVisible: true,
        draggable: false,
        textX: this.props.x - 125,
        textY: this.props.y,
      });
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

  // Raising and lowering animations
  onDragStart(e) {
    e.target.to({
        scaleX: 1.1,
        scaleY: 1.1,
        easing: Konva.Easings.ElasticEaseOut,
    });

    // make rect have shadow
    let rect = e.target.find('Rect')[0];
    rect.setAttrs({
        shadowOffsetX: 15,
        shadowOffsetY: 15,
    });
    e.target.moveToTop();
  }

  onDragEnd(e) {
      e.target.to({
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.ElasticEaseOut,
      });

      // remove shadow
      let rect = e.target.find('Rect')[0];
      rect.setAttrs({
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      });
  };

  render() {
    return (
      <Group
        draggable={this.state.draggable}
        name={this.props.id.toString()}
        id={this.props.id.toString()}
        scaleX={1}
        scaleY={1}
        x={this.state.position.x}
        y={this.state.position.y}
        rotation={this.state.rotation}
        onDblClick={(e) => this.handleTextDblClick(e)}
        onKeyPress={(e) => this.edit(e)}
        onClick={(e) => this.handleClick(e)}
        onTransform={(e) => this.handleTransform(e)}
        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseOut={(e) => this.onMouseOut(e)}
        onDragStart={(e) => this.onDragStart(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        >
        <Rect
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
        {this.buildTransformer()}
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
      </Group>
    );
  }
}

export default Sticky;