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

class OrgPlanning extends Component {
  render() {
    const { isCollapsed, isLocked } = this.props;
    if (isCollapsed) {
      return null;
    } else {
      const {
        bufferID,
        nodeID,
        planning,
        onTimestampUpdate,
        onTimestampRepIntUpdate,
        onTimestampClear
      } = this.props;
      const timings = timestampTypes.map(
        t =>
          isLocked ? (
            <Text>
              {planning && planning[t.toLowerCase()]
                ? planning[t.toLowerCase()].value
                : 'null'}
            </Text>
          ) : (
            <OrgTimestamp
              key={t}
              isLocked={isLocked}
              onTimestampUpdate={onTimestampUpdate(bufferID, nodeID, t)}
              onTimestampRepIntUpdate={onTimestampRepIntUpdate(
                bufferID,
                nodeID,
                t
              )}
              onTimestampClear={onTimestampClear(bufferID, nodeID, t)}
              timestamp={planning ? planning[t.toLowerCase()] : null}
              label={t}
            />
          )
      );

      return <View style={appStyles.container}>{timings}</View>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = getNode(state, bufferID, nodeID);
  const planning = node
    ? OrgNodeUtil.getPlanning(node)
    : OrgNodeUtil.getPlanning(tree);
  return {
    bufferID,
    nodeID,
    planning
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTimestampUpdate: (bufferID, nodeID, timestampType) => date => {
      let timestamp = OrgTimestampUtil.parseDate(date);
      timestamp.type = 'org.timestamp.active';
      timestamp = OrgTimestampUtil.updateValue(timestamp);
      dispatch(updateNodeTimestamp(bufferID, nodeID, timestampType, timestamp));
    },
    onTimestampRepIntUpdate: (bufferID, nodeID, timestampType) => (
      repInt,
      repMin,
      repMax
    ) => {
      dispatch(
        updateNodeTimestampRepInt(
          bufferID,
          nodeID,
          timestampType,
          repInt,
          repMin,
          repMax
        )
      );
    },
    onTimestampClear: (bufferID, nodeID, timestampType) => () => {
      dispatch(clearNodeTimestamp(bufferID, nodeID, timestampType));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgPlanning);
