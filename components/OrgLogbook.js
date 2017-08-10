import React, { Component } from 'react';
import { TouchableHighlight, ScrollView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

import OrgLogbookItem from './OrgLogbookItem';

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
        <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
          <View
            className="OrgLogbook"
            style={{
              flexDirection: 'row',
              backgroundColor: '#cccccc'
            }}>
            <Ionicons
              name={'ios-recording'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>
      );
    } else {
      const listItems =
        this.props.log &&
        this.props.log.entries &&
        this.props.log.entries.map((le, idx) => {
          return (
            <OrgLogbookItem
              key={idx}
              idx={idx}
              type={le.type}
              logItem={le}
              onRemoveLogNote={this.props.onRemoveLogNote}
              onUpdateLogNote={this.props.onUpdateLogNote}
            />
          );
        });

      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Swipeout
            autoClose={true}
            left={[
              {
                text: 'addOne',
                backgroundColor: '#33bb33',
                onPress: () => {
                  this.props.onAddLogNote();
                }
              }
            ]}>
            <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
              <View
                className="OrgLogbook"
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#cccccc'
                }}
                onPress={this._toggleCollapse.bind(this)}>
                <Ionicons
                  name={'ios-recording-outline'}
                  size={20}
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableHighlight>
          </Swipeout>
          <View className="OrgDrawerProperties">
            {listItems}
          </View>
        </View>
      );
    }
  }
}

// <View className="OrgLogbook">
//   <View
//     style={{
//       flexDirection: 'row',
//       backgroundColor: '#cccccc'
//     }}>
//     <Ionicons name={'ios-recording-outline'} size={20} />
//     <View style={{ flex: 1 }}>
//       <TouchableHighlight onPress={this.props.onAddLogNote}>
//         <Text
//           className="OrgDrawerName"
//           style={{
//             fontFamily: 'space-mono',
//             fontSize: 12
//           }}>
//           {'+'}
//         </Text>
//       </TouchableHighlight>
//     </View>
//     <View style={{ flex: 16 }}>
//       <Text
//         style={{
//           fontFamily: 'space-mono',
//           fontSize: 12
//         }}
//         onPress={this._toggleCollapse.bind(this)}>
//         {'LOGBOOK'}
//       </Text>
//     </View>
//   </View>
//   <View>
//     {listItems}
//   </View>
// </View>
