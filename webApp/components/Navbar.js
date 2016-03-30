import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <nav className="z-depth-3 deep-purple darken-4 height-12">
        <div className="nav-wrapper height-min-450px">
          <a className="brand-logo">crowd<span className="a-little-bigger">EMU</span></a>
          <a data-activates="slide-in" className="right button-collapse height-55px"><i className="material-icons height-55px">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li><a className="height-55px" href="/osnes">OSnes</a></li>
          </ul>
          <ul id="slide-in" className="side-nav">
            <li><a href="/osnes">OSnes</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
