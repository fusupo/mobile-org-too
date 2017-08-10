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

import OrgHeadlineEditable from '../components/OrgHeadlineEditable';
import OrgTimestamp from '../components/OrgTimestamp';
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

const timestampTypes = ['OPENED', 'SCHEDULED', 'DEADLINE', 'CLOSED'];

const NodeDetailScreen = ({
  tree,
  bufferID,
  nodeID,
  node,
  onPressDeleteNode,
  onTimestampUpdate,
  onTimestampRepIntUpdate,
  onTimestampClear,
  onAddProp,
  onUpdateProp,
  onRemoveProp,
  onAddLogNote,
  onUpdateLogNote,
  onRemoveLogNote,
  onUpdateNodeBody
}) => {
  // timings
  if (node) {
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

    // childNodes
    const childIDs = OrgTreeUtil.findBranch(tree, nodeID).children;
    const listItems = childIDs.length === 0
      ? null
      : childIDs.map(cn => (
          <OrgTree
            bufferID={bufferID}
            key={cn.nodeID}
            tree={OrgTreeUtil.findBranch(tree, cn.nodeID)}
          />
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
            {timings}
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgDrawer
              drawer={node.propDrawer}
              isCollapsed={false}
              onAddProp={onAddProp(bufferID, nodeID)}
              onUpdateProp={onUpdateProp(bufferID, nodeID)}
              onRemoveProp={onRemoveProp(bufferID, nodeID)}
            />
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgLogbook
              log={node.logbook}
              isCollapsed={false}
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
  console.log(
    'START MAP STATER TO PROPS NODE DETAIL SCREEN ***********************'
  );
  const params = ownProps.navigation.state.params;
  const { bufferID, nodeID } = params;
  const nodes = state.orgBuffers[bufferID].orgNodes;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodes[nodeID];
  // const childIDs = OrgTreeUtil.findBranch(tree, nodeID).children;
  // console.log(childIDs.length);
  console.log(
    'END MAP STATER TO PROPS NODE DETAIL SCREEN ***********************'
  );
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
      // dispatch(actionA(bufferID, nodeID));
      dispatch(deleteNode(bufferID, nodeID));
    },
    onTimestampUpdate: (bufferID, nodeID, timestampType) => date => {
      const timestamp = OrgTimestampUtil.parseDate(date);
      timestamp.type = 'active';
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

// export const actionA = (bufferID, nodeID) => (dispatch, getState) => {
//   console.log('foo');
//   const backAction = NavigationActions.back();
//   dispatch(backAction);
//   //Do someFunc first then this action, use getState() for currentState if you want
//   return dispatch(deleteNode(bufferID, nodeID));

//   // dispatch(deleteNode(bufferID, nodeID));
//   // dispatch({
//   //   type: ACTION_A,
//   //   param1,
//   //   param2
//   // });
//   // // At this line of code first dispatch has been executed and the state has been updated
//   // const value = selectValue(getState(), param2);
//   // if (value === 'neededValue') {
//   //   dispatch({
//   //     type:   ACTION_B
//   //   })
//   // }
// };

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
