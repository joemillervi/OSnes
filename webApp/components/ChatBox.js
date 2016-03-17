import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [ { msg: 'I\'ma Wario, I\'ma gonna win!', by: 'Wario'}],
      connected: 'No'
    };
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on('connect', () => {
      console.log('connected!')
      this.setState({
        connected: 'Yes!'
      })
    });

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
        <div>Connected? {this.state.connected}</div>
        {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} />
        )}
      </div>
    );
  }
}

export default ChatBox;
