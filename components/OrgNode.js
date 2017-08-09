import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1
  },
  flexRow: {
    flexDirection: 'row'
  },
  nodeHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'space-mono',
    flex: 1
  }
});

const OrgNode = ({ bufferID, id, headline, propDrawer, onTitleClick }) => {
  return (
    <TouchableHighlight
      underlayColor="#00ff00"
      style={styles.flexOne}
      onPress={onTitleClick}>
      <View style={styles.flexRow}>
        <OrgTodoKeywordEditable bufferID={bufferID} nodeID={id} />
        <Text style={styles.flexOne}>
          {headline.content}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default OrgNode;
