import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

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
        <OrgTodoKeywordEditable
          onNodeTodoKeywordUpdate={this.props.onNodeTodoKeywordUpdate}
          headline={this.props.headline}
        />
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOrgHeadline);
