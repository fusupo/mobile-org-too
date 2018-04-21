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

const OrgTimestampUtil = require('org-parse').OrgTimestamp;

import appStyles from '../styles';

class OrgTodoKeywordEditable extends Component {
  constructor(props) {
    super(props);
    // let keywords = OrgHeadlineUtil.keywords().slice(0);
    // keywords.shift('none');
    this.state = {
      keywords
    };
  }

  render() {
    const {
      keyword,
      onNodeTodoKeywordUpdate,
      onSelectDone,
      bufferID,
      nodeID
    } = this.props;
    const { keywords } = this.state;
    const todoKeyword = (
      <ModalDropdown
        options={this.state.keywords}
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
                ? '#f00' //OrgHeadlineUtil.colorForKeyword(keyword)
                : '#fff'
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
  return {
    keyword: state.orgBuffers[bufferID].orgNodes[nodeID].keyword
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
