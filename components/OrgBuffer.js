import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import R from 'ramda';

import { addNewNode, deleteNode } from '../actions';
import OrgHeadline from './OrgHeadline';
import Tree from '../components/Tree';
const OrgHeadlineUtil = require('org-parse').OrgHeadline;

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

export class OrgBuffer extends React.Component {
  render() {
    const {
      bufferID,
      nodes,
      tree,
      onAddOnePress,
      onDeleteNodePress,
      onNodeTitlePress
    } = this.props;
    const foo = Math.round(Math.random() * 10);
    return (
      <Tree
        title={bufferID}
        path={[]}
        type={'branch'}
        getHasKids={(path, cbk) => {
          const lens = R.lensPath(path);
          const branch = R.view(lens, this.props.tree);
          cbk(branch.children.length > 0);
        }}
        getItems={(path, cbk) => {
          const lens = R.lensPath(path);
          const branch = R.view(lens, this.props.tree);
          cbk(
            branch.children.map((c, idx) => {
              const newPath = path.slice(0);
              newPath.push('children');
              newPath.push(idx);
              return {
                title: this.props.nodes[c.nodeID].headline.content,
                path: newPath,
                type: c.children.length > 0 ? 'branch' : 'leaf'
              };
            })
          );
        }}
        renderLeafItem={(title, path, type, hasKids) => {
          const lens = R.lensPath(path);
          const branch = R.view(lens, this.props.tree);
          const nodeID = branch.nodeID;
          const node = this.props.nodes[nodeID];
          const keyword = node.headline.todoKeyword;
          const tags = node.headline.tags;
          const baseLine = (
            <View
              style={{ flexDirection: 'row', paddingLeft: 8 * path.length }}>
              <Text
                style={{
                  backgroundColor: keyword
                    ? OrgHeadlineUtil.colorForKeyword(keyword)
                    : '#fff'
                }}>
                {keyword ? keyword : 'none'}
              </Text>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => {
                  onNodeTitlePress(bufferID, nodeID);
                }}>
                <Text>{title}</Text>
              </TouchableHighlight>
              {tags &&
                <View>
                  <Text>{tags.join(':')}</Text>
                </View>}
            </View>
          );
          if (this.props.isLocked) {
            return baseLine;
          } else {
            return (
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
                {baseLine}
              </Swipeout>
            );
          }
        }}
        renderBranchItem={(
          title,
          path,
          type,
          hasKids,
          isCollapsed,
          onToggleCollapse
        ) => {
          const lens = R.lensPath(path);
          const branch = R.view(lens, this.props.tree);
          let pref;
          let textStyle = { fontWeight: 'bold' };
          if (hasKids) {
            if (isCollapsed) {
              pref = '⤷';
            } else {
              pref = '↓';
            }
          } else {
            pref = '⇢';
          }
          if (path.length === 0) {
            return (
              <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                  style={{ flex: 4 }}
                  onPress={onToggleCollapse}>
                  <Text
                    style={[
                      textStyle,
                      { backgroundColor: '#000', color: '#fff' }
                    ]}>
                    {pref + ' ' + title}
                  </Text>
                </TouchableHighlight>
              </View>
            );
          } else {
            const nodeID = branch.nodeID;
            const node = this.props.nodes[nodeID];
            const keyword = node.headline.todoKeyword;
            const tags = node.headline.tags;
            const baseLine = (
              <View style={{ flexDirection: 'row' }}>
                <TouchableHighlight
                  onPress={onToggleCollapse}
                  style={{ paddingLeft: 8 * path.length - 11 }}>
                  <Text style={textStyle}>{pref}</Text>
                </TouchableHighlight>
                <Text
                  style={{
                    backgroundColor: keyword
                      ? OrgHeadlineUtil.colorForKeyword(keyword)
                      : '#fff'
                  }}>
                  {keyword ? keyword : 'none'}
                </Text>
                <TouchableHighlight
                  style={{ flex: 4 }}
                  onPress={() => {
                    onNodeTitlePress(bufferID, nodeID);
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={textStyle}>{title}</Text>
                  </View>
                </TouchableHighlight>
                {tags &&
                  <View>
                    <Text>{tags.join(':')}</Text>
                  </View>}
              </View>
            );
            if (this.props.isLocked) {
              return baseLine;
            } else {
              return (
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
                  {baseLine}
                </Swipeout>
              );
            }
          }
        }}
      />
    );
  }
}
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
