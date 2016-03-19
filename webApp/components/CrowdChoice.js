import React, { Component } from 'react';
import Chart from './barChart.js'

class CrowdChoice extends Component {
  
  render() {
    return (
      <div className="col s4 height-100">
        <div className="row no-bottom-margin">
          <div className="left-algin col s3 push-s9">Votes</div>
          <div className="left-align col s9 pull-s3">Online: 4</div>
        </div>
        <Chart data={[35, 15, 4, 20, 9, 2, 0, 1]}/>
      </div>
    );
  }
}

export default CrowdChoice;
