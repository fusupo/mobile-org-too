import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

import OrgDrawerItem from './OrgDrawerItem';

class OrgDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: this.props.isCollapsed,
      editIdx: null
    };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    if (this.state.isCollapsed) {
      return (
        <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
          <View
            className="OrgDrawer"
            style={{
              flexDirection: 'row',
              backgroundColor: '#cccccc'
            }}>
            <Ionicons
              name={'ios-list-box-outline'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>
      );
    } else {
      const listItems =
        this.props.drawer && this.props.drawer.props
          ? Object.entries(this.props.drawer.props).map((keyval, idx) => {
              const key = keyval[0];
              const val = keyval[1];
              return (
                <OrgDrawerItem
                  key={idx}
                  idx={idx}
                  propKey={key}
                  propVal={typeof val === 'object' ? val.value : val}
                  onRemoveProp={this.props.onRemoveProp}
                  onUpdateProp={this.props.onUpdateProp}
                  onItemEditBegin={itemIdx => {
                    this.setState({ editIdx: itemIdx });
                  }}
                  onItemEditEnd={() => {
                    this.setState({ editIdx: null });
                  }}
                  disabled={
                    this.state.editIdx === null || this.state.editIdx === idx
                      ? false
                      : true
                  }
                />
              );
            })
          : [];

      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Swipeout
            autoClose={true}
            left={[
              {
                text: 'addOne',
                backgroundColor: '#33bb33',
                onPress: () => {
                  this.props.onAddProp();
                }
              }
            ]}>
            <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
              <View
                className="OrgDrawer"
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#cccccc'
                }}>
                <Ionicons
                  name={'ios-list-box'}
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

export default OrgDrawer;
