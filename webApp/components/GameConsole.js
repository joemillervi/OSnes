import React, { Component } from 'react';
import StreamViewer from './StreamViewer';
import GameController from './GameController';

class GameConsole extends Component {
  render() {
    return (
      <div className="col s8">
        GameConsole
        <StreamViewer />
        <GameController />
      </div>
    );
  }
}


export default GameConsole;
