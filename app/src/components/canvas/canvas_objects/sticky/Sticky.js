import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from '../portal/Portal';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';
import Textarea from "../textarea/Textarea";

class Sticky extends React.Component {
  constructor(props) {
    super(props);

//    Todo: decide if we should keep random sticky colors using this array, maybe by default before a color is specified
//    const colors = ['#fffdd0', '#2ec4b6', '#e71d36', '#ff9f1c', '#BD509E', '#A1C865'];
    this.state = {
//      color: colors[Math.floor(Math.random() * colors.length)],
      color: this.props.nextColor,
      editingStickyText: false,
      draggable: true,
      position: {
        x: this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - this.props.width / 2,
        y: this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10,
      },
      rotation: Math.floor(Math.random() * (11) - 5),
      textAreaValue: '',
      finalTextValue: '',
      textEditVisible: true,
      textX: this.props.x - this.props.width / 2,
      textY: this.props.y,
    };
    this.sticky = React.createRef();
  }

  handleTransform(e) {
    // Update the scaleX and scaleY of sticky after transforming
    this.setState({
      scaleX: e.currentTarget.attrs.scaleX,
      scaleY: e.currentTarget.attrs.scaleY
    })
  }

  addTransformerToComponent() {
    const stage = this.transformer.getStage();
    const rectangle = stage.findOne('.' + this.props.id.toString());
    this.transformer.attachTo(rectangle);
    this.transformer.getLayer().batchDraw();
  }

  // focus on sticky text after mounting
  componentDidMount() {
    // need to put code within a setTimeout because
    // getElementById must happen after render
    setTimeout( () => {
      let textarea = document.getElementById(this.props.id.toString());
      textarea.focus();
      console.log(this.sticky);
      this.sticky.current.to({
        scaleX: 1,
        scaleY: 1,
        easing: Konva.Easings.ElasticEaseOut,
      });
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
        scaleX: 1.1 * e.target.attrs.scaleX,
        scaleY: 1.1 * e.target.attrs.scaleY,
        easing: Konva.Easings.ElasticEaseOut,
    });

    // make rect have shadow
    let rect = e.target.find('Rect')[0];
    rect.setAttrs({
        shadowOffsetX: 15,
        shadowOffsetY: 15,
    });
    e.target.moveToTop();
    e.target.getStage().findOne('Transformer').moveToTop();
  }

  onDragEnd(e) {
      e.target.to({
        scaleX: e.target.attrs.scaleX / 1.1,
        scaleY: e.target.attrs.scaleY / 1.1,
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
        x={this.state.position.x}
        y={this.state.position.y}
        rotation={this.state.rotation}
        // onDblClick={(e) => this.handleTextDblClick(e)}
        onKeyPress={(e) => this.edit(e)}
        onTransform={(e) => this.handleTransform(e)}
        onMouseOver={(e) => this.onMouseOver(e)}
        onMouseOut={(e) => this.onMouseOut(e)}
        onDragStart={(e) => this.onDragStart(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        scaleX={this.props.scale}
        scaleY={this.props.scale}
        >
        <Rect
          ref={this.sticky}
          width={this.props.width}
          height={this.props.height}
          fill={this.state.color}
          shadowColor={'black'}
          scaleX={1.1}
          scaleY={1.1}
          />
          <Textarea
              id={this.props.id}
              textEditVisible={this.state.textEditVisible}
              finalTextValue={this.state.finalTextValue}
              width={this.props.width}
              height={this.props.height}
              fontSize={this.props.fontSize}
              textareaX={this.state.textX}
              textareaY={this.state.textY}
              textX={this.state.position.x}
              textY={this.state.position.y}
            />
      </Group>
    );
  }
}

export default Sticky;
