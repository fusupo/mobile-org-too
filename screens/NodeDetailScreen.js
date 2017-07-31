import React from 'react';
import { connect } from 'react-redux';

import {
  cycleNodeCollapse,
  updateNodeHeadlineContent,
  deleteNode
} from '../actions';

import { NavigationActions } from 'react-navigation';

import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OrgTree } from '../components/OrgTree';

import EditOrgHeadline from '../components/EditOrgHeadline';
import OrgHeadline from '../components/OrgHeadline';
import OrgDrawer from '../components/OrgDrawer.js';
import OrgLogbook from '../components/OrgLogbook.js';

const OrgTreeUtil = require('org-parse').OrgTree;

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

const NodeDetailScreen = ({
  navigation,
  buffers,
  onNodeTitleClick,
  onNodeArrowClick,
  onHeadlineEndEditing,
  onPressDeleteNode
}) => {
  const params = navigation.state.params;
  if (params && params.bufferID && params.nodeID) {
    const { bufferID, nodeID } = params;
    const nodes = buffers[bufferID].orgNodes;
    const tree = buffers[bufferID].orgTree;
    const node = nodes[nodeID];
    if (node) {
      // headlineContent
      const headlineContent = node.headline.content;
      // todo keyword
      const todoKeyword = node.headline.todoKeyword
        ? <Text
            style={{
              backgroundColor: node.headline.todoKeywordColor
            }}>
            {node.headline.todoKeyword}
          </Text>
        : null;
      // tags
      const tags = node.headline.tags && node.headline.tags.length > 0
        ? node.headline.tags.map((tag, idx) => {
            return (
              <Text
                key={idx}
                style={{
                  fontFamily: 'space-mono',
                  backgroundColor: '#cccccc',
                  fontSize: 10
                }}>
                {tag}
              </Text>
            );
          })
        : null;
      // scheduled
      const scheduled = node.scheduled
        ? <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 12
            }}>
            {`SCHEDULED: ${node.scheduled.year}-${node.scheduled.month}-${node.scheduled.date} ${node.scheduled.day} ${node.scheduled.hour}:${node.scheduled.minute} ${node.scheduled.repInt}${node.scheduled.repMin}${node.scheduled.repMax !== null ? '/' + node.scheduled.repMax : ''}`}
          </Text>
        : null;
      // deadline
      const deadline = node.deadline
        ? <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 12
            }}>
            {`DEADLINE: ${node.deadline.year}-${node.deadline.month}-${node.deadline.date} ${node.deadline.day} ${node.deadline.hour}:${node.deadline.minute} ${node.deadline.repInt}${node.deadline.repMin}${node.deadline.repMax !== null ? '/' + node.deadline.repMax : ''}`}
          </Text>
        : null;
      // closed
      const closed = node.closed
        ? <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 12
            }}>
            {'CLOSED: ' + node.closed.srcStr}
          </Text>
        : null;
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
              />
            </View>
            <View style={[styles.container, styles.border]}>
              {deadline}
              {scheduled}
              {closed}
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
