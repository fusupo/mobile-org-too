import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  updateNodeTimestamp,
  updateNodeTimestampRepInt,
  clearNodeTimestamp
} from '../actions';

import OrgTimestamp from './OrgTimestamp';

const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');
const OrgNodeUtil = require('../utilities/OrgNodeUtil');

const timestampTypes = ['OPENED', 'SCHEDULED', 'DEADLINE', 'CLOSED'];

import appStyles from '../styles';

import { getNode } from '../selectors';

import OrgSectionElementHeader from './OrgSectionElementHeader';

class OrgPlainList extends Component {
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
        <OrgSectionElementHeader
          iconName={'ios-list'}
          toggleCollapse={this._toggleCollapse.bind(this)}
        />
      );
    } else {
      const { items, bufferID, nodeID } = this.props;
      const listItems = items.map(i => {
        const key = JSON.stringify(i);
        const valueComp = (
          <View key={key}>
            <Text>{`${i.counter ? i.counter : ''}${i.bullet
              ? i.bullet + ' '
              : ''}${i.value}`}</Text>
          </View>
        );
        if (i.list) {
          const subList = (
            <OrgPlainList bufferID={bufferID} nodeID={nodeID} items={i.list} />
          );
          if (i.value) {
            return (
              <View key={key}>
                {i.value ? valueComp : null}
                <View style={{ marginLeft: 10 }}>{subList}</View>
              </View>
            );
          } else {
            return (
              <View key={key} style={{ marginLeft: 10 }}>
                {subList}
              </View>
            );
          }
        } else {
          return valueComp;
        }
      });
      return (
        <View style={appStyles.container}>
          <OrgSectionElementHeader
            iconName={'ios-list'}
            toggleCollapse={this._toggleCollapse.bind(this)}
          />
          <View>{listItems}</View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const node = getNode(state, bufferID, nodeID);
  return {
    bufferID,
    nodeID,
    node
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onTimestampUpdate: (bufferID, nodeID, timestampType) => date => {
    //   let timestamp = OrgTimestampUtil.parseDate(date);
    //   timestamp.type = 'org.timestamp.active';
    //   timestamp = OrgTimestampUtil.updateValue(timestamp);
    //   dispatch(updateNodeTimestamp(bufferID, nodeID, timestampType, timestamp));
    // },
    // onTimestampRepIntUpdate: (bufferID, nodeID, timestampType) => (
    //   repInt,
    //   repMin,
    //   repMax
    // ) => {
    //   dispatch(
    //     updateNodeTimestampRepInt(
    //       bufferID,
    //       nodeID,
    //       timestampType,
    //       repInt,
    //       repMin,
    //       repMax
    //     )
    //   );
    // },
    // onTimestampClear: (bufferID, nodeID, timestampType) => () => {
    //   dispatch(clearNodeTimestamp(bufferID, nodeID, timestampType));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgPlainList);
