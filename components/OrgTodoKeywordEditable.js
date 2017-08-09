import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

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
    const todoKeyword = todoKeywordStr
      ? <TouchableHighlight
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: this.state.keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(
                  this.props.bufferID,
                  this.props.nodeID,
                  this.state.keywords[idx]
                );
              }
            );
          }}>
          <Text
            style={{
              backgroundColor: orgHeadlineUtil.colorForKeyword(todoKeywordStr)
            }}>
            {this.props.keyword}
          </Text>
        </TouchableHighlight>
      : <TouchableHighlight
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: this.state.keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(
                  this.props.bufferID,
                  this.props.nodeID,
                  this.state.keywords[idx]
                );
              }
            );
          }}>
          <Text style={{}}>
            {'none'}
          </Text>
        </TouchableHighlight>;
    return todoKeyword;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  console.log(ownProps);
  const keyword =
    state.orgBuffers[bufferID].orgNodes[nodeID].headline.todoKeyword;
  return { keyword };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNodeTodoKeywordUpdate: (bufferID, nodeID, keyword) => {
      dispatch(updateNodeTodoKeyword(bufferID, nodeID, keyword));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgTodoKeywordEditable
);
