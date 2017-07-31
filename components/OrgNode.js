import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const OrgDrawerUtil = require('org-parse').OrgDrawer;
const orgHeadlineUtil = require('org-parse').OrgHeadline;

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
          backgroundColor: orgHeadlineUtil.colorForKeyword(headline.todoKeyword)
        }}>
        {headline.todoKeyword}
      </Text>
    : null;

  return (
    <TouchableHighlight
      underlayColor="#00ff00"
      style={{ flex: 1 }}
      onPress={onTitleClick}>
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
