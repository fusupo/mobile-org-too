import React from 'react';
import { connect } from 'react-redux';

import {
  Animated,
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

class OrgAgenda extends React.Component {
  state = {
    transXAnim: new Animated.Value(0), // Initial value for opacity: 0
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
    let dayHeight = this.state.dayHeight;
    if (nextProps.percH !== this.props.percH) {
      if (nextProps.percH <= 0.50) {
        dayHeight = magic / 2;
        this.state.transXAnim.setValue(-dayHeight * 2);
      } else {
        dayHeight = magic / 3;
        this.state.transXAnim.setValue(-dayHeight);
      }
      this.setState({
        dayHeight
      });
      console.log('foo');
    } else {
      console.log('bar');
      const h = dayHeight;
      let startX;
      let endX = -h;
      console.log(nextProps.dx);
      switch (nextProps.dx) {
        case -1:
          if (nextProps.percH <= 0.50) {
            startX = -h * 3;
            endX = -h * 2;
          } else {
            startX = -h * 2;
            endX = -h;
          }
          break;
        case 0:
          if (nextProps.percH <= 0.50) {
            startX = -h * 2;
            endX = -h * 2;
          } else {
            startX = -h;
            endX = -h;
          }
          break;
        case 1:
          if (nextProps.percH <= 0.50) {
            startX = -h;
            endX = -h * 2;
          } else {
            startX = 0;
            endX = -h;
          }
          // if (nextProps.percH <= 0.50) {
          //   dayHeight = magic / 2;
          // } else {
          //   dayHeight = magic / 3;
          // }
          break;
      }
      this.state.transXAnim.setValue(startX);
      Animated.timing(
        // Animate over time
        this.state.transXAnim, // The animated value to drive
        {
          toValue: endX, // Animate to opacity: 1 (opaque)
          duration: 250, // Make it take a while
          easing: Easing.inOut(Easing.quad),
          delay: 1
        }
      ).start(e => {
        console.log(e);
        console.log(this.props.dx);
      }); // Starts the animation
    }
  }

  render() {
    let {
      agendaYesterdayM1,
      agendaYesterday,
      agendaToday,
      agendaTomorrow,
      agendaTomorrowP1,
      dx
    } = this.props;
    const build = data => {
      const foo = data.map((d, idx) => {
        if (typeof d === 'string') {
          return <Text key={idx}>{d}</Text>;
        } else {
          return (
            <Text key={idx}>
              {`${d.scheduled.hour}:${d.scheduled.minute}...... ${d.headline.content}`}
            </Text>
          );
        }
      });
      return (
        <View
          style={{
            height: this.state.dayHeight,
            //margin: 10,
            borderColor: '#000',
            borderWidth: 1
          }}>
          {foo}
        </View>
      );
    };

    let xxx;
    if (this.props.percH <= 0.50) {
      xxx = (
        <View
          style={{
            borderColor: '#f00',
            borderWidth: 1,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: this.state.transXAnim
            }}>
            {build(agendaYesterdayM1)}
            {build(agendaYesterday)}
            {build(agendaToday)}
            {build(agendaTomorrow)}
            {build(agendaTomorrowP1)}
          </Animated.View>
        </View>
      );
    } else {
      xxx = (
        <View
          style={{
            borderColor: '#f00',
            borderWidth: 1,
            flex: 1
          }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: this.state.transXAnim
            }}>
            {build(agendaYesterdayM1)}
            {build(agendaYesterday)}
            {build(agendaToday)}
            {build(agendaTomorrow)}
            {build(agendaTomorrowP1)}
          </Animated.View>
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
    const nowStr = `${now.hour}:${now.minute}...... now - - - - - - - - - - - - - - - - - - - - - - - - - -`;
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
      agenda.push(`${b.hour}:${b.minute}...... ----------------`);
    }
    agenda.pop();
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

  const yesterdayM1 = orgTimestampUtils.sub(today, { days: 2 });
  const yesterday = orgTimestampUtils.sub(today, { days: 1 });
  const tomorrow = orgTimestampUtils.add(today, { days: 1 });
  const dayAfterTomorrow = orgTimestampUtils.add(today, { days: 2 });
  const dayAfterTomorrowP1 = orgTimestampUtils.add(today, { days: 3 });

  candidates = filterRange(nodes, yesterdayM1, dayAfterTomorrowP1);
  candidates.sort((a, b) => {
    return orgTimestampUtils.compare(a.scheduled, b.scheduled);
  });

  const padMaybe = n => {
    n = '' + n;
    n = n.length === 1 ? '0' + n : n;
    return n;
  };
  const yesStr = '-----++----YESTERDAY----------';
  const todStr = '-----++----TODAY--------------';
  const tomStr = '-----++----TOMORROW-----------';
  const dateStr = d =>
    `-----++----[${d.year}-${padMaybe(d.month)}-${padMaybe(d.date)} ${d.day}]---`;
  let targYesM1Str, targYesStr, targTodStr, targTomStr, targTomP1Str;

  switch (diff) {
    case -3:
      targYesM1Str = dateStr(yesterdayM1);
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      targTomP1Str = yesStr;
      break;
    case -2:
      targYesM1Str = dateStr(yesterdayM1);
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = yesStr;
      targTomP1Str = todStr;
      break;
    case -1:
      targYesM1Str = dateStr(yesterdayM1);
      targYesStr = dateStr(yesterday);
      targTodStr = yesStr;
      targTomStr = todStr;
      targTomP1Str = tomStr;
      break;
    case 0:
      targYesM1Str = dateStr(yesterdayM1);
      targYesStr = yesStr;
      targTodStr = todStr;
      targTomStr = tomStr;
      targTomP1Str = dateStr(dayAfterTomorrow);
      break;
    case 1:
      targYesM1Str = yesStr;
      targYesStr = todStr;
      targTodStr = tomStr;
      targTomStr = dateStr(tomorrow);
      targTomP1Str = dateStr(dayAfterTomorrow);
      break;
    case 2:
      targYesM1Str = todStr;
      targYesStr = tomStr;
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      targTomP1Str = dateStr(dayAfterTomorrow);
      break;
    case 3:
      targYesM1Str = tomStr;
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      targTomP1Str = dateStr(dayAfterTomorrow);
      break;
    default:
      targYesM1Str = dateStr(yesterdayM1);
      targYesStr = dateStr(yesterday);
      targTodStr = dateStr(today);
      targTomStr = dateStr(tomorrow);
      targTomP1Str = dateStr(dayAfterTomorrow);
      break;
  }

  agendaYesterdayM1 = buildDay(targYesM1Str, yesterdayM1, yesterday);
  agendaYesterday = buildDay(targYesStr, yesterday, today);
  agendaToday = buildDay(targTodStr, today, tomorrow);
  agendaTomorrow = buildDay(targTomStr, tomorrow, dayAfterTomorrow);
  agendaTomorrowP1 = buildDay(
    targTomP1Str,
    dayAfterTomorrow,
    dayAfterTomorrowP1
  );

  agendaYesterdayM1.key = dateStr(yesterdayM1);
  agendaYesterday.key = dateStr(yesterday);
  agendaToday.key = dateStr(today);
  agendaTomorrow.key = dateStr(tomorrow);
  agendaTomorrowP1.key = dateStr(dayAfterTomorrow);

  return {
    agendaYesterdayM1,
    agendaYesterday,
    agendaToday,
    agendaTomorrow,
    agendaTomorrowP1,
    dx
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgAgenda);
