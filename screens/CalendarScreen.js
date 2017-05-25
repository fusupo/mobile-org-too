import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import OrgNode from '../components/OrgNode.js';
import loadParseOrgFilesAsync from '../utilities/loadParseOrgFilesAsync.js';

export default class CalendarScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Calendar'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      orgNodes: null,
      orgTree: null,
      viewIsReady: false
    };
  }

  componentWillMount() {
    console.log('START LOAD/PARSE');
    this._loadParseOrgFilesAsync();
  }

  async _loadParseOrgFilesAsync() {
    try {
      let foo = await loadParseOrgFilesAsync();
      this.setState(foo);
    } catch (e) {
      console.warn(
        'There was an error retrieving files from drobbox on the calendar screen'
      );
      console.log(e.message);
    } finally {
      this.setState({ viewIsReady: true });
    }
  }

  render() {
    if (this.state.viewIsReady) {
      console.log('RENDER THE SHIT FOR REAL');

      const parseDate = timestamp => {
        //          <2017-05-06 Sat 15:00>
        //          <2017-05-02 Tue 21:00>--<2017-05-02 Tue 23:00>
        //          <2017-01-06 Fri>
        //  maybe instead something like:
        //  let components = timestamp.split(' ');
        //  let datetimeComponents = components[0].split('-')...etc
        let dateStr = timestamp.slice(1, 21);
        let year = +dateStr.slice(0, 4);
        let month = +dateStr.slice(5, 7);
        let day = +dateStr.slice(8, 10);
        let hour = +dateStr.slice(15, 17);
        let minute = +dateStr.slice(18, 20);

        month = month === 0 ? 11 : month - 1;

        const d = new Date(year, month, day, hour, minute);
        return d;
      };

      var q = new Date();
      var m = q.getMonth();
      var d = q.getDate();
      var y = q.getFullYear();

      var yesterday = new Date(y, m, d - 1);
      var today = new Date(y, m, d);
      var tomorrow = new Date(y, m, d + 2);

      const candidates = this.state.orgNodes.filter((node, idx) => {
        const nodeDate = node.activeTimeStamp === null
          ? null
          : parseDate(node.activeTimeStamp);
        return (
          nodeDate !== null && nodeDate >= yesterday && nodeDate <= tomorrow
        );
      });

      candidates.sort((a, b) => {
        var dateA = parseDate(a.activeTimeStamp);
        var dateB = parseDate(b.activeTimeStamp);
        return dateA.getTime() - dateB.getTime();
      });

      const hours = [6, 9, 12, 13, 18, 24];
      let preListItems = [];
      let idx = 0;

      const consumeCandidates = (year, month, date, hour) => {
        const localDate = new Date(year, month, date, hour);
        while (
          candidates.length > 0 &&
          parseDate(candidates[0].activeTimeStamp) < localDate
        ) {
          const node = candidates.shift();
          console.log(
            node.activeTimeStamp,
            node.headline.content,
            parseDate(node.activeTimeStamp).toString(),
            localDate.toString()
          );
          preListItems.push({
            date: parseDate(node.activeTimeStamp),
            jsx: (
              <View key={idx} style={{ flexDirection: 'row' }}>
                <Text style={{ fontFamily: 'space-mono', fontSize: 12 }}>
                  {node.activeTimeStamp.substr(16, 5)}
                </Text>
                <OrgNode node={node} isCollapsed={true} />
              </View>
            )
          });
          idx++;
        }
      };

      const buildDay = (date, label) => {
        let localDate = new Date(y, m, date);
        preListItems.push({
          date: localDate,
          jsx: (
            <View key={label}>
              <Text
                style={{
                  color: 'white',
                  backgroundColor: 'black',
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}>
                {localDate.toDateString()}
              </Text>
            </View>
          )
        });
        for (let i = 0; i < hours.length; i++) {
          console.log(hours[i]);
          consumeCandidates(y, m, date, hours[i]);

          if (i < hours.length - 1) {
            preListItems.push({
              date: new Date(y, m, date, hours[i]),
              jsx: (
                <View key={idx}>
                  <Text style={{ fontFamily: 'space-mono', fontSize: 12 }}>
                    {hours[i].toString().padStart(2, '0') + ':00----------'}
                  </Text>
                </View>
              )
            });
            idx++;
          }
        }
      };

      buildDay(d - 1, 'yesterday');
      buildDay(d, 'today');
      buildDay(d + 1, 'tomorrow');

      let listItems = [];
      for (let i = 0; i < preListItems.length; i++) {
        listItems.push(preListItems[i].jsx);
        if (q >= preListItems[i].date && q <= preListItems[i + 1].date) {
          listItems.push(
            <View key={'now'}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12,
                  backgroundColor: '#b0c4de'
                }}>
                {q.getHours().toString().padStart(2, '0') +
                  ':' +
                  q.getMinutes().toString().padStart(2, '0') +
                  '-----NOW-------'}
              </Text>
            </View>
          );
        }
      }

      return (
        <View>
          <ScrollView>
            {listItems}
          </ScrollView>
        </View>
      );
    } else {
      return <View style={styles.container} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  }
});
