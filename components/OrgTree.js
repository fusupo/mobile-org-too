import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux';
import OrgHeadline from './OrgHeadline';

const OrgDrawerUtil = require('org-parse').OrgDrawer;
const OrgTreeUtil = require('org-parse').OrgTree;

const styles = StyleSheet.create({
  orgNodeWrapper: {
    flexDirection: 'row',
    height: 50
  }
});

export class OrgTree extends React.Component {
  render() {
    const { bufferID, tree, collapseStatus } = this.props;
    if (Object.keys(tree).length > 0) {
      switch (collapseStatus) {
        case 'expanded':
        case 'maximized':
          return (
            <View>
              {tree.children.map((t, idx) => {
                return (
                  <OrgHeadline
                    key={t.nodeID}
                    bufferID={bufferID}
                    nodeID={t.nodeID}
                  />
                );
              })}
            </View>
          );
          break;
        default:
          return null;
      }
    } else {
      return (
        <View>
          <Text>{'Empty'}</Text>
        </View>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const root = state.orgBuffers[bufferID].orgTree;
  const tree = OrgTreeUtil.findBranch(root, nodeID);
  const node = state.orgBuffers[bufferID].orgNodes[nodeID];
  //
  let collapseStatus = 'collapsed';
  if (node) {
    const idx = OrgDrawerUtil.indexOfKey(node.propDrawer, 'collapseStatus');
    collapseStatus = idx === -1
      ? 'collapsed'
      : node.propDrawer.properties[idx][1];
  }
  //
  return { collapseStatus, tree };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

const foo = connect(mapStateToProps, mapDispatchToProps)(OrgTree);
export default foo;
