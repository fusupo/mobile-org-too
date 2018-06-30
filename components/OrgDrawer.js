import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

import OrgDrawerItem from './OrgDrawerItem';
import OrgSectionElementHeader from './OrgSectionElementHeader';
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
        <OrgSectionElementHeader
          iconName={'ios-list-box-outline'}
          toggleCollapse={this._toggleCollapse.bind(this)}
        />
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
            <OrgSectionElementHeader
              iconName={'ios-list-box'}
              toggleCollapse={this._toggleCollapse.bind(this)}
            />
          </Swipeout>
          <View className="OrgDrawerProperties">{listItems}</View>
        </View>
      );
    }
  }
}

export default OrgDrawer;
