import React, { Component } from 'react';



class StreamViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      lastImage: null
    };

    this.blobToImage = this.blobToImage.bind(this);
  }

  // getInitialState() {
  //   "data:image/png;base64,"
  // }

  componentDidMount() {
    var config = {};
    config.ioURL = "http://localhost:3001";
    var socket = io(config.ioURL)

    socket.on('frame',(data) => {
      console.log(this.state)
      if (this.state.lastImage && 'undefined' != typeof URL) {
        URL.revokeObjectURL(this.state.lastImage);
      }
      var src = this.blobToImage(data);
      this.setState({ 
        src: src,
        lastImage: src
      });

    });

  }

  blobToImage(imageData) {
    if (Blob && 'undefined' != typeof URL) {
      var blob = new Blob([imageData], {type: 'image/png'});
      return URL.createObjectURL(blob);
    } else if (imageData.base64) {
      return 'data:image/png;base64,' + imageData.data;
    } else {
      return 'about:blank';
    }
  }


  render() {
    return (
      <div id="game" className="height-100">
      <img alt="game" src={this.state.src} />
      </div>
    );
  }
}

export default StreamViewer;
