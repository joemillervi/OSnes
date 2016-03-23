import React, { Component } from 'react';
import DPad from './DPad';
import StartAndSelect from './StartAndSelect';
import AandB from './AandB';

class GameController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listenForKeyPress: false
    };
  }

  onFocus(e) {
    this.setState({
      listenForKeyPress: true
    })
  }

  onBlur(e) {
    this.setState({
      listenForKeyPress: false
    })
  }

  handleKeyPress(e) {
    // If controller is not in focus, ignore keypresses
    if (!this.state.listenForKeyPress) return;

    // Else emit keypress to emulator
    var key = e.keyCode;

    var keys = {
      65: 'a',
      66: 'b',
      13: 'start',
      16: 'select',
      38: 'up',
      40: 'down',
      37: 'left',
      39: 'right'
    };

    var button = keys[key];

    // If keypress is not a button we care about, don't emit
    if(!button) return

    this.props.socket.emit('submitMove', button);
  }

  render() {
    return (
      <div tabIndex={1} onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)} 
      onKeyDown={this.handleKeyPress.bind(this)}
      className="col s8 z-depth-3 height-100 signature-color border-black">
        <div className="row game-controller-container height-90">
          <DPad socket={this.props.socket} />
          <StartAndSelect socket={this.props.socket} />
          <AandB socket={this.props.socket} />
        </div>
      </div>
    );
  }
}

export default GameController;
