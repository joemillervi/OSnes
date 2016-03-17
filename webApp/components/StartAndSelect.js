import React, { Component } from 'react';

class StartAndSelect extends Component {
  render() {
    return (
      <div className="col s4 height-100 centered game-controller-piece start-and-select">
        <table className="height-100">
          <tbody>
            <tr>
              <td className="no-select">Start</td>
              <td className="clickable"><div className="oval-button"></div></td>
            </tr>
            <tr>
              <td className="no-select">Select</td>
              <td className="clickable"><div className="oval-button"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default StartAndSelect;
