import React, { Component } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

class OrgDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: true };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    if (this.state.isCollapsed) {
      return (
        <View className="OrgDrawer">
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            {this.props.drawer.name}
          </Text>
        </View>
      );
    } else {
      const listItems = this.props.drawer.properties.map((keyval, idx) => {
        const key = Object.keys(keyval)[0];
        const val = keyval[key];
        return (
          <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 10
            }}
            key={idx}>
            {key}:{val}
          </Text>
        );
      });

      return (
        <View className="OrgDrawer">
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            {this.props.drawer.name}
          </Text>
          <View className="OrgDrawerProperties">
            {listItems}
          </View>
        </View>
      );
    }
  }
}

export default OrgDrawer;
