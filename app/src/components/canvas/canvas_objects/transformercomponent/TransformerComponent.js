import React from 'react';
import { Transformer } from 'react-konva';

class TransformerComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.checkNode();
    }

    componentDidUpdate() {
        this.checkNode();
    }

    checkNode() {
        /**
         * If a node with this.props.selectedCanvasObjectId exists, attaches
         * a Transformer node to it. Otherwise, detaches the Transformer.
         *
         */
        const stage = this.transformer.getStage();
        const selectedCanvasObjectId  = this.props.selectedCanvasObjectId;
        const selectedNode = stage.findOne('#' + selectedCanvasObjectId.toString());

        // Do nothing if selected node is already attached
        if (selectedNode === this.transformer.node()) {
            return;
        }

        if (selectedNode) {
            this.transformer.attachTo(selectedNode);
        } else {
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
                enabledAnchors={this.props.enabledAnchors}
            />
        );
    }
}
export default TransformerComponent;