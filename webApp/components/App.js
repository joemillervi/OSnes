import React, { Component } from 'react';
import Navbar from './Navbar';
import GameConsole from './GameConsole';
import Sidebar from './Sidebar';
import { connect } from 'react-redux';
import actions from '../redux/actions';


const configURL = "http://10.7.12.213:3001";
const socket = io(configURL);

class App extends Component {

  componentDidMount() {
    var self = this;
    socket.on('sendVoteCount', function (voteCount) {
      self.props.dispatch(actions.tallyVotes(voteCount));
    });
  }

  render() {
    return (
      <div className="row height-100 no-bottom-margin">
        <Navbar />
        <GameConsole socket={socket} votes={this.props.votes} />
        <Sidebar socket={socket} />
      </div>
    );
  }

}

let mapStateToProps = function (state) {
  return state;
};

export default connect(mapStateToProps)(App);
