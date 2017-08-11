import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

import { updateNodeHeadlineContent } from '../actions';

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

class OrgHeadlineEditable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.node.headline.content
    };
  }

  render() {
    const node = this.props.node;
    // tags

    const tags = node.headline.tags && node.headline.tags.length > 0
      ? node.headline.tags.map((tag, idx) => {
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
          keyword={node.headline.todoKeyword}
          nodeID={node.id}
          bufferID={this.props.bufferID}
        />
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
          onEndEditing={e => {
            this.props.onHeadlineEndEditing(
              this.props.bufferID,
              node.id,
              this.state.content
            );
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
    onHeadlineEndEditing: (bufferID, nodeID, text) => {
      dispatch(updateNodeHeadlineContent(bufferID, nodeID, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgHeadlineEditable
);
