import React, { Component } from 'react';
import Chart from './barChart.js'

class CrowdChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: 0
    }
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('connections', (total) => {
      this.setState({
        connections: total
      });
    });
  }
  
  render() {
    return (
      <div className="col s4 height-100">
        <div className="row no-bottom-margin">
          <div className="left-algin col s3 push-s9">Votes</div>
          <div className="left-align col s9 pull-s3">Online: {this.state.connections}</div>
        </div>
        <Chart data={[35, 15, 4, 20, 9, 2, 0, 1]}/>
      </div>
    );
  }
}

export default CrowdChoice;
