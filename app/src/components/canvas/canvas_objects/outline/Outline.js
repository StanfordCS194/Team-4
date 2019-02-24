import React, { Component } from 'react';
import { render } from 'react-dom';
import Portal from '../portal/Portal';
import { Stage, Layer, Rect, Text, Group, Tween, Transformer } from 'react-konva';
import Konva from 'konva';

class Outline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transformer: this.props.transformer,
      draggable: true,
      position: {
        x: this.props.x / this.props.scaleX - this.props.stageX / this.props.scaleX - 125,
        y: this.props.y / this.props.scaleX - this.props.stageY / this.props.scaleX - 10,
      },
      rotation: Math.floor(Math.random() * (11) - 5),
    }
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

  componentDidMount() {
    // need to put code within a setTimeout because
    // getElementById must happen after render
    setTimeout( () => {
      if (this.state.transformer) {

        this.props.obj.to( {
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.ElasticEaseOut,
        });

        this.transformer.attachTo(this.props.obj);
        this.transformer.getLayer().batchDraw();
      }
    });
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


  render() {
    return (
      <Group
        draggable={this.state.draggable}
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
        {this.buildTransformer()}
      </Group>
    );
  }
}

export default Outline;
