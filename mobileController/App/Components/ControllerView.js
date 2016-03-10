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

    }
  }

  componentDidMount() {
    Orientation.lockToLandscapeRight(); //this will lock the view to Landscape   
  }

  render() {
  	StatusBarIOS.setHidden('true');
  	return (
  	  <View style={styles.imageContainer}>
  	    <Image source={require('./Assets/snescontroller.jpg')} style={styles.image}> 
  	      
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

});

module.exports = ControllerView;