import React, { Component } from 'react';
import ChatMessage from './ChatMessage';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [ {}],
      joined: false,
      input: '',
      placeholder: 'what\'s your name?',
      nickname: null
    };

    this.join = this.join.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSumbit = this.handleSumbit.bind(this)
  }

  componentDidMount() {
    const { socket } = this.props;

    // Listen for socket connection
    socket.on('connect', () => {

      // Render a message telling the user they're connected
      var timestamp = new Date();
      this.renderMessage('Connected!', 'crowdMU', timestamp)

      // Check if this is a returning user, if so, join them to the game
      if (window.localStorage && localStorage.nickname) {
        this.join(localStorage.nickname);
      }
    });

    // Start listening for messages
    socket.on('message',(msg, by, timestamp) => {
      this.renderMessage(msg, by, timestamp) 
    });
  }

  // Pass message down to ChatMessage children
  renderMessage(msg, by, timestamp) {
    var message = {
      msg: msg,
      by: by,
      date: timestamp
    }

    var messages = this.state.messages
    messages.push(message)
    messages = messages.slice(-50);
    this.setState({ 
      messages: messages
    });
  }

  // join user to the game
  join(data) {
    const { socket } = this.props;
    var nickname = data;
    // Try-catch necessary because Safari might have locked setItem causing
    // exception
    try {
      if (window.localStorage) localStorage.nickname = data;
    } catch (e) {}

    // Emit user data upon join and update component state
    socket.emit('join', data);
    this.setState({
      joined: true,
      placeholder: '',
      nickname: nickname
    })
  }

  handleInput(e) {
    
    //If it is called by someone pressing enter, then run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {  
      this.handleSumbit(e.target.value.substr(0, 280), this.state.nickname);
    
    //Update component state
    } else {
      this.setState({ input: e.target.value.substr(0, 280) });
    }

  }

  handleSumbit(msg, by) {
    const { socket } = this.props;

    // If message is empty, don't emit
    if (msg === '' ) return;
    

    // If joined already, render and emit message, else join the chat
    if (this.state.joined) {
      var timestamp = new Date();
      this.renderMessage(msg, by, timestamp)
      socket.emit('message', msg, timestamp);
    } else {
      this.join(msg);
    }

    // Set input to null
    this.setState({ input: '' }, ()=>{
    })

  }

  render() {
    return (
      <div className="height-60 grey lighten-4">
        <div>{this.state.joined}</div>
        <div className="chats">
          {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} />
          )}
        </div>
        <div className="input-field">
          <input className="black-text .rounded-10" type="text" placeholder={this.state.placeholder} value={this.state.input} 
          onChange={this.handleInput} onKeyPress={this.handleInput} />
        </div>
      </div>
    );
  }
}

export default ChatBox;
