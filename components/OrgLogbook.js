import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default class OrgLogbook extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: this.props.isCollapsed };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    if (this.state.isCollapsed) {
      return (
        <View className="OrgLogbook">
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            LOGBOOK
          </Text>
        </View>
      );
    } else {
      const listItems =
        this.props.log &&
        this.props.log.entries &&
        this.props.log.entries.map((le, idx) => {
          let ret;
          text = le.text ? <Text>{le.text}</Text> : null;
          switch (le.type) {
            case 'state':
              ret = (
                <View key={idx}>
                  <Text>{`State ${le.state} from ${le.from} ${le.timestamp}`}</Text>
                  {text}
                </View>
              );
              break;
            case 'note':
              ret = (
                <View key={idx}>
                  <Text>{`Note taken on ${le.timestamp}`}</Text>
                  {text}
                </View>
              );
              break;
            default:
              ret = (
                <View key={idx}>
                  <Text>{`DONT KNOW WHAT TO DO HERE!!`}</Text>
                  {text}
                </View>
              );
              break;
          }
          // return (
          //   <View key={idx}>
          //     {l.map((x, idx2) => (
          //       <Text
          //         key={idx2}
          //         style={{
          //           fontFamily: 'space-mono',
          //           backgroundColor: '#cccccc',
          //           fontSize: 10
          //         }}>
          //         {x}
          //       </Text>
          //     ))}
          //   </View>
          // );
          return ret;
        });

      return (
        <View className="OrgLogbook" style={{ flex: 1 }}>
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            LOGBOOK
          </Text>
          <ScrollView
            className="OrgLogbookItems"
            style={{
              backgroundColor: '#cccccc'
            }}>
            {listItems}
          </ScrollView>
        </View>
      );
    }
  }
}
