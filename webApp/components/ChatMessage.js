import React, { Component } from 'react';
import Timeago from '../node_modules/react-timeago/timeago'
import marked from '../node_modules/marked/lib/marked.js'

class ChatMessage extends Component {

  componentDidMount () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: false,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: false,
      smartypants: false
    });
  }

  rawMarkup () {
      return { __html: marked(this.props.message.msg, {sanitize: true}) };
  }

  render() {

    // If there is no socket connection, don't render chats
    if (!this.props.message.date) {
      return (<div></div>)
    }

    // Render chats
    return (
      <div className="">
        <div className="row no-bottom-margin">
          <b className="left-align black-text no-bottom-margin">{this.props.message.by}  </b>
          <Timeago date={this.props.message.date} live={false} minPeriod={60} className="grey-text lighten-4 chat-date"/>
        </div>
        <div className="left-algin black-text no-bottom-margin" dangerouslySetInnerHTML={this.rawMarkup()}/>
      </div>
    );
  }
}

export default ChatMessage;
