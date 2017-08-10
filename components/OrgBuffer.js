import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { addNewNode, deleteNode, cycleNodeCollapse } from '../actions';

import { connect } from 'react-redux';
import OrgTree from './OrgTree';

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

export const OrgBuffer = ({ bufferID, nodes, tree }) => {
  return (
    <View>
      <Text>{bufferID}</Text>
      <OrgTree bufferID={bufferID} tree={tree} />
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
      nodes: {},
      tree: {}
    };
  }
};

const mapDispatchToProps = dispatch => {
  return {
    // onNodeArrowClick: bufferID => {
    //   return nodeID => {
    //     dispatch(cycleNodeCollapse(bufferID, nodeID));
    //   };
    // },
    // onNodeTitleClick: bufferID => {
    //   return nodeID => {
    //     dispatch(
    //       NavigationActions.navigate({
    //         routeName: 'NodeDetail',
    //         params: {
    //           bufferID,
    //           nodeID
    //         }
    //       })
    //     );
    //   };
    // },
    // onAddOne: bufferID => {
    //   return nodeID => {
    //     dispatch(addNewNode(bufferID));
    //   };
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
