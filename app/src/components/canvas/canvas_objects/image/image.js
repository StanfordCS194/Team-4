import React from "react";
import { Image } from "react-konva";


class ImageComponent extends React.Component {
    state = {
        image: null,
        src:this.props.src
    };

    componentDidMount() {
        this.updateImg();
    }

    componentDidUpdate() {
        this.updateImg();
    }

    updateImg() {
        const image = new window.Image();
        image.src = this.props.src;
        image.onload = () => {
            // setState will redraw layer, but doing so creates infinite loop
            this.state.image = image;
        };
    }

    render() {
        return <Image
            draggable={true}
            image={this.state.image} />;
    }
}
export default ImageComponent;