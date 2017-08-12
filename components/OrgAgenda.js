import React from 'react';
import { connect } from 'react-redux';

import {
  Easing,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const orgTimestampUtils = require('org-parse').OrgTimestamp;

const styles = StyleSheet.create({
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
          this.props.decrementDate();
        } else if (gestureState.dy < -1) {
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

  componentWillReceiveProps(nextProps) {
    // let dayHeight = this.state.dayHeight;
    // if (nextProps.percH !== this.props.percH) {
    //   if (nextProps.percH <= 0.50) {
    //     dayHeight = magic / 2;
    //   } else {
    //     dayHeight = magic / 3;
    //   }
    //   this.setState({
    //     dayHeight
    //   });
    // }
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
    const build = (data, height) => {
      const foo = agendaKeys.map((k, kidx) => {
        const listData = data.schedule[k];
        const color = colors[kidx];
        const list = listData.map((d, idx) => (
          <View
            key={idx}
            style={{
              //   flex: 1
            }}>
            <Text key={idx}>{d}</Text>
          </View>
        ));
        return (
          <View
            key={k}
            style={{
              // borderColor: '#000',
              // borderWidth: 1,
              flex: list.length, // + 1,
              backgroundColor: color
            }}>
            {k !== agendaKeys[0]
              ? <Text>{k}</Text>
              : <Text style={{ color: '#fff', backgroundColor: '#000' }}>
                  {data.headerStr}
                </Text>}
            {list}
          </View>
        );
      });
      return (
        <View
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

    const buildSml = (data, height) => {
      const foo = agendaKeys.map((k, kidx) => {
        const listData = data.schedule[k];
        const color = colors[kidx];
        const list = listData.map((d, idx) => (
          <View
            key={idx}
            style={{
              //   flex: 1
            }}>
            <Text key={idx}>{d}</Text>
          </View>
        ));
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
          style={{
            // borderColor: '#000',
            // borderWidth: 1,
            height: height,
            // flex: 1,
            flexDirection: 'column'
          }}>
          <Text style={{ color: '#fff', backgroundColor: '#000' }}>
            {data.headerStr}
          </Text>
          {foo}
        </View>
      );
    };

    let xxx;
    if (this.props.percH <= 0.50) {
      xxx = (
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
            {build(agendaToday, magic / 2)}
          </View>
        </View>
      );
    } else {
      xxx = (
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
            {buildSml(agendaYesterday, magic / 4)}
            {build(agendaToday, magic / 2)}
            {buildSml(agendaTomorrow, magic / 4)}
          </View>
        </View>
      );
    }

    return (
      <View
        {...this._panResponder.panHandlers}
        style={{
          flex: 1,
          borderColor: '#000',
          borderWidth: 1,
          overflow: 'hidden'
        }}
        onLayout={event => {
          const { x, y, width, height } = event.nativeEvent.layout;
          console.log(height);
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
  const dx = orgTimestampUtils.diff(date, prevDate, 'days');

  const nodes = Object.values(state.orgBuffers).reduce(
    (m, v) => m.concat(Object.values(v.orgNodes)),
    []
  );

  const filterRange = (ns, start, end) => {
    return ns.filter(
      n =>
        n.scheduled &&
        orgTimestampUtils.compare(n.scheduled, start) >= 0 &&
        orgTimestampUtils.compare(n.scheduled, end) < 0
    );
  };

  const hours = [0, 6, 9, 12, 13, 18, 24];

  const buildDay = (headerStr, start, end) => {
    let now = date;
    let realNow = orgTimestampUtils.now();
    const nowStr = `${padMaybe(now.hour)}:${padMaybe(now.minute)}...... now - - - - - - - - - - - - - - - - - - - - - - - - - -`;
    const cand = filterRange(candidates, start, end);
    let agenda = [headerStr];
    for (let i = 0; i < hours.length - 1; i++) {
      const a = orgTimestampUtils.add(start, { hours: hours[i] });
      const b = orgTimestampUtils.add(start, { hours: hours[i + 1] });
      let foo = filterRange(cand, a, b);

      if (
        orgTimestampUtils.compare(now, a) > 0 &&
        orgTimestampUtils.compare(now, b) < 0
      ) {
        if (foo.length > 0) {
          if (orgTimestampUtils.compare(now, foo[0].scheduled) < 0) {
            foo.unshift(nowStr);
          } else if (orgTimestampUtils.compare(now, foo[foo.length - 1]) > 0) {
            foo.push(nowStr);
          } else {
            const fooFore = filterRange(foo, a, now);
            const fooAft = filterRange(foo, now, b);
            foo = fooFore.concat(nowStr, fooAft);
          }
        } else {
          foo.push(nowStr);
        }
      }

      agenda = agenda.concat(foo);
      agenda.push(
        `${padMaybe(b.hour)}:${padMaybe(b.minute)}...... ----------------`
      );
    }
    agenda.pop();
    return agenda;
  };

  const buildDay2 = (headerStr, start, end) => {
    const bar = d =>
      `${padMaybe(d.scheduled.hour)}:${padMaybe(d.scheduled.minute)}...... ${d.headline.content}`;
    let now = date;
    const nowStr = `${padMaybe(now.hour)}:${padMaybe(now.minute)}...... now - - - - - - - - - - - - - - - - - - - - - - - - - -`;
    const cand = filterRange(candidates, start, end);
    let agenda = { headerStr, schedule: {} };
    for (let i = 0; i < hours.length - 1; i++) {
      const a = orgTimestampUtils.add(start, { hours: hours[i] });
      const b = orgTimestampUtils.add(start, { hours: hours[i + 1] });
      let foo = filterRange(cand, a, b);
      let foobar = filterRange(cand, a, b).map(bar);

      if (
        orgTimestampUtils.compare(now, a) > 0 &&
        orgTimestampUtils.compare(now, b) < 0
      ) {
        if (foo.length > 0) {
          if (orgTimestampUtils.compare(now, foo[0].scheduled) < 0) {
            console.log('insert now str 1');
            foobar.unshift(nowStr);
          } else if (orgTimestampUtils.compare(now, foo[foo.length - 1]) > 0) {
            console.log('insert now str 2');
            foobar.push(nowStr);
          } else {
            const fooFore = filterRange(foo, a, now).map(bar);
            const fooAft = filterRange(foo, now, b).map(bar);
            console.log('insert now str 3');
            foobar = fooFore.concat(nowStr, fooAft);
          }
        } else {
          console.log('insert now str 4');
          foobar.push(nowStr);
        }
      }

      agenda.schedule[`${padMaybe(a.hour)}:${padMaybe(a.minute)}`] = foobar;
      // agenda = agenda.concat(foo);
      // agenda.push(
      //   `${padMaybe(b.hour)}:${padMaybe(b.minute)}...... ----------------`
      // );
    }
    //agenda.pop();
    return agenda;
  };

  let today = orgTimestampUtils.momentToObj(
    orgTimestampUtils.momentFromObj(date)
  );
  today.hour -= today.hour;
  today.minute -= today.minute;

  let realToday = orgTimestampUtils.now();
  realToday.hour -= realToday.hour;
  realToday.minute -= realToday.minute;

  let diff = orgTimestampUtils.diff(today, realToday, 'days');

  const yesterday = orgTimestampUtils.sub(today, { days: 1 });
  const tomorrow = orgTimestampUtils.add(today, { days: 1 });
  const dayAfterTomorrow = orgTimestampUtils.add(today, { days: 2 });

  candidates = filterRange(nodes, yesterday, dayAfterTomorrow);
  candidates.sort((a, b) => {
    return orgTimestampUtils.compare(a.scheduled, b.scheduled);
  });

  const yesStr = '-----++----YESTERDAY----------';
  const todStr = '-----++----TODAY--------------';
  const tomStr = '-----++----TOMORROW-----------';
  const dateStr = d =>
    `-----++----[${d.year}-${padMaybe(d.month)}-${padMaybe(d.date)} ${d.day}]---`;
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

  agendaYesterday = buildDay2(targYesStr, yesterday, today);
  agendaToday = buildDay2(targTodStr, today, tomorrow);
  agendaTomorrow = buildDay2(targTomStr, tomorrow, dayAfterTomorrow);

  return {
    agendaYesterday,
    agendaToday,
    agendaTomorrow,
    dx
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgAgenda);
