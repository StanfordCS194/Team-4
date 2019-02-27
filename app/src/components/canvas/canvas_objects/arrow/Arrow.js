import React, { Component } from "react";
import { render } from "react-dom";
import { Shape } from "react-konva";


class Arrow extends React.Component {

    render() {
        return <Shape
            sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(20, 100);
                context.lineTo(200, 80);
                context.quadraticCurveTo(150, 100, 200, 150);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
            }}
            x={500}
            y={150}
            fill="#A1C865"
            draggable={true}
        />;
    }
}
export default Arrow;