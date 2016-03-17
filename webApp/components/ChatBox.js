import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [ { msg: 'I\'ma Wario, I\'ma gonna win!', by: 'Wario'}]
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('message',(msg, by) => {
      var message = {
        msg: msg,
        by: by
      }
      var messages = this.state.messages
      messages.push(message)
      this.setState({ 
        messages: messages
      });
    });
  }

  render() {
    return (
      <div className="height-60 margin-4">
        ChatBox
        {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} />
        )}
      </div>
    );
  }
}

export default ChatBox;
