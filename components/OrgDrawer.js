import React, { Component } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import OrgDrawerItem from './OrgDrawerItem';

class OrgDrawer extends Component {
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
        <View
          className="OrgDrawer"
          style={{
            flexDirection: 'row',
            backgroundColor: '#cccccc'
          }}>
          <Ionicons name={'ios-list-box'} size={20} />
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
        const key = keyval[0];
        const val = keyval[1];
        return (
          <OrgDrawerItem
            key={idx}
            idx={idx}
            propKey={key}
            propVal={val}
            onRemoveProp={this.props.onRemoveProp}
            onUpdateProp={this.props.onUpdateProp}
          />
        );
      });

      return (
        <View className="OrgDrawer">
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#cccccc'
            }}>
            <Ionicons name={'ios-list-box-outline'} size={20} />
            <View style={{ flex: 1 }}>
              <TouchableHighlight onPress={this.props.onAddProp}>
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
                className="OrgDrawerName"
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}
                onPress={this._toggleCollapse.bind(this)}>
                {this.props.drawer.name}
              </Text>
            </View>
          </View>
          <View className="OrgDrawerProperties">
            {listItems}
          </View>
        </View>
      );
    }
  }
}

export default OrgDrawer;
