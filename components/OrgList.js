import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import R from 'ramda';

import OrgHeadline from './OrgHeadlineToo';
import List from './List';
import Tree from './Tree';

export default class OrgList extends Component {
  render() {
    const getGetHasKids = idx => (path, cbk) => {
      const lens = R.lensPath(path);
      const branch = R.view(lens, this.props.data[idx]);
      cbk(branch.children && branch.children.length > 0);
    };

    const getGetItems = idx => (path, cbk) => {
      const lens = R.lensPath(path);
      const branch = R.view(lens, this.props.data[idx]);
      cbk(
        branch.children.map((c, idx2) => {
          const newPath = path.slice(0);
          newPath.push('children');
          newPath.push(idx2);
          return {
            title: c.id,
            path: newPath,
            type: c.children && c.children.length > 0 ? 'branch' : 'leaf'
          };
        })
      );
    };

    const getRenderLeafItem = idx => (title, path, type, hasKids) => (
      <View
        key={this.props.data[idx].id}
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

    const getRenderBranchItem = idx => (
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
    };

    const renderListItem = (d, idx) => {
      console.log('RENDER LIST ITEM:', d, idx, this.props.data);
      if (d.children && d.children.length > 0) {
        return (
          <Tree
            key={d.id}
            title={d.id}
            path={[]}
            type={'branch'}
            getHasKids={getGetHasKids(idx)}
            getItems={getGetItems(idx)}
            renderLeafItem={getRenderLeafItem(idx)}
            renderBranchItem={getRenderBranchItem(idx)}
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
    };

    return <List data={this.props.data} renderItem={renderListItem} />;
  }
}
