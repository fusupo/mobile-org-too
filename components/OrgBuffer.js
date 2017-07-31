import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { cycleNodeCollapse } from '../actions';
import { NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';
import OrgNode from './OrgNode';
import OrgTree from './OrgTree';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 5
  },
  padded: {
    paddingLeft: 5
  },
  orgTree: {
    flex: 1
  }
});

export const OrgBuffer = ({
  bufferID,
  nodes,
  tree,
  onNodeTitleClick,
  onNodeArrowClick
}) => {
  return (
    <View>
      <Text>{bufferID}</Text>
      <OrgTree
        nodes={nodes}
        tree={tree}
        onNodeTitleClick={onNodeTitleClick(bufferID)}
        onNodeArrowClick={onNodeArrowClick(bufferID)}
      />
    </View>
  );
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.bufferID) {
    const bufferID = ownProps.bufferID;
    return {
      bufferID: bufferID,
      nodes: state.orgBuffers[bufferID].orgNodes,
      tree: state.orgBuffers[bufferID].orgTree
    };
  } else {
    return {
      nodes: {}, //state.orgNodes,
      tree: {} //state.orgTree
    };
  }
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
            params: {
              bufferID,
              nodeID
            }
          })
        );
      };
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
