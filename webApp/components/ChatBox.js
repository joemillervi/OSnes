import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  render() {
    return (
      <div>
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
