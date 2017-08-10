import React from 'react';
import { connect } from 'react-redux';
import {
  cycleNodeCollapse,
  updateNodeTimestamp,
  updateNodeTimestampRepInt,
  clearNodeTimestamp,
  deleteNode,
  insertNewNodeProp,
  updateNodeProp,
  removeNodeProp,
  insertNewNodeLogNote,
  updateNodeLogNote,
  removeNodeLogNote,
  updateNodeBody
} from '../actions';

import { NavigationActions } from 'react-navigation';

import {
  ActionSheetIOS,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { OrgTree } from '../components/OrgTree';

import OrgHeadline from '../components/OrgHeadline';
import OrgHeadlineEditable from '../components/OrgHeadlineEditable';
import OrgScheduling from '../components/OrgScheduling';
import OrgDrawer from '../components/OrgDrawer';
import OrgLogbook from '../components/OrgLogbook';
import OrgBody from '../components/OrgBody';

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

const NodeDetailScreen = ({
  tree,
  bufferID,
  nodeID,
  node,
  onPressDeleteNode,
  onAddProp,
  onUpdateProp,
  onRemoveProp,
  onAddLogNote,
  onUpdateLogNote,
  onRemoveLogNote,
  onUpdateNodeBody
}) => {
  if (node) {
    // childNodes
    const childIDs = OrgTreeUtil.findBranch(tree, nodeID).children;
    const listItems = childIDs.length === 0
      ? null
      : childIDs.map(cn => (
          <OrgHeadline key={cn.nodeID} bufferID={bufferID} nodeID={cn.nodeID} />
        ));
    const list = listItems
      ? <ScrollView style={{ flex: 1 }}>{listItems}</ScrollView>
      : null;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={[styles.container, styles.border]}>
            <OrgHeadlineEditable bufferID={bufferID} node={node} />
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgScheduling
              bufferID={bufferID}
              nodeID={nodeID}
              isCollapsed={true}
            />
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgDrawer
              drawer={node.propDrawer}
              isCollapsed={true}
              onAddProp={onAddProp(bufferID, nodeID)}
              onUpdateProp={onUpdateProp(bufferID, nodeID)}
              onRemoveProp={onRemoveProp(bufferID, nodeID)}
            />
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgLogbook
              log={node.logbook}
              isCollapsed={true}
              onAddLogNote={onAddLogNote(bufferID, nodeID)}
              onUpdateLogNote={onUpdateLogNote(bufferID, nodeID)}
              onRemoveLogNote={onRemoveLogNote(bufferID, nodeID)}
            />
          </View>
          <OrgBody
            onUpdateNodeBody={onUpdateNodeBody(bufferID, nodeID)}
            bodyText={node.body}
          />
        </ScrollView>
        {list}
        <Button
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ['confirm', 'cancel']
              },
              idx => {
                if (idx === 0) {
                  onPressDeleteNode(bufferID, nodeID);
                }
              }
            );
          }}
          title="DeleteNode"
          color="#841584"
          accessibilityLabel="delete this node"
        />
      </View>
    );
  } else {
    return <View><Text>{'node is gone '}</Text></View>;
  }
};

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state, ownProps) => {
  const params = ownProps.navigation.state.params;
  const { bufferID, nodeID } = params;
  const nodes = state.orgBuffers[bufferID].orgNodes;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodes[nodeID];
  return {
    bufferID,
    nodeID,
    node,
    tree
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
    onPressDeleteNode: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddProp: (bufferID, nodeID) => () => {
      dispatch(insertNewNodeProp(bufferID, nodeID));
    },
    onUpdateProp: (bufferID, nodeID) => (idx, propKey, propVal) => {
      dispatch(updateNodeProp(bufferID, nodeID, idx, propKey, propVal));
    },
    onRemoveProp: (bufferID, nodeID) => propKey => {
      dispatch(removeNodeProp(bufferID, nodeID, propKey));
    },
    onAddLogNote: (bufferID, nodeID) => () => {
      const nowStr = OrgTimestampUtil.serialize(OrgTimestampUtil.now());
      dispatch(insertNewNodeLogNote(bufferID, nodeID, nowStr));
    },
    onUpdateLogNote: (bufferID, nodeID) => (idx, text) => {
      dispatch(updateNodeLogNote(bufferID, nodeID, idx, text));
    },
    onRemoveLogNote: (bufferID, nodeID) => idx => {
      dispatch(removeNodeLogNote(bufferID, nodeID, idx));
    },
    onUpdateNodeBody: (bufferID, nodeID) => text => {
      dispatch(updateNodeBody(bufferID, nodeID, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
