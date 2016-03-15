import React, { Component } from 'react';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import StreamViewer from './StreamViewer';
import GameController from './GameController';

class App extends Component {

  render() {
    return (
      <div>
        <h1>Here is where rad stuff will go</h1>
        <Navbar />
        <ChatBox />
        <StreamViewer />
        <GameController />
      </div>
    );
  }

}

export default App;
