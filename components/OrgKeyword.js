import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

import { getNode } from '../selectors';

class OrgKeyword extends Component {
  render() {
    const { k, val } = this.props;

    if (this.props.isCollapsed) {
      return null;
    } else {
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text>{k + ':' + val}</Text>
        </View>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, idx } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const keyword = node
    ? node.section.children[idx]
    : tree.section.children[idx];
  console.log(keyword);
  return {
    bufferID,
    nodeID,
    k: keyword.key,
    val: keyword.value
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgKeyword);
