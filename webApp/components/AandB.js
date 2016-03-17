import React, { Component } from 'react';

class AandB extends Component {
  render() {
    return (
      <div className="col s4 height-100 centered game-controller-piece a-and-b">
        <table className="height-100">
          <tbody>
            <tr>
              <td className="td-60 clickable"><div className="circle-button b-button"></div></td>
              <td className="td-60 clickable"><div className="circle-button a-button"></div></td>
            </tr>
            <tr>
              <td className="td-40 no-select">B</td>
              <td className="td-40 no-select">A</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AandB;
