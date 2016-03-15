import React, { Component } from 'react';
import ChatBox from './ChatBox';
import Jumbotron from './Jumbotron';

class Sidebar extends Component {
  render() {
    return (
      <div className="col s4 hide-on-small-and-down">
        Sidebar
        <Jumbotron />
        <ChatBox />
      </div>
    );
  }
}

export default Sidebar;
