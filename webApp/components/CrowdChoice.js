import React, { Component } from 'react';
import Chart from './barChart.js'

class CrowdChoice extends Component {

  render() {
    return (
      <div className="col s4 height-100">
        CrowdChoice
        <Chart data={this.props.votes}/>
      </div>
    );
  }
}

 // ['a', 'b', 'Up', 'Right', 'Down', 'Left', 'Start', 'Select']    [35, 15, 4, 20, 9, 2, 0, 1]

export default CrowdChoice;
