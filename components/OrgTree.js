import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgHeadline from './OrgHeadline';
import OrgNode from './OrgNode';

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

const OrgTree = ({ navigator, nodes, tree, onNodeTitleClick }) => {
  console.log('foo');
  if (tree.nodeID === 'root') {
    return (
      <View>
        {tree.children.map(t => {
          return (
            <OrgTree
              key={t.nodeID}
              nodes={nodes}
              tree={t}
              onNodeTitleClick={onNodeTitleClick}
            />
          );
        })}
      </View>
    );
  } else {
    const node = nodes[tree.nodeID];
    const idx = OrgDrawerUtil.indexOfKey(node.propDrawer, 'collapseStatus');
    const collapseStatus = idx === -1
      ? 'collapsed'
      : node.propDrawer.properties[idx][1];
    switch (collapseStatus) {
      case 'collapsed':
        return (
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 10 * node.headline.level
            }}>
            <OrgNode
              key={tree.nodeID}
              {...nodes[tree.nodeID]}
              onTitleClick={() => onNodeTitleClick(tree.nodeID)}
            />
            <TouchableHighlight
              style={{ width: 40 }}
              onPress={() => onNodeTitleClick(tree.nodeID)}>
              <FontAwesome name={'caret-down'} size={10} />
            </TouchableHighlight>
          </View>
        );
        break;
      case 'expanded':
      case 'maximized':
        return (
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: 10 * node.headline.level
              }}>
              <OrgNode
                key={tree.nodeID}
                {...nodes[tree.nodeID]}
                onTitleClick={() => onNodeTitleClick(tree.nodeID)}
              />
              <TouchableHighlight
                style={{ width: 40 }}
                onPress={() => onNodeTitleClick(tree.nodeID)}>
                <FontAwesome name={'caret-up'} size={10} />
              </TouchableHighlight>
            </View>
            <View>
              {tree.children.map(t => {
                return (
                  <OrgTree
                    key={t.nodeID}
                    nodes={nodes}
                    tree={t}
                    onNodeTitleClick={onNodeTitleClick}
                  />
                );
              })}
            </View>
          </View>
        );
        break;
    }
  }
};

export default OrgTree;
