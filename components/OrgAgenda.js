import React from 'react';
import { connect } from 'react-redux';

import { Text, ScrollView, StyleSheet } from 'react-native';

const orgTimestampUtils = require('org-parse').OrgTimestamp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});

const OrgAgenda = ({ agendaYesterday, agendaToday, agendaTomorrow }) => {
  const build = day => {
    const data = {
      yesterday: agendaYesterday,
      today: agendaToday,
      tomorrow: agendaTomorrow
    }[day];

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
    return foo;
  };

  return (
    <ScrollView>
      {build('yesterday')}
      {build('today')}
      {build('tomorrow')}
    </ScrollView>
  );
};

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  let agendaYesterday = [];
  let agendaToday = [];
  let agendaTomorrow = [];
  let candidates;

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
    let now = orgTimestampUtils.now();
    const nowStr = `${now.hour}:${now.minute}...... now - - - - - - - - - - - - - - - - - - - - - - - - - -`;
    const cand = filterRange(candidates, start, end);
    let agenda = [headerStr];
    for (let i = 0; i < hours.length - 1; i++) {
      const a = orgTimestampUtils.add(start, { hours: hours[i] });
      const b = orgTimestampUtils.add(start, { hours: hours[i + 1] });
      let foo = filterRange(cand, a, b);
      // foo.sort((x, y) => {
      //   return orgTimestampUtils.compare(x.scheduled, y.scheduled);
      // });

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

  // if (nodes.length > 0) {
  let today = orgTimestampUtils.now();
  today.hour -= today.hour;
  today.minute -= today.minute;
  const yesterday = orgTimestampUtils.sub(today, { days: 1 });
  const tomorrow = orgTimestampUtils.add(today, { days: 1 });
  const dayAfterTomorrow = orgTimestampUtils.add(today, { days: 2 });

  candidates = filterRange(nodes, yesterday, dayAfterTomorrow);
  candidates.sort((a, b) => {
    return orgTimestampUtils.compare(a.scheduled, b.scheduled);
  });

  agendaYesterday = buildDay(
    '-----++----YESTERDAY----------',
    yesterday,
    today
  );
  agendaToday = buildDay('-----++----TODAY--------------', today, tomorrow);
  agendaTomorrow = buildDay(
    '-----++----TOMORROW-----------',
    tomorrow,
    dayAfterTomorrow
  );
  // }

  return {
    agendaYesterday: agendaYesterday,
    agendaToday: agendaToday,
    agendaTomorrow: agendaTomorrow
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgAgenda);
