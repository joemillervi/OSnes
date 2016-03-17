import React, { Component } from 'react';

class AandB extends Component {
  render() {
    return (
      <div className="col s4 height-100 centered game-controller-piece a-and-b">
        <table className="height-100">
          <tbody>
            <tr>
              <td>B</td>
              <td>A</td>
            </tr>
            <tr>
              <td>B</td>
              <td>A</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AandB;
