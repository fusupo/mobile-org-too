import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import R from 'ramda';

import OrgHeadline from './OrgHeadlineToo';
import List from './List';
import Tree from './Tree';

export default class OrgList extends Component {
  render() {
    return (
      <List
        data={this.props.data}
        renderItem={(d, idx) => {
          if (d.children && d.children.length > 0) {
            return (
              <Tree
                key={d.id}
                title={d.id}
                path={[]}
                type={'branch'}
                getHasKids={(path, cbk) => {
                  const lens = R.lensPath(path);
                  const branch = R.view(lens, this.props.data[idx]);
                  cbk(branch.children.length > 0);
                }}
                getItems={(path, cbk) => {
                  const lens = R.lensPath(path);
                  const branch = R.view(lens, this.props.data[idx]);
                  cbk(
                    branch.children.map((c, idx) => {
                      const newPath = path.slice(0);
                      newPath.push('children');
                      newPath.push(idx);
                      return {
                        title: c.id,
                        path: newPath,
                        type:
                          c.children && c.children.length > 0
                            ? 'branch'
                            : 'leaf'
                      };
                    })
                  );
                }}
                renderLeafItem={(title, path, type, hasKids) => {
                  const lens = R.lensPath(path);
                  const branch = R.view(lens, this.props.data[idx]);
                  return (
                    <View
                      key={d.id}
                      style={{
                        flexDirection: 'row',
                        paddingLeft: 8 * (path.length / 1)
                      }}>
                      <OrgHeadline
                        bufferID={this.props.bufferID}
                        nodeID={title}
                        isLocked={this.props.isLocked}
                      />
                    </View>
                  );
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
                  const branch = R.view(lens, this.props.data[idx]);
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
                    <View key={title}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableHighlight
                          onPress={onToggleCollapse}
                          style={{
                            paddingLeft: 8 * (path.length / 1) - 11
                          }}>
                          <Text style={textStyle}>{pref}</Text>
                        </TouchableHighlight>
                        <OrgHeadline
                          bufferID={this.props.bufferID}
                          nodeID={branch.id}
                          isLocked={this.props.isLocked}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            );
          } else {
            return (
              <View
                key={d.id}
                style={{
                  flexDirection: 'row',
                  paddingLeft: 11
                }}>
                <OrgHeadline
                  key={d.id}
                  bufferID={this.props.bufferID}
                  nodeID={d.id}
                  isLocked={this.props.isLocked}
                />
              </View>
            );
          }
        }}
      />
    );
  }
}
