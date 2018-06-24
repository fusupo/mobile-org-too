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
    const { log, onRemoveLogNote, onUpdateLogNote, onAddLogNote } = this.props;
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
              name={'ios-recording-outline'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>
      );
    } else {
      const listItems =
        log &&
        log.items &&
        log.items.map((le, idx) => {
          return (
            <OrgLogbookItem
              key={idx}
              idx={idx}
              type={le.type}
              logItem={le}
              onRemoveLogNote={onRemoveLogNote}
              onUpdateLogNote={onUpdateLogNote}
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
                  onAddLogNote();
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
                  name={'ios-recording'}
                  size={20}
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableHighlight>
          </Swipeout>
          <View className="OrgDrawerProperties">{listItems}</View>
        </View>
      );
    }
  }
}
