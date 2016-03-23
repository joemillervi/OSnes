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
    // start listening for emulator frames
    const { socket } = this.props;
    socket.on('frame',(data) => {
      if (this.state.lastImage && 'undefined' != typeof URL) {
        URL.revokeObjectURL(this.state.lastImage);
      }

      // convert frame into image
      var src = this.blobToImage(data);
      
      // update component img tag with src
      this.setState({
        src: src,
        lastImage: src
      });

    });

  }

  // convert emulator frames to images
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
    //if there's no image, show loading gif
    if(!this.state.src) {
      return(
        <img src='https://www.bcw.edu/cs/groups/images/documents/images/zglu/z19p/~edisp/loading_icon.gif' 
        className="center-align loading"/>
      );

    // Render emulator
    } else {    
      return (
        <img alt="game" className="z-depth-3 responsive-img" style={{width: 100 + '%', height: 100 + '%'}} src={this.state.src} />
      );
    }
  }
}

export default StreamViewer;
