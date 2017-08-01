import React, { Component } from 'react';
import { TouchableHighlight, ScrollView, Text, View } from 'react-native';

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
        <View className="OrgLogbook">
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <TouchableHighlight onPress={this.props.onAddLogNote}>
                <Text
                  className="OrgDrawerName"
                  style={{
                    fontFamily: 'space-mono',
                    fontSize: 12
                  }}>
                  {'+'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={{ flex: 16 }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}
                onPress={this._toggleCollapse.bind(this)}>
                {'LOGBOOK'}
              </Text>
            </View>
          </View>
          <View>
            {listItems}
          </View>
        </View>
      );
    }
  }
}
