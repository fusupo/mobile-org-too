import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActionSheetIOS
} from 'react-native';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderTopWidth: 1,
    borderStyle: 'solid'
  },
  padded: {
    paddingLeft: 5
  }
});

class EditOrgHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.headline.content
    };
  }

  render() {
    const keywords = orgHeadlineUtil.keywords();
    const todoKeywordStr = this.props.headline.todoKeyword;
    // todo keyword
    const todoKeyword = todoKeywordStr
      ? <TouchableHighlight
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(keywords[idx]);
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
                options: keywords
              },
              idx => {
                this.props.onNodeTodoKeywordUpdate(keywords[idx]);
              }
            );
          }}>
          <Text style={{}}>
            {'none'}
          </Text>
        </TouchableHighlight>;

    // tags
    const tags = this.props.headline.tags && this.props.headline.tags.length > 0
      ? this.props.headline.tags.map((tag, idx) => {
          return (
            <Text
              key={idx}
              style={{
                fontFamily: 'space-mono',
                backgroundColor: '#cccccc',
                fontSize: 10
              }}>
              {tag}
            </Text>
          );
        })
      : null;

    const tagList = tags ? <Text>{tags}</Text> : null;

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {todoKeyword}
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
          onEndEditing={e => {
            this.props.onEndEditing(this.state.content);
          }}
        />
        {tagList}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onNodeTodoKeywordUpdate: todoKeyword => {
    //   console.log('update node todo keyword:', todoKeyword);
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOrgHeadline);
