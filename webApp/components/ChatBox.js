import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  render() {
    return (
      <div>
        <p>ChatBox</p>
        <ChatMessage />
      </div>
    );
  }
}

export default ChatBox;
