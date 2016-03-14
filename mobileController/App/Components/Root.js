var React = require('react-native');
var QRReader = require('QRReader');

var {
  Navigator
} = React;

class Root extends React.Component {
  // console.log("HELLLOOOOOOOOOOOOOOO")
  constructor(props) {
    super(props);
    this.state = {
      hasLodedQROnce: false
    }
  }

  componentWillMount() {
    if (!hasLoadedQROnce) {
      this.props.navigator.push({
        component: QRReader,
        // give this to 
        changeRootState: (obj) => {
          this.setState(obj);
        }
      })
    } else {
      this.props.navigator.push({
        component: ControllerView
      })
    }
  }
}

module.exports = Root;
