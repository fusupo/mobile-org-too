import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';
import Swipeout from 'react-native-swipeout';

import OrgLogbookItem from './OrgLogbookItem';

import {
  insertNewNodeLogNote,
  updateNodeLogNote,
  removeNodeLogNote
} from '../actions';

const OrgNodeUtil = require('../utilities/OrgNodeUtil');
import { getNode } from '../selectors';

class OrgLogbook extends Component {
  render() {
    const {
      isCollapsed,
      isLocked,
      log,
      onRemoveLogNote,
      onUpdateLogNote,
      onAddLogNote
    } = this.props;
    if (isCollapsed) {
      return null;
    } else {
      const listItems =
        log &&
        log.items &&
        log.items.map((le, idx) => {
          return (
            <OrgLogbookItem
              isLocked={isLocked}
              key={idx}
              idx={idx}
              type={le.type}
              logItem={le}
              onRemoveLogNote={onRemoveLogNote}
              onUpdateLogNote={onUpdateLogNote}
            />
          );
        });

      //   <Swipeout
      // autoClose={true}
      // left={[
      //   {
      //     text: 'addOne',
      //     backgroundColor: '#33bb33',
      //     onPress: () => {
      //       onAddLogNote();
      //     }
      //   }
      // ]}>
      return <View className="OrgDrawerProperties">{listItems}</View>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const log = OrgNodeUtil.getLogbook(node || tree);
  return {
    bufferID,
    nodeID,
    log
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddLogNote: (bufferID, nodeID) => () => {
      const nowStr = OrgTimestampUtil.serialize(OrgTimestampUtil.now());
      dispatch(insertNewNodeLogNote(bufferID, nodeID, nowStr));
    },
    onUpdateLogNote: (bufferID, nodeID) => (idx, text) => {
      dispatch(updateNodeLogNote(bufferID, nodeID, idx, text));
    },
    onRemoveLogNote: (bufferID, nodeID) => idx => {
      dispatch(removeNodeLogNote(bufferID, nodeID, idx));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgLogbook);
