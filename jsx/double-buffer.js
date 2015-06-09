'use strict';

var React = require('react-native');

var {
  Component,
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
});

class DoubleBuffer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      buffers: []
    };

    if (props.initProps) {
      this.state.isLoading = true;
      this.requestBuffer(props.initProps, true);
    }
  }

  getAvailableBuffer() {
    var buffers = this.state.buffers;

    switch (buffers.length) {
      case 0:
        return 'buffer1';
      case 1:
        return buffers[0].name === 'buffer2'? 'buffer1' : 'buffer2';
      default:
        return null;
    }
  }

  requestBuffer(props, noStateUpdate) {
    var bufferName = this.getAvailableBuffer();

    //no buffer is available you are sending to much to buffer
    if (!bufferName) {
      return false;
    }

    this.state.buffers.push({
      name: bufferName,
      props: props,
      opacity: 0
    });

    if (!noStateUpdate) {
      this.setState(this.state);
    }

    return true;
  }

  startAnimation() {
    var opacityStep = this.props.opacityStep;

    var loop = () => {
      var buffers = this.state.buffers,
          first, second;

      switch (buffers.length) {
        case 0: //this shouldn't happen but in case of some wired scenario.
          return;

        case 1:
          first = buffers[0];

          if (first.opacity < 1) {
            //if opacity still not 1, we need to increase the opacity and
            //keep the state in loading and change the state.
            this.state.isLoading = true;
            first.opacity += opacityStep;
            this.setState(this.state);
            break;
          } else {
            //Opacity passes 1 so, our aniamtion is done. So what we need to do
            //is change the loading state to false and update the state.
            //no need to do animation anymore. so we are returning from loop
            first.opacity = 1;
            this.state.isLoading = false;
            this.setState(this.state);
            return;
          }

        case 2:
          first = this.state.buffers[0];
          second = this.state.buffers[1];

          if (second.opacity < 1) {
            //we still need to change the opacity of second and first views
            this.state.isLoading = true;
            second.opacity += opacityStep;
            first.opacity -= opacityStep;
            this.setState(this.state);
            break;
          } else {
            //the animation should stop here that's why we are returning from
            //loop here. Also, we are removing first view from buffers since
            //we no longer need it.
            this.state.isLoading = false;
            second.opacity = 1;
            this.state.buffers.shift();
            this.setState(this.state);
            return;
          }

        default:
          throw new Error('something seriously gone wrong.');
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  isReady() {
    this.startAnimation();
  }

  render() {
    var props = this.props,
        state = this.state,
        Component = props.component,
        buffers = state.buffers;

    return (
      <View style={styles.container}>
        {buffers.map((buffer) => {
          return (
            <View
              key={buffer.name}
              style={[styles.fill, { opacity: buffer.opacity }]}>
              <Component
                isReady={this.isReady.bind(this)}
                {...buffer.props}/>
            </View>
          );
        })}
      </View>
    );
  }
}

DoubleBuffer.propTypes = {
  component: React.PropTypes.func.isRequired,
  loading: React.PropTypes.func,
  opacityStep: React.PropTypes.number,
  initProps: React.PropTypes.object
};

DoubleBuffer.defaultProps = {
  loading: View,
  opacityStep: 0.05,
  initProps: null
};

module.exports = DoubleBuffer;
