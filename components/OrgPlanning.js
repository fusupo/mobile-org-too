import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableHighlight } from 'react-native';
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

class OrgPlanning extends Component {
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
          iconName={'ios-alarm-outline'}
          toggleCollapse={this._toggleCollapse.bind(this)}
        />
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
      const planning = OrgNodeUtil.getPlanning(node);
      const timings = timestampTypes.map(t => (
        <OrgTimestamp
          key={t}
          onTimestampUpdate={onTimestampUpdate(bufferID, nodeID, t)}
          onTimestampRepIntUpdate={onTimestampRepIntUpdate(bufferID, nodeID, t)}
          onTimestampClear={onTimestampClear(bufferID, nodeID, t)}
          timestamp={planning ? planning[t.toLowerCase()] : null}
          label={t}
        />
      ));

      return (
        <View style={appStyles.container}>
          <OrgSectionElementHeader
            iconName={'ios-alarm'}
            toggleCollapse={this._toggleCollapse.bind(this)}
          />
          <View>{timings}</View>
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
