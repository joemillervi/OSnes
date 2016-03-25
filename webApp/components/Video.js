import React, { Component } from 'react';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: 0
    }
  }

  componentDidMount() {
    this.props.connectVideoToStream();
  }

  render() {
    return (
    <video className="height-30 margin-4 z-depth-1" id="video-player" width="400" height="300" autoPlay></video>
    );
  }
}

 // ['a', 'b', 'Up', 'Right', 'Down', 'Left', 'Start', 'Select']    [35, 15, 4, 20, 9, 2, 0, 1]

export default Video;
