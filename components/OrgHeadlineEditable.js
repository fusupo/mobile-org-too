import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';
import OrgTags from './OrgTagsEditable';

import { updateNodeHeadlineContent } from '../actions';

import appStyles from '../styles';

class OrgHeadlineEditable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.node.headline.content,
      firstEdit: true
    };
  }

  render() {
    const { bufferID, node, autoFocus } = this.props;
    const { firstEdit, content } = this.state;

    const endEdit = () => {
      this.setState({ firstEdit: false });
      Keyboard.dismiss();
      this.props.onHeadlineEndEditing(bufferID, node.id, content);
    };

    return (
      <View style={[appStyles.container, { flexDirection: 'row' }]}>
        <OrgTodoKeywordEditable
          keyword={node.headline.todoKeyword}
          nodeID={node.id}
          bufferID={bufferID}
        />
        <TextInput
          style={[
            appStyles.baseText,
            { flex: 4, height: 40, borderColor: 'gray', borderWidth: 1 }
          ]}
          value={content}
          autoFocus={autoFocus}
          clearTextOnFocus={autoFocus && firstEdit}
          onSubmitEditing={() => {
            endEdit();
          }}
          onChangeText={content => this.setState({ content })}
          onEndEditing={e => {
            endEdit();
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
  const { bufferID, nodeID, autoFocus } = ownProps;
  const nodes = state.orgBuffers[bufferID].orgNodes;
  const node = nodes[nodeID];
  return {
    bufferID,
    nodeID,
    node,
    autoFocus: autoFocus || false
  };
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
