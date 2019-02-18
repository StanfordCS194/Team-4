import React, { Component } from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

class Sticky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865'],
      editingStickyText: false,
      dragable: true,
      stickyTextHeight: 0,
      stickyTextWidth: 250,
      position: {
        x: this.props.x - 125,
        y: this.props.y,
      }
    }
  }

  // Sticky 'raises' when dragged
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

  selectSticky(e) {

  }

  editText(e) {
    this.setState({editingStickyText: true}); // so delete here won't delete the sticky
    // Given a stickyGroup and its stickyText, edit the text using a textarea
    // If stickyGroup is null, just edit plainText
    // stage.draggable(false);
    // stage.off('wheel');

    // get state properties
    this.setState({dragable: false});
    textareaHeight = this.state.stickyTextHeight;
    textareaWidth = this.state.stickyTextWidth;
    textareaFontSize = 35 + 'px';

    if (this.props.creatingSticky) {
      var textPosition = {
        x: this.props.x - 125,
        y: this.props.y,
      }
      this.props.creatingSticky = false;
    } else {
      //editing existing sticky
      var textPosition = this.state.position;
    }

    stage.off('dblclick');

    var stageBox = stage.getContainer().getBoundingClientRect();

    var areaPosition = {
      x: textPosition.x + stageBox.left,
      y: textPosition.y + stageBox.top
    };

    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = stickyText.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y - 10 + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textareaWidth;
    textarea.style.height = textareaHeight;
    textarea.id = 'textarea_id';
    textarea.style.fontFamily = 'Klee';
    textarea.style.fontSize = textareaFontSize;

    textarea.focus();

    stickyText.text("");
    layer.draw();

    stage.on('click', () => exitEditText(stickyText, textarea, stickyGroup));
    textarea.onkeypress = (() => {
      let key = window.event.keyCode;
      if (key === KEY_CODE_DELETE_1 || key === KEY_CODE_DELETE_2) {
        window.event.stopImmediatePropagation();
      }
      if (key == KEY_CODE_ENTER) {
        exitEditText(stickyText, textarea, stickyGroup, );
      }
    });
  }

  render() {
    let rotation = Math.floor(Math.random() * (11) - 5);
    return (
      <Group
        draggable={this.state.dragable}
        name={"stickyGroup"}
        scaleX={1}
        scaleY={1}
        x={this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125}
        y={this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10}
        id={this.props.id.toString()}
        rotation={rotation}
        dragStart={(e) => this.dragStart(e)}
        dragEnd={(e) => this.dragEnd(e)}
        onClick={(e) => this.selectSticky(e)}
        onDblClick={(e) => this.editText(e)}
        >
        <Rect
          width={250}
          height={250}
          fill={this.state.colors[Math.floor(Math.random() * this.state.colors.length)]}
          />
        <Text
          text={'hi there'}
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
