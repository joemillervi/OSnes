import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import Toggle from 'react-toggle';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{}],
      joined: false,
      input: '',
      placeholder: 'what\'s your name?',
      nickname: null,
      renderMoves: true
    };

    this.join = this.join.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSumbit = this.handleSumbit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    const { socket } = this.props;

    // Listen for socket connection
    socket.on('connect', () => {

      // Render a message telling the user they're connected
      var timestamp = new Date();
      this.renderMessage('Connected!', 'crowdMU', timestamp, true);

      // Check if this is a returning user, if so, join them to the game
      if (window.localStorage && localStorage.nickname) {
        this.join(localStorage.nickname);
      }
    });

    // Start listening for chats
    socket.on('message',(msg, by, timestamp) => {

      // Render all incoming chats as messages
      this.renderMessage(msg, by, timestamp, true);
    });

    // Start listening for moves
    socket.on('submitMove', (move, by, timestamp) => {
      move = 'Pushed ' + move.charAt(0).toUpperCase() + move.slice(1);

      // render moves as messages
      this.renderMessage(move, by, timestamp, false);
    })

  }

  // Pass message down to ChatMessage component. Message is either a chat or move
  renderMessage(msg, by, timestamp, isTrue) {
    var message = {
      msg: msg,
      by: by,
      date: timestamp,
      isChat: isTrue
    };

    var messages = this.state.messages
    messages.push(message)

    // Only keep most recent 200 messages (chats and moves)
    messages = messages.slice(-200);
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
    
    // If someone presses 'enter' on input box, run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {  
      this.handleSumbit(e.target.value.substr(0, 280), this.state.nickname);
    
    // Else update input state
    } else {
      this.setState({ input: e.target.value.substr(0, 280) });
    }

  }

  handleSumbit(msg, by) {
    const { socket } = this.props;

    // If message is empty, don't emit
    if (msg === '' ) return;
    

    // If joined already, render and emit message
    if (this.state.joined) {
      var timestamp = new Date();
      this.renderMessage(msg, by, timestamp, true)
      socket.emit('message', msg, timestamp);

    // else join the chat
    } else {
      this.join(msg);
    }

    // After emitting message, reset input to null
    this.setState({ input: '' }, ()=>{
    })

  }

  handleToggle (e) {
    this.setState({
      renderMoves: !this.state.renderMoves
    })
  }

  render() {
    return (
      <div className="height-60 grey lighten-4">
        <div className="messages">
          {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} renderMoves={this.state.renderMoves} />
          )}
        </div>
        <div className="input-field row no-bottom-margin">
          <input className="col s8 m9 l10 black-text .rounded-10 valign-wrapper" type="text" placeholder={this.state.placeholder} value={this.state.input} 
          onChange={this.handleInput} onKeyPress={this.handleInput} />
          <Toggle className="col s4 m3 l2 valign-wrapper" defaultChecked={this.state.renderMoves} onChange={this.handleToggle}/>
        </div>
      </div>
    );
  }
}

export default ChatBox;
