import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux';
import OrgHeadline from './OrgHeadline';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  orgNodeWrapper: {
    flexDirection: 'row',
    height: 50
  }
});

export class OrgTree extends React.Component {
  render() {
    const { bufferID, tree, node } = this.props;
    if (tree.nodeID === 'root') {
      return (
        <View>
          {tree.children.map(t => {
            return <OrgTree bufferID={bufferID} key={t.nodeID} tree={t} />;
          })}
        </View>
      );
    } else if (Object.keys(tree).length > 0) {
      // const idx = OrgDrawerUtil.indexOfKey(node.propDrawer, 'collapseStatus');
      // const collapseStatus = idx === -1
      //   ? 'collapsed'
      //   : node.propDrawer.properties[idx][1];
      let collapseStatus = 'collapsed';
      switch (collapseStatus) {
        case 'collapsed':
          return <OrgHeadline bufferID={bufferID} nodeID={tree.nodeID} />;
          break;
        case 'expanded':
        case 'maximized':
          return (
            <View>
              <OrgHeadline bufferID={bufferID} nodeID={tree.nodeID} />
              <View>
                {tree.children.map(t => {
                  return (
                    <OrgTree bufferID={bufferID} key={t.nodeID} tree={t} />
                  );
                })}
              </View>
            </View>
          );
          break;
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
  const { bufferID, tree } = ownProps;
  const node = state.orgBuffers[bufferID].orgNodes[tree.nodeID];
  return { node };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTree);
