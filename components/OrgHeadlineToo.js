import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

import {
  addNewNode,
  cycleNodeCollapse,
  deleteNode,
  updateNodeHeadlineContent
} from '../actions';

const OrgHeadlineUtil = require('org-parse').OrgHeadline;

import OrgTags from './OrgTagsEditable';

import appStyles from '../styles';

import { getTodoKeywordSettings, getNode } from '../selectors';

class OrgHeadline extends Component {
  render() {
    const {
      bufferID,
      node,
      nodeID,
      isLocked,
      onNodeTitlePress,
      onDeleteNodePress,
      onAddOnePress,
      keywordSettings
    } = this.props;

    const keyword = node.keyword;
    const tags = node.tags;

    if (isLocked) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text
            style={[
              appStyles.baseText,
              {
                backgroundColor: keyword
                  ? keywordSettings[keyword]
                  : keywordSettings['none']
              }
            ]}>
            {keyword ? keyword : 'none'}
          </Text>
          <TouchableHighlight
            style={{ flex: 4 }}
            onPress={() => {
              onNodeTitlePress(bufferID, nodeID);
            }}>
            <Text style={[appStyles.baseText, { fontSize: 12, color: '#000' }]}>
              {node.title}
            </Text>
          </TouchableHighlight>
          {tags && (
            <View>
              <Text style={[appStyles.baseText]}>{tags.join(':')}</Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <Swipeout
          style={{ flex: 1 }}
          right={[
            {
              text: 'deleteNode',
              onPress: () => {
                onDeleteNodePress(bufferID, nodeID);
              }
            }
          ]}
          left={[
            {
              text: 'addOne',
              onPress: () => {
                onAddOnePress(bufferID, nodeID, node);
              }
            }
          ]}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <OrgTodoKeywordEditable
              keyword={keyword}
              nodeID={nodeID}
              bufferID={bufferID}
            />
            <TouchableHighlight
              style={{ flex: 4 }}
              onPress={() => {
                onNodeTitlePress(bufferID, nodeID);
              }}>
              <Text style={[appStyles.baseText, { color: '#000' }]}>
                {node.title}
              </Text>
            </TouchableHighlight>
            <View style={{ flex: 1 }}>
              <OrgTags bufferID={bufferID} nodeID={node.id} />
            </View>
          </View>
        </Swipeout>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const node = getNode(state, bufferID, nodeID);
  const keywordSettings = getTodoKeywordSettings(state);
  return {
    node,
    keywordSettings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNodeTitlePress: (bufferID, nodeID) => {
      const pushAction = StackActions.push({
        routeName: 'NodeDetail',
        params: {
          bufferID,
          nodeID
        }
      });

      ownProps.navigation.dispatch(pushAction);
    },
    onDeleteNodePress: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddOnePress: (bufferID, nodeID, node) => {
      dispatch(addNewNode(bufferID, nodeID, node.stars + 1));
    },
    onNodeArrowPress: (bufferID, nodeID) => {
      dispatch(cycleNodeCollapse(bufferID, nodeID));
    },
    onHeadlineEndEditing: (bufferID, nodeID, text) => {
      dispatch(updateNodeHeadlineContent(bufferID, nodeID, text));
    }
  };
};
import { withNavigation } from 'react-navigation';
export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(OrgHeadline)
);
