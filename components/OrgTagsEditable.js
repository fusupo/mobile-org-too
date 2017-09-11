import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import R from 'ramda';

import { toggleNodeTag } from '../actions';

import appStyles from '../styles';

class OrgTagsEditable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      freeformVisible: false,
      freeformText: null
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setFreeformVisible(visible) {
    this.setState({ freeformVisible: visible });
  }

  render() {
    const { bufferID, nodeID, tags, allTags, onToggleTag } = this.props;
    const tagItems = tags.length > 0
      ? tags.map((tag, idx) => {
          return (
            <View key={idx} style={appStyles.container}>
              <Text
                style={[
                  appStyles.baseText,
                  {
                    backgroundColor: '#cccccc',
                    fontSize: 10
                  }
                ]}>
                {tag}
              </Text>
            </View>
          );
        })
      : null;

    const tagList = tagItems
      ? <View style={appStyles.container}>{tagItems}</View>
      : null;

    return (
      <View style={appStyles.container}>
        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View
            style={[
              appStyles.container,
              { marginTop: 22, flexDirection: 'column' }
            ]}>
            <View style={{ flex: 4, backgroundColor: '#ddd' }}>
              {tags.map((tag, idx) => (
                <TouchableHighlight
                  key={idx}
                  onPress={() => {
                    onToggleTag(bufferID, nodeID, tag);
                  }}>
                  <View style={{ flex: 0 }}>
                    <Text
                      style={[
                        appStyles.baseText,
                        {
                          backgroundColor: '#cccccc',
                          fontSize: 10,
                          padding: 10
                        }
                      ]}>
                      {tag}
                    </Text>
                  </View>
                </TouchableHighlight>
              ))}
            </View>
            <ScrollView style={{ flex: 8, backgroundColor: '#eee' }}>
              {this.state.freeformVisible
                ? <View>
                    <TextInput
                      style={appStyles.baseText}
                      value={this.state.freeformText}
                      onChangeText={freeformText =>
                        this.setState({ freeformText })}
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <View style={appStyles.container}>
                        <Button
                          title={'CANCEL'}
                          onPress={() => {
                            this.setFreeformVisible(
                              !this.state.freeformVisible
                            );
                            this.setState({ freeformText: null });
                          }}
                        />
                      </View>
                      <View style={appStyles.container}>
                        <Button
                          title={'OK'}
                          onPress={() => {
                            this.setFreeformVisible(
                              !this.state.freeformVisible
                            );
                            onToggleTag(
                              bufferID,
                              nodeID,
                              this.state.freeformText
                            );
                            this.setState({ freeformText: null });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                : <TouchableHighlight
                    style={appStyles.container}
                    onPress={() => {
                      this.setFreeformVisible(!this.state.freeformVisible);
                    }}>
                    <Text
                      style={[
                        appStyles.baseText,
                        {
                          backgroundColor: '#cccccc',
                          fontSize: 10,
                          padding: 10
                        }
                      ]}>
                      {'add new'}
                    </Text>
                  </TouchableHighlight>}
              {allTags.map((tag, idx) => (
                <View key={idx} style={{ flex: 0 }}>
                  <TouchableHighlight
                    onPress={() => {
                      onToggleTag(bufferID, nodeID, tag);
                    }}>
                    <Text
                      style={[
                        appStyles.baseText,
                        {
                          backgroundColor: '#cccccc',
                          fontSize: 10,
                          padding: 10
                        }
                      ]}>
                      {tag}
                    </Text>
                  </TouchableHighlight>
                </View>
              ))}
            </ScrollView>
            <View style={appStyles.container}>
              <Button
                title={'DONE'}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
            </View>
          </View>
        </Modal>
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
          style={appStyles.container}>
          <View style={[appStyles.container, { flexDirection: 'column' }]}>
            {tagList}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const node = state.orgBuffers[bufferID].orgNodes[nodeID];
  let allTags = Object.values(state.orgBuffers).reduce((m, v) => {
    let tags = Object.values(v.orgNodes).reduce((m2, v2) => {
      return m2.concat(v2.headline.tags || []);
    }, []);
    return m.concat(tags);
  }, []);
  allTags = R.uniq(allTags);
  return {
    tags: node.headline.tags || [],
    allTags
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onToggleTag: (bufferID, nodeID, tag) => {
      dispatch(toggleNodeTag(bufferID, nodeID, tag));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTagsEditable);
