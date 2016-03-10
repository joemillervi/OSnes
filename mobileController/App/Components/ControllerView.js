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
  	  <View>
  	    <Text>Awesome controller goes here</Text>
  	  </View>
  	);
  }
}

var styles = StyleSheet.create({

});

module.exports = ControllerView;