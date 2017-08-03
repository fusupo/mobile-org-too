import React from 'react';
import { connect } from 'react-redux';

import { ScrollView, StyleSheet, View } from 'react-native';

import OrgHabits from '../components/OrgHabits';
import OrgAgenda from '../components/OrgAgenda';

const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});

class CalendarScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'someshit other shit'
  });
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <OrgAgenda />
        </ScrollView>
        <ScrollView>
          <OrgHabits />
        </ScrollView>
      </View>
    );
  }
}

// const CalendarScreen = ({ habits, habitData, onHabitPress }) => (
// );

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  // const nodes = Object.values(state.orgBuffers).reduce(
  //   (m, v) => m.concat(Object.values(v.orgNodes)),
  //   []
  // );

  return {
    // habits: [],
    // habitData: []
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onHabitPress: nodeID => {
    //   const nowStr = orgTimestampUtils.serialize(orgTimestampUtils.now());
    //   dispatch(completeHabit(nodeID, nowStr));
    //   dispatch(resetHabit(nodeID, nowStr));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
