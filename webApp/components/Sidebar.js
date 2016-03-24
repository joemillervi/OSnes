import React, { Component } from 'react';
import ChatBox from './ChatBox';
import Jumbotron from './Jumbotron';

class Sidebar extends Component {
  render() {
    return (
      <div className="col s12 m4 signature-color height-90">
        <Jumbotron />
        <ChatBox socket={this.props.socket} />
      </div>
    );
  }
}

export default Sidebar;
