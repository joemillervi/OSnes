import React, { Component } from 'react';

class OSnesComingSoon extends Component {

  render() {
    return (
      <a id="back" href="/"><i class="fa fa-chevron-left"></i> Back to CrowdEMU</a>
      <h1 class="coming-soon">Coming Soon</h1>
      <h3 class="coming-soon">to the Chrome Store</h3>
      <img id="loading-gif" src="assets/images/snesgif.gif" alt="">
      <h3 id="pitch" class="coming-soon"></h3>
    );
  }

}

export default OSnesComingSoon;
