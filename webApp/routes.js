import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import React, { Component } from 'react';
import App from './components/App';
import OSnes from './components/OSnes';

module.exports = (
  <Route path="/">
    <IndexRoute component={App} />
    <Route path="/osnes" component={OSnes} />
  </Route>
);
