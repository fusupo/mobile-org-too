import React from 'react';
import { connect } from 'react-redux';

import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import OrgHabits from '../components/OrgHabits';
import OrgAgenda from '../components/OrgAgenda';

const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

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
        let h = this.state.stageH; // - barHeight;
        let fourth = h / 4;
        let half = h / 2;
        let flr = Math.floor(this.state.currTop / fourth);

        let newState;
        if (flr <= 0) {
          newState = {
            prevTop: 0,
            currTop: 0
          };
        } else if (flr === 1 || flr === 2) {
          newState = {
            prevTop: half,
            currTop: half
          };
        } else if (flr >= 3) {
          newState = {
            prevTop: h,
            currTop: h
          };
        }
        this.setState(newState);
      }
    });
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
            currTop: height / 2,
            prevTop: height / 2
          });
        }}>
        <ScrollView
          alwaysBounceVertical={false}
          style={[styles.viewA, { height: this.state.currTop }]}>
          {this.props.viewA}
        </ScrollView>
        {this.renderDraggable()}
        <ScrollView
          alwaysBounceVertical={false}
          style={[
            styles.viewB,
            {
              height: this.state.stageH - this.state.currTop
            }
          ]}>
          {this.props.viewB}
        </ScrollView>
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
