import React from 'react';
import { Transformer } from 'react-konva';

class TransformerComponent extends React.Component {

    componentDidMount() {
        this.checkNode();
    }

    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        // here we need to manually attach or detach Transformer node
        const stage = this.transformer.getStage();
        const { selectedCanvasObjectId } = this.props;
        const selectedNode = stage.findOne('#' + selectedCanvasObjectId.toString());

        // do nothing if selected node is already attached
        if (selectedNode === this.transformer.node()) {
            return;
        }

        if (selectedNode) {
            // attach to another node
            this.transformer.attachTo(selectedNode);
        } else {
            // remove transformer
            this.transformer.detach();
        }
        this.transformer.moveToTop();
        this.transformer.getLayer().batchDraw();
    }

    render() {
        return (
            <Transformer
                ref={node => {
                    this.transformer = node;
                }}
            />
        );
    }
}
export default TransformerComponent;