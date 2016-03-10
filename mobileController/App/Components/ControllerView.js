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
    }
  }

  componentDidMount() {
    Orientation.lockToLandscapeRight(); //this will lock the view to Landscape   
    if(Dimensions.get('window').width===375) { //iPhone 6/6s
      this.setState({circleButtonSize: 62})
    } else if (Dimensions.get('window').width===414) { //iPhone 6+/6s+
      this.setState({circleButtonSize: 68})
    } else if (Dimensions.get('window').width===320) { //iPhone 5/5s
      this.setState({circleButtonSize: 53})
    }
  }

  render() {
  	StatusBarIOS.setHidden('true');
  	return (
  	  <View style={styles.imageContainer}>
  	    <Image source={require('./Assets/snescontrollercropped.jpg')} style={styles.image}> 

          <View style={styles.AButton}> 
            <TouchableOpacity>
              <IconIon name="record" size={this.state.circleButtonSize} color="#a82530"/>
            </TouchableOpacity>
          </View>

          <View style={styles.BButton}> 
            <TouchableOpacity>
              <IconIon name="record" size={this.state.circleButtonSize} color="#d9a04c"/>
            </TouchableOpacity>
          </View>

          <View style={styles.XButton}> 
            <TouchableOpacity>
              <IconIon name="record" size={this.state.circleButtonSize} color="#3645ba"/>
            </TouchableOpacity>
          </View>

          <View style={styles.YButton}> 
            <TouchableOpacity>
              <IconIon name="record" size={this.state.circleButtonSize} color="#428a43"/>
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
  }
});

module.exports = ControllerView;