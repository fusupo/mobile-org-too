import React from 'react';
import { connect } from 'react-redux';

import {
  cycleNodeCollapse,
  updateNodeHeadlineContent,
  updateNodeTimestamp,
  updateNodeTimestampRepInt,
  clearNodeTimestamp,
  updateNodeTodoKeyword,
  deleteNode
} from '../actions';

import { NavigationActions } from 'react-navigation';

import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OrgTree } from '../components/OrgTree';

import EditOrgHeadline from '../components/EditOrgHeadline';
import OrgTimestamp from '../components/OrgTimestamp.js';
import OrgDrawer from '../components/OrgDrawer.js';
import OrgLogbook from '../components/OrgLogbook.js';

const OrgTreeUtil = require('org-parse').OrgTree;
const OrgTimestampUtil = require('org-parse').OrgTimestamp;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 10
  }
});

const timestampTypes = ['OPENED', 'SCHEDULED', 'DEADLINE', 'CLOSED'];

const NodeDetailScreen = ({
  navigation,
  buffers,
  onNodeTitleClick,
  onNodeArrowClick,
  onHeadlineEndEditing,
  onPressDeleteNode,
  onNodeTodoKeywordUpdate,
  onTimestampUpdate,
  onTimestampRepIntUpdate,
  onTimestampClear
}) => {
  const params = navigation.state.params;
  if (params && params.bufferID && params.nodeID) {
    const { bufferID, nodeID } = params;
    const nodes = buffers[bufferID].orgNodes;
    const tree = buffers[bufferID].orgTree;
    const node = nodes[nodeID];
    if (node) {
      // timings
      const timings = timestampTypes.map(t => (
        <OrgTimestamp
          key={t}
          timestamp={node[t.toLowerCase()]}
          label={t}
          onTimestampUpdate={onTimestampUpdate(bufferID, nodeID, t)}
          onTimestampRepIntUpdate={onTimestampRepIntUpdate(bufferID, nodeID, t)}
          onTimestampClear={onTimestampClear(bufferID, nodeID, t)}
        />
      ));
      // body
      const body = node.body ? <Text>{node.body}</Text> : null;
      // childNodes
      const childIDs = OrgTreeUtil.findBranch(tree, nodeID).children;
      const listItems = childIDs.length === 0
        ? null
        : childIDs.map((cn, idx) => (
            <OrgTree
              key={cn.nodeID}
              nodes={nodes}
              tree={OrgTreeUtil.findBranch(tree, cn.nodeID)}
              onNodeTitleClick={onNodeTitleClick(bufferID)}
              onNodeArrowClick={onNodeArrowClick(bufferID)}
            />
          ));
      const list = listItems
        ? <ScrollView style={{ flex: 1 }}>{listItems}</ScrollView>
        : null;
      return (
        <View style={styles.container}>
          <Button
            onPress={() => onPressDeleteNode(bufferID, nodeID)}
            title="DeleteNode"
            color="#841584"
            accessibilityLabel="delete this node"
          />
          <ScrollView style={styles.container}>
            <View style={[styles.container, styles.border]}>
              <EditOrgHeadline
                headline={node.headline}
                onEndEditing={onHeadlineEndEditing(bufferID, nodeID)}
                onNodeTodoKeywordUpdate={onNodeTodoKeywordUpdate(
                  bufferID,
                  nodeID
                )}
              />
            </View>
            <View style={[styles.container, styles.border]}>
              {timings}
            </View>
            <View style={[styles.container, styles.border]}>
              <OrgDrawer drawer={node.propDrawer} isCollapsed={false} />
            </View>
            <View style={[styles.container, styles.border]}>
              <OrgLogbook log={node.logbook} isCollapsed={false} />
            </View>
            <View style={[styles.container, styles.border]}>
              {body}
            </View>
          </ScrollView>
          {list}
        </View>
      );
    } else {
      return <View><Text>{'fooosball'}</Text></View>;
    }
  } else {
    return <View><Text>{'fooosball'}</Text></View>;
  }
};

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state, ownProps) => {
  return {
    buffers: state.orgBuffers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeArrowClick: bufferID => {
      return nodeID => {
        dispatch(cycleNodeCollapse(bufferID, nodeID));
      };
    },
    onNodeTitleClick: bufferID => {
      return nodeID => {
        dispatch(
          NavigationActions.navigate({
            routeName: 'NodeDetail',
            params: { bufferID, nodeID }
          })
        );
      };
    },
    onHeadlineEndEditing: (bufferID, nodeID) => text =>
      dispatch(updateNodeHeadlineContent(bufferID, nodeID, text)),
    onPressDeleteNode: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onNodeTodoKeywordUpdate: (bufferID, nodeID) => todoKeyword =>
      dispatch(updateNodeTodoKeyword(bufferID, nodeID, todoKeyword)),
    onTimestampUpdate: (bufferID, nodeID, timestampType) => date => {
      const timestamp = OrgTimestampUtil.parseDate(date);
      timestamp.type = 'active';
      dispatch(updateNodeTimestamp(bufferID, nodeID, timestampType, timestamp));
    },
    onTimestampRepIntUpdate: (bufferID, nodeID, timestampType) => (
      repInt,
      repMaxVal,
      repMaxU,
      repMinVal,
      repMinU
    ) => {
      dispatch(
        updateNodeTimestampRepInt(
          bufferID,
          nodeID,
          timestampType,
          repInt,
          repMaxVal + repMaxU,
          repMinVal + repMinU
        )
      );
    },
    onTimestampClear: (bufferID, nodeID, timestampType) => () => {
      dispatch(clearNodeTimestamp(bufferID, nodeID, timestampType));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
