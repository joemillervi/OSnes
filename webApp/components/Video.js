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
          <div className="video-player-wrapper z-depth-1">
            <video id="video-player" height="230" autoPlay></video>
          </div>
          );
    }
}

export default Video;
