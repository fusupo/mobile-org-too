import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgDrawer from './OrgDrawer.js';
import OrgLogbook from './OrgLogbook.js';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  nodeHeader: {
    flexDirection: 'row'
  },
  nodeHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'space-mono',
    flex: 1
  }
});

const OrgNode = ({ id, headline, propDrawer, onTitleClick }) => {
  let collapseStatusText;
  const collapseStatusIdx = OrgDrawerUtil.indexOfKey(
    propDrawer,
    'collapseStatus'
  );
  if (collapseStatusIdx === -1) {
    collapseStatusText = 'undefined';
  } else {
    collapseStatusText = propDrawer.properties[collapseStatusIdx][1];
  }

  // todo keyword
  const todoKeyword = headline.todoKeyword
    ? <Text
        style={{
          backgroundColor: headline.todoKeywordColor
        }}>
        {headline.todoKeyword}
      </Text>
    : null;

  return (
    <TouchableHighlight underlayColor="#00ff00" style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text>{todoKeyword}</Text>
        <Text style={{ flex: 1 }}>
          {headline.content}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default OrgNode;
