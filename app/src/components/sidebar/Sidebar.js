import React, { Component } from 'react';

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tools: ['sticky', 'paint', 'picture'],
    };
  }

  createToolDivs() {
    let tools = [];
    for (let i = 0; i < this.state.tools.length; i++) {
      tools.push(<div key={this.state.tools[i]}> {this.state.tools[i]} </div>);
    }
    const res = (
      <div className="tools"></div>
    );
    return res;
  }

  render() {
    return (
      <div className="toolbar">
        {this.createToolDivs()}
      </div>
    );
  }
}

export default Toolbar;
