import React from 'react';
import { connect } from 'react-redux';

import {
  ScrollView,
  Component,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

import OrgHabits from '../components/OrgHabits';
import OrgAgenda from '../components/OrgAgenda';

const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

class Viewport extends React.Component {
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
        this.setState({ currTop: this.state.prevTop + gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        let h = this.state.stageH - barHeight;
        let fourth = h / 4;
        let half = h / 2;
        let flr = Math.floor(this.state.currTop / fourth);

        let newState;
        switch (flr) {
          case 0:
            newState = {
              prevTop: 0,
              currTop: 0
            };
            break;
          case 1:
          case 2:
            newState = {
              prevTop: half,
              currTop: half
            };
            break;
          case 3:
            newState = {
              prevTop: h,
              currTop: h
            };
            break;
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
          this.setState({ stageW: width, stageH: height });
        }}>
        <ScrollView
          style={[
            styles.viewA,
            { height: this.state.currTop + barHeight / 2 }
          ]}>
          <OrgAgenda />
        </ScrollView>
        <ScrollView
          style={[
            styles.viewB,
            {
              height: this.state.stageH -
                barHeight -
                this.state.currTop +
                barHeight / 2
            }
          ]}>
          <OrgHabits />
        </ScrollView>
        {this.renderDraggable()}
      </View>
    );
  }

  renderDraggable() {
    return (
      <View style={styles.draggableContainer}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            styles.bar,
            {
              left: 0,
              top: this.state.currTop,
              width: this.state.stageW
            }
          ]}>
          <View style={styles.barInner}><Text>{'helllooooooo!'}</Text></View>
        </Animated.View>
      </View>
    );
  }
}

const barHeight = 50;
var styles = StyleSheet.create({
  bar: {
    height: barHeight,
    backgroundColor: '#ccc5'
  },
  barInner: {
    backgroundColor: '#333',
    position: 'absolute',
    top: barHeight / 2 - 5,
    height: 10,
    width: '100%'
  },
  mainContainer: {
    flex: 1
  },
  draggableContainer: {
    position: 'absolute'
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

//module.exports = PanResponderExample;
class CalendarScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'calendar'
  });
  render() {
    return <Viewport />;
  }
}

// <View style={styles.container}>
// <ScrollView>
// <OrgAgenda />
// </ScrollView>
// <ScrollView>
// <OrgHabits />
// </ScrollView>
// </View>
////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
