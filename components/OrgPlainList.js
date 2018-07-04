import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableHighlight } from 'react-native';

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

class OrgPlainList extends Component {
  render() {
    const { isCollapsed } = this.props;
    if (isCollapsed) {
      return null;
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
      return <View style={appStyles.container}>{listItems}</View>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, idx } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const items = node
    ? node.section.children[idx].items
    : tree.section.children[idx].items;
  return {
    bufferID,
    nodeID,
    items
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
