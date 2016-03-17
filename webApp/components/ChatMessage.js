import React, { Component } from 'react';

class ChatMessage extends Component {
  render() {
    return (
      <div className="row">
        <div className="left-align col s3">{this.props.message.by} : </div>
        <div className="left-algin col s9">{this.props.message.msg}</div>
      </div>
    );
  }
}

export default ChatMessage;
