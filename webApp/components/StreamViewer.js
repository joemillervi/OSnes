import React, { Component, PropTypes } from 'react';



class StreamViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      lastImage: null
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('frame',(data) => {
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
      <img alt="game" className="responsive-img" style={{width: 100 + '%', height: 100 + '%'}} src={this.state.src} />
    );
  }
}

export default StreamViewer;
