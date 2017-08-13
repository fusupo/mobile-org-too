import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import { addNewNode, deleteNode, cycleNodeCollapse } from '../actions';

const OrgDrawerUtil = require('org-parse').OrgDrawer;
import OrgNode from './OrgNode';
import OrgTree from './OrgTree';
import OrgTags from './OrgTagsEditable';

const styles = StyleSheet.create({
  rowContainer: { flex: 1, flexDirection: 'row' },
  tag: {
    fontFamily: 'space-mono',
    backgroundColor: '#cccccc',
    fontSize: 10
  },
  orgNodeWrapper: {
    flexDirection: 'row',
    height: 50
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
      levelOffset
    } = this.props;
    //   <Swipeout
    // style={{ flex: 1 }}
    // right={[
    //   {
    //     text: 'deleteNode',
    //     onPress: () => {
    //       onDeleteNodePress(bufferID, nodeID);
    //     }
    //   }
    // ]}
    // left={[
    //   {
    //     text: 'addOne',
    //     onPress: () => {
    //       onAddOnePress(bufferID, nodeID, node);
    //     }
    //   }
    // ]}>
    // </Swipeout>
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1
        }}>
        <View
          style={[
            styles.orgNodeWrapper,
            {
              marginLeft: 27 * (node.headline.level - 1 - levelOffset),
              borderColor: '#337',
              borderWidth: 1,
              flex: 1,
              flexDirection: 'row'
            }
          ]}>
          <TouchableHighlight
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}
            onPress={() => {
              onNodeArrowPress(bufferID, nodeID);
            }}>
            <FontAwesome
              name={isCollapsed ? 'caret-down' : 'caret-up'}
              size={25}
            />
          </TouchableHighlight>
          <View style={{ flex: 4 }}>
            <OrgNode
              bufferID={bufferID}
              nodeID={nodeID}
              onTitleClick={() => {
                onNodeTitlePress(bufferID, nodeID);
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <OrgTags bufferID={bufferID} nodeID={nodeID} />
          </View>
        </View>
        {isCollapsed ? null : <OrgTree bufferID={bufferID} nodeID={nodeID} />}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, levelOffset } = ownProps;
  const node = state.orgBuffers[bufferID].orgNodes[nodeID];
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
    levelOffset: levelOffset || 0
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
