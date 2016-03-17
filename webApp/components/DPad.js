import React, { Component } from 'react';

class DPad extends Component {
  render() {
    return (
      <div className="col s4 no-margin height-100 game-controller-piece dpad">
        <table className="height-100">
          <tbody>
            <tr>
              <td rowSpan="2"><i className="material-icons">keyboard_arrow_left</i></td>
              <td><i className="material-icons">keyboard_arrow_up</i></td>
              <td rowSpan="2"><i className="material-icons">keyboard_arrow_right</i></td>
            </tr>
            <tr>
              <td><i className="material-icons">keyboard_arrow_down</i></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DPad;
