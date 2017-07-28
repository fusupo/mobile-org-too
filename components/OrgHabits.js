import React from 'react';
import { connect } from 'react-redux';

import {
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});

const OrgHabits = ({ habits, habitData, onHabitPress }) => (
  <ScrollView>
    {habits.map((h, idx) => (
      <View key={h.id} style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          underlayColor="#00ff00"
          style={{ flex: 2 }}
          onPress={() => onHabitPress(h.id)}>
          <Text style={{ textAlign: 'right', fontSize: 12 }}>
            {h.headline.content}
          </Text>
        </TouchableHighlight>
        <Text style={{ flex: 1 }}>
          {habitData[idx]}
        </Text>
      </View>
    ))}
  </ScrollView>
);

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => ({
  habits: Object.values(state.orgNodes).filter(n => {
    const idx = orgDrawerUtils.indexOfKey(n.propDrawer, 'STYLE');
    if (idx === -1 || n.propDrawer.properties[idx] === 'habit') return false;
    return true;
  }),
  habitData: Object.values(state.orgNodes)
    .filter(n => {
      const idx = orgDrawerUtils.indexOfKey(n.propDrawer, 'STYLE');
      if (idx === -1 || n.propDrawer.properties[idx] === 'habit') return false;
      return true;
    })
    .map(n => {
      const now = orgTimestampUtils.now();
      now.hour -= now.hour;
      now.minute -= now.minute;
      const past = orgTimestampUtils.sub(now, { days: 14 });
      const fut = orgTimestampUtils.add(now, { days: 7 });
      if (n.logbook) {
        // don't know why there'd be no logbook if passed previous
        // filter...maybe if completely new habit but not yet logged done
        const logData = n.logbook.entries.filter(
          le =>
            le.type === 'state' &&
            le.state === '"DONE"' &&
            le.from === '"TODO"' &&
            orgTimestampUtils.compare(le.timestamp, past) > 0 &&
            orgTimestampUtils.compare(le.timestamp, fut) < 0
          // don't know why there'd be no logbook if passed previous filter...maybe
          // if completely new habit but not yet logged done
        );

        logData = logData.sort((a, b) =>
          orgTimestampUtils.compare(a.timestamp, b.timestamp)
        );

        let ret = [];
        if (logData.length > 0) {
          for (let i = 0; i < 21; i++) {
            const curr = orgTimestampUtils.add(past, { days: 1 * i });
            const next = orgTimestampUtils.add(curr, { days: 1 });
            const ts = logData.length > 0 ? logData[0].timestamp : null;
            if (
              ts !== null &&
              orgTimestampUtils.compare(ts, curr) > 0 &&
              orgTimestampUtils.compare(ts, next) < 0
            ) {
              logData.shift();
              ret.push('x');
            } else {
              ret.push('-');
            }
          }
        }
        return ret;
      }
      return [];
    })
});

const mapDispatchToProps = dispatch => {
  return {
    onHabitPress: nodeID => {
      const nowStr = orgTimestampUtils.serialize(orgTimestampUtils.now());
      dispatch(completeHabit(nodeID, nowStr));
      dispatch(resetHabit(nodeID, nowStr));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgHabits);
