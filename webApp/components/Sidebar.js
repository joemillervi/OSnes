import React, { Component } from 'react';
import ChatBox from './ChatBox';
import Jumbotron from './Jumbotron';

class Sidebar extends Component {
  render() {
    return (
      <div className="col s4">
        Sidebar
        <Jumbotron />
        <ChatBox />
      </div>
    );
  }
}

export default Sidebar;
