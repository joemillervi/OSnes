import React, { Component } from 'react';

class StartAndSelect extends Component {

  // sendButtonClick(button: string): void
  sendButtonClick(button) {
    this.props.socket.emit('move', button);
  }

  render() {
    return (
      <div className="col s4 height-100 centered game-controller-piece start-and-select">
        <table className="height-100">
          <tbody>
            <tr>
              <td className="no-select">Start</td>
              <td
                onClick={this.sendButtonClick.bind(this, 'start')}
                className="clickable"
              >
                <div className="oval-button"></div>
              </td>
            </tr>
            <tr>
              <td className="no-select">Select</td>
              <td
                onClick={this.sendButtonClick.bind(this, 'select')}
                className="clickable"
              >
                <div className="oval-button"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default StartAndSelect;
