import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text } from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';

import { updateNodeTodoKeyword } from '../actions';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

class OrgTodoKeywordEditable extends Component {
  constructor(props) {
    super(props);
    let keywords = orgHeadlineUtil.keywords().slice(0);
    keywords.push('none');
    this.state = {
      keywords
    };
  }

  render() {
    const todoKeywordStr = this.props.keyword;
    const todoKeyword = (
      <ModalDropdown
        options={this.state.keywords}
        onSelect={idx => {
          this.props.onNodeTodoKeywordUpdate(
            this.props.bufferID,
            this.props.nodeID,
            this.state.keywords[idx]
          );
        }}>
        <Text
          style={{
            backgroundColor: todoKeywordStr
              ? orgHeadlineUtil.colorForKeyword(todoKeywordStr)
              : '#fff'
          }}>
          {todoKeywordStr ? todoKeywordStr : 'none'}
        </Text>
      </ModalDropdown>
    );
    return todoKeyword;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  return {
    keyword: state.orgBuffers[bufferID].orgNodes[nodeID].headline.todoKeyword
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeTodoKeywordUpdate: (bufferID, nodeID, keyword) => {
      dispatch(updateNodeTodoKeyword(bufferID, nodeID, keyword));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgTodoKeywordEditable
);
