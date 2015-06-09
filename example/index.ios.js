/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var DoubleBuffer = require('react-native-double-buffer');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component
} = React;

class MyComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('sent I\'m ready message');
      this.props.isReady();
    }, 1000);
  }

  render() {
    return (
      <View style={{ flex:1, backgroundColor: this.props.color }}></View>
    );
  }
}

class example extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var dBuffer = this.refs.dBuffer;

    // dBuffer.requestBuffer({ color: 'red' });
    //
    // setTimeout(() => {
    //   dBuffer.requestBuffer({ color: 'yellow' });
    // }, 4000);
    //
    // setTimeout(() => {
    //   dBuffer.requestBuffer({ color: 'black' });
    // }, 8000);
  }

  render() {
    return (
      <DoubleBuffer
        ref="dBuffer"
        initProps={{ color: 'blue' }}
        component={MyComponent}/>
    );
  }
}

AppRegistry.registerComponent('example', () => example);
