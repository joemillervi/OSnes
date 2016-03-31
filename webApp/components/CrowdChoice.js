import React, { Component } from 'react';
import Chart from './Chart.js'

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
      <div className="col s4 z-index-minus-20">
        <div className="row no-bottom-margin">
          <b className="left-algin col s3 push-s9">Votes</b>
          <b className="left-align col s9 pull-s3">Online: {this.state.connections}</b>
        </div>
        <Chart data={this.props.votes}/>
        <div className="clear"></div>
      </div>
    );
  }
}

 // ['a', 'b', 'Up', 'Right', 'Down', 'Left', 'Start', 'Select']    [35, 15, 4, 20, 9, 2, 0, 1]

export default CrowdChoice;
