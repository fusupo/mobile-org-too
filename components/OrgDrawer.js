import React, { Component } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

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
              fontSize: 12,
              flex: 1,
              paddingLeft: 10
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
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Swipeout
            left={[
              {
                text: 'addOne',
                onPress: () => {
                  this.props.onAddProp();
                }
              }
            ]}>
            <View
              className="OrgDrawer"
              style={{
                flexDirection: 'row',
                backgroundColor: '#cccccc'
              }}>
              <Ionicons name={'ios-list-box-outline'} size={20} />
              <Text
                className="OrgDrawerName"
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12,
                  flex: 1,
                  paddingLeft: 10
                }}
                onPress={this._toggleCollapse.bind(this)}>
                {this.props.drawer.name}
              </Text>
            </View>
          </Swipeout>
          <View className="OrgDrawerProperties">
            {listItems}
          </View>
        </View>
      );
    }
  }
}

export default OrgDrawer;
