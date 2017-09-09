import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';

import { connect } from 'react-redux';

import R from 'ramda';

import { addNewNode, deleteNode } from '../actions';
import OrgHeadline from './OrgHeadline';
import Tree from '../components/Tree';

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
      onDeleteNodePress
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
          return <View><Text>{title}</Text></View>;
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
          const branch = R.view(lens, tree);
          const nodeID = branch.nodeID;
          const node = this.props.nodes[nodeID];
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
          return (
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{ flex: 4 }}
                onPress={onToggleCollapse}>
                <Text style={textStyle}>{pref + ' ' + title}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => onAddOnePress(bufferID, nodeID, node)}>
                <Text>{'+'}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ flex: 1 }}
                onPress={() => onDeleteNodePress(bufferID, nodeID)}>
                <Text>{'-'}</Text>
              </TouchableHighlight>
            </View>
          );
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
    onDeleteNodePress: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddOnePress: (bufferID, nodeID, node) => {
      dispatch(addNewNode(bufferID, nodeID, node.headline.level + 1));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
