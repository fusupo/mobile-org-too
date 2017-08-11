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
      date: foo
    };
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
        viewA={<OrgAgenda date={this._clone(this.state.date)} />}
        viewB={
          <OrgHabits
            date={this._clone(this.state.date)}
            incrementDate={() =>
              this.setState({
                date: orgTimestampUtils.add(this.state.date, {
                  days: 1
                })
              })}
            decrementDate={() =>
              this.setState({
                date: orgTimestampUtils.sub(this.state.date, {
                  days: 1
                })
              })}
          />
        }
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
