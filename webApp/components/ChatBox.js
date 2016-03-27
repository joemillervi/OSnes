import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import Toggle from 'react-toggle';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'what\'s your name?',
      nickname: null,
      joined: false,
      messages: [{}],
      displayMoves: true,
      chatInput: '',
      imageInput: '',
      videoInput: ''
    };

    this.join = this.join.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.handleChatInput = this.handleChatInput.bind(this)
    this.handleImageInput = this.handleImageInput.bind(this)
    this.handleVideoInput = this.handleVideoInput.bind(this)
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

  // join user to the game. Fires automatically for returning users, otherwise fires when first message is entered
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


  handleChatInput(e) {
    
    // If someone presses 'enter' on input box, run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {  
      this.handleSumbit(this.state.chatInput, this.state.nickname);
    
    // Else update input state
    } else {
      this.setState({ chatInput: e.target.value.substr(0, 280) });
    }

  }

  handleImageInput(e) {

    // If someone presses 'enter' on input box, run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {

      // convert to image markdown syntax and then submit
      var image = '![image](' + this.state.imageInput + ')'
      this.handleSumbit(image, this.state.nickname);

    // Else update input state
    } else {
      this.setState({ imageInput: e.target.value.substr(0, 280) });
    }
  }

  handleVideoInput(e) {

    // If someone presses 'enter' on input box, run the submit handler
    if (e.charCode === 13 || e.keyCode === 13) {
      // convert to video markdown syntax and then submit
      var video = '[![video]()](' + this.state.videoInput + ')';
      this.handleSumbit(video, this.state.nickname);

    // Else update input state
    } else {
      this.setState({ videoInput: e.target.value.substr(0, 280) });
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
    this.setState({
      chatInput: '',
      imageInput: '',
      videoInput: ''
    })

  }

  handleToggle (e) {
    this.setState({
      displayMoves: !this.state.displayMoves
    })
  }

  render() {
    return (
      <div className="height-60 grey lighten-4">
        <div className="messages">
          {this.state.messages.map ((message, index) =>
          <ChatMessage message={message} key={index} displayMoves={this.state.displayMoves} />
          )}
        </div>
        <div className="input-field grey lighten-4 row no-bottom-margin card">
          <input className="col s7 m8 l9 black-text .rounded-10 valign-wrapper" type="text" placeholder={this.state.placeholder} 
            value={this.state.chatInput} onChange={this.handleChatInput} onKeyPress={this.handleChatInput} />
          <Toggle className="right col s4 m3 l2 valign-wrapper" defaultChecked={this.state.displayMoves} onChange={this.handleToggle}/>
          <div className="right col s1 m1 l1 card-title activator">
            <i className="material-icons">more_vert</i>
          </div>
          <div className="card-reveal grey lighten-4">
            <span className="card-title">Paste an image or youtube link below<i className="material-icons right">close</i></span>
            <div className="input-field row no-bottom-margin">
              <input className="col s7 m8 l9 black-text .rounded-10" type="text" placeholder="Image"
                value={this.state.imageInput}  onChange={this.handleImageInput} onKeyPress={this.handleImageInput}/>
            </div>
            <div className="input-field row no-bottom-margin">
              <input className="col s7 m8 l9 black-text .rounded-10" type="text" placeholder="Video"
                value={this.state.videoInput} onChange={this.handleVideoInput} onKeyPress={this.handleVideoInput}/>
            </div>
          </div>
        </div>
        <p className="grey lighten-4" style={ (this.state.chatInput) ? reveal : hide }>
        *italic*,   **bold**,   **_combined_**,   ~~strikethrough~~
        </p>
      </div>
    );
  }
}

export default ChatBox;

var reveal = {
  color: '#9e9e9e',
  fontSize: '0.8em',
  wordSpacing: '1em'
}

var hide = {
  display: 'hide',
  color: '#f5f5f5',
  fontSize: '0.8em',
  wordSpacing: '1em'
}
