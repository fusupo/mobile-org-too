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
  nodes,
  tree,
  onNodeTitleClick,
  onNodeArrowClick,
  onHeadlineEndEditing,
  onPressDeleteNode
}) => {
  const nodeID = navigation.state.params.nodeID;
  const node = nodes[nodeID];
  if (node !== undefined) {
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
    const childIDs = OrgTreeUtil.childIDs(tree, nodeID);
    console.log(childIDs);
    const listItems = childIDs.length === 0
      ? null
      : childIDs.map((cn, idx) => (
          <OrgTree
            key={cn.nodeID}
            nodes={nodes}
            tree={OrgTreeUtil.findBranch(tree, cn.nodeID)}
            onNodeTitleClick={() => {
              onNodeTitleClick(cn.nodeID);
            }}
            onNodeArrowClick={() => {
              onNodeArrowClick(cn.nodeID);
            }}
          />
        ));
    const list = listItems
      ? <ScrollView style={{ flex: 1 }}>{listItems}</ScrollView>
      : null;
    return (
      <View style={styles.container}>
        <Button
          onPress={() => onPressDeleteNode(nodeID)}
          title="DeleteNode"
          color="#841584"
          accessibilityLabel="delete this node"
        />
        <ScrollView style={styles.container}>
          <View style={[styles.container, styles.border]}>
            <EditOrgHeadline
              headline={node.headline}
              onEndEditing={onHeadlineEndEditing(nodeID)}
            />
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
};

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => ({
  nodes: state.orgNodes,
  tree: state.orgTree
});

const mapDispatchToProps = dispatch => {
  return {
    onNodeArrowClick: nodeID => {
      dispatch(cycleNodeCollapse(nodeID));
    },
    onNodeTitleClick: nodeID => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'NodeDetail',
          params: { nodeID: nodeID }
        })
      );
    },
    onHeadlineEndEditing: nodeID => text =>
      dispatch(updateNodeHeadlineContent(nodeID, text)),
    onPressDeleteNode: nodeID => {
      dispatch(deleteNode(nodeID));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
