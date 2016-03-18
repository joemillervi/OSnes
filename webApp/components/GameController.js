import React, { Component } from 'react';
import DPad from './DPad';
import StartAndSelect from './StartAndSelect';
import AandB from './AandB';

class GameController extends Component {
  render() {
    return (
      <div className="col s8 height-100 signature-color rounded-10 border-black">
        <div className="row game-controller-container height-90">
          <DPad />
          <StartAndSelect />
          <AandB />
        </div>
      </div>
    );
  }
}

export default GameController;
