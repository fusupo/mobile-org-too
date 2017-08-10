import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

import {
  updateNodeTimestamp,
  updateNodeTimestampRepInt,
  clearNodeTimestamp
} from '../actions';

import OrgTimestamp from './OrgTimestamp';

const OrgTimestampUtil = require('org-parse').OrgTimestamp;

const timestampTypes = ['OPENED', 'SCHEDULED', 'DEADLINE', 'CLOSED'];

class OrgScheduling extends Component {
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
        <View className="OrgScheduling">
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            SCHEDULING
          </Text>
        </View>
      );
    } else {
      const {
        bufferID,
        nodeID,
        node,
        onTimestampUpdate,
        onTimestampRepIntUpdate,
        onTimestampClear
      } = this.props;
      const timings = timestampTypes.map(t => (
        <OrgTimestamp
          key={t}
          onTimestampUpdate={onTimestampUpdate(bufferID, nodeID, t)}
          onTimestampRepIntUpdate={onTimestampRepIntUpdate(bufferID, nodeID, t)}
          onTimestampClear={onTimestampClear(bufferID, nodeID, t)}
          timestamp={node[t.toLowerCase()]}
          label={t}
        />
      ));

      return (
        <View>
          <View className="OrgScheduling">
            <Text
              className="OrgDrawerName"
              style={{
                fontFamily: 'space-mono',
                backgroundColor: '#cccccc',
                fontSize: 12
              }}
              onPress={this._toggleCollapse.bind(this)}>
              SCHEDULING
            </Text>
          </View>
          <View>{timings}</View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const nodes = state.orgBuffers[bufferID].orgNodes;
  const node = nodes[nodeID];
  return {
    bufferID,
    nodeID,
    node
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTimestampUpdate: (bufferID, nodeID, timestampType) => date => {
      console.log('UPDATE TIMESTAMP');
      const timestamp = OrgTimestampUtil.parseDate(date);
      timestamp.type = 'active';
      console.log(bufferID, nodeID, timestampType, timestamp);
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

export default connect(mapStateToProps, mapDispatchToProps)(OrgScheduling);
