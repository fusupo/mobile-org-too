import React from 'react';
import { connect } from 'react-redux';

import {
  ActionSheetIOS,
  Button,
  DatePickerIOS,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

const OrgDrawerUtil = require('../utilities/OrgDrawerUtil');

import {
  timestampNow,
  timestampStringNow,
  momentFromTS,
  momentToTS,
  cloneTS,
  addTS,
  subTS,
  diffTS,
  compareTS,
  parseDate,
  serializeTS
} from '../utilities/utils';
//const OrgTimestampUtil = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});

class OrgHabits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currX: 0,
      prevDX: 0,
      dateModalVisible: false,
      dateModalDate: new Date(),
      dateModalNodeID: null,
      noteModalVisible: false,
      noteModalText: null,
      noteModalNodeID: null
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        const ddx = gestureState.dx - this.state.prevDX;
        let nextX = this.state.currX + ddx;
        // const tick = 5;
        // if (nextX > tick) {
        //   this.props.decrementDate();
        //   nextX = 0;
        // } else if (nextX < -tick) {
        //   this.props.incrementDate();
        //   nextX = 0;
        // }
        this.setState({ prevDX: gestureState.dx, currX: nextX });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.setState({ prevDX: 0, currX: 0 });
        if (gestureState.dx > 1) {
          this.props.decrementDate();
        } else if (gestureState.dx < -1) {
          this.props.incrementDate();
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      }
    });
  }
  setDateModalVisible(visible) {
    this.setState({ dateModalVisible: visible });
  }
  setNoteModalVisible(visible) {
    this.setState({ noteModalVisible: visible });
  }
  render() {
    const { date, habits, habitData, onHabitPress } = this.props;
    const showDateModal = nodeID => {
      this.setState({
        dateModalNodeID: nodeID,
        dateModalDate: new Date(
          date.year,
          date.month - 1,
          date.date,
          new Date().getHours(),
          new Date().getMinutes()
        )
      });
      this.setDateModalVisible(true);
    };
    const showOKEditCancelSheet = nodeID => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['confirm', 'edit date', 'cancel']
        },
        idx => {
          if (idx === 0) {
            const tdate = momentToTS(momentFromTS(date));
            tdate.hour += timestampNow().hour;
            tdate.minute += timestampNow().minute;
            onHabitPress(nodeID, tdate);
          } else if (idx === 1) {
            showDateModal(nodeID);
          }
        }
      );
    };
    return (
      <ScrollView style={{ flex: 1, marginBottom: 30 }}>
        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.dateModalVisible}
          onRequestClose={() => {
            alert('Date Modal has been closed.');
          }}>
          <View style={{ flex: 1, marginTop: 22 }}>
            <DatePickerIOS
              style={{ height: 150, flex: 12 }}
              date={this.state.dateModalDate}
              onDateChange={dateModalDate => this.setState({ dateModalDate })}
              mode="datetime"
            />

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={'Cancel'}
                  onPress={() => {
                    this.setDateModalVisible(!this.state.dateModalVisible);
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={'OK'}
                  onPress={() => {
                    this.setDateModalVisible(!this.state.dateModalVisible);

                    const timestamp = parseDate(this.state.dateModalDate);
                    onHabitPress(
                      this.state.dateModalNodeID,
                      timestamp,
                      this.state.noteModalText
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType={'none'}
          transparent={false}
          visible={this.state.noteModalVisible}
          onRequestClose={() => {
            alert('Note Modal has been closed.');
            console.log('Note Modal has been closed.');
          }}>
          <View style={{ marginTop: 40, flexDirection: 'column' }}>
            <TextInput
              style={{ height: '50%', borderColor: '#ccc', borderWidth: 1 }}
              multiline={true}
              value={this.state.noteModalText}
              onChangeText={noteModalText => {
                this.setState({ noteModalText });
              }}
            />
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={'Cancel'}
                  onPress={() => {
                    this.setNoteModalVisible(!this.state.noteModalVisible);
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={'Edit Date'}
                  onPress={() => {
                    this.setNoteModalVisible(!this.state.noteModalVisible);
                    showDateModal(this.state.noteModalNodeID);
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={'OK'}
                  onPress={() => {
                    this.setNoteModalVisible(!this.state.noteModalVisible);
                    const tdate = momentToTS(momentFromTS(date));
                    tdate.hour += timestampNow().hour;
                    tdate.minute += timestampNow().minute;
                    onHabitPress(
                      this.state.noteModalNodeID,
                      tdate,
                      this.state.noteModalText
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {habits.map((h, idx) => (
          <View key={h.id} style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              underlayColor="#00ff00"
              style={{ flex: 1 }}
              onPress={() => {
                this.setState({ noteModalText: null });
                const idx = OrgDrawerUtil.indexOfKey(h.propDrawer, 'LOGGING');
                if (idx >= 0) {
                  switch (h.propDrawer.properties[idx][1]) {
                    case 'DONE(@)':
                      // SHOW NOTE EDITOR
                      this.setState({ noteModalNodeID: h.id });
                      this.setNoteModalVisible(!this.state.noteModalVisible);
                      break;
                    default:
                      console.log(
                        'UNHANDLED LOGGING TYPE IN ORGHABITS!! -- ',
                        h.propDrawer.properties[idx][1]
                      );
                      break;
                  }
                } else {
                  // SHOW OK/EDIT/CANCEL SHEET
                  showOKEditCancelSheet(h.id);
                }
              }}>
              <Text style={{ textAlign: 'right', fontSize: 12 }}>
                {h.headline.content}
              </Text>
            </TouchableHighlight>

            <View {...this._panResponder.panHandlers} style={{ flex: 1 }}>
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
                    <Text
                      key={idx}
                      style={{
                        backgroundColor: color,
                        opacity: idx < 14 ? 1 : 0.5
                      }}>
                      {c}
                    </Text>
                  );
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state, ownProps) => {
  let date = ownProps.date;

  const nodes = Object.values(state.orgBuffers).reduce(
    (m, v) => m.concat(Object.values(v.orgNodes)),
    []
  );

  const habits = nodes.filter(n => {
    const idx = OrgDrawerUtil.indexOfKey(n.propDrawer, 'STYLE');
    if (idx === -1 || n.propDrawer.properties[idx] === 'habit') return false;
    return true;
  });

  const getRealNow = () => {
    const now = timestampNow();
    now.hour -= now.hour;
    now.minute -= now.minute;
    return now;
  };

  const habitData = nodes
    .filter(n => {
      const idx = OrgDrawerUtil.indexOfKey(n.propDrawer, 'STYLE');
      if (idx === -1 || n.propDrawer.properties[idx] === 'habit') return false;
      return true;
    })
    .map(n => {
      const now = date; //timestampNow();
      now.hour -= now.hour;
      now.minute -= now.minute;
      const past = subTS(now, { days: 14 });
      const fut = addTS(now, { days: 7 });
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
            compareTS(le.timestamp, past) > 0 &&
            compareTS(le.timestamp, fut) < 0
        );

        logData = logData.sort((a, b) => compareTS(a.timestamp, b.timestamp));

        let ret = [];
        let rngMin = 0;
        let rngMax = 0;
        if (logData.length > 0) {
          for (let i = 0; i < 21; i++) {
            const curr = addTS(past, { days: 1 * i });
            const next = addTS(curr, { days: 1 });
            const ts = logData.length > 0 ? logData[0].timestamp : null;
            if (
              ts !== null &&
              compareTS(ts, curr) > 0 &&
              compareTS(ts, next) < 0
            ) {
              logData.shift();
              ret.push('x');

              rngMin = repMinVal * { d: 1, w: 7 }[repMinU];
              rngMax = repMaxVal ? repMaxVal * { d: 1, w: 7 }[repMaxU] : 0;
              if (rngMax > 0) rngMin--;
            } else if (compareTS(getRealNow(), curr) === 0) {
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
    habitData,
    date
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHabitPress: (nodeID, date, noteText = null) =>
      dispatch(someAction(nodeID, date, noteText))
  };
};

function someAction(nodeID, date, noteText) {
  return (dispatch, getState) => {
    const state = getState();
    const nowStr = serializeTS(date); //;timestampNow());
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

    dispatch(completeHabit(bufferID, nodeID, nowStr, noteText));
    dispatch(resetHabit(bufferID, nodeID, nowStr));
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgHabits);
