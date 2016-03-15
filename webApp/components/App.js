import React, { Component } from 'react';
import Navbar from './Navbar';
import GameConsole from './GameConsole';
import Sidebar from './Sidebar';

class App extends Component {

  render() {
    return (
      <div className="row">
        <h2>Here is where the rad stuff will go</h2>
        <Navbar />
        <GameConsole />
        <Sidebar />
      </div>
    );
  }

}

export default App;
