import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';
import OrgTags from './OrgTagsEditable';

import { updateNodeHeadlineTitle } from '../actions';

import appStyles from '../styles';

import { getNode } from '../selectors';

class OrgHeadlineEditable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.node.title,
      firstEdit: true
    };
  }

  render() {
    console.log('RENDER HEADLINE EDITABLE');
    const { bufferID, node, autoFocus, onHeadlineEndEditing } = this.props;
    const { firstEdit, title } = this.state;

    const endEdit = () => {
      this.setState({ firstEdit: false });
      Keyboard.dismiss();
      onHeadlineEndEditing(bufferID, node.id, title);
    };

    return (
      <View style={[appStyles.container, { flexDirection: 'row' }]}>
        <OrgTodoKeywordEditable
          keyword={node.keyword}
          nodeID={node.id}
          bufferID={bufferID}
        />
        <TextInput
          style={[
            appStyles.baseText,
            { flex: 4, height: 40, borderColor: 'gray', borderWidth: 1 }
          ]}
          value={title}
          autoFocus={autoFocus}
          clearTextOnFocus={autoFocus && firstEdit}
          onSubmitEditing={endEdit}
          onChangeText={title => this.setState({ title })}
          onEndEditing={endEdit}
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
  const node = getNode(state, bufferID, nodeID);
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
      dispatch(updateNodeHeadlineTitle(bufferID, nodeID, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrgHeadlineEditable
);
