import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import R from 'ramda';

import OrgHeadline from './OrgHeadlineToo';
import List from './List';
import Tree from './Tree';

export default class OrgSectionElementHeader extends Component {
  render() {
    const { toggleCollapse, iconName } = this.props;
    return (
      <TouchableHighlight onPress={toggleCollapse}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#cccccc'
          }}>
          <Ionicons name={iconName} size={20} style={{ marginLeft: 5 }} />
        </View>
      </TouchableHighlight>
    );
  }
}
