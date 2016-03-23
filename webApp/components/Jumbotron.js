import React, { Component } from 'react';

class Jumbotron extends Component {
  render() {
  navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

  var peers = {
    'id': { // <- actual id
      'peer': null,
      'isConnected': false
    }
  };

  var outsideStream;
  var myID;
  this.props.socket.on('become-streamer', (idInfo) => {
    console.log('become-streamer')
    // get video stream
    navigator.getUserMedia({ video: true, audio: false }, (stream) => {
      // make stream global for peers who connect later
      outsideStream = stream;
      var video = document.getElementById('video-player')
      video.src = window.URL.createObjectURL(outsideStream)
      // create peer connections wil all sockets and stream to them
        idInfo.allIDs.forEach((id) => {
          if (idInfo.myID !== id) {
            peers[id] = {};
            peers[id].isConnected = false;
            peers[id].peer = new SimplePeer({ initiator: true, stream: stream, trickle: false})
            peers[id].peer.on('signal', (data) => {
              if (!peers[id].isConnected) {
                this.props.socket.emit('connect-to-peer', {id: id, SDP: data})
                peers[id].isConnected = true
              }
            })
          }
        })
    }, (error) => {
      console.log(error)
    })
  })

  // as new peers join give them the stream
  this.props.socket.on('new-peer', (id) => {
    console.log('new-peer', id)
    peers[id] = {};
    peers[id].peer = new SimplePeer({ initiator: true, stream: outsideStream, trickle: false })
    peers[id].peer.on('signal', (data) => {
      if (!peers[id].isConnected) {
        console.log(data)
        this.props.socket.emit('connect-to-peer', {id: id, SDP: data})
        peers[id].isConnected = true;
      }
    })
  })

  this.props.socket.on('signal-peer2', (data) => {
    console.log(data.id)
    console.log(peers[data.id].peer)
    // peers[data.id] = {};
    peers[data.id].peer.signal(data.SDP);
  })

  // if you are not the streamer connect with them
  this.props.socket.on('connect-to-streamers-peer', (data) => {
    console.log('connect-to-streamers-peer', data.SDP)
    // handle the case where video streamer is the peer
    console.log('not undefined:', peers[data.id])

      peers[data.id] = {};
      peers[data.id].isConnected = false;
      peers[data.id].peer = new SimplePeer();
      peers[data.id].peer.signal(data.SDP);
      peers[data.id].peer.on('signal', (SDP) => {
        if (!peers[data.id].isConnected) {
          this.props.socket.emit('signal-peer1', {id: data.id, SDP: SDP})
          peers[data.id].isConnected = true;
        }
      })
      peers[data.id].peer.on('stream',  (stream) => {
        // got remote video stream, now let's show it in a video tag
        var video = document.getElementById('video-player')
        console.log('video! stream', stream)
        video.src = window.URL.createObjectURL(stream)
        video.play()
      })
  })

  // turn off webcam if not streaming
  this.props.socket.on('stop-streaming', () => {
    console.log('stop-streaming')
    outsideStream.getVideoTracks()[0].stop();
    peers = {}; // clear all peers in case we become the streamer again
  })

return (<video id="video-player" width="400" height="300" autoPlay></video>)
}}

export default Jumbotron;
