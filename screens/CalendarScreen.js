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

import {
  timestampNow,
  momentFromTS,
  momentToTS,
  cloneTS,
  addTS,
  subTS
} from '../utilities/utils';

const orgDrawerUtils = require('org-parse').OrgDrawer;
/* const orgTimestampUtils = require('org-parse').OrgTimestamp;*/

import { completeHabit, resetHabit } from '../actions';

class CalendarScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'calendar'
  });

  constructor(props) {
    super(props);
    const foo = timestampNow();
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
      let date = cloneTS(this.state.date);
      let now = timestampNow();
      date.hour = now.hour;
      date.minute = now.minute;
      this.setState({ date });
    }, 1000);
  }

  render() {
    if (this.props.screenProps.currRoute === 'AgendaTab') {
      return (
        <SplitPane
          viewA={
            <OrgAgenda
              prevDate={cloneTS(this.state.prevDate)}
              date={cloneTS(this.state.date)}
              incrementDate={() =>
                this.setState({
                  prevDate: cloneTS(this.state.date),
                  date: addTS(this.state.date, {
                    days: 1
                  })
                })}
              decrementDate={() =>
                this.setState({
                  prevDate: cloneTS(this.state.date),
                  date: subTS(this.state.date, {
                    days: 1
                  })
                })}
              percH={this.state.percA}
            />
          }
          onResizeA={percA => {
            this.setState({
              percA,
              prevDate: cloneTS(this.state.date)
            });
          }}
          viewB={
            <OrgHabits
              date={cloneTS(this.state.date)}
              incrementDate={() =>
                this.setState({
                  prevDate: cloneTS(this.state.date),
                  date: addTS(this.state.date, {
                    days: 1
                  })
                })}
              decrementDate={() =>
                this.setState({
                  prevDate: cloneTS(this.state.date),
                  date: subTS(this.state.date, {
                    days: 1
                  })
                })}
            />
          }
          onResizeB={percB => {
            this.setState({
              percB,
              prevDate: cloneTS(this.state.date)
            });
          }}
        />
      );
    } else {
      return null;
    }
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
