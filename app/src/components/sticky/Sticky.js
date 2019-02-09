import React, { Component, Fragment } from 'react';

class Sticky extends Component {
  render() {
    return (
      <div className="sticky" style={{height: '100px', width: '100px', backgroundColor: 'red'}}>
        <p className="writing">Hi there</p>
      </div>
    );
  }
}

export default Sticky;
