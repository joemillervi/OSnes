import React from 'react';
import { render } from 'react-dom';
import App from '../components/App';
import configureStore from '../redux/configureStore';
import { Provider } from 'react-redux';

// Make the socket connection globally available
var config = {};
config.ioURL = "http://localhost:3001";
window.socket = io(config.ioURL);

let initialState = {};

let store = configureStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

$(document).ready(function () {

  $('.button-collapse').sideNav({
    edge: 'right'
  });

  // Styling for game controller hovers
  $('.a-and-b tr td:last-child')
    .mouseover(function () {
      $(this).parent().next().find('td').last().toggleClass('red-text');
    })
    .mouseout(function () {
      $(this).parent().next().find('td').last().toggleClass('red-text');
    });

  $('.a-and-b tr td:first-child')
    .mouseover(function () {
      $(this).parent().next().find('td').first().toggleClass('red-text');
    })
    .mouseout(function () {
      $(this).parent().next().find('td').first().toggleClass('red-text');
    });

  $('.start-and-select tr:first-child td:last-child')
    .mouseover(function () {
      $(this).prev().toggleClass('red-text');
    })
    .mouseout(function () {
      $(this).prev().toggleClass('red-text');
    });

  $('.start-and-select tr:last-child td:last-child')
    .mouseover(function () {
      $(this).prev().toggleClass('red-text');
    })
    .mouseout(function () {
      $(this).prev().toggleClass('red-text');
    });

});
