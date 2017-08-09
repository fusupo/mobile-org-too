import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux';
import OrgNode from './OrgNode';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  orgNodeWrapper: {
    flexDirection: 'row',
    height: 50
  }
});

const makeHeadline = (
  bufferID,
  nodes,
  node,
  isCollapsed,
  onNodeTitleClick,
  onNodeArrowClick,
  onAddOnePress,
  onDeleteNodePress
) => (
  <Swipeout
    sensitiviy={1}
    right={[
      {
        text: 'deleteNode',
        onPress: () => {
          onDeleteNodePress(node.id);
        }
      }
    ]}
    left={[
      {
        text: 'addOne',
        onPress: () => {
          onAddOnePress(node.id);
        }
      }
    ]}>
    <View
      style={[
        styles.orgNodeWrapper,
        {
          marginLeft: 10 * node.headline.level
        }
      ]}>
      <OrgNode
        bufferID={bufferID}
        key={node.id}
        {...nodes[node.id]}
        onTitleClick={() => onNodeTitleClick(node.id)}
      />
      <TouchableHighlight
        style={{ width: 40 }}
        onPress={() => onNodeArrowClick(node.id)}>
        <FontAwesome name={isCollapsed ? 'caret-down' : 'caret-up'} size={25} />
      </TouchableHighlight>
    </View>
  </Swipeout>
);

export class OrgTree extends React.Component {
  render() {
    const {
      bufferID,
      nodes,
      tree,
      onNodeTitleClick,
      onNodeArrowClick,
      onAddOnePress,
      onDeleteNodePress
    } = this.props;
    if (tree.nodeID === 'root') {
      return (
        <View>
          {tree.children.map(t => {
            return (
              <OrgTree
                bufferID={bufferID}
                key={t.nodeID}
                nodes={nodes}
                tree={t}
                onNodeTitleClick={onNodeTitleClick}
                onNodeArrowClick={onNodeArrowClick}
                onAddOnePress={onAddOnePress}
                onDeleteNodePress={onDeleteNodePress}
              />
            );
          })}
        </View>
      );
    } else if (Object.keys(tree).length > 0) {
      const node = nodes[tree.nodeID];
      const idx = OrgDrawerUtil.indexOfKey(node.propDrawer, 'collapseStatus');
      const collapseStatus = idx === -1
        ? 'collapsed'
        : node.propDrawer.properties[idx][1];
      switch (collapseStatus) {
        case 'collapsed':
          return makeHeadline(
            bufferID,
            nodes,
            node,
            true,
            onNodeTitleClick,
            onNodeArrowClick,
            onAddOnePress,
            onDeleteNodePress
          );
          break;
        case 'expanded':
        case 'maximized':
          return (
            <View>
              {makeHeadline(
                bufferID,
                nodes,
                node,
                false,
                onNodeTitleClick,
                onNodeArrowClick,
                onAddOnePress,
                onDeleteNodePress
              )}
              <View>
                {tree.children.map(t => {
                  return (
                    <OrgTree
                      bufferID={bufferID}
                      key={t.nodeID}
                      nodes={nodes}
                      tree={t}
                      onNodeTitleClick={onNodeTitleClick}
                      onNodeArrowClick={onNodeArrowClick}
                      onAddOnePress={onAddOnePress}
                      onDeleteNodePress={onDeleteNodePress}
                    />
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
  return {
    nodes: ownProps.nodes,
    tree: ownProps.tree
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const ret = {};
  ret.onNodeTitleClick = ownProps.onNodeTitleClick
    ? ownProps.onNodeTitleClick
    : nodeID => {
        console.log(nodeID);
      };
  ret.onAddOnePress = ownProps.onAddOnePress
    ? ownProps.onAddOnePress
    : nodeID => {
        console.log('add One', nodeID);
      };
  ret.onDeleteNodePress = ownProps.onDeleteNodePress
    ? ownProps.onDeleteNodePress
    : nodeID => {
        console.log('delete One', nodeID);
      };
  return ret;
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTree);
