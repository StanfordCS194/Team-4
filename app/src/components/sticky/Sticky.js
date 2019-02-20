import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from '../portal/Portal';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    const colors = ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865'];
    this.state = {
      color: colors[Math.floor(Math.random() * colors.length)],
      editingStickyText: false,
      dragable: true,
      stickyTextHeight: 250,
      stickyTextWidth: 250,
      position: {
        x: this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125,
        y: this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10,
      },
      rotation: Math.floor(Math.random() * (11) - 5),
      textValue: 'hi there',
      textEditVisible: false,
      textX: 0,
      textY: 0,
    }
  }

  // Sticky 'raises' when dragged
  // Todo: be implemented
  // The following is directly pasted from epiphany_canvas.js
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
  // Todo: be implemented
  // The following is directly pasted from epiphany_canvas.js
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


  handleTextEdit(e) {
    this.setState({
      textValue: e.target.value
    });
  }

  // on pressing enter, exit text edit
  handleTextareaKeyDown(e) {
    const KEY_CODE_ENTER = 13;
    if (e.keyCode === KEY_CODE_ENTER) {
      this.setState({
        textEditVisible: false,
        dragable: true,
      });
    }
  }

  // On dbl click, set make text editor visible and focus on textedit
  handleTextDblClick(e) {
    const absPos = e.target.getAbsolutePosition();
    this.setState({
      textEditVisible: true,
      dragable: false,
      textX: absPos.x,
      textY: absPos.y,
    });
    let textarea = document.getElementById(this.props.id.toString());
    textarea.focus();
  }

  // On focus out/ blur of text area, leave editing mode
  handleBlur() {
    this.setState({
      textEditVisible: false,
      dragable: true,
    });
  }

  // focus on sticky text after mounting
  componentDidMount() {
    // need to put code within a setTimeout because
    // getElementById must happen after render
    setTimeout( () => {
      this.setState({
        textEditVisible: true,
        dragable: false,
        textX: this.state.position.x,
        textY: this.state.position.y,
      });
      let textarea = document.getElementById(this.props.id.toString());
      textarea.focus();
    });
  }

  render() {
    return (
      <Group
        draggable={this.state.dragable}
        name={"stickyGroup"}
        id={this.props.id.toString()}
        scaleX={1}
        scaleY={1}
        x={this.state.position.x}
        y={this.state.position.y}
        rotation={this.state.rotation}
        dragStart={(e) => this.dragStart(e)}
        dragEnd={(e) => this.dragEnd(e)}
        onDblClick={(e) => this.handleTextDblClick(e)}
        onKeyPress={(e) => this.edit(e)}
        >
        <Rect
          width={250}
          height={250}
          fill={this.state.color}
          shadowColor={'black'}
          />
        <Text
          text={this.state.textValue}
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
            value={this.state.textValue}
            id={this.props.id.toString()}
            style={{
              display: this.state.textEditVisible ? 'block' : 'none',
              position: 'absolute',
              top: this.state.textY + 'px',
              left: this.state.textX + 'px'
            }}
            onChange={(e) => this.handleTextEdit(e)}
            onKeyDown={(e) => this.handleTextareaKeyDown(e)}
            onBlur={() => this.handleBlur()}
            />
        </Portal>
      </Group>
    );
  }

  real_render() {
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

export default Sticky;
