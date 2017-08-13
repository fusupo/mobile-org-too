import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';
import OrgTags from './OrgTagsEditable';

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
    const { bufferID, node } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <OrgTodoKeywordEditable
          keyword={node.headline.todoKeyword}
          nodeID={node.id}
          bufferID={bufferID}
        />
        <TextInput
          style={{ flex: 4, height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
          onEndEditing={e => {
            this.props.onHeadlineEndEditing(
              bufferID,
              node.id,
              this.state.content
            );
          }}
        />
        <View style={{ flex: 1 }}>
          <OrgTags bufferID={bufferID} nodeID={node.id} />
        </View>
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
