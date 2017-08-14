import React from 'react';
import { connect } from 'react-redux';

import {
  Button,
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
import SplitPane from '../components/SplitPane';

const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

class CalendarScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'calendar'
  });

  constructor(props) {
    super(props);
    const foo = orgTimestampUtils.now();
    this.state = {
      date: foo,
      prevDate: foo,
      percA: 0,
      percB: 0
    };
  }

  componentDidMount() {
    // this is likely super inefficient as this initiates a whole bunch of
    // calculations on each update
    setInterval(() => {
      let date = orgTimestampUtils.clone(this.state.date);
      let now = orgTimestampUtils.now();
      date.hour = now.hour;
      date.minute = now.minute;
      this.setState({ date });
    }, 1000);
  }

  _clone(d) {
    const ret = orgTimestampUtils.momentToObj(
      orgTimestampUtils.momentFromObj(d)
    );
    return ret;
  }

  render() {
    return (
      <SplitPane
        viewA={
          <OrgAgenda
            prevDate={this._clone(this.state.prevDate)}
            date={this._clone(this.state.date)}
            incrementDate={() =>
              this.setState({
                prevDate: this._clone(this.state.date),
                date: orgTimestampUtils.add(this.state.date, {
                  days: 1
                })
              })}
            decrementDate={() =>
              this.setState({
                prevDate: this._clone(this.state.date),
                date: orgTimestampUtils.sub(this.state.date, {
                  days: 1
                })
              })}
            percH={this.state.percA}
          />
        }
        onResizeA={percA => {
          this.setState({
            percA,
            prevDate: this._clone(this.state.date)
          });
        }}
        viewB={
          <OrgHabits
            date={this._clone(this.state.date)}
            incrementDate={() =>
              this.setState({
                prevDate: this._clone(this.state.date),
                date: orgTimestampUtils.add(this.state.date, {
                  days: 1
                })
              })}
            decrementDate={() =>
              this.setState({
                prevDate: this._clone(this.state.date),
                date: orgTimestampUtils.sub(this.state.date, {
                  days: 1
                })
              })}
          />
        }
        onResizeB={percB => {
          this.setState({
            percB,
            prevDate: this._clone(this.state.date)
          });
        }}
      />
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
