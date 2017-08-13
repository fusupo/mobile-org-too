import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import { addNewNode, deleteNode, cycleNodeCollapse } from '../actions';

const OrgDrawerUtil = require('org-parse').OrgDrawer;
const OrgTreeUtil = require('org-parse').OrgTree;

import OrgNode from './OrgNode';
import OrgTree from './OrgTree';
import OrgTags from './OrgTagsEditable';

const styles = StyleSheet.create({
  orgNodeWrapper: {
    flexDirection: 'row',
    paddingBottom: 10
    // height: 50,
    // borderColor: '#337',
    // borderWidth: 1
  }
});

class OrgHeadline extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      bufferID,
      node,
      nodeID,
      isCollapsed,
      onNodeTitlePress,
      onDeleteNodePress,
      onAddOnePress,
      onNodeArrowPress,
      levelOffset,
      childCount
    } = this.props;
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1
        }}>
        <Swipeout
          style={{ flex: 1 }}
          right={[
            {
              text: 'deleteNode',
              onPress: () => {
                onDeleteNodePress(bufferID, nodeID);
              }
            }
          ]}
          left={[
            {
              text: 'addOne',
              onPress: () => {
                onAddOnePress(bufferID, nodeID, node);
              }
            }
          ]}>
          <View
            style={[
              styles.orgNodeWrapper,
              {
                marginLeft: 27 * (node.headline.level - 1 - levelOffset)
              }
            ]}>
            {childCount > 0
              ? <TouchableHighlight
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}
                  onPress={() => {
                    onNodeArrowPress(bufferID, nodeID);
                  }}>
                  <FontAwesome
                    name={isCollapsed ? 'caret-right' : 'caret-down'}
                    size={25}
                  />
                </TouchableHighlight>
              : <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}>
                  <FontAwesome name={'minus'} size={25} />
                </View>}
            <View style={{ flex: 4 }}>
              <OrgNode
                bufferID={bufferID}
                nodeID={nodeID}
                onTitleClick={() => {
                  onNodeTitlePress(bufferID, nodeID);
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <OrgTags bufferID={bufferID} nodeID={nodeID} />
            </View>
          </View>
        </Swipeout>
        {isCollapsed ? null : <OrgTree bufferID={bufferID} nodeID={nodeID} />}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, levelOffset } = ownProps;
  const node = state.orgBuffers[bufferID].orgNodes[nodeID];
  const tree = state.orgBuffers[bufferID].orgTree;
  const branch = OrgTreeUtil.findBranch(tree, nodeID);

  //
  const idx = OrgDrawerUtil.indexOfKey(node.propDrawer, 'collapseStatus');
  const collapseStatus = idx === -1
    ? 'collapsed'
    : node.propDrawer.properties[idx][1];
  let isCollapsed;
  if (collapseStatus === 'collapsed') {
    isCollapsed = true;
  } else if (collapseStatus === 'expanded' || collapseStatus === 'maximized') {
    isCollapsed = false;
  }
  //
  return {
    node,
    isCollapsed,
    levelOffset: levelOffset || 0,
    childCount: branch.children.length || 0
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNodeTitlePress: (bufferID, nodeID) => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'NodeDetail',
          params: {
            bufferID,
            nodeID
          }
        })
      );
    },
    onDeleteNodePress: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddOnePress: (bufferID, nodeID, node) => {
      dispatch(addNewNode(bufferID, nodeID, node.headline.level + 1));
    },
    onNodeArrowPress: (bufferID, nodeID) => {
      dispatch(cycleNodeCollapse(bufferID, nodeID));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgHeadline);
