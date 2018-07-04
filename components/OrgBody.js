import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { updateNodeParagraph } from '../actions';
import { getNode } from '../selectors';

import appStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    height: 70
  },
  text: {
    margin: 10
  }
});

class OrgBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      text: undefined,
      isCollapsed: true,
      isLocked: true
    };
  }

  componentWillMount() {
    this.setState({ text: this.props.text });
  }

  render() {
    const {
      idx,
      bufferID,
      nodeID,
      onUpdateNodeParagraph,
      bodyText,
      isCollapsed,
      isLocked
    } = this.props;
    const { isEditing, text } = this.state;
    const showEditor =
      !isLocked && isEditing ? (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={appStyles.container}>
              <Button
                onPress={() => {
                  this.setState({ isEditing: false });
                  //this._toggleCollapse();
                }}
                title="cancel"
                color="#aa3333"
              />
            </View>
            <View style={appStyles.container}>
              <Button
                onPress={() => {
                  onUpdateNodeParagraph(bufferID, nodeID, idx, text);
                  this.setState({ isEditing: false });
                  //this._toggleCollapse();
                }}
                title="ok"
                color="#33aa33"
              />
            </View>
          </View>
          <ScrollView style={[appStyles.container]} horizontal={true}>
            <View style={[appStyles.container]}>
              <TextInput
                style={[
                  appStyles.baseText,
                  styles.text,
                  { width: '100%' },
                  appStyles.border
                ]}
                value={text === undefined ? bodyText : text}
                multiline={true}
                autoFocus={true}
                onChangeText={text => {
                  this.setState({ text });
                }}
              />
            </View>
          </ScrollView>
        </View>
      ) : isCollapsed ? null : isLocked ? (
        <ScrollView style={[appStyles.container]} horizontal={true}>
          <View style={[appStyles.container]}>
            <Text
              style={[
                appStyles.baseText,
                styles.text,
                { width: '100%' },
                appStyles.border
              ]}>
              {
                // bodyText
                text
              }
            </Text>
          </View>
        </ScrollView>
      ) : (
        <TouchableHighlight
          onPress={
            isCollapsed ? null : () => this.setState({ isEditing: true })
          }>
          <ScrollView style={[appStyles.container]} horizontal={true}>
            <View style={[appStyles.container]}>
              <Text style={[styles.container, styles.text]}>
                {
                  //bodyText
                  text
                }
              </Text>
            </View>
          </ScrollView>
        </TouchableHighlight>
      );

    return <View style={{ flex: 16 }}>{showEditor}</View>;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, idx } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const text = node
    ? node.section.children[idx].value.join('\n')
    : tree.section.children[idx].value.join('\n');
  return {
    bufferID,
    nodeID,
    text
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateNodeParagraph: (bufferID, nodeID, idx, text) => {
      dispatch(updateNodeParagraph(bufferID, nodeID, idx, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBody);
