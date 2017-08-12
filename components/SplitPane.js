import React from 'react';
import { connect } from 'react-redux';

import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View
} from 'react-native';

const barHeight = 30;
class SplitPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stageW: 0,
      stageH: 0,
      prevTop: 0,
      currTop: 0
    };

    this._previousTop = 82;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        let currTop = this.state.prevTop + gesture.dy;
        currTop = currTop < 0 ? 0 : currTop;
        currTop = currTop > this.state.stageH ? this.state.stageH : currTop;
        this.setState({ currTop });
      },
      onPanResponderRelease: (e, gesture) => {
        let h = this.state.stageH - barHeight;
        let fourth = h / 4;
        let half = h / 2;
        let flr = Math.floor(this.state.currTop / fourth);

        let newState;
        if (flr <= 0) {
          newState = {
            prevTop: 0,
            currTop: 0
          };
          this._fireResize(0, 1);
        } else if (flr === 1 || flr === 2) {
          newState = {
            prevTop: half,
            currTop: half
          };
          this._fireResize(0.5, 0.5);
        } else if (flr >= 3) {
          newState = {
            prevTop: h,
            currTop: h
          };
          this._fireResize(1, 0);
        }
        this.setState(newState);
      }
    });
  }

  _fireResize(a, b) {
    if (this.props.onResizeA) this.props.onResizeA(a);
    if (this.props.onResizeB) this.props.onResizeB(b);
  }

  render() {
    return (
      <View
        style={styles.mainContainer}
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
          this.setState({
            stageW: width,
            stageH: height,
            currTop: (height - barHeight) / 2,
            prevTop: (height - barHeight) / 2
          });
        }}>
        <View
          alwaysBounceVertical={false}
          style={[styles.viewA, { height: this.state.currTop }]}>
          {this.props.viewA}
        </View>
        {this.renderDraggable()}
        <View
          alwaysBounceVertical={false}
          style={[
            styles.viewB,
            {
              height: this.state.stageH - this.state.currTop
            }
          ]}>
          {this.props.viewB}
        </View>
      </View>
    );
  }

  renderDraggable() {
    return (
      <View style={styles.draggableContainer}>
        <View
          {...this.panResponder.panHandlers}
          style={[
            styles.bar,
            {
              left: 0,
              top: 0,
              width: this.state.stageW
            }
          ]}>
          <View style={styles.barInner} />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  bar: {
    height: barHeight,
    backgroundColor: '#ccc'
  },
  barInner: {
    backgroundColor: '#3333',
    top: barHeight / 2 - 10,
    height: 20,
    width: '100%'
  },
  mainContainer: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden'
  },
  viewA: {
    width: '100%',
    height: 20
  },
  viewB: {
    width: '100%',
    height: 20
  }
});

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SplitPane);
