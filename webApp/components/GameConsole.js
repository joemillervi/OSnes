import React, { Component } from 'react';
import StreamViewer from './StreamViewer';
import GameController from './GameController';
import CrowdChoice from './CrowdChoice';

class GameConsole extends Component {
  render() {
    return (
      <div className="col m8 s12 height-90 height-min-110px">
        <div className="row no-bottom-margin height-70 margin-2">
          <StreamViewer />
        </div>
        <div className="row no-bottom-margin height-20 margin-2">
          <GameController />
          <CrowdChoice />
        </div>
      </div>
    );
  }
}


export default GameConsole;
