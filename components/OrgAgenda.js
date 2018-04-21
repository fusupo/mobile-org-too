import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import {
  Button,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

/* import { OrgTimestampUtil.momentFromObj, OrgTimestampUtil.momentToObj } from '../utilities/utils';*/

const OrgNodeUtil = require('../utilities/OrgNodeUtil');
const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');

const styles = StyleSheet.create({
  text: {
    fontFamily: 'space-mono',
    fontSize: 10
  },
  container: {
    flex: 1,
    paddingTop: 15
  }
});

const magic = 504;
const padMaybe = n => {
  n = '' + n;
  n = n.length === 1 ? '0' + n : n;
  return n;
};

class OrgAgenda extends React.Component {
  state = {
    stageH: 0,
    dayHeight: magic / 2
  };

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
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        //this.setState({ prevDX: 0, currX: 0 });
        if (gestureState.dy > 1) {
          this.props.incrementDate();
        } else if (gestureState.dy < -1) {
          this.props.decrementDate();
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

  render() {
    let { agendaYesterday, agendaToday, agendaTomorrow, dx } = this.props;
    let agendaKeys = ['00:00', '06:00', '09:00', '12:00', '13:00', '18:00'];
    let colors = [
      '#92021C',
      '#EC6E58',
      '#F6BD78',
      '#F6BD78',
      '#956066',
      '#564975'
    ];
    const entry = (d, idx) => (
      <View
        key={idx}
        style={{
          //   flex: 1
          flexDirection: 'row'
        }}>
        <View {...this._panResponder.panHandlers}>
          <Text style={styles.text}>{`${d.time}...... `}</Text>
        </View>
        <TouchableHighlight
          onPress={() => {
            this.props.onNodeTitleClick(d.bufferID, d.nodeID);
          }}>
          <Text key={idx} style={styles.text}>
            {d.content}
          </Text>
        </TouchableHighlight>
      </View>
    );
    const build = (data, height) => {
      const foo = agendaKeys.map((k, kidx) => {
        const listData = data.schedule[k];
        const color = colors[kidx];
        const list = !listData
          ? []
          : listData.map((d, idx) => {
              if (d.nodeID === 'NOW') {
                return (
                  <View
                    {...this._panResponder.panHandlers}
                    key={idx}
                    style={{
                      //   flex: 1
                    }}>
                    <Text
                      style={[styles.text, { color: 'yellow' }]}
                      key={
                        idx
                      }>{`${d.time}...... now - - - - - - - - - - - - - - - - - -`}</Text>
                  </View>
                );
              } else {
                return entry(d, idx);
              }
            });
        const header =
          k !== agendaKeys[0] ? (
            <View {...this._panResponder.panHandlers}>
              <Text style={styles.text}>{k}</Text>
            </View>
          ) : (
            <View {...this._panResponder.panHandlers}>
              <Text
                style={[
                  styles.text,
                  { color: '#fff', backgroundColor: '#000' }
                ]}>
                {data.headerStr}
              </Text>
            </View>
          );
        return (
          <View
            key={k}
            style={{
              // borderColor: '#000',
              // borderWidth: 1,
              flex: list.length + 1,
              backgroundColor: color
            }}>
            {header}
            {list}
          </View>
        );
      });
      return (
        <View
          key={data.headerStr}
          style={{
            // borderColor: '#000',
            // borderWidth: 1,
            height: height,
            // flex: 1,
            flexDirection: 'column'
          }}>
          {foo}
        </View>
      );
    };

    //{...this._panResponder.panHandlers}
    const buildSml = (data, height) => {
      const foo = agendaKeys.map((k, kidx) => {
        const listData = data.schedule[k];
        const color = colors[kidx];
        const list = !listData ? [] : listData.map((d, idx) => entry(d, idx));
        return (
          <View
            key={k}
            style={{
              // borderColor: '#000',
              // borderWidth: 1
              backgroundColor: color
            }}>
            {list}
          </View>
        );
      });
      return (
        <View
          key={data.headerStr}
          style={{
            // borderColor: '#000',
            // borderWidth: 1,
            height: height,
            // flex: 1,
            flexDirection: 'column'
          }}>
          <Text
            style={[styles.text, { color: '#fff', backgroundColor: '#000' }]}>
            {data.headerStr}
          </Text>
          {foo}
        </View>
      );
    };

    const xxx = (
      <View
        style={{
          // borderColor: '#f00',
          // borderWidth: 1,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0
          }}>
          {this.props.percH <= 0.5
            ? build(agendaToday, magic / 2)
            : [
                buildSml(agendaYesterday, magic / 4),
                build(agendaToday, magic / 2),
                buildSml(agendaTomorrow, magic / 4)
              ]}
        </View>
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
          // borderColor: '#000',
          // borderWidth: 1,
          overflow: 'hidden',
          backgroundColor: '#000'
        }}
        onLayout={event => {
          const { x, y, width, height } = event.nativeEvent.layout;
          this.setState({
            stageH: height
          });
        }}>
        {xxx}
      </View>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state, ownProps) => {
  let agendaYesterday = [];
  let agendaToday = [];
  let agendaTomorrow = [];
  let candidates;

  let date = ownProps.date;
  let prevDate = ownProps.prevDate;
  const dx = OrgTimestampUtil.diff(date, prevDate, 'days');

  const nodes = Object.entries(state.orgBuffers).reduce((m, v) => {
    const bufferID = v[0];
    const entries = Object.values(v[1].orgNodes).map(n => {
      const scheduled = OrgNodeUtil.getScheduled(n);
      const deadline = OrgNodeUtil.getDeadline(n);
      return {
        bufferID,
        nodeID: n.id,
        scheduled,
        deadline,
        content: n.title
      };
    });
    return m.concat(entries);
  }, []);

  const filterRange = (ns, start, end) => {
    return ns.filter(n => {
      const scheduled = n.scheduled; //OrgNodeUtil.getScheduled(n);
      const deadline = n.deadline; //OrgNodeUtil.getDeadline(n);
      return (
        (scheduled &&
          OrgTimestampUtil.compare(scheduled, start) >= 0 &&
          OrgTimestampUtil.compare(scheduled, end) < 0) ||
        (deadline &&
          OrgTimestampUtil.compare(deadline, start) >= 0 &&
          OrgTimestampUtil.compare(deadline, end) < 0)
      );
    });
  };

  const hours = [0, 6, 9, 12, 13, 18, 24];

  const buildDayToo = (headerStr, start, end) => {
    const bar = (m, d) => {
      let res = [];
      const scheduled = d.scheduled; //OrgNodeUtil.getScheduled(d);
      const deadline = d.deadline; //OrgNodeUtil.getDeadline(d);
      if (scheduled) {
        res.push({
          bufferID: d.bufferID,
          nodeID: d.nodeID,
          time: `${padMaybe(scheduled.time.hh)}:${padMaybe(scheduled.time.mm)}`,
          content: 'scheduled: ' + d.content
        });
      }
      if (deadline) {
        res.push({
          bufferID: d.bufferID,
          nodeID: d.nodeID,
          time: `${padMaybe(deadline.time.hh)}:${padMaybe(deadline.time.mm)}`,
          content: 'deadline: ' + d.content
        });
      }
      return m.concat(res);
    };
    let now = date;
    const nowStr = {
      bufferID: 'NOW',
      nodeID: 'NOW',
      time: `${padMaybe(now.time.hh)}:${padMaybe(now.time.mm)}:${padMaybe(
        new Date().getSeconds()
      )}`,
      content: 'NOW'
    };
    const cand = filterRange(candidates, start, end);

    console.log('condditatds', cand, now);

    let agenda = { headerStr, schedule: {} };
    for (let i = 0; i < hours.length - 1; i++) {
      const a = OrgTimestampUtil.add(start, { hours: hours[i] });
      const b = OrgTimestampUtil.add(start, { hours: hours[i + 1] });
      let foo = filterRange(cand, a, b);
      let foobar = filterRange(cand, a, b).reduce(bar, []);

      if (
        OrgTimestampUtil.compare(now, a) > 0 &&
        OrgTimestampUtil.compare(now, b) < 0
      ) {
        if (foo.length > 0) {
          if (
            OrgTimestampUtil.compare(now, foo[0].scheduled) < 0 ||
            OrgTimestampUtil.compare(now, foo[0].deadline) < 0
          ) {
            foobar.unshift(nowStr);
          } else if (OrgTimestampUtil.compare(now, foo[foo.length - 1]) > 0) {
            foobar.push(nowStr);
          } else {
            const fooFore = filterRange(foo, a, now).reduce(bar, []);
            const fooAft = filterRange(foo, now, b).reduce(bar, []);
            foobar = fooFore.concat([nowStr], fooAft);
          }
        } else {
          foobar.push(nowStr);
        }
      }

      agenda.schedule[`${padMaybe(a.time.hh)}:${padMaybe(a.time.mm)}`] = foobar;
    }
    return agenda;
  };

  let today = OrgTimestampUtil.clone(date);
  today.time.hh -= today.time.hh;
  today.time.mm -= today.time.mm;

  let realToday = OrgTimestampUtil.now();
  realToday.time.hh -= realToday.time.hh;
  realToday.time.mm -= realToday.time.mm;

  let diff = OrgTimestampUtil.diff(today, realToday, 'days');

  const yesterday = OrgTimestampUtil.sub(today, { days: 1 });
  const tomorrow = OrgTimestampUtil.add(today, { days: 1 });
  const dayAfterTomorrow = OrgTimestampUtil.add(today, { days: 2 });

  candidates = filterRange(nodes, yesterday, dayAfterTomorrow);
  candidates.sort((a, b) => {
    const scheduledA = a.scheduled; //OrgNodeUtil.getScheduled(a);
    const deadlineA = a.deadline; //OrgNodeUtil.getDeadline(a);
    const scheduledB = b.scheduled; //OrgNodeUtil.getScheduled(b);
    const deadlineB = b.deadline; //OrgNodeUtil.getDeadline(b);
    const timeA = !scheduledA ? deadlineA : scheduledA;
    const timeB = !scheduledB ? deadlineB : scheduledB;
    return OrgTimestampUtil.compare(timeA, timeB);
  });

  const yesStr = '-----++----YESTERDAY----------';
  const todStr = '-----++----TODAY--------------';
  const tomStr = '-----++----TOMORROW-----------';
  const dateStr = d =>
    `-----++----[${d.date.yyyy}-${padMaybe(d.date.mm)}-${padMaybe(
      d.date.dayName
    )} ${d.date.dd}]---`;
  let targYesStr, targTodStr, targTomStr;

  switch (diff) {
    case -2:
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = yesStr;
      break;
    case -1:
      targYesStr = dateStr(yesterday);
      targTodStr = yesStr;
      targTomStr = todStr;
      break;
    case 0:
      targYesStr = yesStr;
      targTodStr = todStr;
      targTomStr = tomStr;
      break;
    case 1:
      targYesStr = todStr;
      targTodStr = tomStr;
      targTomStr = dateStr(tomorrow);
      break;
    case 2:
      targYesStr = tomStr;
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      break;
    default:
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      break;
  }

  agendaYesterday = buildDayToo(targYesStr, yesterday, today);
  agendaToday = buildDayToo(targTodStr, today, tomorrow);
  agendaTomorrow = buildDayToo(targTomStr, tomorrow, dayAfterTomorrow);

  return {
    agendaYesterday,
    agendaToday,
    agendaTomorrow,
    dx
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeTitleClick: (bufferID, nodeID) => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'NodeDetail',
          params: {
            bufferID,
            nodeID
          }
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgAgenda);
