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
          style={{ flex: 1 }}
          onPress={() => onHabitPress(h.id)}>
          <Text style={{ textAlign: 'right', fontSize: 12 }}>
            {h.headline.content}
          </Text>
        </TouchableHighlight>
        <Text
          style={{
            flex: 1,
            fontFamily: 'space-mono',
            fontSize: 12
          }}>
          {habitData[idx].map((c, idx) => {
            const color = {
              '-': 'red',
              b: 'blue',
              g: 'green',
              y: 'yellow'
            }[c];
            return (
              <Text key={idx} style={{ backgroundColor: color }}>{c}</Text>
            );
          })}
        </Text>
      </View>
    ))}
  </ScrollView>
);

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  const nodes = Object.values(state.orgBuffers).reduce(
    (m, v) => m.concat(Object.values(v.orgNodes)),
    []
  );
  const habits = nodes.filter(n => {
    const idx = orgDrawerUtils.indexOfKey(n.propDrawer, 'STYLE');
    if (idx === -1 || n.propDrawer.properties[idx] === 'habit') return false;
    return true;
  });
  const habitData = nodes
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
        // filter...maybe if completely new habit but not yet logged done in
        // other words this needs to be caught much earlier...i.e. around the
        // time the orgfile is parsed to begin with
        const scheduled = n.scheduled;
        const { repInt, repMin, repMax } = scheduled;
        const repMinVal = parseInt(repMin.substr(0, repMin.length - 1));
        const repMinU = repMin[repMin.length - 1];
        const repMaxVal = repMax
          ? parseInt(repMax.substr(0, repMax.length - 1))
          : null;
        const repMaxU = repMax ? repMax[repMax.length - 1] : null;

        const logData = n.logbook.entries.filter(
          le =>
            le.type === 'state' &&
            le.state === '"DONE"' &&
            le.from === '"TODO"' &&
            orgTimestampUtils.compare(le.timestamp, past) > 0 &&
            orgTimestampUtils.compare(le.timestamp, fut) < 0
        );

        logData = logData.sort((a, b) =>
          orgTimestampUtils.compare(a.timestamp, b.timestamp)
        );

        let ret = [];
        let rngMin = 0;
        let rngMax = 0;
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

              rngMin = repMinVal * { d: 1, w: 7 }[repMinU];
              rngMax = repMaxVal ? repMaxVal * { d: 1, w: 7 }[repMaxU] : 0;
              if (rngMax > 0) rngMin--;
            } else if (orgTimestampUtils.compare(now, curr) === 0) {
              ret.push('!');
            } else {
              if (rngMax && rngMax > 0) {
                if (rngMin > 0) {
                  ret.push('b');
                  rngMin--;
                } else {
                  if (rngMax === 1) {
                    ret.push('y');
                  } else {
                    ret.push('g');
                  }
                }
                rngMax--;
              } else if (rngMin > 0) {
                if (rngMin === 1) {
                  ret.push('y');
                } else {
                  ret.push('b');
                }
                rngMin--;
              } else {
                ret.push('-');
              }
            }
          }
        }
        return ret;
      }
      return [];
    });
  return {
    habits,
    habitData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHabitPress: nodeID => dispatch(someAction(nodeID))
  };
};

function someAction(nodeID) {
  return (dispatch, getState) => {
    const state = getState();
    const nowStr = orgTimestampUtils.serialize(orgTimestampUtils.now());

    // super inefficient way of finding bufferID from nodeID !!!!
    let bufferID = Object.entries(state.orgBuffers).reduce((M, V) => {
      if (M === undefined) {
        const hasId = Object.keys(V[1].orgNodes).reduce((m, v) => {
          return m || v === nodeID;
        }, false);
        if (hasId) {
          return V[0];
        } else {
          return undefined;
        }
      }
      return M;
    }, undefined);

    dispatch(completeHabit(bufferID, nodeID, nowStr));
    dispatch(resetHabit(bufferID, nodeID, nowStr));
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgHabits);
