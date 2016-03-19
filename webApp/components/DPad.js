import React, { Component } from 'react';

class DPad extends Component {

  // sendButtonClick(button: string): void
  sendButtonClick(button) {
    this.props.socket.emit('move', button);
  }

  render() {
    return (
      <div className="col s4 no-margin height-100 game-controller-piece dpad">
        <table className="height-100">
          <tbody>
            <tr>
              <td
                onClick={this.sendButtonClick.bind(this, 'left')}
                rowSpan="2"
              >
                <i className="material-icons">keyboard_arrow_left</i>
              </td>
              <td
                onClick={this.sendButtonClick.bind(this, 'up')}
              >
                <i className="material-icons">keyboard_arrow_up</i>
              </td>
              <td
                onClick={this.sendButtonClick.bind(this, 'right')}
                rowSpan="2"
              >
                <i className="material-icons">keyboard_arrow_right</i>
              </td>
            </tr>
            <tr>
              <td
                onClick={this.sendButtonClick.bind(this, 'down')}
              >
                <i className="material-icons">keyboard_arrow_down</i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DPad;
