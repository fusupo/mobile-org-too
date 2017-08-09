import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

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
    const todoKeywordStr = this.props.headline.todoKeyword;
    const todoKeyword = todoKeywordStr
      ? <TouchableHighlight
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: this.state.keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(this.state.keywords[idx]);
              }
            );
          }}>
          <Text
            style={{
              backgroundColor: orgHeadlineUtil.colorForKeyword(todoKeywordStr)
            }}>
            {this.props.headline.todoKeyword}
          </Text>
        </TouchableHighlight>
      : <TouchableHighlight
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: this.state.keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(this.state.keywords[idx]);
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
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgTodoKeywordEditable
);
