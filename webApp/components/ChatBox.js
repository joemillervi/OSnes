import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  render() {
    return (
      <div className="height-60 margin-4">
        ChatBox
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
      </div>
    );
  }
}

export default ChatBox;
