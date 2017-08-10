import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

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

const OrgNode = ({ bufferID, nodeID, headlineContent, onTitleClick }) => {
  return (
    <TouchableHighlight
      underlayColor="#00ff00"
      style={styles.flexOne}
      onPress={onTitleClick}>
      <View style={styles.flexRow}>
        <OrgTodoKeywordEditable bufferID={bufferID} nodeID={nodeID} />
        <Text style={styles.flexOne}>
          {headlineContent}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  return {
    headlineContent: state.orgBuffers[bufferID].orgNodes[nodeID].headline
      .content
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgNode);
