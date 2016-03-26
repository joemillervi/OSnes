import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Timeago from 'react-timeago'
import marked from 'marked-for-chat'

class ChatMessage extends Component {

  componentDidMount () {
    // Set markdown preferences
    marked.setOptions({
      sanitize: true,
      renderer: new marked.Renderer(),
      gfm: true,
      tables: false,
      breaks: false,
      pedantic: false,
      smartLists: false,
      smartypants: false
    });

    // Scroll to the bottom on each new message
    var node = ReactDom.findDOMNode(this);
    node.scrollIntoView(false);
  }


  rawMarkdown () {
    // parse chats for markdown syntax
    return { __html: marked(this.props.message.msg, {sanitize: true}) };
  }

  renderChat() {
    return (
      <div>
        <div className="row no-bottom-margin">
          <b className="left-align black-text">{this.props.message.by}  </b>
          <Timeago date={this.props.message.date} live={false} minPeriod={60} className="grey-text lighten-4 message-timestamp"/>
        </div>
        <div className="left-algin black-text" dangerouslySetInnerHTML={this.rawMarkdown()}/>
      </div>
    );
  }

  renderMove() {
    console.log('renderMove', this.props.message.msg)
    return (
      <div>
        <div className="row no-bottom-margin">
          <b className="left-align black-text">{this.props.message.by}  </b>
          <b className="left-algin move">{this.props.message.msg}  </b>
          <Timeago date={this.props.message.date} live={false} minPeriod={60} className="grey-text lighten-4 message-timestamp"/>
        </div>
      </div>
    );
  }


  render() {
    // If there is no socket connection, don't try to render messages
    if (!this.props.message.date) {
      return (<div></div>);
    }

    // If message is a chat, render as a chat
    if(this.props.message.isChat) {
      return this.renderChat();
    }

    // If message is a move and moves are toggled to display, render move
    if(!this.props.message.isChat && this.props.displayMoves) {
      return this.renderMove();

    // Don't render move because they're toggled to not display
    } else {
      return (<div></div>);
    }
  }
}

export default ChatMessage;
