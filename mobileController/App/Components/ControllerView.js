var React = require('react-native');
var IconIon = require('react-native-vector-icons/Ionicons');
var Orientation = require('react-native-orientation');
var api = require('../Utils/api');
var Settings = require('./Settings');
var _ = require('lodash');

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
} = React;

class ControllerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      circleButtonSize: undefined,
      arrowButtonSize: undefined,
    }
  }

  componentDidMount() {
    Orientation.lockToLandscapeRight(); //this will lock the view to Landscape

    //buttons must scale with size of the phone   
    if(Dimensions.get('window').width===375) { //iPhone 6/6s
      this.setState({
      	circleButtonSize: 62,
      	arrowButtonSize: 52
      })
    } else if (Dimensions.get('window').width===414) { //iPhone 6+/6s+
      this.setState({
      	circleButtonSize: 68,
      	arrowButtonSize: 58
      })
    } else if (Dimensions.get('window').width===320) { //iPhone 5/5s
      this.setState({
      	circleButtonSize: 53,
      	arrowButtonSize: 44
      })
    }
  }

  _APressIn() {
  	console.log('A pressed')
  }

  _APressOut() {
  	console.log('A released')
  }

  _BPressIn() {
  	console.log('B pressed')
  }

  _BPressOut() {
  	console.log('B released')
  }

  _XPressIn() {
  	console.log('X pressed')
  }

  _XPressOut() {
  	console.log('X released')
  }

  _YPressIn() {
  	console.log('Y pressed')
  }

  _YPressOut() {
  	console.log('Y released')
  }

  _upArrowPressIn() {
  	console.log('up arrow pressed')
  }

  _upArrowPressOut() {
  	console.log('up arrow released')
  }

  _downArrowPressIn() {
  	console.log('down arrow pressed')
  }

  _downArrowPressOut() {
  	console.log('down arrow released')
  }

  _rightArrowPressIn() {
  	console.log('right arrow pressed')
  }

  _rightArrowPressOut() {
  	console.log('right arrow released')
  }

  _leftArrowPressIn() {
  	console.log('left arrow pressed')
  }

  _leftArrowPressOut() {
  	console.log('left arrow released')
  }

  render() {
  	StatusBarIOS.setHidden('true');
  	return (
  	  <View style={styles.imageContainer}>
  	    <Image source={require('./Assets/snescontrollercropped.jpg')} style={styles.image}> 

          <View style={styles.AButton}> 
            <TouchableOpacity onPressIn={this._APressIn.bind(this)} onPressOut={this._APressOut.bind(this)}>
              <IconIon name="record" size={this.state.circleButtonSize} color="#a82530"/>
            </TouchableOpacity>
          </View>
          <View style={styles.BButton}> 
            <TouchableOpacity onPressIn={this._BPressIn.bind(this)} onPressOut={this._BPressOut.bind(this)}>
              <IconIon name="record" size={this.state.circleButtonSize} color="#d9a04c"/>
            </TouchableOpacity>
          </View>
          <View style={styles.XButton}> 
            <TouchableOpacity onPressIn={this._XPressIn.bind(this)} onPressOut={this._XPressOut.bind(this)}>
              <IconIon name="record" size={this.state.circleButtonSize} color="#3645ba"/>
            </TouchableOpacity>
          </View>
          <View style={styles.YButton}> 
            <TouchableOpacity onPressIn={this._YPressIn.bind(this)} onPressOut={this._YPressOut.bind(this)}>
              <IconIon name="record" size={this.state.circleButtonSize} color="#428a43"/>
            </TouchableOpacity>
          </View>

          <View style={styles.upButton}> 
            <TouchableOpacity underlayColor={'black'} onPressIn={this._upArrowPressIn.bind(this)} onPressOut={this._upArrowPressOut.bind(this)}>
              <IconIon name="stop" size={this.state.arrowButtonSize} color="transparent"/>
            </TouchableOpacity>
          </View>
          <View style={styles.downButton}> 
            <TouchableOpacity onPressIn={this._downArrowPressIn.bind(this)} onPressOut={this._downArrowPressOut.bind(this)} >
              <IconIon name="stop" size={this.state.arrowButtonSize} color="red"/>
            </TouchableOpacity>
          </View>
          <View style={styles.leftButton}> 
            <TouchableOpacity onPressIn={this._leftArrowPressIn.bind(this)} onPressOut={this._leftArrowPressOut.bind(this)} >
              <IconIon name="stop" size={this.state.arrowButtonSize} color="red"/>
            </TouchableOpacity>
          </View>
          <View style={styles.rightButton}> 
            <TouchableOpacity onPressIn={this._rightArrowPressIn.bind(this)} onPressOut={this._rightArrowPressOut.bind(this)}>
              <IconIon name="stop" size={this.state.arrowButtonSize} color="red"/>
            </TouchableOpacity>
          </View>


  	    </Image>
  	  </View>

  	);
  }
}

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
  AButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.3875,
  	left: Dimensions.get('window').height * 0.848,
  },
  BButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.5215,
  	left: Dimensions.get('window').height * 0.7525,
  },
  XButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.255,
  	left: Dimensions.get('window').height * 0.752,
  },
  YButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.3875,
  	left: Dimensions.get('window').height * 0.655,
  },
  rightButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.405,
  	left: Dimensions.get('window').height * 0.24,
  },
  downButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.51,
  	left: Dimensions.get('window').height * 0.18,
  },
  upButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.30,
  	left: Dimensions.get('window').height * 0.18,
  },
  leftButton: {
  	position: 'absolute',
  	top: Dimensions.get('window').width * 0.405,
  	left: Dimensions.get('window').height * 0.12,
  }
});

module.exports = ControllerView;