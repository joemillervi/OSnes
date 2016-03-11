var React = require('react-native');
var Camera = require('react-native-camera').default;
var IconIon = require('react-native-vector-icons/Ionicons');
var api = require('../Utils/api');
var ControllerView = require('./ControllerView');
var _ = require('lodash');
var BarcodeScanner = require('react-native-barcodescanner');

var {
  Dimensions,
  StyleSheet,
  Text,
  View,
  // TouchableHighlight,
  TouchableOpacity,
  Navigator,
  StatusBarIOS,
  AlertIOS,
  Platform
} = React;

class QRReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraTorchToggle: Camera.constants.TorchMode.off,
      handleFocusChanged: () => {},
      androidTorch: "off"
    }
  }

  // Android barcode scanner
  _barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
    //TODO: use the data (the IP address) to connect to the computer using an api.js helper function
    this.props.navigator.push({
      component: ControllerView,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {} //disable ability to swipe to pop back from ControllerView to QRReader once past the ip address page
      }
    });
  }

  // IOs barcode scanner
  _onBarCodeRead(e) {
    //format of QR code: https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=10.0.0.215
    AlertIOS.alert("QR Code Found", e.data);
    console.log("QR Code Found", e.data);

    //TODO: use the data (the IP address) to connect to the computer using an api.js helper function

    //open up the ControllerView with buttons
    this.props.navigator.push({
      component: ControllerView,
      sceneConfig: {
        ...Navigator.SceneConfigs.FloatFromBottom,
        gestures: {} //disable ability to swipe to pop back from ControllerView to QRReader once past the ip address page
      }
    });

  }

  // For Android
  _toggleTorch() {
    console.log(this.state.androidTorch)
    if (this.state.androidTorch === 'on') {
      this.setState({androidTorch: 'off'})
    }
    else {
      this.setState({androidTorch: 'on'})
    }
  }

  // For ios
  _torchEnabled() {
    this.state.cameraTorchToggle === Camera.constants.TorchMode.on ? this.setState({ cameraTorchToggle: Camera.constants.TorchMode.off }) : this.setState({ cameraTorchToggle: Camera.constants.TorchMode.on });
  }

  render() {
    // check for IOS specific

    if (Platform.OS === 'ios') {
      StatusBarIOS.setStyle('light-content');
      return (
        <View >
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            torchMode={this.state.cameraTorchToggle}
            aspect={Camera.constants.Aspect.Fill}
            onBarCodeRead={_.once(this._onBarCodeRead.bind(this))}
            defaultOnFocusComponent={ true }
            onFocusChanged={ this.state.handleFocusChanged }>

            <View style={styles.rectangleContainer}>
              <View style={styles.rectangle}/>
            </View>

            <View style={styles.bottomButtonContainer}>
                <TouchableOpacity onPress={this._torchEnabled.bind(this)} style={styles.flashButton} underlayColor={'#FC9396'}>
                  {this.state.cameraTorchToggle === Camera.constants.TorchMode.off ? <IconIon name="ios-bolt-outline" size={55} color="rgba(237,237,237,0.5)" style={styles.flashIcon} /> : <IconIon name="ios-bolt" size={55} color="rgba(237,237,237,0.5)" style={styles.flashIcon} />}
                </TouchableOpacity>
            </View>

          </Camera>
        </View>
      );
      // else if Android
    } else {
      console.log('android')
      return (

          <BarcodeScanner
            onBarCodeRead={_.once(this._barcodeReceived.bind(this))}
            style={{ flex: 1 }}
            torchMode={this.state.androidTorch}
            >
          <View style={styles.bottomButtonContainerAndroid}>
              <TouchableOpacity onPress={this._toggleTorch.bind(this)} style={styles.flashButton} underlayColor={'#FC9396'}>
                {this.state.androidTorch === 'off'? <IconIon name="ios-bolt-outline" size={55} color="rgba(237,237,237,0.5)" style={styles.flashIcon} /> : <IconIon name="ios-bolt" size={55} color="rgba(237,237,237,0.5)" style={styles.flashIcon} />}
              </TouchableOpacity>
          </View>
        </BarcodeScanner>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#ededed',
    backgroundColor: 'transparent',
  },

  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 15
  },
  bottomButtonContainerAndroid: {
    flexDirection: 'row',
    alignItems:'center',
    marginBottom: 15
  },
  flashButton: {
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: '#ededed',
    paddingLeft: 25
  },
  flashIcon: {
    width: 52.5,
    height: 55,
    backgroundColor: 'transparent'
  },
});

module.exports = QRReader;
