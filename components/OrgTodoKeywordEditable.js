import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text } from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';

import {
  updateNodeTimestamp,
  updateNodeTodoKeyword,
  completeTodo
} from '../actions';

const keywords = require('../constants/TodoKeyword').default; // ?;

const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');

import appStyles from '../styles';

import { getTodoKeywordSettings, getNode } from '../selectors';

class OrgTodoKeywordEditable extends Component {
  render() {
    const {
      keyword,
      keywordSettings,
      onNodeTodoKeywordUpdate,
      onSelectDone,
      bufferID,
      nodeID
    } = this.props;
    const keywords = Object.keys(keywordSettings);

    const todoKeyword = (
      <ModalDropdown
        options={keywords}
        onSelect={idx => {
          const targKeyword = keywords[idx];
          if (keyword === 'TODO' && targKeyword === 'DONE')
            onSelectDone(bufferID, nodeID);
          onNodeTodoKeywordUpdate(bufferID, nodeID, targKeyword);
        }}>
        <Text
          style={[
            appStyles.baseText,
            {
              backgroundColor: keyword
                ? keywordSettings[keyword]
                : keywordSettings['none']
            }
          ]}>
          {keyword ? keyword : 'none'}
        </Text>
      </ModalDropdown>
    );

    return todoKeyword;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const keywordSettings = getTodoKeywordSettings(state);

  return {
    keyword: getNode(state, bufferID, nodeID).keyword,
    keywordSettings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeTodoKeywordUpdate: (bufferID, nodeID, keyword) => {
      dispatch(updateNodeTodoKeyword(bufferID, nodeID, keyword));
    },
    onSelectDone: (bufferID, nodeID, noteText = '') => {
      dispatch(
        completeTodo(
          bufferID,
          nodeID,
          OrgTimestampUtil.serialize(OrgTimestampUtil.now()),
          noteText
        )
      );
      dispatch(
        updateNodeTimestamp(bufferID, nodeID, 'CLOSED', OrgTimestampUtil.now())
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgTodoKeywordEditable
);
