import React from 'react';
import { connect } from 'react-redux';

import {
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import OrgNode from '../components/OrgNode.js';
import DropboxDataSource from '../utilities/DropboxDataSource.js';

const orgUtils = require('org-parse').utils;
const orgDrawerUtils = require('org-parse').OrgDrawer;
const orgTimestampUtils = require('org-parse').OrgTimestamp;

import { completeHabit, resetHabit } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});

// export default class CalendarScreen extends React.Component {
//   static route = {
//     navigationBar: {
//       title: 'Calendar'
//     }
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       orgNodes: null,
//       orgTree: null,
//       viewIsReady: false
//     };
//   }

//   componentWillMount() {
//     this._loadParseOrgFilesAsync();
//   }

//   async _loadParseOrgFilesAsync() {
//     const ds = new DropboxDataSource();
//     try {
//       let foo = await ds.loadParseOrgFilesAsync();
//       this.setState(foo);
//     } catch (e) {
//       console.warn(
//         'There was an error retrieving files from drobbox on the calendar screen'
//       );
//       console.log(e.message);
//     } finally {
//       this.setState({ viewIsReady: true });
//     }
//   }

//   render() {
//     return <View><Text>{'funk'}</Text></View>;
// if (this.state.viewIsReady) {
//   const parseDate = timestamp => {
//     //          <2017-05-06 Sat 15:00>
//     //          <2017-05-02 Tue 21:00>--<2017-05-02 Tue 23:00>
//     //          <2017-01-06 Fri>
//     //  maybe instead something like:
//     //  let components = timestamp.split(' ');
//     //  let datetimeComponents = components[0].split('-')...etc
//     let dateStr = timestamp.slice(1, 21);
//     let year = +dateStr.slice(0, 4);
//     let month = +dateStr.slice(5, 7);
//     let day = +dateStr.slice(8, 10);
//     let hour = +dateStr.slice(15, 17);
//     let minute = +dateStr.slice(18, 20);

//     month = month === 0 ? 11 : month - 1;

//     const d = new Date(year, month, day, hour, minute);
//     return d;
//   };

//   var q = new Date();
//   var m = q.getMonth();
//   var d = q.getDate();
//   var y = q.getFullYear();

//   var yesterday = new Date(y, m, d - 1);
//   var today = new Date(y, m, d);
//   var tomorrow = new Date(y, m, d + 2);

//   const candidates = this.state.orgNodes.filter(node => {
//     let nodeDate = null;
//     if (orgUtils.nodeHasActiveTimeStamp_p(node)) {
//       let ts = orgUtils.activeTimeStampFromNode(node);
//       nodeDate = parseDate(ts.srcStr);
//     }
//     return (
//       nodeDate !== null && nodeDate >= yesterday && nodeDate <= tomorrow
//     );
//   });

//   candidates.sort((a, b) => {
//     var dateA = parseDate(orgUtils.activeTimeStampFromNode(a).srcStr);
//     var dateB = parseDate(orgUtils.activeTimeStampFromNode(b).srcStr);
//     return dateA.getTime() - dateB.getTime();
//   });

//   const hours = [6, 9, 12, 13, 18, 24];
//   let preListItems = [];
//   let idx = 0;

//   const consumeCandidates = (year, month, date, hour) => {
//     const localDate = new Date(year, month, date, hour);
//     while (
//       candidates.length > 0 &&
//       parseDate(orgUtils.activeTimeStampFromNode(candidates[0]).srcStr) <
//         localDate
//     ) {
//       const node = candidates.shift();
//       preListItems.push({
//         date: parseDate(orgUtils.activeTimeStampFromNode(node).srcStr),
//         jsx: (
//           <View key={idx} style={{ flexDirection: 'row' }}>
//             <Text style={{ fontFamily: 'space-mono', fontSize: 12 }}>
//               {orgUtils.activeTimeStampFromNode(node).srcStr.substr(16, 5)}
//             </Text>
//             <OrgNode node={node} isCollapsed={true} />
//           </View>
//         )
//       });
//       idx++;
//     }
//   };

//   const buildDay = (date, label) => {
//     let localDate = new Date(y, m, date);
//     preListItems.push({
//       date: localDate,
//       jsx: (
//         <View key={label}>
//           <Text
//             style={{
//               color: 'white',
//               backgroundColor: 'black',
//               fontFamily: 'space-mono',
//               fontSize: 12
//             }}>
//             {localDate.toDateString()}
//           </Text>
//         </View>
//       )
//     });
//     for (let i = 0; i < hours.length; i++) {
//       // console.log(hours[i]);
//       consumeCandidates(y, m, date, hours[i]);

//       if (i < hours.length - 1) {
//         preListItems.push({
//           date: new Date(y, m, date, hours[i]),
//           jsx: (
//             <View key={idx}>
//               <Text style={{ fontFamily: 'space-mono', fontSize: 12 }}>
//                 {hours[i].toString().padStart(2, '0') + ':00----------'}
//               </Text>
//             </View>
//           )
//         });
//         idx++;
//       }
//     }
//   };

//   buildDay(d - 1, 'yesterday');
//   buildDay(d, 'today');
//   buildDay(d + 1, 'tomorrow');

//   let listItems = [];
//   for (let i = 0; i < preListItems.length; i++) {
//     listItems.push(preListItems[i].jsx);
//     if (q >= preListItems[i].date && q <= preListItems[i + 1].date) {
//       listItems.push(
//         <View key={'now'}>
//           <Text
//             style={{
//               fontFamily: 'space-mono',
//               fontSize: 12,
//               backgroundColor: '#b0c4de'
//             }}>
//             {q.getHours().toString().padStart(2, '0') +
//               ':' +
//               q.getMinutes().toString().padStart(2, '0') +
//               '-----NOW-------'}
//           </Text>
//         </View>
//       );
//     }
//   }

//   return (
//     <View>
//       <ScrollView>
//         {listItems}
//       </ScrollView>
//     </View>
//   );
// } else {
//   return <View style={styles.container} />;
// }
//   }
// }

const CalendarScreen = ({ habits, habitData, onHabitPress }) => (
  <ScrollView>
    {habits.map((h, idx) => (
      <View key={h.id} style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          underlayColor="#00ff00"
          style={{ flex: 1 }}
          onPress={() => onHabitPress(h.id)}>
          <Text style={{ textAlign: 'right' }}>
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
    // onNodeTitleClick: nodeID => {
    //   dispatch(
    //     NavigationActions.navigate({
    //       routeName: 'NodeDetail',
    //       params: { nodeID: nodeID }
    //     })
    //   );
    // },
    // onHeadlineEndEditing: nodeID => text =>
    //   dispatch(updateNodeHeadlineContent(nodeID, text)),
    // onPressDeleteNode: nodeID => {
    //   dispatch(deleteNode(nodeID));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
