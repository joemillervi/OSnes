import React, { Component } from 'react';
import Navbar from './Navbar';
import GameConsole from './GameConsole';
import Sidebar from './Sidebar';

class App extends Component {

  render() {
    return (
      <div className="row">
        <Navbar />
        <GameConsole />
        <Sidebar />
      </div>
    );
  }

}

export default App;
