import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { connect } from 'react-redux';

import R from 'ramda';

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

export const OrgBuffer = ({ bufferID, nodes, tree }) => {
  // const list = tree.children.map(c => {
  //   return <OrgHeadline key={c.nodeID} bufferID={bufferID} nodeID={c.nodeID} />;
  // });
  // return (
  //   <View>
  //     <Text>{bufferID}</Text>
  //     {list}
  //   </View>
  // );
  return (
    <Tree
      title={bufferID}
      path={[]}
      type={'branch'}
      getHasKids={(path, cbk) => {
        const lens = R.lensPath(path);
        const branch = R.view(lens, tree);
        cbk(branch.children.length > 0);
      }}
      getItems={(path, cbk) => {
        const lens = R.lensPath(path);
        const branch = R.view(lens, tree);
        cbk(
          branch.children.map((c, idx) => {
            const newPath = path.slice(0);
            newPath.push('children');
            newPath.push(idx);
            return {
              title: nodes[c.nodeID].headline.content,
              path: newPath,
              type: c.children.length > 0 ? 'branch' : 'leaf'
            };
          })
        );
      }}
      renderLeafItem={(title, path, type, hasKids) => {
        return <View><Text>{title}</Text></View>;
      }}
      renderBranchItem={(title, path, type, hasKids, isCollapsed) => {
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
        return <View><Text style={textStyle}>{pref + ' ' + title}</Text></View>;
      }}
    />
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
