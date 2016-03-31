import React, { Component } from 'react';
import StreamViewer from './StreamViewer';
import GameController from './GameController';
import CrowdChoice from './CrowdChoice';

class GameConsole extends Component {
  render() {
    return (
      <div className="col m8 s12 height-88 height-min-510px grey lighten-2">
        <div className="row no-bottom-margin height-70 margin-2">
          <StreamViewer socket={this.props.socket} />
        </div>
        <div className="row no-bottom-margin height-20 margin-2 min-height-150">
          <GameController socket={this.props.socket} />
          <CrowdChoice socket={this.props.socket} votes={this.props.votes} />
        </div>
      </div>
    );
  }
}


export default GameConsole;
